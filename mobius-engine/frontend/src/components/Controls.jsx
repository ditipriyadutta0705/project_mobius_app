import React from 'react';
import { Search, Filter, RefreshCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';

export default function Controls({
  searchQuery,
  setSearchQuery,
  selectedBranch,
  setSelectedBranch,
  selectedVerdict,
  setSelectedVerdict,
  onResetView,
  onOpenStoryboards,
}) {
  return (
    <div className="absolute top-20 left-6 z-20 flex flex-col gap-2 pointer-events-auto">
      {/* Search & Filter Card */}
      <div className="bg-slate-950/90 backdrop-blur border border-cyan-500/30 rounded-lg p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col gap-2.5 w-72">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search timelines, triggers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900/80 border border-slate-700/60 rounded text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {/* Anchor Theater Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400 inline" /> Temporal Anchor
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-2 py-1 bg-slate-900/80 border border-slate-700/60 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ALL">All Operational Theaters</option>
            <option value="NY">New York (2012)</option>
            <option value="ASGARD">Asgard (2013)</option>
            <option value="MORAG">Morag (2014)</option>
            <option value="VORMIR">Vormir (2014)</option>
          </select>
        </div>

        {/* Verdict / State Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400 inline" /> Verdict Filter
          </label>
          <select
            value={selectedVerdict}
            onChange={(e) => setSelectedVerdict(e.target.value)}
            className="w-full px-2 py-1 bg-slate-900/80 border border-slate-700/60 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ALL">All Timeline States</option>
            <option value="PRIME_VICTORY">Prime Victory</option>
            <option value="PYRRHIC_VICTORY">Pyrrhic Victory</option>
            <option value="THANOS_DOUBLE_SNAP">Thanos Double Snap</option>
            <option value="TVA_RESET">TVA Reset</option>
            <option value="TIMELINE_STRANDED">Stranded</option>
            <option value="ACTIVE">In-Flight / Non-Terminal</option>
          </select>
        </div>

        {/* Reset View & Storyboard Deck Buttons */}
        <div className="flex flex-col gap-1.5 mt-1">
          <button
            onClick={onResetView}
            className="w-full py-1.5 px-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded text-xs font-mono text-cyan-300 flex items-center justify-center gap-1.5 transition"
          >
            <RefreshCw className="w-3 h-3 inline" /> Center Stark Map
          </button>

          <button
            onClick={onOpenStoryboards}
            className="w-full py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 rounded text-xs font-mono text-amber-300 flex items-center justify-center gap-1.5 transition shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold"
          >
            <span className="text-sm">🎨</span> View Branch Sketches
          </button>
        </div>
      </div>
    </div>
  );
}

