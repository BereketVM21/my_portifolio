import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import OSBrowser, { ChromeIcon, EdgeIcon } from './OSBrowser';

const OSContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await api.createMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ padding: '16px', backgroundColor: 'rgba(81, 207, 102, 0.2)', borderRadius: '8px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
          <div style={{ fontSize: '14px', color: '#51cf66', fontWeight: '500' }}>Message sent successfully!</div>
        </div>
        <button 
          className="btn" 
          onClick={() => setSubmitted(false)}
          style={{ marginTop: '16px', padding: '8px 16px', fontSize: '14px', background: 'linear-gradient(135deg, #0078d4, #000000)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px' }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'grid', gap: '16px' }}>
      {error && (
        <div style={{ padding: '12px', backgroundColor: 'rgba(255, 107, 107, 0.2)', borderRadius: '4px', color: '#ff6b6b', fontSize: '13px' }}>
          ⚠️ {error}
        </div>
      )}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter your name"
          required
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '0.2px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Enter your email"
          required
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '0.2px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          placeholder="Enter subject"
          required
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '0.2px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Write your message here..."
          required
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '0.2px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            resize: 'none'
          }}
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        style={{
          padding: '12px 24px',
          backgroundColor: sending ? '#3a3a3a' : '#0078d4',
          border: 'none',
          borderRadius: '4px',
          cursor: sending ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          color: 'white',
          fontWeight: '500'
        }}
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

