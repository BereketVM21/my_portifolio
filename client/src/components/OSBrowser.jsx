import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

// --- SVG ICONS FOR CHROME AND EDGE ---
export const ChromeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#fff" />
    <path d="M12 2C9.09 2 6.53 3.25 4.8 5.25L9 12.5C9.35 11.64 10.15 11 11.1 11H21.8C21.1 6 17 2 12 2Z" fill="#EA4335" />
    <path d="M4.8 5.25C3.06 7.25 2 9.87 2 12.75C2 17 5 20.65 9 21.6L13.1 14.5C12.75 15.36 11.95 16 11 16C9.9 16 9 15.1 9 14C9 13.62 9.11 13.27 9.3 12.97L4.8 5.25Z" fill="#34A853" />
    <path d="M21.8 11H13.1L9.3 17.5C10.12 17.82 11.04 18 12 18C16.41 18 20.15 15.1 21.4 11.15C21.6 11.1 21.8 11.05 21.8 11Z" fill="#FBBC05" />
    <circle cx="12" cy="12" r="4" fill="#4285F4" />
    <circle cx="12" cy="12" r="3.2" fill="#fff" />
    <circle cx="12" cy="12" r="2.8" fill="#4285F4" />
  </svg>
);

export const EdgeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="edgeGrad1" x1="8.3%" y1="91.7%" x2="91.7%" y2="8.3%">
        <stop offset="0%" stopColor="#0c59a4" />
        <stop offset="30%" stopColor="#1175b9" />
        <stop offset="70%" stopColor="#00b0f0" />
        <stop offset="100%" stopColor="#00b0af" />
      </linearGradient>
      <linearGradient id="edgeGrad2" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#00a890" />
        <stop offset="100%" stopColor="#81bc06" />
      </linearGradient>
    </defs>
    <path d="M 50 10 C 27.9 10 10 27.9 10 50 C 10 65.5 18.8 79.1 32 86 C 29.5 73.8 33.3 60.1 42.5 50.9 C 51.7 41.7 65.4 37.9 77.6 40.4 C 77.9 37.2 78 33.9 78 30.6 C 78 19.2 65.5 10 50 10 Z" fill="url(#edgeGrad1)" />
    <path d="M 32 86 C 41.6 91 52.8 92.2 63.3 89.2 C 77.8 85.1 88 71.9 88 56.4 C 88 51.5 87 46.8 85.2 42.5 C 74.3 48.8 62.5 61.1 57.5 75 C 53.6 85.8 42.1 85.4 32 86 Z" fill="url(#edgeGrad2)" />
    <path d="M 57.5 75 C 52.5 61.1 40.7 48.8 29.8 42.5 C 28 46.8 27 51.5 27 56.4 C 27 71.9 37.2 85.1 51.7 89.2 C 55.4 87.5 56.8 80.8 57.5 75 Z" fill="#00b0f0" opacity="0.3" />
  </svg>
);

