import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, useProgress, Center } from '@react-three/drei';

const MODEL_PATH = '/models/loading_animation.glb';
const FADE_MS = 600;
const MIN_VISIBLE_MS = 6000; // total preloader visible duration

// Preload immediately so the request kicks off as soon as this module loads,
// rather than waiting for the component to mount.
useGLTF.preload(MODEL_PATH);

function AnimatedModel() {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_PATH);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    const clipName = names.includes('Take 01') ? 'Take 01' : names[0];
    const action = actions[clipName];
    action?.reset().play(); // three's default loop mode is LoopRepeat / Infinity

    return () => {
      action?.stop();
    };
  }, [actions, names]);

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Enhanced lighting: richer ambient and stronger directed light to make the model pop */}
      <ambientLight intensity={0.8} />
      <pointLight position={[3, 3, 5]} intensity={4} color="#8fe9ff" />
      <Suspense fallback={null}>
        <AnimatedModel />
      </Suspense>
    </>
  );
}

export default function Preloader({ onFinished }) {
  const { progress } = useProgress();
  const [fadingOut, setFadingOut] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const hasFinishedRef = useRef(false);

  // 1. Smoothly increment the percentage to reach 100% after 9 seconds (9000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      let nextProgress = Math.floor((elapsed / 5000) * 100); // reach 100% at 5s

      // Cap at 99% if the actual assets haven't fully loaded yet
      if (progress < 100) {
        nextProgress = Math.min(nextProgress, 99);
      } else {
        nextProgress = Math.min(nextProgress, 100);
      }

      setDisplayProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(interval);
      }
    }, 30); // frequent updates for smooth percentage increment

    return () => clearInterval(interval);
  }, [progress]);

  // 2. Regular loading progress timer (triggers when display progress reaches 100%)
  useEffect(() => {
    if (displayProgress < 100 || hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    const elapsed = Date.now() - startTimeRef.current;
    const delay = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    const timer = setTimeout(() => setFadingOut(true), delay);
    return () => clearTimeout(timer);
  }, [displayProgress]);

  // 3. Safety timeout: force fade out after a maximum of 11 seconds (11000ms)
  // in case progress is stuck, model fails to load, or WebGL errors occur.
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setFadingOut(true);
      }
    }, 7000); // force fade after 7s max

    return () => clearTimeout(safetyTimer);
  }, []);

  // 4. Fallback unmount timer to guarantee the preloader unmounts
  // even if onTransitionEnd is not fired by the browser.
  useEffect(() => {
    if (!fadingOut) return;
    
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      onFinished?.();
    }, FADE_MS + 100); // 600ms transition + 100ms buffer

    return () => clearTimeout(unmountTimer);
  }, [fadingOut, onFinished]);

  const handleTransitionEnd = (e) => {
    if (e.propertyName !== 'opacity' || !fadingOut) return;
    setMounted(false); // fully unmount -> Canvas stops rendering entirely
    onFinished?.();
  };

  if (!mounted) return null;

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05080d',
        opacity: fadingOut ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: fadingOut ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          width: 'min(70vw, 360px)',
          height: 'min(70vw, 360px)',
          filter: 'drop-shadow(0 0 12px rgba(143, 233, 255, 0.6))',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 6.8], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <Scene />
        </Canvas>
      </div>

      <div
        style={{
          marginTop: 20,
          color: '#8fe9ff',
          fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
          fontSize: 28,
          letterSpacing: '0.05em',
          fontWeight: 800,
          textShadow: '0 0 12px rgba(143, 233, 255, 0.6)',
        }}
      >
        <strong>{displayProgress}%</strong>
      </div>
    </div>
  );
}