const OSTerminal = ({ bio, skills, projects, closeWindow }) => {
  const [history, setHistory] = React.useState([
    'Antigravity OS Command Line Interface [Version 1.0.0]',
    '(c) Antigravity Corporation. All rights reserved.',
    '',
    'Type "help" to view a list of available commands.'
  ]);
  const [input, setInput] = React.useState('');
  const [cmdHistory, setCmdHistory] = React.useState([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIndex - 1;
      if (nextIdx >= 0) {
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Enter') {
      handleCommand();
    }
  };

  const handleCommand = () => {
    const cmd = input.trim();
    if (cmd) {
      setCmdHistory(prev => {
        if (prev.length > 0 && prev[prev.length - 1] === cmd) return prev;
        return [...prev, cmd];
      });
    }
    setHistoryIndex(-1);
    const cmdClean = cmd.toLowerCase();
    const newHistory = [...history, `C:\\Users\\Guest> ${input}`];

    if (cmdClean === 'help') {
      newHistory.push(
        'Available commands:',
        '  help      - Show this help message',
        '  about     - Display personal about information',
        '  skills    - List professional skills and technologies',
        '  projects  - Show featured projects and information',
        '  neofetch  - Display system details and ASCII logo',
        '  clear     - Clear the terminal screen',
        '  exit      - Close the terminal application'
      );
    } else if (cmdClean === 'about') {
      newHistory.push(
        '========================================',
        `  Name:      ${bio?.name || 'Your Name'}`,
        `  Title:     ${bio?.heroSubtitle || 'Full Stack Developer'}`,
        `  Location:  ${bio?.location || 'Your Location'}`,
        `  Email:     ${bio?.socialLinks?.email || 'your.email@example.com'}`,
        '========================================',
        `  Bio: ${bio?.aboutMe || 'A passionate developer.'}`
      );
    } else if (cmdClean === 'skills') {
      if (skills && skills.length > 0) {
        newHistory.push('Professional Skills:');
        const groups = skills.reduce((acc, s) => {
          const cat = s.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(s);
          return acc;
        }, {});
        Object.entries(groups).forEach(([cat, list]) => {
          newHistory.push(`\n  [${cat}]`);
          list.forEach(s => {
            const bar = '='.repeat(Math.round(s.proficiency / 10)) + '-'.repeat(10 - Math.round(s.proficiency / 10));
            newHistory.push(`    ${s.name.padEnd(15)} [${bar}] ${s.proficiency}%`);
          });
        });
      } else {
        newHistory.push(
          'Professional Skills:',
          '  Frontend:   React, TypeScript, CSS, Tailwind CSS',
          '  Backend:    Node.js, Express, MongoDB, PostgreSQL',
          '  DevOps:     Docker, AWS, CI/CD'
        );
      }
    } else if (cmdClean === 'projects') {
      if (projects && projects.length > 0) {
        newHistory.push('Featured Projects:');
        projects.forEach(p => {
          newHistory.push(
            `\n  * ${p.title.toUpperCase()}`,
            `    Description:  ${p.description}`,
            `    Technologies: ${p.technologies.join(', ')}`
          );
        });
      } else {
        newHistory.push(
          'Featured Projects:',
          '  1. Portfolio OS - Simulated Windows 11 desktop built in React.',
          '  2. Task Management API - Scalable Express/MongoDB web service.'
        );
      }
    } else if (cmdClean === 'neofetch') {
      newHistory.push(
        '   /\\_/\\      guest@antigravity-os',
        '  ( o.o )     --------------------',
        '   > ^ <      OS: Antigravity Portfolio OS v1.0',
        '  /  |  \\     Kernel: React 18 / Vite v4',
        ' (   |   )    Shell: Gemini Terminal v1.0',
        '  \\__|_/      Theme: Windows 11 Navy Blue',
        '              Processor: AI Assistant Engine'
      );
    } else if (cmdClean === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (cmdClean === 'exit') {
      closeWindow();
      return;
    } else if (cmdClean !== '') {
      newHistory.push(`'${cmdClean}' is not recognized as an internal or external command. Type "help" for a list.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#0c0c0c', 
        color: '#cccccc', 
        fontFamily: '"Consolas", "Courier New", monospace', 
        padding: '16px', 
        height: '100%', 
        overflowY: 'auto',
        fontSize: '14px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}
      onClick={() => document.getElementById('terminal-hidden-input')?.focus()}
    >
      <div style={{ flex: 1 }}>
        {history.map((line, idx) => (
          <div key={idx} style={{ whiteSpace: 'pre-wrap', marginBottom: '4px', lineHeight: '1.4' }}>{line}</div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ color: '#00ff00', marginRight: '8px' }}>C:\\Users\\Guest&gt;</span>
          <input
            id="terminal-hidden-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontFamily: '"Consolas", "Courier New", monospace',
              fontSize: '14px',
              outline: 'none',
              flex: 1
            }}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

const OSNotepad = () => {
  const [text, setText] = React.useState(() => {
    return localStorage.getItem('notepad_content') || 'Welcome to Notepad!\n\nThis is a working text editor. Anything you type here is saved to your browser\'s localStorage so it stays here when you return.';
  });

  const handleChange = (e) => {
    setText(e.target.value);
    localStorage.setItem('notepad_content', e.target.value);
  };

  const handleClear = () => {
    setText('');
    localStorage.setItem('notepad_content', '');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'notes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1e1e1e', color: '#e0e0e0', flex: 1 }}>
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '6px 12px', 
        backgroundColor: '#2b2b2b', 
        borderBottom: '0.2px solid rgba(255,255,255,0.1)',
        fontSize: '12px',
        alignItems: 'center'
      }}>
        <button 
          onClick={handleDownload}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#ccc', 
            cursor: 'pointer', 
            padding: '4px 8px', 
            borderRadius: '4px',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          💾 Save / Download
        </button>
        <button 
          onClick={handleClear}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#ccc', 
            cursor: 'pointer', 
            padding: '4px 8px', 
            borderRadius: '4px',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          🗑️ Clear Text
        </button>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        style={{
          flex: 1,
          border: 'none',
          padding: '16px',
          fontFamily: 'Consolas, monospace',
          fontSize: '14px',
          outline: 'none',
          resize: 'none',
          backgroundColor: '#1e1e1e',
          color: '#e0e0e0',
          lineHeight: '1.5'
        }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 12px',
        backgroundColor: '#2b2b2b',
        borderTop: '0.2px solid rgba(255,255,255,0.1)',
        fontSize: '11px',
        color: '#888'
      }}>
        <span>Ln 1, Col {charCount}</span>
        <span>Words: {wordCount} | Chars: {charCount}</span>
        <span>Windows (CRLF) | UTF-8</span>
      </div>
    </div>
  );
};

const OSSnakeGame = () => {
  const [snake, setSnake] = React.useState([{ x: 8, y: 8 }, { x: 8, y: 9 }]);
  const [food, setFood] = React.useState({ x: 4, y: 4 });
  const [dir, setDir] = React.useState({ x: 0, y: -1 });
  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(() => parseInt(localStorage.getItem('snake_highscore') || '0'));
  const [gameOver, setGameOver] = React.useState(false);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState('medium');
  const gameRef = React.useRef(null);

  const gridSize = 16;

  const playSound = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'eat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'die') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {}
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || gameOver) return;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y === 0) setDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y === 0) setDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x === 0) setDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x === 0) setDir({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir, gameStarted, gameOver]);

  const speed = difficulty === 'slow' ? 220 : difficulty === 'medium' ? 150 : 90;

  React.useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
          playSound('die');
          setGameOver(true);
          return prevSnake;
        }

        for (let segment of prevSnake) {
          if (segment.x === newHead.x && segment.y === newHead.y) {
            playSound('die');
            setGameOver(true);
            return prevSnake;
          }
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          playSound('eat');
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('snake_highscore', nextScore.toString());
            }
            return nextScore;
          });
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [dir, food, gameStarted, gameOver, highScore, speed]);

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      let onSnake = false;
      for (let segment of currentSnake) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          onSnake = true;
          break;
        }
      }
      if (!onSnake) break;
    }
    setFood(newFood);
  };

  const restartGame = () => {
    setSnake([{ x: 8, y: 8 }, { x: 8, y: 9 }]);
    setFood({ x: 4, y: 4 });
    setDir({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div 
      ref={gameRef}
      tabIndex="0" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        backgroundColor: '#121212', 
        color: 'white',
        outline: 'none',
        padding: '12px',
        flex: 1,
        userSelect: 'none'
      }}
      onClick={() => gameRef.current?.focus()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '280px', marginBottom: '8px', fontSize: '13px' }}>
        <span>Score: <strong style={{ color: '#60cdff' }}>{score}</strong></span>
        <span>High Score: <strong style={{ color: '#ffd700' }}>{highScore}</strong></span>
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '280px',
        aspectRatio: '1',
        backgroundColor: '#0a0a0a',
        border: '3px solid #333',
        borderRadius: '8px',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: 'calc(100% / 16) calc(100% / 16)'
        }} />

        {!gameStarted && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(4px)',
            gap: '12px',
            zIndex: 10
          }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', color: '#60cdff' }}>SNAKE GAME</span>
            
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
              {['slow', 'medium', 'fast'].map(level => (
                <button
                  key={level}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDifficulty(level);
                  }}
                  style={{
                    padding: '3px 8px',
                    fontSize: '10px',
                    backgroundColor: difficulty === level ? '#60cdff' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '3px',
                    color: difficulty === level ? 'black' : 'white',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: 'bold'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setGameStarted(true)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#0078d4', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0,120,212,0.4)'
              }}
            >
              Start Game
            </button>
          </div>
        )}

        {gameOver && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(0,0,0,0.9)', 
            backdropFilter: 'blur(4px)',
            gap: '12px',
            zIndex: 10
          }}>
            <span style={{ fontSize: '20px', color: '#ff4757', fontWeight: 'bold', letterSpacing: '2px' }}>GAME OVER</span>
            <span style={{ fontSize: '13px' }}>Final Score: <strong style={{ color: '#60cdff' }}>{score}</strong></span>
            <button 
              onClick={restartGame}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#0078d4', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Play Again
            </button>
          </div>
        )}

        {snake.map((segment, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: 'calc(100% / 16 - 1px)',
              height: 'calc(100% / 16 - 1px)',
              background: idx === 0 
                ? 'linear-gradient(135deg, #60cdff 0%, #0078d4 100%)' 
                : 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)',
              left: `calc(100% / 16 * ${segment.x})`,
              top: `calc(100% / 16 * ${segment.y})`,
              borderRadius: idx === 0 ? '4px' : '2px',
              border: '0.2px solid #000',
              boxShadow: idx === 0 ? '0 0 5px #60cdff' : 'none'
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            width: 'calc(100% / 16 - 2px)',
            height: 'calc(100% / 16 - 2px)',
            background: 'radial-gradient(circle, #ff6b6b 0%, #ff4757 100%)',
            left: `calc(100% / 16 * ${food.x} + 1px)`,
            top: `calc(100% / 16 * ${food.y} + 1px)`,
            borderRadius: '50%',
            boxShadow: '0 0 8px #ff4757',
          }}
        />
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: '1.4' }}>
        Press W/A/S/D or Arrows to move.
      </div>
    </div>
  );
};

const OSSettings = () => {
  const { settings, updateSettings, resetSettings, availableWallpapers } = useTheme();
  const { user } = useAuth();
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [saveAsDefault, setSaveAsDefault] = React.useState(true);
  const [savedMessage, setSavedMessage] = React.useState('');

  // Hover and Active states for Windows 11 style buttons
  const [saveHover, setSaveHover] = React.useState(false);
  const [saveActive, setSaveActive] = React.useState(false);
  const [resetHover, setResetHover] = React.useState(false);
  const [resetActive, setResetActive] = React.useState(false);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    try {
      updateSettings(localSettings);
      
      if (user && saveAsDefault) {
        await api.updateSettings({
          defaultBrightness: localSettings.brightness,
          defaultWallpaper: localSettings.wallpaper,
          defaultDarkMode: localSettings.darkMode,
          defaultFontSize: localSettings.fontSize
        });
        setSavedMessage('Changes saved to local settings and site defaults!');
      } else {
        setSavedMessage('Changes saved successfully!');
      }
      
      setTimeout(() => {
        setSavedMessage('');
      }, 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setSavedMessage('Failed to save defaults to server.');
      setTimeout(() => {
        setSavedMessage('');
      }, 2500);
    }
  };

  const handleReset = () => {
    resetSettings();
    setSavedMessage('Settings reset to default!');
    setTimeout(() => {
      setSavedMessage('');
    }, 2500);
  };

  // Windows 11 theme colors styling based on local settings dark mode preview
  const isDark = localSettings.darkMode;
  const bgColor = isDark ? '#202020' : '#f3f3f3';
  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryTextColor = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const subHeaderColor = isDark ? '#ffffff' : '#111111';

  // Windows 11 Style save button colors
  const saveBtnBg = saveActive
    ? (isDark ? '#50b5df' : '#005a9e')
    : (saveHover
      ? (isDark ? '#7ce0ff' : '#1975c5')
      : (isDark ? '#60cdff' : '#0067c0'));

  const saveBtnColor = isDark ? '#000000' : '#ffffff';

  // Windows 11 Style restore button colors
  const resetBtnBg = resetActive
    ? (isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)')
    : (resetHover
      ? (isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.06)')
      : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)'));

  const resetBtnBorder = isDark ? '1px solid rgba(255, 255, 255, 0.09)' : '1px solid rgba(0, 0, 0, 0.06)';

  return (
    <div style={{ padding: '20px', height: '100%', overflowY: 'auto', backgroundColor: bgColor, color: textColor, transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: textColor }}>Settings</h3>
      
      {/* System Settings */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: subHeaderColor }}>System</h4>
        
        {/* Brightness */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '8px', display: 'block', fontSize: '13px', color: secondaryTextColor }}>
            Display Brightness
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={localSettings.brightness}
              onChange={(e) => setLocalSettings({ ...localSettings, brightness: parseInt(e.target.value) })}
              style={{ flex: 1, cursor: 'pointer', accentColor: isDark ? '#60cdff' : '#0067c0' }}
            />
            <span style={{ minWidth: '45px', textAlign: 'right', fontSize: '13px', color: textColor }}>{localSettings.brightness}%</span>
          </div>
        </div>

        {/* Background */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '8px', display: 'block', fontSize: '13px', color: secondaryTextColor }}>
            Background Color
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {availableWallpapers.map(w => (
              <button
                key={w.value}
                onClick={() => setLocalSettings({ ...localSettings, wallpaper: w.value })}
                style={{
                  padding: '12px',
                  backgroundColor: w.preview,
                  border: localSettings.wallpaper === w.value ? `3px solid ${isDark ? '#60cdff' : '#0067c0'}` : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: 'white',
                  transition: 'all 0.2s ease',
                  boxShadow: localSettings.wallpaper === w.value ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                }}
              >
                {w.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '8px', display: 'block', fontSize: '13px', color: secondaryTextColor }}>
            Dark Mode
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setLocalSettings({ ...localSettings, darkMode: true })}
              style={{
                flex: 1,
                padding: '10px 20px',
                backgroundColor: localSettings.darkMode ? (isDark ? '#60cdff' : '#0067c0') : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'),
                border: localSettings.darkMode ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                color: localSettings.darkMode ? (isDark ? '#000000' : '#ffffff') : textColor,
                fontWeight: localSettings.darkMode ? '600' : '400',
                transition: 'all 0.15s ease'
              }}
            >
              On
            </button>
            <button
              onClick={() => setLocalSettings({ ...localSettings, darkMode: false })}
              style={{
                flex: 1,
                padding: '10px 20px',
                backgroundColor: !localSettings.darkMode ? (isDark ? '#60cdff' : '#0067c0') : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'),
                border: !localSettings.darkMode ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                color: !localSettings.darkMode ? (isDark ? '#000000' : '#ffffff') : textColor,
                fontWeight: !localSettings.darkMode ? '600' : '400',
                transition: 'all 0.15s ease'
              }}
            >
              Off
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginBottom: '8px', display: 'block', fontSize: '13px', color: secondaryTextColor }}>
            Font Size
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setLocalSettings({ ...localSettings, fontSize: Math.max(12, localSettings.fontSize - 1) })}
              style={{
                padding: '10px 16px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                color: textColor,
                minWidth: '40px',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}
            >
              −
            </button>
            <input
              type="number"
              min="12"
              max="24"
              value={localSettings.fontSize}
              onChange={(e) => setLocalSettings({ ...localSettings, fontSize: parseInt(e.target.value) || 16 })}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.12)'}`,
                borderRadius: '4px',
                color: textColor,
                fontSize: '13px',
                textAlign: 'center'
              }}
            />
            <button
              onClick={() => setLocalSettings({ ...localSettings, fontSize: Math.min(24, localSettings.fontSize + 1) })}
              style={{
                padding: '10px 16px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                color: textColor,
                minWidth: '40px',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Admin Site-wide Defaults Option */}
      {user && (
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="saveAsDefault"
            checked={saveAsDefault}
            onChange={(e) => setSaveAsDefault(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: isDark ? '#60cdff' : '#0067c0' }}
          />
          <label htmlFor="saveAsDefault" style={{ fontSize: '13px', color: textColor, cursor: 'pointer' }}>
            Set as default settings for all visitors
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Save Button */}
        <button
          onClick={handleSave}
          onMouseEnter={() => setSaveHover(true)}
          onMouseLeave={() => { setSaveHover(false); setSaveActive(false); }}
          onMouseDown={() => setSaveActive(true)}
          onMouseUp={() => setSaveActive(false)}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: saveBtnBg,
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            color: saveBtnColor,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
            transition: 'background-color 0.15s, transform 0.1s',
            transform: saveActive ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
            <path d="M17.207 4.293a1 1 0 0 1 0 1.414L8.5 14.414l-4.707-4.707a1 1 0 0 1 1.414-1.414L8.5 11.586l7.293-7.293a1 1 0 0 1 1.414 0Z"/>
          </svg>
          Save Changes
        </button>

        {/* Reset/Restore Button */}
        <button
          onClick={handleReset}
          onMouseEnter={() => setResetHover(true)}
          onMouseLeave={() => { setResetHover(false); setResetActive(false); }}
          onMouseDown={() => setResetActive(true)}
          onMouseUp={() => setResetActive(false)}
          style={{
            flex: 1,
            padding: '8px 12px',
            backgroundColor: resetBtnBg,
            border: resetBtnBorder,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            color: textColor,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s, border-color 0.15s, transform 0.1s',
            transform: resetActive ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
            <path d="M10 2a8 8 0 1 0 5.657 2.343l.586-.586a.5.5 0 0 1 .854.354V7.5a.5.5 0 0 1-.5.5H13.25a.5.5 0 0 1-.354-.854l.654-.654A6.5 6.5 0 1 1 10 3.5c1.472 0 2.85.49 3.96 1.317a.75.75 0 0 0 .914-1.19A7.954 7.954 0 0 0 10 2Z" fill="currentColor"/>
          </svg>
          Restore to Default
        </button>
      </div>

      {/* Success Notification */}
      {savedMessage && (
        <div style={{
          marginTop: '15px',
          padding: '10px 16px',
          backgroundColor: savedMessage.includes('reset') ? 'rgba(255, 193, 7, 0.2)' : 'rgba(81, 207, 102, 0.2)',
          border: savedMessage.includes('reset') ? '0.2px solid rgba(255, 193, 7, 0.4)' : '0.2px solid rgba(81, 207, 102, 0.4)',
          borderRadius: '6px',
          color: savedMessage.includes('reset') ? '#ffc107' : '#51cf66',
          fontSize: '12px',
          textAlign: 'center',
          animation: 'windowOpen 0.2s ease'
        }}>
          {savedMessage}
        </div>
      )}
    </div>
  );
};

const OSDashboard = ({ bio, skills, projects, isFullscreen, setIsFullscreen }) => {
  const { settings, updateSettings, resetSettings, availableWallpapers, getWallpaperColor } = useTheme();
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllApps, setShowAllApps] = useState(false);
  const [recentlyOpened, setRecentlyOpened] = useState(['portfolio', 'projects', 'skills', 'contact']);
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [calendarPanelOpen, setCalendarPanelOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [zIndex, setZIndex] = useState(100);
  const [desktopWallpaper, setDesktopWallpaper] = useState("url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop')");
  
  const desktopRef = useRef(null);
  
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (e.target.closest('input') || e.target.closest('textarea') || e.target.closest('.window')) return;
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleDesktopClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
    setStartMenuOpen(false);
    setPowerMenuOpen(false);
    setNotificationPanelOpen(false);
    setCalendarPanelOpen(false);
    setQuickSettingsOpen(false);
  };

  const handleShutdown = () => {
    setStartMenuOpen(false);
    setPowerMenuOpen(false);
    setIsShuttingDown(true);
    setTimeout(() => {
      setIsShuttingDown(false);
      setIsFullscreen(false);
    }, 2000);
  };

  const handleRestart = () => {
    setStartMenuOpen(false);
    setPowerMenuOpen(false);
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
      setWindows([]);
      setActiveWindow(null);
    }, 2500);
  };

  const handleSignOut = () => {
    setStartMenuOpen(false);
    setPowerMenuOpen(false);
    setIsFullscreen(false);
  };

  const handleRefresh = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const handleNextWallpaper = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
    const currentIdx = wallpapers.findIndex(w => w.gradient === desktopWallpaper);
    const nextIdx = (currentIdx + 1) % wallpapers.length;
    setDesktopWallpaper(wallpapers[nextIdx].gradient);
  };

  const handleToggleTheme = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
    updateSettings({ darkMode: !settings.darkMode });
  };

  // Wallpaper options
  const wallpapers = [
    // Animals
    { id: 1, name: 'Lion', gradient: "url('https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200&auto=format&fit=crop')" },
    { id: 2, name: 'Wolf', gradient: "url('https://images.unsplash.com/photo-1590420485404-f86d22b8abf8?q=80&w=1200&auto=format&fit=crop')" },
    { id: 3, name: 'Eagle', gradient: "url('https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1200&auto=format&fit=crop')" },
    { id: 4, name: 'Tiger', gradient: "url('https://images.unsplash.com/photo-1507666405895-422efe53f197?q=80&w=1200&auto=format&fit=crop')" },
    { id: 5, name: 'Cat', gradient: "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200&auto=format&fit=crop')" },

    // Tropical Nature
    { id: 6, name: 'Tropical Beach', gradient: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop')" },
    { id: 7, name: 'Blue Ocean', gradient: "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1200&auto=format&fit=crop')" },
    { id: 8, name: 'Palm Trees', gradient: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop')" },
    { id: 9, name: 'Islands', gradient: "url('https://images.unsplash.com/photo-1467377791767-c929b559497a?q=80&w=1200&auto=format&fit=crop')" },

    // Mountain Nature
    { id: 10, name: 'Snow Peaks', gradient: "url('https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=1200&auto=format&fit=crop')" },
    { id: 11, name: 'Camping', gradient: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop')" },
    { id: 12, name: 'Hiking Trails', gradient: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop')" },
    { id: 13, name: 'Northern Lights', gradient: "url('https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=1200&auto=format&fit=crop')" },

    // Fantasy
    { id: 14, name: 'Dragon Concept', gradient: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')" },
    { id: 15, name: 'Castle', gradient: "url('https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1200&auto=format&fit=crop')" },
    { id: 16, name: 'Magic Forest', gradient: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200&auto=format&fit=crop')" },
    { id: 17, name: 'Elves Forest', gradient: "url('https://images.unsplash.com/photo-1500622339170-43be37201741?q=80&w=1200&auto=format&fit=crop')" },

    // Tech/Dev
    { id: 18, name: 'Code Editor', gradient: "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop')" },
    { id: 19, name: 'Terminal Aesthetics', gradient: "url('https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop')" },
    { id: 20, name: 'Python Theme', gradient: "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop')" },
    { id: 21, name: 'JavaScript Theme', gradient: "url('https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1200&auto=format&fit=crop')" },
    { id: 22, name: 'Linux Terminal', gradient: "url('https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200&auto=format&fit=crop')" },

    // Gaming
    { id: 23, name: 'GTA VI Vibe', gradient: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop')" },
    { id: 24, name: 'Cyberpunk 2077 Vibe', gradient: "url('https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=1200&auto=format&fit=crop')" },
    { id: 25, name: 'Elden Ring Vibe', gradient: "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop')" },
    { id: 26, name: 'Red Dead Redemption 2 Vibe', gradient: "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop')" },

    // Hypercars
    { id: 27, name: 'Bugatti', gradient: "url('https://images.unsplash.com/photo-1600706432502-75a0e2b83b8b?q=80&w=1200&auto=format&fit=crop')" },
    { id: 28, name: 'Koenigsegg', gradient: "url('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop')" },
    { id: 29, name: 'McLaren', gradient: "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop')" },
    { id: 30, name: 'Pagani', gradient: "url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop')" },

    // Artistic/Anime
    { id: 31, name: 'Anime Landscape', gradient: "url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop')" },
    { id: 32, name: 'Night City', gradient: "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop')" },
    { id: 33, name: 'Fantasy World', gradient: "url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop')" },

    // Cyberpunk/Neon
    { id: 34, name: 'Neon City', gradient: "url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop')" },
    { id: 35, name: 'Rainy Streets', gradient: "url('https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=1200&auto=format&fit=crop')" },
    { id: 36, name: 'Futuristic Building', gradient: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop')" }
  ];

  // Desktop icons
  const desktopIcons = [
    { id: 'portfolio', name: 'Portfolio', icon: '📁', action: () => openWindow('portfolio') },
    { id: 'about', name: 'About Me', icon: '👤', action: () => openWindow('about') },
    { id: 'skills', name: 'Skills', icon: '⚡', action: () => openWindow('skills') },
    { id: 'projects', name: 'Projects', icon: '🚀', action: () => openWindow('projects') },
    { id: 'contact', name: 'Contact', icon: '📧', action: () => openWindow('contact') },
    { id: 'terminal', name: 'Terminal', icon: '💻', action: () => openWindow('terminal') },
    { id: 'notepad', name: 'Notepad', icon: '📝', action: () => openWindow('notepad') },
    { id: 'snake', name: 'Snake Game', icon: '🎮', action: () => openWindow('snake') },
    { id: 'chrome', name: 'Google Chrome', icon: <ChromeIcon size={36} />, action: () => openWindow('chrome') },
    { id: 'edge', name: 'Microsoft Edge', icon: <EdgeIcon size={36} />, action: () => openWindow('edge') },
    { id: 'settings', name: 'Settings', icon: '⚙️', action: () => openWindow('settings') },
    { id: 'wallpaper', name: 'Wallpaper', icon: '🖼️', action: () => openWindow('wallpaper') },
  ];

  // Start menu apps
  const startMenuApps = [
    { id: 'portfolio', name: 'Portfolio', icon: '📁', action: () => { openWindow('portfolio'); setStartMenuOpen(false); } },
    { id: 'about', name: 'About Me', icon: '👤', action: () => { openWindow('about'); setStartMenuOpen(false); } },
    { id: 'skills', name: 'Skills', icon: '⚡', action: () => { openWindow('skills'); setStartMenuOpen(false); } },
    { id: 'projects', name: 'Projects', icon: '🚀', action: () => { openWindow('projects'); setStartMenuOpen(false); } },
    { id: 'contact', name: 'Contact', icon: '📧', action: () => { openWindow('contact'); setStartMenuOpen(false); } },
    { id: 'terminal', name: 'Terminal', icon: '💻', action: () => { openWindow('terminal'); setStartMenuOpen(false); } },
    { id: 'notepad', name: 'Notepad', icon: '📝', action: () => { openWindow('notepad'); setStartMenuOpen(false); } },
    { id: 'snake', name: 'Snake Game', icon: '🎮', action: () => { openWindow('snake'); setStartMenuOpen(false); } },
    { id: 'chrome', name: 'Google Chrome', icon: <ChromeIcon size={28} />, action: () => { openWindow('chrome'); setStartMenuOpen(false); } },
    { id: 'edge', name: 'Microsoft Edge', icon: <EdgeIcon size={28} />, action: () => { openWindow('edge'); setStartMenuOpen(false); } },
    { id: 'settings', name: 'Settings', icon: '⚙️', action: () => { openWindow('settings'); setStartMenuOpen(false); } },
    { id: 'wallpaper', name: 'Wallpaper', icon: '🖼️', action: () => { openWindow('wallpaper'); setStartMenuOpen(false); } },
  ];

  // Pinned apps
  const pinnedApps = [
    { id: 'portfolio', name: 'Portfolio', icon: '📁' },
    { id: 'terminal', name: 'Terminal', icon: '💻' },
    { id: 'notepad', name: 'Notepad', icon: '📝' },
    { id: 'snake', name: 'Snake Game', icon: '🎮' },
    { id: 'chrome', name: 'Google Chrome', icon: <ChromeIcon size={22} /> },
    { id: 'edge', name: 'Microsoft Edge', icon: <EdgeIcon size={22} /> },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'wallpaper', name: 'Wallpaper', icon: '🖼️' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Apply theme settings
  useEffect(() => {
    const adjustedBrightness = 30 + (settings.brightness * 2.2);
    document.documentElement.style.filter = `brightness(${adjustedBrightness}%)`;
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    
    const wallpaperColor = getWallpaperColor(settings.wallpaper);
    if (settings.darkMode) {
      document.body.classList.remove('light-mode');
      document.body.style.backgroundColor = wallpaperColor;
    } else {
      document.body.classList.add('light-mode');
      document.body.style.backgroundColor = '#9d9c9c';
    }
  }, [settings, getWallpaperColor]);

  const openWindow = (windowId) => {
    if (startMenuApps.some(app => app.id === windowId)) {
      setRecentlyOpened(prev => {
        const filtered = prev.filter(id => id !== windowId);
        return [windowId, ...filtered].slice(0, 4);
      });
    }
    const existingWindow = windows.find(w => w.id === windowId);
    if (existingWindow) {
      setWindows(windows.map(w => w.id === windowId ? { ...w, minimized: false } : w));
      setActiveWindow(windowId);
      setZIndex(zIndex + 1);
    } else {
      const wSize = getWindowSize(windowId);
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
      
      // Cascade offset to keep multiple open windows distinct
      const cascadeOffset = (windows.length % 6) * 30;
      
      // Professional positioning: center the window on screen with cascade offset
      const defaultX = Math.max(20, Math.floor((screenWidth - wSize.width) / 2) + cascadeOffset);
      const defaultY = Math.max(20, Math.floor((screenHeight - wSize.height - 48) / 2) + cascadeOffset);

      const newWindow = {
        id: windowId,
        title: getWindowTitle(windowId),
        icon: getWindowIcon(windowId),
        position: { x: defaultX, y: defaultY },
        size: wSize,
        minimized: false,
        maximized: false
      };
      setWindows([...windows, newWindow]);
      setActiveWindow(windowId);
      setZIndex(zIndex + 1);
    }
  };

  const closeWindow = (windowId) => {
    setWindows(windows.filter(w => w.id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(windows.length > 1 ? windows[windows.length - 2].id : null);
    }
  };

  const minimizeWindow = (windowId) => {
    setWindows(windows.map(w => w.id === windowId ? { ...w, minimized: true } : w));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  };

  const maximizeWindow = (windowId) => {
    setWindows(windows.map(w => w.id === windowId ? { ...w, maximized: !w.maximized } : w));
    setZIndex(zIndex + 1);
  };

  const focusWindow = (windowId) => {
    setActiveWindow(windowId);
    setZIndex(zIndex + 1);
  };

  const handleWindowDrag = (windowId, deltaX, deltaY) => {
    setWindows(windows.map(w => {
      if (w.id === windowId && !w.maximized) {
        return {
          ...w,
          position: {
            x: Math.max(0, w.position.x + deltaX),
            y: Math.max(0, w.position.y + deltaY)
          }
        };
      }
      return w;
    }));
  };

  const getWindowTitle = (windowId) => {
    const titles = {
      portfolio: 'Portfolio',
      about: 'About Me',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      settings: 'Settings',
      wallpaper: 'Wallpaper',
      terminal: 'Terminal (Command Prompt)',
      notepad: 'Notepad',
      snake: 'Snake Game',
      chrome: 'Google Chrome',
      edge: 'Microsoft Edge',
    };
    return titles[windowId] || 'Window';
  };

  const getWindowIcon = (windowId) => {
    const icons = {
      portfolio: '📁',
      about: '👤',
      skills: '⚡',
      projects: '🚀',
      contact: '📧',
      settings: '⚙️',
      wallpaper: '🖼️',
      terminal: '💻',
      notepad: '📝',
      snake: '🎮',
      chrome: <ChromeIcon size={18} />,
      edge: <EdgeIcon size={18} />,
    };
    return icons[windowId] || '📄';
  };

  const getWindowSize = (windowId) => {
    const sizes = {
      portfolio: { width: 800, height: 600 },
      about: { width: 600, height: 400 },
      skills: { width: 700, height: 500 },
      projects: { width: 900, height: 600 },
      contact: { width: 600, height: 500 },
      settings: { width: 500, height: 450 },
      wallpaper: { width: 900, height: 600 },
      terminal: { width: 700, height: 450 },
      notepad: { width: 600, height: 400 },
      snake: { width: 400, height: 480 },
      chrome: { width: 950, height: 650 },
      edge: { width: 950, height: 650 },
    };
    return sizes[windowId] || { width: 600, height: 400 };
  };

  const renderWindowContent = (windowId) => {
    try {
      switch (windowId) {
        case 'settings':
          return <OSSettings />;
        case 'wallpaper':
          return renderWallpaperContent();
        case 'terminal':
          return <OSTerminal bio={bio} skills={skills} projects={projects} closeWindow={() => closeWindow('terminal')} />;
        case 'notepad':
          return <OSNotepad />;
        case 'snake':
          return <OSSnakeGame />;
        case 'chrome':
          return <OSBrowser type="chrome" bio={bio} closeWindow={() => closeWindow('chrome')} />;
        case 'edge':
          return <OSBrowser type="edge" bio={bio} closeWindow={() => closeWindow('edge')} />;
        default:
          return renderPortfolioContent(windowId);
      }
    } catch (error) {
      console.error('Error rendering window content:', error);
      return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#1e1e1e' }}>
          <h3>Error</h3>
          <p>Failed to load this application.</p>
          <p style={{ fontSize: '12px', color: '#ff6b6b' }}>{error.message}</p>
        </div>
      );
    }
  };

  const renderWallpaperContent = () => (
    <div style={{ padding: '20px', height: '100%', overflowY: 'auto', backgroundColor: '#1e1e1e' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: 'white' }}>Wallpaper</h3>
      
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
        Choose a wallpaper for your Windows desktop
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {wallpapers.map(wallpaper => (
          <div
            key={wallpaper.id}
            onClick={() => setDesktopWallpaper(wallpaper.gradient)}
            style={{
              cursor: 'pointer',
              borderRadius: '12px',
              overflow: 'hidden',
              border: desktopWallpaper === wallpaper.gradient ? '3px solid #0078d4' : '0.2px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div
              style={{
                height: '120px',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), ${wallpaper.gradient}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}
            >
              🖼️
            </div>
            <div style={{ padding: '12px', backgroundColor: '#2d2d2d' }}>
              <div style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>{wallpaper.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                {desktopWallpaper === wallpaper.gradient ? '✓ Active' : 'Click to apply'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'rgba(0, 120, 212, 0.1)', border: '0.2px solid rgba(0, 120, 212, 0.3)', borderRadius: '8px' }}>
        <div style={{ fontSize: '13px', color: 'white', marginBottom: '8px' }}>
          💡 <strong>Tip:</strong> These wallpapers only change the Windows desktop background, not your main portfolio.
        </div>
      </div>
    </div>
  );









  const renderPortfolioContent = (windowId) => {
    const content = {
      portfolio: { 
        title: 'Portfolio', 
        text: 'Welcome to the portfolio! Navigate through different sections using the desktop icons or Start menu.',
        sections: ['About Me', 'Skills', 'Projects', 'Contact', 'Experience']
      },
      about: { 
        title: 'About Me', 
        text: 'This is the About Me section. Here you can learn more about me and my background.',
        details: bio ? {
          name: bio.name || 'John Doe',
          title: bio.heroSubtitle || 'Full Stack Developer',
          location: bio.location || 'San Francisco, CA',
          email: bio.socialLinks?.email || 'john@example.com',
          bio: bio.aboutMe || 'A passionate developer...',
          avatarUrl: bio.avatarUrl || '/uploads/profile.jpg'
        } : {
          name: 'John Doe',
          title: 'Full Stack Developer',
          location: 'San Francisco, CA',
          email: 'john@example.com',
          bio: 'A passionate developer with 5+ years of experience in building web applications and solving complex problems.',
          avatarUrl: '/uploads/profile.jpg'
        }
      },
      skills: { 
        title: 'Skills', 
        text: 'This is the Skills section. Here you can view technical skills and proficiencies.',
        categories: skills && skills.length > 0 ? (
          Object.entries(skills.reduce((acc, skill) => {
            const cat = skill.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill.name);
            return acc;
          }, {})).map(([name, skillList]) => ({ name, skills: skillList }))
        ) : [
          { name: 'Frontend', skills: ['React', 'Vue.js', 'TypeScript', 'CSS/SASS', 'Tailwind CSS'] },
          { name: 'Backend', skills: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB'] },
          { name: 'DevOps', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git'] },
          { name: 'Tools', skills: ['VS Code', 'Figma', 'Postman', 'Jira', 'Slack'] }
        ]
      },
      projects: { 
        title: 'Projects', 
        text: 'This is the Projects section. Here you can view featured projects and their details.',
        items: projects && projects.length > 0 ? (
          projects.map(proj => ({
            name: proj.title,
            description: proj.description,
            tech: proj.technologies || [],
            status: proj.status || 'Completed'
          }))
        ) : [
          { name: 'E-Commerce Platform', description: 'Full-stack e-commerce solution with payment integration', tech: ['React', 'Node.js', 'Stripe'], status: 'Completed' },
          { name: 'Task Management App', description: 'Collaborative task management with real-time updates', tech: ['Vue.js', 'Firebase', 'WebSocket'], status: 'In Progress' },
          { name: 'Weather Dashboard', description: 'Beautiful weather app with forecasts and alerts', tech: ['React', 'Weather API', 'Chart.js'], status: 'Completed' }
        ]
      },
      contact: { 
        title: 'Contact', 
        text: 'This is the Contact section. Here you can send a message through the contact form.',
        form: true
      }
    };
    
    const item = content[windowId] || { title: 'Portfolio', text: 'Welcome!' };
    
    if (windowId === 'about' && item.details) {
      return (
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{item.title}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px', alignItems: 'start' }}>
            {/* Profile Photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <img 
                src={item.details.avatarUrl} 
                alt="Profile Headshot"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                style={{ 
                  width: '140px', 
                  height: '140px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '3px solid rgba(0, 120, 212, 0.4)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  filter: `brightness(${10000 / (30 + settings.brightness * 2.2)}%)`
                }} 
              />
            </div>
            {/* Profile Details */}
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>Name</div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>{item.details.name}</div>
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>Title</div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>{item.details.title}</div>
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>Location</div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>{item.details.location}</div>
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>Email</div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>{item.details.email}</div>
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>Bio</div>
                <div style={{ fontSize: '13px', color: 'white', lineHeight: '1.6' }}>{item.details.bio}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (windowId === 'skills' && item.categories) {
      return (
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{item.title}</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {item.categories.map((category, index) => (
              <div key={index} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>{category.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {category.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} style={{ 
                      padding: '4px 12px', 
                      backgroundColor: 'rgba(0, 120, 212, 0.2)', 
                      border: '0.2px solid rgba(0, 120, 212, 0.5)', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      color: '#60cdff' 
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (windowId === 'projects' && item.items) {
      return (
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{item.title}</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {item.items.map((project, index) => (
              <div key={index} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{project.name}</div>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: project.status === 'Completed' ? 'rgba(81, 207, 102, 0.2)' : 'rgba(255, 193, 7, 0.2)', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    color: project.status === 'Completed' ? '#51cf66' : '#ffc107' 
                  }}>
                    {project.status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>{project.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} style={{ 
                      padding: '4px 8px', 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      color: 'rgba(255,255,255,0.8)' 
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (windowId === 'contact' && item.form) {
      return (
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>{item.title}</h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>{item.text}</p>
          <OSContactForm />
        </div>
      );
    }
    
    return (
      <div style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>{item.title}</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>{item.text}</p>
        {item.sections && (
          <div style={{ display: 'grid', gap: '8px' }}>
            {item.sections.map((section, index) => {
              const sectionId = section.toLowerCase().replace(' ', '');
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (sectionId === 'about' || sectionId === 'aboutme') openWindow('about');
                    else if (sectionId === 'skills') openWindow('skills');
                    else if (sectionId === 'projects') openWindow('projects');
                    else if (sectionId === 'contact') openWindow('contact');
                    else if (sectionId === 'experience') openWindow('about');
                  }}
                  style={{
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <span>📄</span>
                  <span style={{ fontSize: '14px', color: 'white' }}>{section}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sortedStartMenuApps = [...startMenuApps].sort((a, b) => a.name.localeCompare(b.name));
  const groupedStartMenuApps = sortedStartMenuApps.reduce((acc, app) => {
    const letter = app.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(app);
    return acc;
  }, {});

  return (
    <>
      {/* Small Screen Icon */}
      {!isFullscreen && (
        <div 
          className="os-screen-icon"
          onClick={() => setIsFullscreen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #0078d4 0%, #00bcf2 100%)',
            border: '0.2px solid rgba(255,255,255,0.2)',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 9999,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🖥️
        </div>
      )}

      {/* Full Windows 11 Desktop */}
      {isFullscreen && (
        <div 
          ref={desktopRef}
          className="windows-desktop"
          onContextMenu={handleContextMenu}
          onClick={handleDesktopClick}
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), ${desktopWallpaper}`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
            zIndex: 9999
          }}
        >
          {isShuttingDown && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'black',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid white', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
              <div style={{ fontSize: '18px' }}>Shutting down...</div>
            </div>
          )}

          {isRestarting && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: '#0078d4',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid white', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
              <div style={{ fontSize: '18px' }}>Restarting...</div>
            </div>
          )}
      {/* Desktop Icons */}
      <div 
        className="desktop-icons" 
        style={{ 
          padding: '16px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, 96px)', 
          gap: '16px', 
          alignContent: 'start',
          opacity: isRefreshing ? 0.3 : 1,
          transition: 'opacity 0.2s ease'
        }}
      >
        {desktopIcons.map(icon => (
          <div
            key={icon.id}
            onClick={icon.action}
            onDoubleClick={icon.action}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '12px 8px',
              borderRadius: '8px',
              transition: 'background 0.2s',
              width: '96px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{icon.icon}</div>
            <div style={{ fontSize: '12px', textAlign: 'center', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)', wordWrap: 'break-word' }}>
              {icon.name}
            </div>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map(window => (
        !window.minimized && (
          <Window
            key={window.id}
            window={window}
            isActive={activeWindow === window.id}
            onFocus={() => focusWindow(window.id)}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onDrag={(deltaX, deltaY) => handleWindowDrag(window.id, deltaX, deltaY)}
            zIndex={activeWindow === window.id ? zIndex : zIndex - 1}
          >
            {renderWindowContent(window.id)}
          </Window>
        )
      ))}

      {/* Start Menu */}
      {startMenuOpen && (
        <div 
          className="start-menu"
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '500px',
            backgroundColor: 'rgba(32, 32, 32, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '0.2px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 10000,
            animation: 'startMenuOpen 0.2s ease',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Bar */}
          <div style={{ padding: '16px' }}>
            <input
              type="text"
              placeholder="Type here to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '0.2px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {searchQuery.trim() !== '' ? (
            /* Search Results View */
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', paddingLeft: '8px' }}>
                Search results for "{searchQuery}"
              </div>
              {startMenuApps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {startMenuApps
                    .filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(app => (
                      <div
                        key={app.id}
                        onClick={app.action}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>{app.icon}</div>
                        <div style={{ fontSize: '13px', color: 'white' }}>{app.name}</div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.5)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontSize: '14px' }}>No results found for "{searchQuery}"</div>
                </div>
              )}
            </div>
          ) : showAllApps ? (
            /* All Apps Alphabetical View */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px 8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>All apps</span>
                <button
                  onClick={() => setShowAllApps(false)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: 'white',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  ← Back
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 16px' }}>
                {Object.entries(groupedStartMenuApps).map(([letter, apps]) => (
                  <div key={letter} style={{ marginBottom: '16px' }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#0078d4',
                      padding: '2px 8px',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      marginBottom: '8px'
                    }}>
                      {letter}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
                      {apps.map(app => (
                        <div
                          key={app.id}
                          onClick={app.action}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>{app.icon}</div>
                          <div style={{ fontSize: '13px', color: 'white' }}>{app.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Standard Pinned & Recommended View */
            <>
              {/* Pinned Apps */}
              <div style={{ padding: '0 16px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Pinned</span>
                  <button
                    onClick={() => setShowAllApps(true)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: 'white',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    All apps →
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                  {pinnedApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => { openWindow(app.id); setStartMenuOpen(false); }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '36px', marginBottom: '8px' }}>{app.icon}</div>
                      <div style={{ fontSize: '12px', textAlign: 'center', color: 'white' }}>{app.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended */}
              <div style={{ padding: '0 16px 16px', flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>Recommended</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {recentlyOpened.map(appId => (
                    <div
                      key={appId}
                      onClick={() => {
                        openWindow(appId);
                        setStartMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>{getWindowIcon(appId)}</div>
                      <div>
                        <div style={{ fontSize: '13px', color: 'white' }}>{getWindowTitle(appId)}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Recently opened</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* User & Power Footer */}
          <div style={{ position: 'relative', padding: '16px', borderTop: '0.2px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div 
              onClick={() => { openWindow('about'); setStartMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--navy-light)' }}>
                <img 
                  src={bio?.avatarUrl || '/uploads/profile.jpg'} 
                  alt="User Avatar"
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    filter: `brightness(${10000 / (30 + settings.brightness * 2.2)}%)`
                  }}
                />
                <span style={{ display: 'none', fontSize: '16px' }}>👤</span>
              </div>
              <span style={{ fontSize: '13px', color: 'white' }}>User</span>
            </div>
            
            {/* Power Button */}
            <button
              onClick={() => { setPowerMenuOpen(!powerMenuOpen); }}
              style={{ padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', color: 'white' }}
            >
              ⏻
            </button>

            {/* Power Dropdown Menu */}
            {powerMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '60px',
                  right: '16px',
                  width: '120px',
                  backgroundColor: 'rgba(45, 45, 45, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '0.2px solid rgba(255,255,255,0.15)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  zIndex: 10001,
                  padding: '4px'
                }}
              >
                {[
                  { label: 'Restart', action: handleRestart },
                  { label: 'Shut Down', action: handleShutdown },
                  { label: 'Sign Out', action: handleSignOut }
                ].map(opt => (
                  <div
                    key={opt.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      opt.action();
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div 
        className="taskbar" 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '48px',
          backgroundColor: 'rgba(32, 32, 32, 0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '0.2px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '0 16px',
          zIndex: 10000
        }}
      >
        {/* Exit OS Button */}
        <button
          onClick={() => setIsFullscreen(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 71, 87, 0.2)',
            border: '0.2px solid rgba(255, 71, 87, 0.5)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'white',
            transition: 'all 0.2s',
            marginRight: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 71, 87, 0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 71, 87, 0.2)'}
        >
          Exit OS
        </button>

        {/* Start Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!startMenuOpen) {
              setSearchQuery('');
              setShowAllApps(false);
              setPowerMenuOpen(false);
            }
            setStartMenuOpen(!startMenuOpen);
            setNotificationPanelOpen(false);
            setCalendarPanelOpen(false);
            setQuickSettingsOpen(false);
          }}
          style={{
            padding: '8px 12px',
            backgroundColor: startMenuOpen ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'white',
            transition: 'all 0.2s',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = startMenuOpen ? 'rgba(255,255,255,0.2)' : 'transparent'}
        >
          <span style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '2px', 
            width: '16px', 
            height: '16px' 
          }}>
            <div style={{ backgroundColor: '#f25022', borderRadius: '1px' }} />
            <div style={{ backgroundColor: '#7fba00', borderRadius: '1px' }} />
            <div style={{ backgroundColor: '#00a4ef', borderRadius: '1px' }} />
            <div style={{ backgroundColor: '#ffb900', borderRadius: '1px' }} />
          </span>
        </button>

        {/* Pinned Apps */}
        {pinnedApps.map(app => (
          <button
            key={app.id}
            onClick={() => app.id === 'settings' ? openWindow('settings') : openWindow(app.id)}
            style={{
              padding: '8px 12px',
              backgroundColor: activeWindow === app.id ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'white',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = activeWindow === app.id ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            {app.icon}
            {activeWindow === app.id && (
              <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '3px', backgroundColor: '#60cdff', borderRadius: '2px' }} />
            )}
          </button>
        ))}

        {/* Open Windows */}
        {windows.filter(w => !pinnedApps.find(p => p.id === w.id)).map(window => (
          <button
            key={window.id}
            onClick={() => window.minimized ? openWindow(window.id) : focusWindow(window.id)}
            style={{
              padding: '8px 12px',
              backgroundColor: activeWindow === window.id && !window.minimized ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '20px',
              color: 'white',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = activeWindow === window.id && !window.minimized ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            {window.icon}
            {activeWindow === window.id && !window.minimized && (
              <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '3px', backgroundColor: '#60cdff', borderRadius: '2px' }} />
            )}
          </button>
        ))}

        {/* System Tray */}
        <div style={{ 
          position: 'absolute', 
          right: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '14px' }}>🔊</span>
          <span style={{ fontSize: '14px' }}>📶</span>
          <span style={{ fontSize: '14px' }}>🔋</span>
          <div style={{ 
            textAlign: 'right', 
            fontSize: '12px', 
            color: 'white',
            minWidth: '80px',
            lineHeight: '1.3'
          }}>
            <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Desktop Context Menu */}
      {contextMenu.visible && (
        <div 
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            width: '180px',
            backgroundColor: 'rgba(32, 32, 32, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '0.2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            zIndex: 100000,
            padding: '4px 0',
            fontSize: '13px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-item" onClick={handleRefresh}>
            <span>🔄 Refresh</span>
          </div>
          <div className="context-menu-item" onClick={handleNextWallpaper}>
            <span>🖼️ Next Wallpaper</span>
          </div>
          <div style={{ height: '0.2px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
          <div className="context-menu-item" onClick={() => { openWindow('terminal'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>
            <span>💻 Open Terminal</span>
          </div>
          <div className="context-menu-item" onClick={() => { openWindow('notepad'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>
            <span>📝 Open Notepad</span>
          </div>
          <div className="context-menu-item" onClick={() => { openWindow('snake'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>
            <span>🎮 Open Snake Game</span>
          </div>
          <div style={{ height: '0.2px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
          <div className="context-menu-item" onClick={handleToggleTheme}>
            <span>🌓 Toggle Theme Mode</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes startMenuOpen {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .context-menu-item {
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.15s;
        }
        .context-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
        </div>
      )}
    </>
  );
};

const Window = ({ window, isActive, onFocus, onClose, onMinimize, onMaximize, onDrag, zIndex, children }) => {
  const { settings } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // Hover states for Windows 11 style titlebar controls
  const [minHover, setMinHover] = useState(false);
  const [maxHover, setMaxHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls') || e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
    onFocus();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x - window.position.x;
    const deltaY = e.clientY - dragStart.y - window.position.y;
    onDrag(deltaX, deltaY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Windows 11 Fluent theme styling
  const isDark = settings.darkMode;
  const textColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
  
  return (
    <div
      ref={windowRef}
      className="window"
      onContextMenu={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: window.maximized ? '0' : `${window.position.x}px`,
        top: window.maximized ? '0' : `${window.position.y}px`,
        width: window.maximized ? '100%' : `${window.size.width}px`,
        height: window.maximized ? 'calc(100% - 48px)' : `${window.size.height}px`,
        backgroundColor: isDark
          ? (isActive ? 'rgba(32, 32, 32, 0.75)' : 'rgba(28, 28, 28, 0.85)')
          : (isActive ? 'rgba(243, 243, 243, 0.75)' : 'rgba(248, 248, 248, 0.85)'),
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: window.maximized ? '0' : '12px',
        boxShadow: isActive
          ? (isDark
            ? '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset'
            : '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.4) inset')
          : (isDark
            ? '0 8px 16px rgba(0,0,0,0.3)'
            : '0 8px 16px rgba(0,0,0,0.06)'),
        zIndex: zIndex,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'windowOpen 0.2s ease',
        maxHeight: 'calc(100% - 48px)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, border-radius 0.2s ease'
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="window-titlebar"
        onMouseDown={handleMouseDown}
        style={{
          height: '36px',
          backgroundColor: isDark ? 'rgba(32, 32, 32, 0.45)' : 'rgba(243, 243, 243, 0.45)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 0 12px',
          cursor: 'move',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>{window.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '500', color: textColor }}>{window.title}</span>
        </div>
        <div className="window-controls" style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={onMinimize}
            onMouseEnter={() => setMinHover(true)}
            onMouseLeave={() => setMinHover(false)}
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: minHover ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') : 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s'
            }}
          >
            −
          </button>
          <button
            onClick={onMaximize}
            onMouseEnter={() => setMaxHover(true)}
            onMouseLeave={() => setMaxHover(false)}
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: maxHover ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') : 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s'
            }}
          >
            □
          </button>
          <button
            onClick={onClose}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            style={{
              width: '32px',
              height: '28px',
              backgroundColor: closeHover ? '#e81123' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              color: closeHover ? '#ffffff' : textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.1s, color 0.1s'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="window-content" style={{ flex: 1, overflow: 'auto', color: isDark ? 'white' : '#000000' }}>
        {children}
      </div>
    </div>
  );
};

export default OSDashboard;
