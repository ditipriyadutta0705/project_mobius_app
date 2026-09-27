import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, AlertTriangle } from 'lucide-react';

export default function HoloVideoPlayer({ clipUrl, title, nodeId, themeType = 'cyan' }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');

  useEffect(() => {
    setHasError(false);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted
        setIsPlaying(false);
      });
    }
  }, [clipUrl, nodeId]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    setCurrentTime(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(ms).padStart(2, '0')}`);
  };

  const themeColors = {
    cyan: 'border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)] text-[#00f0ff]',
    amber: 'border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.3)] text-[#f59e0b]',
    crimson: 'border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.3)] text-[#ef4444]',
    purple: 'border-[#c084fc] shadow-[0_0_20px_rgba(192,132,252,0.3)] text-[#c084fc]',
  };

  const borderClass = themeColors[themeType] || themeColors.cyan;

  return (
    <div className={`relative w-full aspect-video rounded-lg overflow-hidden border bg-black/80 holo-scanline ${borderClass} group`}>
      {/* Corner Bracket Overlays */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-current pointer-events-none z-30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-current pointer-events-none z-30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-current pointer-events-none z-30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-current pointer-events-none z-30" />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-2.5 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold tracking-wider text-slate-200">LIVE CHRONO FEED</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{nodeId}</span>
        </div>
      </div>

      {/* Main Video or Fallback Telemetry */}
      {clipUrl && !hasError ? (
        <video
          ref={videoRef}
          src={clipUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover filter contrast-125 brightness-95"
        />
      ) : (
        /* Tactical Fallback Telemetry Animation */
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 relative">
          <div className="absolute inset-0 bg-stark-grid opacity-30" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full border border-dashed border-cyan-400/50 animate-spin" />
              <div className="w-10 h-10 rounded-full border border-amber-400/60 animate-ping absolute inset-3" />
              <AlertTriangle className="w-6 h-6 text-amber-400 absolute inset-5" />
            </div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              TELEMETRY SIMULATION REPLAY
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[240px]">
              Direct optical feed unavailable. Rendering algorithmic causality telemetry.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex justify-between items-center text-xs opacity-90 transition-opacity">
        <div className="flex items-center gap-2.5">
          <button
            onClick={togglePlay}
            className="p-1 rounded bg-black/60 hover:bg-white/20 text-slate-200 transition"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-1 rounded bg-black/60 hover:bg-white/20 text-slate-200 transition"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <span className="font-mono text-[11px] text-slate-300">{currentTime}</span>
        </div>
        <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
          STARK HUD OPTICS v4.2
        </div>
      </div>
    </div>
  );
}