// --- LIVE SEARCH RESULTS VIEW ---
const SearchResultsView = ({ query, isGoogle, navigateTo, isDark, goHome }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFallbackResults = () => {
    return [
      {
        url: `${query.toLowerCase().replace(/[^a-z0-9]/g, '') || 'search'}.com`,
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Simulated Search Result`,
        desc: `Simulated search query match for "${query}". Note: The local network environment is currently offline or firewalled; displaying portfolio projects and simulated web pages.`
      },
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
      },
      {
        url: 'youtube.com/watch?v=coding-music',
        title: 'Lo-Fi Coding Music - 24/7 Relaxing Beats for Programming',
        desc: 'Stream live simulated lo-fi hip hop beats ideal for long coding sessions. Click to open and play the video directly inside the browser simulated YouTube.'
      },
      {
        url: 'openai.com/chatgpt',
        title: 'ChatGPT - Interactive simulated AI Assistant chatbot',
        desc: 'Chat with a simulated model in your browser tab to query details regarding developer projects, programming experience, and resume details.'
      }
    ];
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    axios.get(`/api/search?q=${encodeURIComponent(query)}`, { timeout: 3000 })
      .then(response => {
        if (isMounted) {
          if (response.data && response.data.length > 0) {
            setResults(response.data);
          } else {
            setResults(getFallbackResults());
          }
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Search API error or timeout:', err);
        if (isMounted) {
          setResults(getFallbackResults());
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

  const isDarkTheme = isDark && !isGoogle;

  const searchStyle = {
    backgroundColor: isDarkTheme ? '#181818' : '#ffffff',
    color: isDarkTheme ? '#e0e0e0' : '#202124',
    fontFamily: 'arial, sans-serif',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  };

  return (
    <div style={searchStyle}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '16px 24px',
        borderBottom: `1px solid ${isDarkTheme ? '#2a2a2a' : '#ebebeb'}`,
        backgroundColor: isDarkTheme ? '#202020' : '#ffffff'
      }}>
        {isGoogle ? (
          <div onClick={goHome} style={{ fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC05' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </div>
        ) : (
          <div onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#00b0f0' }}>
            <EdgeIcon size={24} />
            <span>Bing</span>
          </div>
        )}
        
        <div style={{ display: 'flex', flex: 1, maxWidth: '600px', position: 'relative' }}>
          <input
            type="text"
            defaultValue={query}
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '14px',
              border: `1px solid ${isDarkTheme ? '#444' : '#dfe1e5'}`,
              borderRadius: '24px',
              outline: 'none',
              backgroundColor: isDarkTheme ? '#333' : '#fff',
              color: isDarkTheme ? '#fff' : '#000'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigateTo(`${isGoogle ? 'google.com' : 'bing.com'}/search?q=${encodeURIComponent(e.target.value)}`);
              }
            }}
          />
        </div>
      </div>

      {/* Results Container */}
      <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', maxWidth: '1000px', flex: 1 }}>
        
        {/* Main List */}
        <div>
          <div style={{ fontSize: '13px', color: '#70757a', marginBottom: '20px' }}>
            {loading ? 'Searching live web...' : `About ${results.length} results (0.12 seconds) for "${query}"`}
          </div>

          {error && (
            <div style={{
              color: '#d32f2f',
              backgroundColor: '#ffebee',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid #ffcdd2',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ width: '120px', height: '12px', backgroundColor: isDarkTheme ? '#333' : '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                  <div style={{ width: '250px', height: '18px', backgroundColor: isDarkTheme ? '#444' : '#d0d0d0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                  <div style={{ width: '450px', height: '14px', backgroundColor: isDarkTheme ? '#333' : '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
                </div>
              ))}
            </div>
          ) : (
            results.map((res, i) => (
              <div key={i} style={{ marginBottom: '28px', maxWidth: '600px' }}>
                <div style={{ fontSize: '12px', color: isDarkTheme ? '#aaa' : '#202124', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {res.url}
                </div>
                <div
                  onClick={() => navigateTo(res.url)}
                  style={{
                    fontSize: '19px',
                    color: isGoogle ? '#1a0dab' : '#00b0f0',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    fontWeight: 'normal',
                    lineHeight: '1.3'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  {res.title}
                </div>
                <div style={{ fontSize: '14px', color: isDarkTheme ? '#bbb' : '#4d5156', lineHeight: '1.5' }}>
                  {res.desc}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar / Knowledge Panel */}
        {(query.toLowerCase().includes('engineer') || query.toLowerCase().includes('developer') || query.toLowerCase().includes('portfolio')) && (
          <div style={{
            border: `1px solid ${isDarkTheme ? '#333' : '#dadce0'}`,
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: isDarkTheme ? '#222' : '#fcfcfc',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'normal', marginBottom: '4px' }}>Full Stack Engineer</h3>
            <div style={{ fontSize: '13px', color: '#70757a', marginBottom: '12px' }}>Professional Profile</div>
            <div style={{ height: '0.2px', backgroundColor: 'rgba(128,128,128,0.2)', margin: '8px 0' }} />
            
            <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '12px 0' }}>
              A professional in software development capable of designing and maintaining frontend user interfaces as well as complex backend architectures, databases, and APIs.
            </p>

            <div style={{ fontSize: '13px', display: 'grid', gap: '8px' }}>
              <div><strong>Primary Languages:</strong> JavaScript, TypeScript, Python, HTML/CSS</div>
              <div><strong>Popular Frameworks:</strong> React, Vue.js, Node.js, Express</div>
              <div><strong>Key Skills:</strong> Web performance, API engineering, UI design</div>
            </div>

            <button
              onClick={() => navigateTo('portfolio.local')}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px',
                backgroundColor: '#0078d4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              Open Portfolio App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const OSBrowser = ({ type = 'chrome', closeWindow }) => {
  const { settings } = useTheme();
  const isDark = settings.darkMode;

  const defaultHomepage = type === 'chrome' ? 'google.com' : 'bing.com';

  // Browser Tabs State
  const [tabs, setTabs] = useState([
    {
      id: 1,
      url: defaultHomepage,
      title: type === 'chrome' ? 'Google' : 'Bing',
      history: [defaultHomepage],
      historyIndex: 0,
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [addressInput, setAddressInput] = useState(defaultHomepage);

  // Copilot sidebar active state for Edge
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState([
    { sender: 'ai', text: 'Hi! I am Microsoft Copilot, your AI assistant. How can I help you today?' }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const copilotEndRef = useRef(null);

  // Find active tab
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Ref to prevent stale closures in postMessage listener
  const navigateToRef = useRef(null);
  useEffect(() => {
    navigateToRef.current = navigateTo;
  });

  // Listen for navigation messages from the proxy iframe
  useEffect(() => {
    const handleNavigateMessage = (e) => {
      if (e.data && e.data.type === 'NAVIGATE') {
        if (navigateToRef.current) {
          navigateToRef.current(e.data.url);
        }
      }
    };
    window.addEventListener('message', handleNavigateMessage);
    return () => {
      window.removeEventListener('message', handleNavigateMessage);
    };
  }, []);

  // Update address bar when active tab changes
  useEffect(() => {
    if (activeTab) {
      setAddressInput(activeTab.url);
    }
  }, [activeTabId, activeTab?.url]);

  // Scroll to bottom of copilot chat
  useEffect(() => {
    copilotEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, copilotOpen]);

  // Tab Control Functions
  const createNewTab = (url = defaultHomepage) => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map(t => t.id)) + 1 : 1;
    const newTab = {
      id: newId,
      url: url,
      title: url === 'google.com' ? 'Google' : url === 'bing.com' ? 'Bing' : url,
      history: [url],
      historyIndex: 0
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (idToClose, e) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // If closing the last tab, close the window
      if (closeWindow) closeWindow();
      return;
    }
    
    const filteredTabs = tabs.filter(t => t.id !== idToClose);
    setTabs(filteredTabs);
    
    if (activeTabId === idToClose) {
      // Set active to another tab
      const closedIdx = tabs.findIndex(t => t.id === idToClose);
      const newActiveIdx = closedIdx > 0 ? closedIdx - 1 : 0;
      setActiveTabId(filteredTabs[newActiveIdx].id);
    }
  };

  const updateActiveTab = (updates) => {
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  };

  const navigateTo = (destUrl) => {
    let finalUrl = destUrl.trim();
    if (!finalUrl) return;

    // Check if it's a search query or URL
    const isUrl = finalUrl.includes('.') && !finalUrl.includes(' ');
    if (!isUrl) {
      // Convert to search URL
      if (type === 'chrome') {
        finalUrl = `google.com/search?q=${encodeURIComponent(finalUrl)}`;
      } else {
        finalUrl = `bing.com/search?q=${encodeURIComponent(finalUrl)}`;
      }
    } else {
      // Ensure protocol or clean local domains
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        // Just clean up for local matching, but don't force https everywhere
      }
    }

    const currentHistory = activeTab.history.slice(0, activeTab.historyIndex + 1);
    const nextHistory = [...currentHistory, finalUrl];
    
    // Determine Page Title
    let title = finalUrl;
    if (finalUrl.includes('google.com/search')) title = 'Google Search';
    else if (finalUrl.includes('bing.com/search')) title = 'Bing Search';
    else if (finalUrl === 'google.com' || finalUrl === 'www.google.com') title = 'Google';
    else if (finalUrl === 'bing.com' || finalUrl === 'www.bing.com') title = 'Bing';
    else if (finalUrl.includes('github.com')) title = 'GitHub: Let\'s build from here';
    else if (finalUrl.includes('wikipedia.org')) title = 'Wikipedia, the free encyclopedia';
    else if (finalUrl.includes('youtube.com')) title = 'YouTube';
    else if (finalUrl.includes('openai.com') || finalUrl.includes('chatgpt.com')) title = 'ChatGPT';
    else if (finalUrl.includes('portfolio.local')) title = 'My Portfolio';

    updateActiveTab({
      url: finalUrl,
      title: title,
      history: nextHistory,
      historyIndex: nextHistory.length - 1
    });
  };

  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      const nextIdx = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[nextIdx];
      updateActiveTab({
        url: prevUrl,
        historyIndex: nextIdx,
        title: prevUrl // simplified title update
      });
    }
  };

  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextIdx = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[nextIdx];
      updateActiveTab({
        url: nextUrl,
        historyIndex: nextIdx,
        title: nextUrl
      });
    }
  };

  const refreshPage = () => {
    // Simply reset tab url to reload
    const currentUrl = activeTab.url;
    updateActiveTab({ url: '' });
    setTimeout(() => {
      updateActiveTab({ url: currentUrl });
    }, 100);
  };

  const goHome = () => {
    navigateTo(defaultHomepage);
  };

  // AI Chat bot responses
  const getAIResponse = (query) => {
    const q = query.toLowerCase();
    let text = "";

    if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
      text = "Hello! I am your AI assistant simulated here in the browser. Ask me anything about the developer's skills, portfolio projects, or code examples!";
    } else if (q.includes('developer') || q.includes('author') || q.includes('who are you') || q.includes('who is')) {
      text = "This Windows OS Portfolio was built by a Full Stack Software Engineer. They are passionate about creating stunning, premium user experiences and robust, high-performance backends. You can check the 'About Me' section on the desktop to find out more!";
    } else if (q.includes('skill') || q.includes('technolog') || q.includes('stack')) {
      text = "The developer has strong proficiency in:\n\n* **Frontend**: React.js, TypeScript, Vue.js, CSS, HTML5, TailwindCSS\n* **Backend**: Node.js, Express, Python (Django, Flask), Java, PostgreSQL, MongoDB\n* **DevOps & Tools**: Docker, AWS (S3, EC2), CI/CD, Git, GitHub\n\nYou can click on the **Skills** app on the desktop for a visual breakdown of their experience!";
    } else if (q.includes('project') || q.includes('portfolio')) {
      text = "Some featured projects in this developer's portfolio include:\n\n1. **Windows 11 OS Replica (This Website!)**: A fully responsive web desktop experience containing games, command line, text editors, settings, and interactive browsers.\n2. **E-Commerce API**: A robust scalable shopping platform backed by Node and Stripe.\n3. **Weather Dashboard**: Beautiful real-time forecasts with interactive data viz charts.\n\nType in the URL bar `github.com` or look at the **Projects** desktop app to see more details!";
    } else if (q.includes('code') || q.includes('react') || q.includes('javascript') || q.includes('js')) {
      text = "Here is a clean React counter hook example:\n\n```javascript\nimport { useState } from 'react';\n\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  const increment = () => setCount(prev => prev + 1);\n  const decrement = () => setCount(prev => prev - 1);\n  return { count, increment, decrement };\n}\n```";
    } else {
      text = `That sounds very interesting! As an AI assistant, I can see you searched or asked about "${query}". Explore this portfolio's functional apps like Terminal, Snake Game, and Notepad to see real engineering capability in action. Let me know if you want to write a code snippet!`;
    }

    return text;
  };

  const handleCopilotSend = () => {
    if (!copilotInput.trim()) return;
    const userMsg = copilotInput.trim();
    setCopilotMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setCopilotInput('');

    setTimeout(() => {
      const reply = getAIResponse(userMsg);
      setCopilotMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 800);
  };

  // --- SUB-PAGES RENDERING ROUTER ---
  const renderBrowserContent = () => {
    const url = activeTab?.url || '';

    // Check if it matches search queries
    if (url.includes('google.com/search') || url.includes('bing.com/search')) {
      const params = new URLSearchParams(url.substring(url.indexOf('?')));
      const query = params.get('q') || '';
      return renderSearchResults(query);
    }

    // Direct pages
    const cleanUrl = url.replace(/(^\w+:|^)\/\//, '').replace('www.', '').toLowerCase();
    
    if (cleanUrl === 'google.com') {
      return renderGoogleHome();
    }
    if (cleanUrl === 'bing.com') {
      return renderBingHome();
    }
    if (cleanUrl.startsWith('github.com')) {
      return renderGitHub(cleanUrl);
    }
    if (cleanUrl.startsWith('wikipedia.org')) {
      return renderWikipedia(cleanUrl);
    }
    if (cleanUrl.startsWith('youtube.com')) {
      return renderYouTube(cleanUrl);
    }
    if (cleanUrl.startsWith('openai.com') || cleanUrl.startsWith('chatgpt.com')) {
      return renderChatGPT();
    }
    if (cleanUrl.startsWith('portfolio.local')) {
      return renderPortfolioInception();
    }

    // Default Fallback: Try loading in iframe via Web Proxy
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;
    const proxiedUrl = `/api/proxy?url=${encodeURIComponent(fullUrl)}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <iframe
            src={proxiedUrl}
            title="External Viewport"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: 'white'
            }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    );
  };

  // --- GOOGLE HOMEPAGE ---
  const renderGoogleHome = () => {
    const [searchVal, setSearchVal] = useState('');
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#ffffff',
        color: '#202124',
        fontFamily: 'arial, sans-serif',
        padding: '20px'
      }}>
        {/* Colorful Google Logo */}
        <div style={{ fontSize: '72px', fontWeight: '500', letterSpacing: '-2px', marginBottom: '28px', userSelect: 'none' }}>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
        </div>
        
        {/* Search bar */}
        <form onSubmit={(e) => { e.preventDefault(); navigateTo(`google.com/search?q=${encodeURIComponent(searchVal)}`); }} style={{ width: '100%', maxWidth: '580px', position: 'relative' }}>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 24px 12px 48px',
              fontSize: '16px',
              border: '1px solid #dfe1e5',
              borderRadius: '24px',
              outline: 'none',
              boxShadow: 'none',
              transition: 'box-shadow 0.2s',
              backgroundColor: '#fff',
              color: '#000'
            }}
            placeholder="Search Google or type a URL"
            onFocus={(e) => e.target.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          />
          <div style={{ position: 'absolute', left: '16px', top: '14px', fontSize: '16px', color: '#9aa0a6' }}>🔍</div>
        </form>

        <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigateTo(`google.com/search?q=${encodeURIComponent(searchVal || 'Full Stack Software Engineer')}`)}
            style={{
              padding: '10px 16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #f8f9fa',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#3c4043',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid #dadce0'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid #f8f9fa'}
          >
            Google Search
          </button>
          <button
            onClick={() => navigateTo('portfolio.local')}
            style={{
              padding: '10px 16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #f8f9fa',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#3c4043',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid #dadce0'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid #f8f9fa'}
          >
            I'm Feeling Lucky
          </button>
        </div>

        <div style={{ marginTop: '28px', fontSize: '13px', color: '#5f6368' }}>
          Google offered in: <span style={{ color: '#1a0dab', cursor: 'pointer' }}>English</span>
        </div>
      </div>
    );
  };

  // --- BING HOMEPAGE ---
  const renderBingHome = () => {
    const [searchVal, setSearchVal] = useState('');
    return (
      <div style={{
        position: 'relative',
        height: '100%',
        backgroundImage: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        color: 'white',
        fontFamily: '-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '13px', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', gap: '16px', fontWeight: '500' }}>
            <span style={{ borderBottom: '2px solid white', cursor: 'pointer', paddingBottom: '4px' }}>Search</span>
            <span style={{ opacity: 0.8, cursor: 'pointer' }} onClick={() => setCopilotOpen(true)}>Copilot</span>
            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Images</span>
            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Videos</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>Sign In 👤</span>
            <span>Preferences ⚙️</span>
          </div>
        </div>

        {/* Center search */}
        <div style={{ alignSelf: 'center', width: '100%', maxWidth: '520px', textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
            <EdgeIcon size={36} />
            <span>Microsoft Bing</span>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); navigateTo(`bing.com/search?q=${encodeURIComponent(searchVal)}`); }} style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 48px 14px 20px',
                fontSize: '15px',
                border: 'none',
                borderRadius: '24px',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#333333',
                boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
              }}
              placeholder="Ask me anything..."
            />
            <button type="submit" style={{ position: 'absolute', right: '16px', top: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
              🔍
            </button>
          </form>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px' }}>
            <span style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer' }} onClick={() => setCopilotOpen(true)}>
              🤖 Chat with Copilot
            </span>
          </div>
        </div>

        {/* Bottom news block */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          {[
            { cat: 'Tech News', title: 'Why simulated browsers are taking over developer portfolio design.' },
            { cat: 'Windows 11', title: 'Antigravity OS update released with Microsoft Edge integration.' },
            { cat: 'AI Trends', title: 'Developers leverage simulated Copilots to debug nested apps.' }
          ].map((item, idx) => (
            <div key={idx} style={{
              backgroundColor: 'rgba(32, 32, 32, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '0.2px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(32, 32, 32, 0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(32, 32, 32, 0.65)'}
            >
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#00b0f0', fontWeight: 'bold', marginBottom: '4px' }}>{item.cat}</div>
              <div style={{ fontSize: '12px', fontWeight: '500', lineHeight: '1.4' }}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- GOOGLE/BING SEARCH RESULTS PAGE ---
  const renderSearchResults = (query) => {
    return (
      <SearchResultsView
        query={query}
        isGoogle={activeTab.url.includes('google.com')}
        navigateTo={navigateTo}
        isDark={isDark}
        goHome={goHome}
      />
    );
  };

  // --- GITHUB ---
  const renderGitHub = (url) => {
    // Basic router inside GitHub mock
    const showRepoDetail = url.includes('/portfolio-website');
    const [activeTabName, setActiveTabName] = useState('Overview');

    return (
      <div style={{
        backgroundColor: '#0d1117',
        color: '#c9d1d9',
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {/* GitHub Header */}
        <div style={{
          backgroundColor: '#161b22',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #21262d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span onClick={() => navigateTo('github.com')} style={{ fontSize: '24px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>🐱 GitHub</span>
            <input
              type="text"
              placeholder="Search or jump to..."
              style={{
                backgroundColor: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '13px',
                color: 'white',
                outline: 'none',
                width: '240px'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', fontSize: '13px', fontWeight: '600' }}>
              <span style={{ cursor: 'pointer' }}>Pull requests</span>
              <span style={{ cursor: 'pointer' }}>Issues</span>
              <span style={{ cursor: 'pointer' }}>Codespaces</span>
            </div>
          </div>
        </div>

        {showRepoDetail ? (
          /* Repository Detail View */
          <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            <div style={{ fontSize: '18px', marginBottom: '16px' }}>
              <span style={{ color: '#58a6ff', cursor: 'pointer' }} onClick={() => navigateTo('github.com')}>developer</span>
              <span style={{ margin: '0 4px' }}>/</span>
              <strong style={{ color: '#c9d1d9' }}>portfolio-website</strong>
              <span style={{ marginLeft: '8px', fontSize: '11px', border: '1px solid #30363d', padding: '2px 8px', borderRadius: '10px' }}>Public</span>
            </div>

            <div style={{ border: '1px solid #30363d', borderRadius: '6px', backgroundColor: '#161b22', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #30363d', paddingBottom: '12px', marginBottom: '12px' }}>
                <strong>README.md</strong>
                <span>Vite + React Project</span>
              </div>
              <h1 style={{ color: 'white', borderBottom: '1px solid #21262d', paddingBottom: '8px' }}>Windows 11 Portfolio OS</h1>
              <p style={{ marginTop: '12px', lineHeight: '1.6' }}>
                This is a premium React application replicating a fully operational Windows 11 desktop experience. Designed for portfolio display, it implements several desktop apps, a settings framework, terminal dashboard, and fully responsive window frames.
              </p>
              <h3>Features:</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Window dragging, resizing, maximizing, and snapping.</li>
                <li>Dynamic theme settings (dark/light brightness modifiers).</li>
                <li>Customizable wallpaper carousel with immediate CSS gradient applying.</li>
                <li>Embedded retro arcade Snake Game with high score logic.</li>
                <li>Google Chrome and Edge simulated browsers with working address bar, tabs, history, and search result routing.</li>
              </ul>
            </div>
            <button
              onClick={() => navigateTo('github.com')}
              style={{
                backgroundColor: '#21262d',
                color: '#c9d1d9',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '6px 16px',
                cursor: 'pointer'
              }}
            >
              ← Back to profile
            </button>
          </div>
        ) : (
          /* Profile Overview */
          <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
            
            {/* Sidebar Details */}
            <div>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                backgroundImage: "url('/uploads/profile.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #30363d',
                marginBottom: '16px',
                filter: `brightness(${10000 / (30 + settings.brightness * 2.2)}%)`
              }} />
              <h2 style={{ color: 'white', margin: '0' }}>Full Stack Engineer</h2>
              <div style={{ fontSize: '16px', color: '#8b949e', marginBottom: '16px' }}>@developer</div>
              <div style={{ fontSize: '13px', lineHeight: '1.4', marginBottom: '16px' }}>
                Creative builder specializing in custom simulated web frameworks, database design, and systems engineering.
              </div>
              <button style={{ width: '100%', padding: '6px', backgroundColor: '#21262d', border: '1px solid #30363d', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Edit Profile</button>
              
              <div style={{ marginTop: '24px', fontSize: '12px', display: 'grid', gap: '8px', color: '#8b949e' }}>
                <div>📍 San Francisco, CA</div>
                <div>📧 developer@portfolio.local</div>
                <div>🔗 portfolio.local</div>
              </div>
            </div>

            {/* Profile Tabs & Content */}
            <div>
              {/* Profile sub-tabs */}
              <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #21262d', paddingBottom: '8px', marginBottom: '20px', fontSize: '14px' }}>
                {['Overview', 'Repositories', 'Projects', 'Stars'].map(t => (
                  <span
                    key={t}
                    onClick={() => setActiveTabName(t)}
                    style={{
                      cursor: 'pointer',
                      fontWeight: activeTabName === t ? 'bold' : 'normal',
                      color: activeTabName === t ? 'white' : '#8b949e',
                      borderBottom: activeTabName === t ? '2px solid #f78166' : 'none',
                      paddingBottom: '8px'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {activeTabName === 'Repositories' || activeTabName === 'Overview' ? (
                <div>
                  <h3 style={{ color: 'white', marginBottom: '12px' }}>Popular Repositories</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {[
                      { name: 'portfolio-website', desc: 'Windows 11 Dashboard simulation interface built completely in React and CSS.', lang: 'JavaScript', stars: 42 },
                      { name: 'scalable-ecommerce-api', desc: 'Backend microservices using Node Express, MongoDB, and Stripe checkout hooks.', lang: 'NodeJS', stars: 28 },
                      { name: 'weather-radar-charts', desc: 'Data visualization tool displaying temperature anomalies using ChartJS.', lang: 'TypeScript', stars: 15 },
                      { name: 'retro-snake-arcade', desc: 'Interactive HTML5 Canvas arcade game styled in early Windows aesthetics.', lang: 'HTML5', stars: 19 }
                    ].map((repo, idx) => (
                      <div key={idx} style={{
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        padding: '16px',
                        backgroundColor: '#161b22',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div
                            onClick={() => repo.name === 'portfolio-website' ? navigateTo('github.com/developer/portfolio-website') : null}
                            style={{
                              color: '#58a6ff',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            {repo.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '8px', lineHeight: '1.4' }}>{repo.desc}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#8b949e', marginTop: '16px' }}>
                          <span>🟡 {repo.lang}</span>
                          <span>⭐ {repo.stars}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Commit calendar mock */}
                  <h3 style={{ color: 'white', marginTop: '32px', marginBottom: '12px' }}>1,842 contributions in the last year</h3>
                  <div style={{
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '16px',
                    backgroundColor: '#161b22',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    {/* Grid of green dots */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 10px)', gap: '4px' }}>
                      {Array.from({ length: 210 }).map((_, i) => {
                        const shades = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
                        const randomColor = shades[Math.floor(Math.random() * (i % 7 === 0 ? 5 : 3))];
                        return (
                          <div key={i} style={{ width: '10px', height: '10px', backgroundColor: randomColor, borderRadius: '2px' }} />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#8b949e' }}>
                  No items listed under this section.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- WIKIPEDIA ---
  const renderWikipedia = (url) => {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        color: '#202122',
        fontFamily: 'sans-serif',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {/* Wiki header */}
        <div style={{
          borderBottom: '1px solid #a2a9b1',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f6f6f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'serif', cursor: 'pointer' }} onClick={() => navigateTo('wikipedia.org')}>W WIKIPEDIA</span>
            <input
              type="text"
              placeholder="Search Wikipedia"
              style={{
                padding: '4px 10px',
                fontSize: '13px',
                border: '1px solid #a2a9b1',
                width: '200px'
              }}
            />
          </div>
          <div style={{ fontSize: '11px' }}>
            Not logged in | <span style={{ color: '#0645ad', cursor: 'pointer' }}>Talk</span> | <span style={{ color: '#0645ad', cursor: 'pointer' }}>Contributions</span>
          </div>
        </div>

        {/* Wiki Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', flex: 1 }}>
          
          {/* Left panel */}
          <div style={{
            padding: '16px 12px',
            borderRight: '1px solid #a2a9b1',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: '#f6f6f6'
          }}>
            <strong style={{ color: '#444' }}>Navigation</strong>
            <span style={{ color: '#0645ad', cursor: 'pointer' }} onClick={() => navigateTo('wikipedia.org')}>Main page</span>
            <span style={{ color: '#0645ad', cursor: 'pointer' }}>Contents</span>
            <span style={{ color: '#0645ad', cursor: 'pointer' }}>Current events</span>
            <span style={{ color: '#0645ad', cursor: 'pointer' }}>Random article</span>
            <span style={{ color: '#0645ad', cursor: 'pointer' }} onClick={() => navigateTo('portfolio.local')}>About developer</span>
          </div>

          {/* Main article */}
          <div style={{ padding: '24px 32px' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', margin: '0 0 4px 0', borderBottom: '1px solid #a2a9b1', paddingBottom: '4px' }}>
              Software Engineer
            </h1>
            <div style={{ fontSize: '12px', color: '#555', italic: 'true', marginBottom: '16px' }}>From Wikipedia, the free encyclopedia</div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '32px' }}>
              <div>
                <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                  A <strong>software engineer</strong> is a professional who applies engineering principles to the design, development, maintenance, testing, and evaluation of computer software. Prior to the mid-1960s, software practitioners called themselves computer programmers or software developers, regardless of their actual education or technical background.
                </p>
                <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                  The term <i>software engineering</i> was coined by F.L. Bauer at the NATO Software Engineering Conference in 1968, indicating that software creation is an engineering discipline rather than a craft or science.
                </p>

                <h3 style={{ borderBottom: '1px solid #a2a9b1', paddingBottom: '4px', fontWeight: 'normal', fontFamily: 'Georgia, serif', marginTop: '24px' }}>Role and Education</h3>
                <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                  Modern engineers construct applications that power the web. In simulated contexts, developers create replica operating systems like the Antigravity Desktop to present portfolios in a unified environment. These environments require intensive state mapping and styling routines.
                </p>
              </div>

              {{/* Infobox */}}
              <div>
                <table style={{
                  border: '1px solid #a2a9b1',
                  backgroundColor: '#f8f9fa',
                  fontSize: '12px',
                  width: '100%',
                  padding: '8px'
                }}>
                  <thead>
                    <tr>
                      <th colSpan="2" style={{ fontSize: '14px', padding: '6px 0', backgroundColor: '#e2e2e2' }}>Software Engineer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center', padding: '8px 0' }}>🧑‍💻</td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #e2e2e2' }}>
                      <td style={{ padding: '6px', fontWeight: 'bold' }}>Occupation type:</td>
                      <td style={{ padding: '6px' }}>Professional</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', fontWeight: 'bold' }}>Activity sectors:</td>
                      <td style={{ padding: '6px' }}>Tech, Systems, Web Development</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px', fontWeight: 'bold' }}>Primary skills:</td>
                      <td style={{ padding: '6px' }}>Coding, Architecture design, Database engineering</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- YOUTUBE ---
  const renderYouTube = (url) => {
    // Check if watching a video
    const isWatch = url.includes('watch?v=');
    const [currentVideoId, setCurrentVideoId] = useState('jfKfPfyJRdk');

    useEffect(() => {
      if (isWatch) {
        const params = new URLSearchParams(url.substring(url.indexOf('?')));
        const vid = params.get('v') || 'jfKfPfyJRdk';
        setCurrentVideoId(vid);
      }
    }, [url, isWatch]);

    const videoList = [
      { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio - beats to relax/study to ☕', channel: 'Lofi Girl', views: '4.8M views', date: '3 months ago', time: '11:45' },
      { id: 'd3GDwO12920', title: 'Microsoft Fluent Design System - Desktop Evolution Walkthrough', channel: 'Windows Design', views: '230K views', date: '1 year ago', time: '08:12' },
      { id: 'Ke90Tje7VS0', title: 'React JS Tutorial for Beginners - Full Crash Course (2026 Edition)', channel: 'Code Academy', views: '1.2M views', date: '6 months ago', time: '15:20' },
      { id: 'g2_9Qo2F_rY', title: 'Why Vanilla CSS is Making a Huge Comeback in Modern Web Apps', channel: 'Design Web', views: '98K views', date: '2 weeks ago', time: '10:04' }
    ];

    const currentVideo = videoList.find(v => v.id === currentVideoId) || videoList[0];

    return (
      <div style={{
        backgroundColor: '#0f0f0f',
        color: '#f1f1f1',
        fontFamily: '"Roboto", "Arial", sans-serif',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#0f0f0f',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div onClick={() => navigateTo('youtube.com')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
            <span style={{ color: '#ff0000', fontSize: '24px' }}>▶️</span>
            <span>YouTube</span>
          </div>

          <div style={{ display: 'flex', flex: 1, maxWidth: '480px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search"
              style={{
                width: '100%',
                padding: '6px 16px',
                fontSize: '14px',
                backgroundColor: '#121212',
                border: '1px solid #303030',
                borderRadius: '40px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ fontSize: '14px' }}>Sign In 👤</div>
        </div>

        {isWatch ? (
          /* Video Detail Player Page */
          <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
            
            {/* Left side: player */}
            <div>
              <div style={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                width: '100%',
                backgroundColor: 'black',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}>
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                  title="YouTube video player"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '16px', color: 'white' }}>{currentVideo.title}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '13px', color: '#aaa' }}>
                <div>{currentVideo.views} • {currentVideo.date}</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ cursor: 'pointer' }}>👍 Like</span>
                  <span style={{ cursor: 'pointer' }}>↪️ Share</span>
                  <span style={{ cursor: 'pointer' }}>📥 Download</span>
                </div>
              </div>
              <div style={{ height: '0.2px', backgroundColor: '#303030', margin: '16px 0' }} />
              
              {/* Channel Block */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>{currentVideo.channel}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>1.24M subscribers</div>
                </div>
                <button style={{ marginLeft: 'auto', backgroundColor: '#f1f1f1', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Subscribe</button>
              </div>
            </div>

            {/* Right side: related videos list */}
            <div>
              <h3 style={{ fontSize: '14px', marginBottom: '16px' }}>Up next</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {videoList.filter(v => v.id !== currentVideoId).map((video, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigateTo(`youtube.com/watch?v=${video.id}`)}
                    style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}
                  >
                    <div style={{
                      width: '120px',
                      height: '70px',
                      backgroundColor: '#333',
                      borderRadius: '8px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      📺
                      <span style={{ position: 'absolute', bottom: '4px', right: '4px', backgroundColor: 'black', fontSize: '9px', padding: '2px 4px', borderRadius: '2px' }}>{video.time}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'white', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{video.title}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>{video.channel}</div>
                      <div style={{ fontSize: '11px', color: '#aaa' }}>{video.views}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Grid Video list homepage */
          <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Recommended</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
              {videoList.map((video, idx) => (
                <div
                  key={idx}
                  onClick={() => navigateTo(`youtube.com/watch?v=${video.id}`)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#2b2b2b',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    📺
                    <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'black', fontSize: '10px', padding: '2px 6px', borderRadius: '2px' }}>{video.time}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>👤</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {video.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>{video.channel}</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>{video.views} • {video.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- CHATGPT ---
  const renderChatGPT = () => {
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
      { sender: 'ai', text: 'Hello! I am ChatGPT, a simulated assistant. Ask me anything about the developer\'s programming skills, portfolio details, or experience!' }
    ]);
    const chatEndRef = useRef(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSend = () => {
      if (!chatInput.trim()) return;
      const text = chatInput.trim();
      setChatHistory(prev => [...prev, { sender: 'user', text }]);
      setChatInput('');

      setTimeout(() => {
        const resp = getAIResponse(text);
        setChatHistory(prev => [...prev, { sender: 'ai', text: resp }]);
      }, 700);
    };

    return (
      <div style={{
        backgroundColor: '#212121',
        color: '#ececf1',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        height: '100%',
        display: 'flex'
      }}>
        {/* Sidebar */}
        <div style={{
          width: '240px',
          backgroundColor: '#171717',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #333'
        }}>
          <div>
            <button onClick={() => setChatHistory([{ sender: 'ai', text: 'New conversation started. Ask me about the developer\'s portfolio!' }])} style={{ width: '100%', padding: '10px', border: '1px solid #4d4d4d', borderRadius: '4px', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '13px' }}>
              ＋ New Chat
            </button>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '16px', paddingLeft: '4px' }}>Yesterday</div>
            <div style={{ fontSize: '13px', color: '#ccc', padding: '8px 4px', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2c2c2c'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              💬 Portfolio Developer Details
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '0.2px solid #444', paddingTop: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
            <div style={{ fontSize: '13px' }}>Guest User</div>
          </div>
        </div>

        {/* Chat Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, padding: '24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '20px',
                padding: '16px 20px',
                borderRadius: '8px',
                backgroundColor: msg.sender === 'ai' ? '#2f2f2f' : 'transparent',
                maxWidth: '750px',
                alignSelf: 'center',
                width: '100%',
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '4px',
                  backgroundColor: msg.sender === 'ai' ? '#10a37f' : '#ab68ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'white',
                  flexShrink: 0
                }}>
                  {msg.sender === 'ai' ? '🤖' : 'U'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom input area */}
          <div style={{ padding: '0 40px 24px 40px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '750px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? handleSend() : null}
                placeholder="Send a message..."
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 16px',
                  borderRadius: '24px',
                  backgroundColor: '#353541',
                  border: '1px solid #4f4f4f',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '10px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: chatInput ? '#10a37f' : 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- RECURSIVE PORTFOLIO INCEPTION ---
  const renderPortfolioInception = () => {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: '#111827',
        color: 'white',
        height: '100%',
        overflowY: 'auto',
        fontFamily: 'Segoe UI, system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Simulated Developer Portfolio</h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '6px' }}>Nested portfolio simulation active on `http://portfolio.local`</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#1f2937', borderRadius: '8px', border: '0.2px solid #374151' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#60cdff', marginBottom: '8px' }}>👤 About Me</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#d1d5db' }}>
              Full Stack Software Engineer specialized in high fidelity web simulations, complex dashboard widgets, game logic structures, and secure backend routing stacks.
            </p>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: '#1f2937', borderRadius: '8px', border: '0.2px solid #374151' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#60cdff', marginBottom: '8px' }}>⚡ Engineering Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'].map(skill => (
                <span key={skill} style={{ backgroundColor: 'rgba(96,205,255,0.1)', border: '0.2px solid rgba(96,205,255,0.4)', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', color: '#60cdff' }}>{skill}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#1f2937', borderRadius: '8px', border: '0.2px solid #374151', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#60cdff', marginBottom: '8px' }}>🚀 Running Projects</h3>
            <ul style={{ fontSize: '13px', lineHeight: '1.8', color: '#d1d5db', paddingLeft: '20px' }}>
              <li><strong>Antigravity OS Replica</strong> - Interactive desktop sandbox built completely with vanilla styling.</li>
              <li><strong>Stripe Custom Billing Engine</strong> - Node.js payment processor with robust error logs.</li>
              <li><strong>Snake Arcade Game</strong> - Retro game loop rendering high scores on browser context variables.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // --- BROWSER THEMING STYLES ---
  const isChrome = type === 'chrome';

  const cleanUrl = activeTab?.url?.replace(/(^\w+:|^)\/\//, '').replace('www.', '').toLowerCase() || '';
  const isMockPage = 
    cleanUrl === 'google.com' || 
    cleanUrl === 'bing.com' || 
    cleanUrl.startsWith('google.com/search') ||
    cleanUrl.startsWith('bing.com/search') ||
    cleanUrl.startsWith('github.com') || 
    cleanUrl.startsWith('wikipedia.org') || 
    cleanUrl.startsWith('youtube.com') || 
    cleanUrl.startsWith('openai.com') || 
    cleanUrl.startsWith('chatgpt.com') || 
    cleanUrl.startsWith('portfolio.local');
  const isProxied = !isMockPage;
  
  // UI colors
  const browserBg = isChrome 
    ? (isDark ? '#202124' : '#dee1e6')
    : (isDark ? '#1f1f1f' : '#f3f3f3');
  
  const toolbarBg = isChrome
    ? (isDark ? '#35363a' : '#ffffff')
    : (isDark ? '#2d2d2d' : '#ffffff');

  const textCol = isDark ? '#ffffff' : '#000000';
  const subtextCol = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const borderCol = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)';

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* Main Browser Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        backgroundColor: browserBg,
        color: textCol,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        {/* --- TAB BAR --- */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: '8px 8px 0 8px',
          gap: '4px',
          height: '40px',
          backgroundColor: browserBg,
          borderBottom: isChrome ? 'none' : `1px solid ${borderCol}`
        }}>
          {tabs.map(tab => {
            const isActive = tab.id === activeTabId;
            const tabStyle = isChrome ? {
              backgroundColor: isActive ? toolbarBg : 'transparent',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              color: textCol,
              fontWeight: isActive ? '500' : 'normal',
              minWidth: '140px',
              maxWidth: '180px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '12px',
              height: '32px',
              transition: 'background 0.2s',
              borderBottom: 'none'
            } : {
              backgroundColor: isActive ? toolbarBg : 'transparent',
              borderLeft: `1px solid ${borderCol}`,
              borderRight: `1px solid ${borderCol}`,
              borderTop: isActive ? `2px solid ${isDark ? '#60cdff' : '#0067c0'}` : 'none',
              color: textCol,
              fontWeight: isActive ? '500' : 'normal',
              minWidth: '130px',
              maxWidth: '180px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '12px',
              height: '32px',
              borderBottom: isActive ? 'none' : `1px solid ${borderCol}`
            };

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                style={tabStyle}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: '14px' }}>🌐</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.title}</span>
                </div>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: subtextCol,
                    fontSize: '11px',
                    padding: '2px 6px',
                    cursor: 'pointer',
                    borderRadius: '50%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    e.currentTarget.style.color = '#ff6b6b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = subtextCol;
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
          
          {/* New Tab Button */}
          <button
            onClick={() => createNewTab()}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              color: textCol,
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ＋
          </button>
        </div>

        {/* --- TOOLBAR --- */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          gap: '8px',
          backgroundColor: toolbarBg,
          borderBottom: `1px solid ${borderCol}`
        }}>
          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              disabled={activeTab.historyIndex <= 0}
              onClick={goBack}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '40%',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab.historyIndex > 0 ? textCol : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
                cursor: activeTab.historyIndex > 0 ? 'pointer' : 'default',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (activeTab.historyIndex > 0) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ◀
            </button>
            <button
              disabled={activeTab.historyIndex >= activeTab.history.length - 1}
              onClick={goForward}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '40%',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab.historyIndex < activeTab.history.length - 1 ? textCol : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
                cursor: activeTab.historyIndex < activeTab.history.length - 1 ? 'pointer' : 'default',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (activeTab.historyIndex < activeTab.history.length - 1) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ▶
            </button>
            <button
              onClick={refreshPage}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '40%',
                border: 'none',
                backgroundColor: 'transparent',
                color: textCol,
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🔄
            </button>
            <button
              onClick={goHome}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '40%',
                border: 'none',
                backgroundColor: 'transparent',
                color: textCol,
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🏠
            </button>
          </div>

          {/* Address Bar */}
          <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? navigateTo(addressInput) : null}
              style={{
                width: '100%',
                padding: `6px ${isProxied ? '95px' : '12px'} 6px 32px`,
                fontSize: '13px',
                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f1f3f4',
                border: `1px solid ${borderCol}`,
                borderRadius: isChrome ? '16px' : '4px',
                color: textCol,
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '7px', fontSize: '13px', opacity: 0.5 }}>🔒</span>
            {isProxied && (
              <span style={{
                position: 'absolute',
                right: '8px',
                top: '5px',
                fontSize: '10px',
                backgroundColor: 'rgba(52, 168, 83, 0.15)',
                color: isDark ? '#81c784' : '#2e7d32',
                border: '1px solid rgba(52, 168, 83, 0.3)',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 'bold',
                userSelect: 'none'
              }}>
                Web Proxy
              </span>
            )}
          </div>

          {/* Copilot Sidebar Toggle for Edge */}
          {!isChrome && (
            <button
              onClick={() => setCopilotOpen(!copilotOpen)}
              style={{
                backgroundColor: copilotOpen ? 'rgba(0, 176, 240, 0.2)' : 'transparent',
                border: copilotOpen ? '1px solid #00b0f0' : 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: textCol
              }}
              onMouseEnter={(e) => {
                if (!copilotOpen) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!copilotOpen) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <EdgeIcon size={16} />
              <span style={{ fontWeight: '500' }}>Copilot</span>
            </button>
          )}
        </div>

        {/* --- VIEWPORT FRAME --- */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', backgroundColor: 'white' }}>
          {renderBrowserContent()}
        </div>
      </div>

      {/* --- COPILOT PANEL FOR EDGE --- */}
      {copilotOpen && !isChrome && (
        <div style={{
          width: '320px',
          height: '100%',
          backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
          borderLeft: `1px solid ${borderCol}`,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
          animation: 'windowOpen 0.2s ease',
          zIndex: 5
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${borderCol}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? '#2d2d2d' : '#f3f3f3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold' }}>
              <EdgeIcon size={18} />
              <span>Microsoft Copilot</span>
            </div>
            <button
              onClick={() => setCopilotOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: textCol,
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {copilotMessages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' 
                  ? '#0078d4' 
                  : (isDark ? '#2d2d2d' : '#ffffff'),
                color: msg.sender === 'user' ? 'white' : textCol,
                padding: '10px 12px',
                borderRadius: '8px',
                maxWidth: '85%',
                fontSize: '12px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: msg.sender === 'ai' ? `1px solid ${borderCol}` : 'none'
              }}>
                {msg.text}
              </div>
            ))}
            <div ref={copilotEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: `1px solid ${borderCol}`, backgroundColor: isDark ? '#202020' : '#f0f0f0' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? handleCopilotSend() : null}
                placeholder="Ask Copilot..."
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: '20px',
                  backgroundColor: isDark ? '#111' : 'white',
                  border: `1px solid ${borderCol}`,
                  color: textCol,
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleCopilotSend}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '6px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#00b0f0',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OSBrowser;
