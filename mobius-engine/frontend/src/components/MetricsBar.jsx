import React from 'react';
import { 
  Shield, Zap, History, AlertOctagon, Sparkles, Volume2, VolumeX, 
  Mic, MicOff, FileText, Radio 
} from 'lucide-react';
import starkAudio from '../utils/audioEngine';

export default function MetricsBar({ 
  stats, 
  selectedNode, 
  isAudioMuted, 
  onToggleAudio, 
  voicePersona, 
  onTogglePersona,
  isSpeechEnabled,
  onToggleSpeech,
  onOpenDossier
}) {
  const stones = [
    { name: "Space", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.2)" },
    { name: "Mind", color: "#facc15", bg: "rgba(250, 204, 21, 0.2)" },
    { name: "Reality", color: "#ef4444", bg: "rgba(239, 68, 68, 0.2)" },
    { name: "Power", color: "#c084fc", bg: "rgba(192, 132, 252, 0.2)" },
    { name: "Time", color: "#22c55e", bg: "rgba(34, 197, 94, 0.2)" },
    { name: "Soul", color: "#f97316", bg: "rgba(249, 115, 22, 0.2)" },
  ];

  const nodeStones = selectedNode?.stones_secured || {};

  return (
    <header className="h-16 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur px-4 sm:px-5 flex items-center justify-between z-30 select-none">
      {/* Title & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded border border-cyan-400/40 bg-cyan-950/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.25)]">
          <History className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '18s' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-widest text-cyan-400">PROJECT MOBIUS</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              STARK HUD v2.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">TEMPORAL INCURSION & PROBABILITY ENGINE</p>
        </div>
      </div>

      {/* Global Statistics */}
      <div className="hidden xl:flex items-center gap-6 font-mono text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase">Realities Mapped</span>
          <span className="font-bold text-slate-200 text-sm">{stats?.total_nodes || 0}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase">Victory Chance</span>
          <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 inline" /> {stats?.overall_win_rate || 0}%
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase">Thanos Awareness</span>
          <span className="font-bold text-amber-400 text-sm flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 inline" /> {stats?.average_thanos_awareness || 0}%
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase">TVA Entropy Index</span>
          <span className="font-bold text-purple-400 text-sm flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 inline" /> {stats?.average_entropy || 0}%
          </span>
        </div>
      </div>

      {/* Center/Right: Stones + Sound Controls + Dossier Export */}
      <div className="flex items-center gap-3">
        {/* Active Node Stone Telemetry */}
        <div className="hidden sm:flex items-center gap-1">
          {stones.map((st) => {
            const isSecured = Boolean(nodeStones[st.name]);
            return (
              <div
                key={st.name}
                title={`${st.name} Stone: ${isSecured ? 'SECURED' : 'UNSECURED'}`}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-all duration-300 border flex items-center gap-0.5 ${
                  isSecured
                    ? 'border-transparent shadow-lg text-slate-900 animate-pulse'
                    : 'border-slate-800 text-slate-600 bg-slate-900/50 opacity-40'
                }`}
                style={{
                  backgroundColor: isSecured ? st.color : undefined,
                  boxShadow: isSecured ? `0 0 8px ${st.color}` : undefined,
                }}
              >
                <Sparkles className="w-2.5 h-2.5 inline" />
                <span>{st.name}</span>
              </div>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* Stark J.A.R.V.I.S. Audio Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-700/60 font-mono text-xs">
          {/* Master Mute / SFX Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? "Unmute Stark HUD Audio & Quantum Reactor Hum" : "Mute Stark Audio"}
            className={`p-1.5 rounded transition flex items-center gap-1 ${
              !isAudioMuted 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.3)] animate-pulse' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* AI Voice Persona Toggle (JARVIS / FRIDAY) */}
          <button
            onClick={onTogglePersona}
            disabled={isAudioMuted}
            title={`Active Voice Persona: ${voicePersona}. Click to toggle.`}
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition ${
              isAudioMuted 
                ? 'text-slate-600 bg-slate-950/40 cursor-not-allowed'
                : voicePersona === 'JARVIS'
                  ? 'bg-blue-950 text-blue-300 border border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
            }`}
          >
            {voicePersona}
          </button>

          {/* Voice Speech Toggle */}
          <button
            onClick={onToggleSpeech}
            disabled={isAudioMuted}
            title={isSpeechEnabled ? "Voice Synthesizer: ACTIVE" : "Voice Synthesizer: MUTED"}
            className={`p-1 rounded text-[10px] transition ${
              isAudioMuted
                ? 'text-slate-600 cursor-not-allowed'
                : isSpeechEnabled
                  ? 'text-cyan-400 hover:bg-cyan-950/40'
                  : 'text-slate-600 hover:bg-slate-800'
            }`}
          >
            {isSpeechEnabled ? <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>

        {/* Mission Dossier Export Button */}
        <button
          onClick={onOpenDossier}
          title="Open Classified S.H.I.E.L.D. Tactical Dossier & Export Options"
          className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/50 text-xs font-mono text-red-300 flex items-center gap-1.5 transition font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)] group"
        >
          <FileText className="w-3.5 h-3.5 text-red-400 group-hover:animate-bounce" />
          <span className="hidden md:inline">TACTICAL DOSSIER</span>
          <span className="md:hidden">DOSSIER</span>
        </button>
      </div>
    </header>
  );
}
