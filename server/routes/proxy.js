const express = require('express');
const router = express.Router();
const axios = require('axios');

// Unescape HTML helper
function unescapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x39;/g, "'")
    .replace(/&#x60;/g, '`')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ');
}

// 1. DuckDuckGo HTML Search Scraper (Live Search Results)
router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  if (!query) {
    return res.status(400).json({ message: 'Missing search query' });
  }

  try {
    const response = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 8000
    });

    const html = response.data;
    const results = [];
    
    // Split into result blocks (DuckDuckGo results have class "result results_links...")
    const blocks = html.split('<div class="result results_links');
    
    for (let i = 1; i < blocks.length && results.length < 12; i++) {
      const block = blocks[i];
      
      const urlMatch = block.match(/<a class="result__a" href="([^"]+)"/);
      const titleMatch = block.match(/<a class="result__a"[^>]*>([\s\S]*?)<\/a>/);
      const snippetMatch = block.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/) 
        || block.match(/<div class="result__snippet"[^>]*>([\s\S]*?)<\/div>/);
        
      if (urlMatch && titleMatch) {
        let url = urlMatch[1];
        
        // Extract original URL from DuckDuckGo redirect query
        if (url.includes('uddg=')) {
          try {
            const urlObj = new URL('https://html.duckduckgo.com' + url);
            const decoded = urlObj.searchParams.get('uddg');
            if (decoded) url = decoded;
          } catch (e) {
            // fallback if URL constructor fails
            const uddgIndex = url.indexOf('uddg=');
            if (uddgIndex !== -1) {
              const encUrl = url.substring(uddgIndex + 5).split('&')[0];
              url = decodeURIComponent(encUrl);
            }
          }
        }
        
        const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
        const desc = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : '';
        
        results.push({
          url: url,
          title: unescapeHtml(title),
          desc: unescapeHtml(desc)
        });
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Search scraper error:', error.message);
    
    // Return mock fallback search results so the page doesn't crash on network failure
    const fallbackResults = [
      {
        url: 'portfolio.local',
        title: 'Full Stack Software Engineer - Official Portfolio Site',
        desc: 'Interactive desktop simulation showcasing portfolio details, projects, skills, contact forms, custom terminal console, and playable snake retro arcade games.'
      },
      {
        url: 'github.com/developer/portfolio-website',
        title: 'GitHub - developer/portfolio-website: Windows 11 replica simulation in React',
        desc: 'Source code for the simulated Windows OS built completely with React, Vite, and vanilla CSS. Supports interactive windows, responsive dashboard, and customization features.'
      },
      {
        url: 'wikipedia.org/wiki/Software_Engineer',
        title: 'Software engineering - Wikipedia',
        desc: 'A software engineer is a person who applies the principles of software engineering to the design, development, maintenance, testing, and evaluation of computer software.'
      }
    ];
    res.json(fallbackResults);
  }
});

// 2. Server-side Web Proxy Route
router.get('/proxy', async (req, res) => {
  let targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('<h1>Missing target URL parameter</h1>');
  }

  // Prepend protocol if missing
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': targetUrl
      },
      responseType: 'text',
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true // Handle redirect codes manually or let axios follow them
    });

    // Handle manual redirects if Axios maxRedirects was exceeded or did not catch it
    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      const redirectUrl = response.headers.location;
      return res.redirect(`/api/proxy?url=${encodeURIComponent(redirectUrl)}`);
    }

    let contentType = response.headers['content-type'] || 'text/html';
    
    // Set headers on response, omitting security headers
    res.setHeader('Content-Type', contentType);
    
    // If it's an HTML page, process and inject base href + intercept script
    if (contentType.includes('text/html')) {
      let html = response.data;
      
      // Determine origin base URL for relative elements
      const parsedUrl = new URL(targetUrl);
      const baseHref = parsedUrl.origin + parsedUrl.pathname;
      
      // Inject base tag
      const baseTag = `<base href="${baseHref}">`;
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}`);
      } else {
        html = baseTag + html;
      }

      // Inject JS navigation intercept script
      const interceptScript = `
        <script>
          (function() {
            // 1. Intercept Link Clicks
            document.addEventListener('click', function(e) {
              var target = e.target;
              while (target && target.tagName !== 'A') {
                target = target.parentNode;
              }
              if (target && target.href) {
                // Ignore hash clicks or non-http links
                if (target.href.startsWith('mailto:') || target.href.startsWith('javascript:') || target.getAttribute('href').startsWith('#')) {
                  return;
                }
                e.preventDefault();
                
                // Send absolute URL to parent window
                if (window.parent) {
                  window.parent.postMessage({ type: 'NAVIGATE', url: target.href }, '*');
                }
              }
            }, true);

            // 2. Intercept Form Submissions
            document.addEventListener('submit', function(e) {
              var target = e.target;
              if (target && target.tagName === 'FORM') {
                e.preventDefault();
                var action = target.action || window.location.href;
                var method = (target.method || 'GET').toUpperCase();
                
                // Serialize Form Data
                var formData = new FormData(target);
                var params = new URLSearchParams();
                for (var pair of formData.entries()) {
                  params.append(pair[0], pair[1]);
                }
                
                var targetUrl = action;
                if (method === 'GET') {
                  var separator = targetUrl.includes('?') ? '&' : '?';
                  targetUrl = targetUrl + separator + params.toString();
                  if (window.parent) {
                    window.parent.postMessage({ type: 'NAVIGATE', url: targetUrl }, '*');
                  }
                } else {
                  // For POST forms, since we are doing simple navigation, redirecting to action is a clean fallback
                  if (window.parent) {
                    window.parent.postMessage({ type: 'NAVIGATE', url: targetUrl }, '*');
                  }
                }
              }
            }, true);
          })();
        </script>
      `;

      if (html.includes('</body>')) {
        html = html.replace('</body>', `${interceptScript}</body>`);
      } else {
        html = html + interceptScript;
      }

      return res.send(html);
    }

    // For css, image or raw responses, return as-is
    return res.send(response.data);
  } catch (error) {
    console.error('Proxy request error:', error.message);
    res.status(500).send(`
      <div style="font-family: sans-serif; padding: 24px; text-align: center; color: #ff4757; background-color: #ffe0e0; border-radius: 8px;">
        <h2>❌ Proxy Navigation Error</h2>
        <p>Failed to connect to: <strong>${targetUrl}</strong></p>
        <p style="font-size: 13px; color: #555;">Details: ${error.message}</p>
        <p style="font-size: 12px; margin-top: 16px;"><a href="javascript:history.back()" style="color: #0078d4; text-decoration: none; font-weight: bold;">← Go Back</a></p>
      </div>
    `);
  }
});

module.exports = router;
