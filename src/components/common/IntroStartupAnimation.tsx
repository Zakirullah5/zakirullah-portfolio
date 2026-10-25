import React, { useState, useEffect } from 'react';
import { ZKLogo } from './ZKLogo.tsx';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IntroStartupAnimationProps {
  onComplete: () => void;
}

export const IntroStartupAnimation: React.FC<IntroStartupAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'assembling' | 'scanning' | 'ready' | 'exit'>('assembling');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if user previously experienced intro this session
    const hasSeen = sessionStorage.getItem('zk_intro_seen');
    if (hasSeen === 'true') {
      onComplete();
      return;
    }

    // Step 1: Progress counter & assembly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 28);

    // Step 2: Scanning & light sweep
    const scanTimeout = setTimeout(() => {
      setPhase('scanning');
    }, 1100);

    // Step 3: Ready state
    const readyTimeout = setTimeout(() => {
      setPhase('ready');
    }, 1900);

    // Step 4: Exit & transition into site
    const exitTimeout = setTimeout(() => {
      setPhase('exit');
      setTimeout(() => {
        sessionStorage.setItem('zk_intro_seen', 'true');
        onComplete();
      }, 700);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(scanTimeout);
      clearTimeout(readyTimeout);
      clearTimeout(exitTimeout);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('zk_intro_seen', 'true');
    setPhase('exit');
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04060e] text-white transition-all duration-700 ${
        phase === 'exit' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,rgba(147,51,234,0.12)_40%,transparent_75%)] pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-40" />

      {/* Top Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Center 3D Logo Cinematic Assembly */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Holographic Glowing Ring */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-purple-600/30 to-blue-500/20 border border-amber-400/50 p-2 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.35)] relative overflow-hidden group">
            {/* Light Sweep Beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-light-sweep" />

            <span className="text-3xl text-amber-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">👑</span>
            <span className="font-display font-black text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              ZK
            </span>
          </div>

          {/* Pulse ring */}
          <div className="absolute -inset-2 rounded-[32px] border border-cyan-400/40 animate-ping opacity-30 pointer-events-none" />
        </div>

        {/* Brand Reveal */}
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400">
          ZAKIRULLAH
        </h1>
        <div className="font-sans text-xs tracking-[0.3em] uppercase text-amber-400 font-semibold mt-1">
          Creative Studio
        </div>
        <p className="font-cursive text-amber-300/90 text-lg mt-2 tracking-wide">
          Turning Imagination Into Extraordinary Digital Experiences
        </p>

        {/* Progress Bar & Status */}
        <div className="w-56 mt-8">
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1.5 uppercase">
            <span>
              {phase === 'assembling' && 'Assembling 3D Core...'}
              {phase === 'scanning' && 'Calibrating Shaders...'}
              {(phase === 'ready' || phase === 'exit') && 'Experience Ready'}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
