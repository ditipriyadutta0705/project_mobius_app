import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Activity, Video, Users, Sparkles, ChevronRight, FileText, Image as ImageIcon, Maximize2 } from 'lucide-react';
import HoloVideoPlayer from './HoloVideoPlayer';
import starkAudio from '../utils/audioEngine';
import { resolveAssetUrl } from '../utils/assetHelper';

export default function NodeDetails({ node, onClose, onOpenTheater }) {
  if (!node) return null;

  const data = node.data || node;
  const theme = data.theme || {
    type: 'cyan',
    border: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.15)',
    badge: 'NODE',
  };

  const [activeMedia, setActiveMedia] = useState('sketch'); // 'sketch' | 'video'

  const pymIcons = Array.from({ length: 4 }).map((_, i) => i < (data.pym_particles_remaining || 0));

  // Determine storyboard image strictly using authentic hand-drawn sketches
  const getStoryboardUrl = () => {
    if (data.storyboard_url && data.storyboard_url.endsWith('.jpg')) {
      return resolveAssetUrl(data.storyboard_url);
    }
    const text = (data.node_id + ' ' + data.title + ' ' + (data.divergence_trigger || '')).toUpperCase();
    if (text.includes('BARTON') || text.includes('CLINT')) return resolveAssetUrl('/storyboards/vormir_clint_sacrifice.jpg');
    if (text.includes('DUAL') || text.includes('BOTH DIE') || text.includes('PITON')) return resolveAssetUrl('/storyboards/vormir_dual_fall.jpg');
    if (text.includes('VORMIR') || text.includes('SOUL')) return resolveAssetUrl('/storyboards/vormir_2014.jpg');
    if (text.includes('ELEVATOR') || text.includes('HYDRA')) return resolveAssetUrl('/storyboards/ny_elevator_brawl.jpg');
    if (text.includes('ANCIENT') || text.includes('ASTRAL') || text.includes('SANCTUM')) return resolveAssetUrl('/storyboards/ny_ancient_one_astral.jpg');
    if (text.includes('ASGARD') || text.includes('AETHER') || text.includes('MJOLNIR')) return resolveAssetUrl('/storyboards/asgard_2013.jpg');
    if (text.includes('MORAG') || text.includes('NEBULA') || text.includes('ORB')) return resolveAssetUrl('/storyboards/morag_2014.jpg');
    if (text.includes('COMPOUND') || text.includes('THANOS') || text.includes('SNAP') || text.includes('FIN')) return resolveAssetUrl('/storyboards/compound_2023.jpg');
    return resolveAssetUrl('/storyboards/ny_2012.jpg');
  };

  const storyboardImg = getStoryboardUrl();

  return (
    <aside className="w-96 h-[calc(100vh-4rem)] border-l border-cyan-500/20 bg-slate-950/95 backdrop-blur p-4 overflow-y-auto flex flex-col gap-4 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.7)] font-mono">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded font-bold tracking-widest uppercase border"
              style={{
                color: theme.border,
                borderColor: theme.border,
                backgroundColor: theme.bg,
              }}
            >
              {theme.badge || "TIMELINE NODE"}
            </span>
            <span className="text-[10px] text-slate-400">DEPTH {data.depth}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-100 mt-1.5 leading-snug font-sans">{data.title}</h2>
          <span className="text-[11px] text-slate-400 mt-0.5">ID: {data.node_id}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Media Mode Switcher: Storyboard Sketch vs Video Feed */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700/80 p-0.5 text-xs w-full">
            <button
              onClick={() => {
                starkAudio.playHoloBlip(1200, 0.05);
                setActiveMedia('sketch');
              }}
              className={`flex-1 py-1 rounded flex items-center justify-center gap-1.5 transition text-[11px] font-semibold ${
                activeMedia === 'sketch'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Storyboard Sketch
            </button>
            <button
              onClick={() => {
                starkAudio.playHoloBlip(1350, 0.05);
                setActiveMedia('video');
              }}
              className={`flex-1 py-1 rounded flex items-center justify-center gap-1.5 transition text-[11px] font-semibold ${
                activeMedia === 'video'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,240,255,0.5)] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Holo Video Loop
            </button>
          </div>
        </div>

        {/* Media Frame Display */}
        {activeMedia === 'sketch' ? (
          /* Concept Art Storyboard Sketch Display */
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-amber-500/60 bg-black shadow-[0_0_20px_rgba(245,158,11,0.25)] group cursor-pointer"
               onClick={onOpenTheater}>
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400 pointer-events-none z-30" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none z-30" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none z-30" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none z-30" />

            {/* Storyboard Image */}
            <img
              src={storyboardImg}
              alt="Divergence Storyboard Concept Art"
              className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] pointer-events-none">
              <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold uppercase tracking-wider">
                DIVERGENCE STORYBOARD
              </span>
              <span className="text-amber-300 font-mono bg-black/60 px-1 rounded">
                KEY SCENE
              </span>
            </div>

            {/* Bottom Caption & Theater Trigger */}
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px]">
              <span className="text-slate-200 truncate max-w-[200px]">
                {data.divergence_trigger || data.title}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenTheater(); }}
                className="px-2 py-0.5 rounded bg-black/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition"
              >
                <Maximize2 className="w-3 h-3" /> EXPAND
              </button>
            </div>
          </div>
        ) : (
          /* Video Player Display */
          <HoloVideoPlayer
            clipUrl={data.video_clip_url}
            title={data.title}
            nodeId={data.node_id}
            themeType={theme.type}
            onOpenTheater={onOpenTheater}
          />
        )}
      </div>

      {/* Divergence Trigger */}
      {data.divergence_trigger && (
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 flex flex-col gap-1">
          <span className="text-[10px] uppercase text-amber-400 font-semibold tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> DIVERGENCE TRIGGER
          </span>
          <p className="text-xs text-amber-100/90 font-mono">{data.divergence_trigger}</p>
        </div>
      )}

      {/* Deterministic Resource Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Pym Particles */}
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase">Pym Particles</span>
          <div className="flex items-center gap-1.5">
            {pymIcons.map((filled, idx) => (
              <div
                key={idx}
                className={`w-3.5 h-5 rounded-sm border transition-all ${
                  filled
                    ? 'bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'bg-slate-800 border-slate-700 opacity-30'
                }`}
              />
            ))}
            <span className="text-xs ml-1 text-slate-300 font-bold">{data.pym_particles_remaining}/4</span>
          </div>
        </div>

        {/* Victory Chance */}
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase">Victory Probability</span>
          <div className="flex items-center gap-2">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                style={{ width: `${Math.round((data.victory_probability || 0) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              {Math.round((data.victory_probability || 0) * 100)}%
            </span>
          </div>
        </div>

        {/* Thanos Awareness */}
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase">Thanos Awareness</span>
          <div className="flex items-center gap-2">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-rose-500 rounded-full"
                style={{ width: `${Math.round((data.thanos_awareness || 0) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-amber-400 font-bold">
              {Math.round((data.thanos_awareness || 0) * 100)}%
            </span>
          </div>
        </div>

        {/* TVA Entropy Index */}
        <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex flex-col gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase">TVA Entropy Index</span>
          <div className="flex items-center gap-2">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{ width: `${Math.min(100, Math.round(data.tva_entropy_index || 0))}%` }}
              />
            </div>
            <span className="text-xs text-purple-400 font-bold">
              {Math.round(data.tva_entropy_index || 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1.5">
        <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1 font-mono">
          <FileText className="w-3.5 h-3.5 text-cyan-400" /> TACTICAL NARRATIVE LOG
        </span>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.narrative_summary}</p>
      </div>

      {/* Roster & Casualty Status */}
      {data.characters && Object.keys(data.characters).length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1 font-mono">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> ACTIVE AVENGERS ROSTER & STATUS
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {Object.values(data.characters).map((char) => {
              const statusColors = {
                Active: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
                Incapacitated: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
                Captured: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
                Deceased: 'text-red-500 border-red-500/40 bg-red-950/30 line-through',
                MIA: 'text-slate-400 border-slate-700 bg-slate-900/30',
              };
              const style = statusColors[char.status] || statusColors.Active;
              return (
                <div
                  key={char.name}
                  className={`p-1.5 rounded border flex flex-col justify-between ${style}`}
                >
                  <span className="font-semibold text-slate-200">{char.name}</span>
                  <span className="text-[9px] uppercase tracking-wider">{char.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cinematic Director Video Prompt Details */}
      {data.cinematic_prompt && (
        <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase text-cyan-400 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> CINEMATIC PROMPT DIRECTIVE
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed italic bg-black/40 p-2 rounded border border-slate-800/80 font-mono">
            "{data.cinematic_prompt}"
          </p>
        </div>
      )}
    </aside>
  );
}
