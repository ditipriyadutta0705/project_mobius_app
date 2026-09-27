import React, { useState } from 'react';
import { X, Video, Image as ImageIcon, Volume2, VolumeX, Shield, Zap, AlertOctagon, Sparkles, Film, ChevronRight } from 'lucide-react';
import { resolveAssetUrl } from '../utils/assetHelper';

export default function HoloTheaterModal({ node, isOpen, onClose }) {
  if (!isOpen || !node) return null;

  const data = node.data || node;
  const theme = data.theme || {
    type: 'cyan',
    border: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.15)',
    badge: 'NODE',
  };

  const [activeMediaTab, setActiveMediaTab] = useState('video'); // 'video' | 'storyboard'
  const [isMuted, setIsMuted] = useState(true);

  // Match corresponding authentic hand-drawn storyboard sketch
  const getStoryboardPath = (id, title, storedUrl) => {
    if (storedUrl && storedUrl.endsWith('.jpg')) return resolveAssetUrl(storedUrl);
    const text = (id + ' ' + title).toUpperCase();
    if (text.includes('BARTON') || text.includes('CLINT')) return resolveAssetUrl('/storyboards/vormir_clint_sacrifice.jpg');
    if (text.includes('DUAL') || text.includes('BOTH DIE') || text.includes('PITON')) return resolveAssetUrl('/storyboards/vormir_dual_fall.jpg');
    if (text.includes('VORMIR') || text.includes('SOUL')) return resolveAssetUrl('/storyboards/vormir_2014.jpg');
    if (text.includes('ELEVATOR') || text.includes('HYDRA')) return resolveAssetUrl('/storyboards/ny_elevator_brawl.jpg');
    if (text.includes('ANCIENT') || text.includes('ASTRAL') || text.includes('SANCTUM')) return resolveAssetUrl('/storyboards/ny_ancient_one_astral.jpg');
    if (text.includes('ASGARD') || text.includes('AETHER')) return resolveAssetUrl('/storyboards/asgard_2013.jpg');
    if (text.includes('MORAG') || text.includes('NEBULA')) return resolveAssetUrl('/storyboards/morag_2014.jpg');
    if (text.includes('COMPOUND') || text.includes('THANOS') || text.includes('FIN') || text.includes('ADV')) return resolveAssetUrl('/storyboards/compound_2023.jpg');
    return resolveAssetUrl('/storyboards/ny_2012.jpg');
  };

  const storyboardImg = getStoryboardPath(data.node_id, data.title, data.storyboard_url);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn">
      {/* Outer Hologram Box */}
      <div
        className="w-full max-w-6xl max-h-[92vh] bg-[#070b14] border-2 rounded-xl overflow-hidden shadow-2xl flex flex-col relative font-mono select-none"
        style={{
          borderColor: theme.border,
          boxShadow: `0 0 40px ${theme.border}40`,
        }}
      >
        {/* Top Header Bar */}
        <div className="h-14 px-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-sm md:text-base font-bold text-slate-100 tracking-wider">
              STARK HUD // CINEMATIC HOLO-THEATER
            </h2>
            <span
              className="text-[10px] px-2 py-0.5 rounded font-bold uppercase border"
              style={{
                color: theme.border,
                borderColor: theme.border,
                backgroundColor: theme.bg,
              }}
            >
              {theme.badge}
            </span>
          </div>

          {/* Media Switcher & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700/80 p-0.5 text-xs">
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-3 py-1 rounded flex items-center gap-1.5 transition ${
                  activeMediaTab === 'video'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video Feed
              </button>
              <button
                onClick={() => setActiveMediaTab('storyboard')}
                className={`px-3 py-1 rounded flex items-center gap-1.5 transition ${
                  activeMediaTab === 'storyboard'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Storyboard Sketch
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Close Theater (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Screen + Telemetry Panel */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-4 p-5">
          {/* Main Visual Display (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-cyan-500/40 bg-black holo-scanline shadow-inner">
              {activeMediaTab === 'video' && data.video_clip_url ? (
                <video
                  src={data.video_clip_url}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover filter contrast-125"
                />
              ) : (
                <img
                  src={storyboardImg}
                  alt="Storyboard Sketch"
                  className="w-full h-full object-cover filter contrast-110"
                />
              )}

              {/* Scanline CRT overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />

              {/* Watermark / Coordinates */}
              <div className="absolute bottom-3 left-4 text-[11px] font-mono text-cyan-300 bg-black/60 px-2.5 py-1 rounded border border-cyan-500/30">
                NODE #{data.node_id} // DEPTH {data.depth}
              </div>

              {activeMediaTab === 'video' && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-3 right-4 p-1.5 rounded bg-black/60 hover:bg-white/20 text-slate-200 border border-slate-700 transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Title & Divergence Callout */}
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                CHRONAL DESIGNATION
              </span>
              <h3 className="text-base font-bold text-slate-100 font-sans">{data.title}</h3>
              {data.divergence_trigger && (
                <p className="text-xs text-amber-300 font-mono">
                  &gt; TRIGGER: {data.divergence_trigger}
                </p>
              )}
            </div>
          </div>

          {/* Right Telemetry & Narrative Log (1 Col) */}
          <div className="flex flex-col gap-3">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400">PYM PARTICLES</span>
                <span className="text-sm font-bold text-rose-400">{data.pym_particles_remaining}/4 Vials</span>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400">VICTORY CHANCE</span>
                <span className="text-sm font-bold text-emerald-400">
                  {Math.round((data.victory_probability || 0) * 100)}%
                </span>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400">THANOS AWARENESS</span>
                <span className="text-sm font-bold text-amber-400">
                  {Math.round((data.thanos_awareness || 0) * 100)}%
                </span>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex flex-col">
                <span className="text-[10px] text-slate-400">TVA ENTROPY</span>
                <span className="text-sm font-bold text-purple-400">
                  {Math.round(data.tva_entropy_index || 0)}%
                </span>
              </div>
            </div>

            {/* Tactical Narrative */}
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> MISSION NARRATIVE
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.narrative_summary}</p>
            </div>

            {/* Cinematic Camera Prompt */}
            {data.cinematic_prompt && (
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col gap-2 flex-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> DIRECTOR CAMERA & LIGHTING DIRECTIVE
                </span>
                <p className="text-[11px] text-slate-400 font-mono italic leading-relaxed">
                  "{data.cinematic_prompt}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
