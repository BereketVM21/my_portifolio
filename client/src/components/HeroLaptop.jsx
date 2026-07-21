import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Script of code to type in Mode 0 (Live Typing)
const CODE_LINES = [
  "import React, { useState } from 'react';",
  "import { Canvas } from '@react-three/fiber';",
  "",
  "const Portfolio = () => {",
  "  const [loading, setLoading] = useState(true);",
  "  const [activeTab, setActiveTab] = useState('home');",
  "",
  "  return (",
  "    <div className='portfolio-container'>",
  "      <HeroSection active={activeTab === 'home'}>",
  "        <h1>Welcome to Bereket's Space</h1>",
  "        <p>Full Stack & 3D Developer</p>",
  "      </HeroSection>",
  "      <ProjectGrid projects={projects} />",
  "      <ContactForm onSubmit={handleContact} />",
  "    </div>",
  "  );",
  "};",
  "",
  "export default Portfolio;"
];

// Helper to draw syntax-highlighted code on canvas
const drawCodeLine = (ctx, line, x, y) => {
  ctx.font = '15px Consolas, Monaco, monospace';
  const tokens = line.split(/(\s+|[(){}[\]<>=:;.,'"])/);
  let currentX = x;
  
  tokens.forEach(token => {
    if (!token) return;
    
    if (/^(import|from|const|let|var|function|return|export|default|class|if|else)$/.test(token)) {
      ctx.fillStyle = '#c586c0'; // Pink keyword
    } else if (/^(useState|useEffect|Canvas|OrbitControls|Environment|Portfolio|HeroSection|ProjectGrid|ContactForm)$/.test(token)) {
      ctx.fillStyle = '#4fc1ff'; // Light blue function/component
    } else if (/^['"].*['"]$/.test(token) || (token.startsWith("'") || token.startsWith('"'))) {
      ctx.fillStyle = '#ce9178'; // Orange string
    } else if (/^[0-9]+$/.test(token)) {
      ctx.fillStyle = '#b5cea8'; // Green number
    } else if (/^[A-Z][a-zA-Z0-9]*$/.test(token)) {
      ctx.fillStyle = '#dcdcaa'; // Yellow Class/Component
    } else if (/^[(){}[\]<>=:;.,]$/.test(token)) {
      ctx.fillStyle = '#ffd700'; // Yellow brackets/punctuation
    } else {
      ctx.fillStyle = '#d4d4d4'; // Standard white-grey
    }
    
    ctx.fillText(token, currentX, y);
    currentX += ctx.measureText(token).width;
  });
};

function LaptopModel(props) {
  const group = useRef();
  const screenMatRef = useRef();
  
  // Load the 3D model
  const { scene } = useGLTF('/models/laptop.glb');
  const model = useMemo(() => scene.clone(), [scene]);

  // Load the user portrait photo (copied from the uploaded file)
  const userPhotoImg = useMemo(() => {
    const img = new Image();
    img.src = '/user_photo.jpg';
    return img;
  }, []);

  // Create the dynamic 2D canvas texture
  const { canvas, ctx, screenTexture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    
    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.flipY = false;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    
    return { canvas, ctx, screenTexture };
  }, []);

  // Create the carbon fiber bump map texture procedurally
  const carbonBumpMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 16, 16);
    
    ctx.fillStyle = '#9c9c9c';
    ctx.fillRect(0, 0, 8, 8);
    ctx.fillRect(8, 8, 8, 8);
    ctx.fillStyle = '#646464';
    ctx.fillRect(8, 0, 8, 8);
    ctx.fillRect(0, 8, 8, 8);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(60, 60);
    return texture;
  }, []);

  // Apply materials in useMemo
  const { centeredModel, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    model.position.set(-center.x, -center.y, -center.z);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.4;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material) {
          const matName = child.material.name;
          
          if (matName === '02___Default') {
            // Screen Display — MeshBasicMaterial is unaffected by lights/reflections
            const screenMat = new THREE.MeshBasicMaterial({
              map: screenTexture,
              toneMapped: false,
            });
            child.material = screenMat;
            screenMatRef.current = screenMat;
          } else if (matName === '_crayfishdiffuse') {
            // Laptop deck & casing
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#121212'),
              roughness: 0.8,
              metalness: 0.25,
              bumpMap: carbonBumpMap,
              bumpScale: 0.002,
            });
          } else if (matName === '03___Default') {
            // Keyboard keys
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#1c1c1c'),
              roughness: 0.6,
              metalness: 0.15,
              emissive: new THREE.Color('#ffffff'),
              emissiveIntensity: 0.2, // Keyboard backlight glow
            });
          }
        }
      }
    });

    return { centeredModel: model, scale: targetSize / maxDim };
  }, [model, screenTexture, carbonBumpMap]);

  // Handle animation and canvas redrawing in the useFrame loop
  useFrame((state) => {
    if (!group.current) return;
    
    const t = state.clock.getElapsedTime();
    
    // 1. Slow Auto-Rotation
    group.current.rotation.y = t * 0.15;
    group.current.position.y = Math.sin(t * 0.8) * 0.08; // float

    // 2. Keep texture marked for update every frame
    if (screenMatRef.current) {
      // MeshBasicMaterial — no emissive needed, texture is always full brightness
    }

    // 3. Detect Rotation Cycle (period is now ~41.89s with 0.15 speed)
    const rotationPeriod = (Math.PI * 2) / 0.15; 
    const halfPeriod = rotationPeriod / 2;
    const adjustedTime = t + halfPeriod;
    const currentMode = Math.floor(adjustedTime / rotationPeriod) % 3;
    const cycleTime = adjustedTime % rotationPeriod;

    // 4. Redraw Canvas Screen Content
    ctx.clearRect(0, 0, 1024, 768);

    if (currentMode === 0) {
      // --- MODE 0: VS CODE CODE TYPING ---
      // Editor Background
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, 1024, 768);

      // VS Code Activity Bar (far left, width 48px)
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, 0, 48, 768);
      // Tiny Activity Bar Icons
      ctx.fillStyle = '#858585';
      ctx.fillRect(16, 20, 16, 16);
      ctx.fillRect(16, 56, 16, 16);
      ctx.fillRect(16, 92, 16, 16);
      ctx.fillRect(16, 128, 16, 16);
      ctx.fillRect(16, 720, 16, 16);

      // VS Code Sidebar (X: 48 to 190)
      ctx.fillStyle = '#252526';
      ctx.fillRect(48, 0, 142, 768);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#bbbbbb';
      ctx.fillText('EXPLORER: PORTFOLIO', 60, 20);
      
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#858585';
      ctx.fillText('▼ src', 60, 45);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('  js App.jsx', 60, 70);
      ctx.fillStyle = '#858585';
      ctx.fillText('  js CookieBanner.jsx', 60, 95);
      ctx.fillText('  img user_photo.jpg', 60, 120);

      // Tab Bar (Y: 0 to 35)
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(190, 0, 834, 35);
      // Active Tab
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(190, 0, 120, 35);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('App.jsx', 210, 22);
      ctx.fillStyle = '#ff5f56';
      ctx.fillText('×', 290, 22);
      // Inactive Tab
      ctx.fillStyle = '#2d2d2d';
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#858585';
      ctx.fillText('CookieBanner.jsx', 330, 22);

      // Line numbers bar
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(190, 35, 45, 688);
      
      // Compute character count to type
      const totalChars = CODE_LINES.reduce((sum, line) => sum + line.length, 0);
      const typingProgress = Math.min(1, cycleTime / 30); // finish typing in 30s (extended for slower rotation)
      const charsToShow = Math.floor(typingProgress * totalChars);

      let charsLeft = charsToShow;
      let cursorX = 250;
      let cursorY = 60;
      let hasCursor = false;

      for (let i = 0; i < CODE_LINES.length; i++) {
        const line = CODE_LINES[i];
        const lineY = 60 + i * 22;
        
        // Draw line number
        ctx.font = '13px Consolas, monospace';
        ctx.fillStyle = '#858585';
        ctx.fillText(String(i + 1), 205, lineY);

        if (charsLeft >= line.length) {
          drawCodeLine(ctx, line, 250, lineY);
          charsLeft -= line.length;
        } else if (charsLeft > 0) {
          const partialLine = line.substring(0, charsLeft);
          drawCodeLine(ctx, partialLine, 250, lineY);
          
          ctx.font = '15px Consolas, monospace';
          cursorX = 250 + ctx.measureText(partialLine).width;
          cursorY = lineY - 13;
          charsLeft = 0;
          hasCursor = true;
        } else {
          // If this is the active typing head and no chars left, draw cursor at start
          if (!hasCursor && charsToShow > 0) {
            cursorX = 250;
            cursorY = lineY - 13;
            hasCursor = true;
          }
          break;
        }
      }

      // Draw cursor if typing is active
      if (hasCursor && Math.floor(t * 3.5) % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cursorX, cursorY, 2, 16);
      }

      // VS Code Status Bar (Y: 723 to 745)
      ctx.fillStyle = '#007acc';
      ctx.fillRect(190, 723, 834, 22);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('LF  UTF-8  JavaScript  Ln 12, Col 4', 800, 738);
      ctx.fillText('master*', 210, 738);

    } else if (currentMode === 1) {
      // --- MODE 1: SCROLLING PORTFOLIO WEBSITE ---
      // Web Background (Slate 900)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1024, 768);

      // Scroll physics: scroll from Y=0 to Y=800 over 16s, scroll back up in 5s
      let scrollY = 0;
      if (cycleTime < 2) {
        scrollY = 0;
      } else if (cycleTime < 18) {
        scrollY = ((cycleTime - 2) / 16) * 800;
      } else {
        scrollY = Math.max(0, 800 - ((cycleTime - 18) / 5) * 800);
      }

      // 1. HERO SECTION (Y = 0 to 500)
      const heroY = 0 - scrollY;
      if (heroY > -768 && heroY < 768) {
        // Gradient title
        const grad = ctx.createLinearGradient(120, heroY + 200, 700, heroY + 200);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(1, '#a855f7');
        ctx.fillStyle = grad;
        ctx.font = 'bold 54px Arial, sans-serif';
        ctx.fillText("Hi, I'm Bereket VM", 120, heroY + 200);

        // Subtitle
        ctx.fillStyle = '#94a3b8';
        ctx.font = '28px Arial, sans-serif';
        ctx.fillText('Creative Full Stack Developer & 3D Artist', 120, heroY + 250);

        // Intro
        ctx.fillStyle = '#64748b';
        ctx.font = '18px Arial, sans-serif';
        ctx.fillText('Crafting beautiful, interactive digital web experiences.', 120, heroY + 295);

        // Buttons
        // Button 1: Filled Gradient
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(120, heroY + 340, 160, 48, 8);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px Arial, sans-serif';
        ctx.fillText('View Work', 160, heroY + 370);

        // Button 2: Outline
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(300, heroY + 340, 160, 48, 8);
        ctx.stroke();
        ctx.fillStyle = '#a855f7';
        ctx.fillText('Contact Me', 340, heroY + 370);
      }

      // 2. ABOUT ME SECTION (Y = 500 to 1000)
      const aboutY = 500 - scrollY;
      if (aboutY > -768 && aboutY < 768) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillText('ABOUT ME', 120, aboutY + 80);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '18px Arial, sans-serif';
        ctx.fillText('I build modern web experiences using React, Three.js, Node.js, and MongoDB.', 120, aboutY + 130);
        ctx.fillText('Merging graphic artistry with robust software architecture to build the next gen of web apps.', 120, aboutY + 165);

        // Cards (representing stats)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(120, aboutY + 210, 200, 120, 12);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText('5+', 150, aboutY + 265);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText('Years Experience', 150, aboutY + 295);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(350, aboutY + 210, 200, 120, 12);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText('50+', 380, aboutY + 265);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText('Projects Completed', 380, aboutY + 295);
      }

      // 3. PROJECTS SECTION (Y = 1000 to 1500)
      const projY = 1000 - scrollY;
      if (projY > -768 && projY < 768) {
        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillText('FEATURED PROJECTS', 120, projY + 80);

        // Cards
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(120, projY + 130, 360, 220, 16);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('E-Commerce Dashboard OS', 150, projY + 180);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText('Full OS simulation with Windows windows, charts, and API integration.', 150, projY + 220);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(510, projY + 130, 360, 220, 16);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('3D Interactive Models', 540, projY + 180);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Arial, sans-serif';
        ctx.fillText('Interactive WebGL configurator utilizing Three.js and custom shaders.', 540, projY + 220);
      }

      // Sticky Header
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, 0, 1024, 70);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(1024, 70);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText('Bereket.dev', 120, 42);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px Arial, sans-serif';
      ctx.fillText('Work', 700, 42);
      ctx.fillText('About', 770, 42);
      ctx.fillText('Skills', 840, 42);
      ctx.fillText('Contact', 910, 42);

      // Scrollbar representation
      ctx.fillStyle = '#334155';
      ctx.fillRect(1012, 70, 12, 698);
      ctx.fillStyle = '#64748b';
      const scrollThumbHeight = 150;
      const scrollThumbY = 70 + (scrollY / 800) * (698 - scrollThumbHeight);
      ctx.fillRect(1012, scrollThumbY, 12, scrollThumbHeight);

      // Floating cursor simulation
      const cursorX = 512 + Math.sin(t * 1.5) * 200;
      const cursorY = 384 + Math.cos(t * 1.5) * 100;
      
      // Draw cursor arrow
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cursorX, cursorY);
      ctx.lineTo(cursorX + 12, cursorY + 12);
      ctx.lineTo(cursorX + 5, cursorY + 13);
      ctx.lineTo(cursorX, cursorY + 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

    } else if (currentMode === 2) {
      // --- MODE 2: USER PHOTO & HUD INTERFACE ---
      // Background (Very dark warm tone)
      ctx.fillStyle = '#0f0e15';
      ctx.fillRect(0, 0, 1024, 768);

      // Draw photo centered
      const imgX = 232;
      const imgY = 74;
      const imgW = 560;
      const imgH = 560;

      if (userPhotoImg.complete && userPhotoImg.naturalWidth > 0) {
        ctx.drawImage(userPhotoImg, imgX, imgY, imgW, imgH);
      } else {
        // Placeholder loading box if image not loaded yet
        ctx.fillStyle = '#1c1924';
        ctx.fillRect(imgX, imgY, imgW, imgH);
        
        ctx.font = '20px Arial, sans-serif';
        ctx.fillStyle = '#858585';
        ctx.textAlign = 'center';
        ctx.fillText('LOADING PHOTO...', 512, 384);
        ctx.textAlign = 'left'; // reset
      }

      // Neon orange border around photo (matches the warm rim light)
      ctx.save();
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 4;
      ctx.strokeRect(imgX, imgY, imgW, imgH);
      ctx.restore();

      // Scanline effect running down the portrait image
      const scanY = imgY + ((cycleTime * 140) % imgH);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(imgX, scanY);
      ctx.lineTo(imgX + imgW, scanY);
      ctx.stroke();

      // Cyberpunk HUD Corner brackets
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      // Top Left Corner
      ctx.beginPath();
      ctx.moveTo(30, 60); ctx.lineTo(30, 30); ctx.lineTo(60, 30);
      ctx.stroke();
      // Top Right Corner
      ctx.beginPath();
      ctx.moveTo(994, 60); ctx.lineTo(994, 30); ctx.lineTo(964, 30);
      ctx.stroke();
      // Bottom Left Corner
      ctx.beginPath();
      ctx.moveTo(30, 708); ctx.lineTo(30, 738); ctx.lineTo(60, 738);
      ctx.stroke();
      // Bottom Right Corner
      ctx.beginPath();
      ctx.moveTo(994, 708); ctx.lineTo(994, 738); ctx.lineTo(964, 738);
      ctx.stroke();

      // Left HUD details
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#10b981'; // green status
      ctx.fillText('● SYS.STATUS: ONLINE', 45, 100);
      ctx.fillStyle = '#8f8da0';
      ctx.fillText('CPU.TEMP: 42.4°C', 45, 130);
      ctx.fillText('MEM.USAGE: 64.1%', 45, 160);
      ctx.fillText('BANDWIDTH: 104MB/s', 45, 190);
      ctx.fillText('LOC.GRID: SEC.02B', 45, 220);

      // Right HUD details
      ctx.fillStyle = '#f97316'; // orange status
      ctx.fillText('MODE: PORTRAIT PROFILE', 810, 100);
      ctx.fillStyle = '#8f8da0';
      ctx.fillText('SYS.VERSION: OS.v2.0', 810, 130);
      ctx.fillText('DATE: 2026-07-21', 810, 160);
      ctx.fillText('SYS.CORE: CONNECTED', 810, 190);
      ctx.fillText('GRID: 192.168.1.48', 810, 220);

      // Bottom Portrait styled label
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText('BEREKET VM', 512, 680);
      
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 15px Arial, sans-serif';
      const sub = 'FULL STACK DEVELOPER & 3D ARTIST';
      ctx.fillText(sub.split('').join(' '), 512, 715);
      ctx.textAlign = 'left'; // reset
    }

    // Taskbar at the very bottom (universal across all modes, matches Windows 11 style)
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 745, 1024, 23);
    ctx.fillStyle = '#252526';
    ctx.fillRect(0, 745, 1024, 1); // line separator
    
    // Draw centered icons
    const taskbarCenter = 512;
    const icons = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];
    icons.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(taskbarCenter - 75 + idx * 30, 756, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Mark texture for GPU update
    screenTexture.needsUpdate = true;
  });

  return (
    <group ref={group} {...props}>
      <group scale={scale}>
        <primitive object={centeredModel} />
      </group>
    </group>
  );
}

function Loader() {
  return null; // keep fallback invisible
}

export default function HeroLaptop({ className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 320,
        pointerEvents: 'auto',
        ...style
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 4], fov: 35 }}
        frameloop="always"
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.4} />

        <Suspense fallback={<Loader />}>
          <LaptopModel />
        </Suspense>

        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.35}
          scale={6}
          blur={2.5}
          far={2}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/laptop.glb');


