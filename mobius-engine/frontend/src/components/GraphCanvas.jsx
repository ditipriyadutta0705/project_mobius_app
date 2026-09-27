import React, { memo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls as FlowControls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Video, Shield, AlertTriangle, Skull, Flame, Image as ImageIcon, Sparkles } from 'lucide-react';

// Custom Stark Node Component
const MobiusCustomNode = memo(({ data, selected }) => {
  const theme = data.theme || {
    type: 'cyan',
    border: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.12)',
    glow: '0 0 12px rgba(0, 240, 255, 0.4)',
    badge: 'NODE',
  };

  const isTerminal = Boolean(data.is_terminal);
  const hasVideo = Boolean(data.video_clip_url);
  const storyboardUrl = data.storyboard_url;

  return (
    <div
      className={`px-3 py-2.5 rounded-lg border-2 transition-all duration-300 w-72 backdrop-blur-md cursor-pointer select-none font-mono ${
        selected ? 'ring-2 ring-white scale-105 z-50 shadow-[0_0_30px_rgba(0,240,255,0.6)]' : 'hover:scale-102 hover:brightness-110'
      }`}
      style={{
        borderColor: theme.border,
        backgroundColor: theme.bg,
        boxShadow: selected ? `0 0 25px ${theme.border}` : theme.glow,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 !bg-cyan-400 !border !border-slate-900"
      />

      {/* Top Header Badge & Media Icons */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[9px]">
        <span
          className="px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-slate-950"
          style={{ backgroundColor: theme.border }}
        >
          {theme.badge}
        </span>
        <div className="flex items-center gap-1.5 text-slate-300">
          {storyboardUrl && (
            <span className="flex items-center gap-0.5 text-amber-300" title="Storyboard Concept Sketch Available">
              <ImageIcon className="w-3 h-3 text-amber-400" /> SKETCH
            </span>
          )}
          {hasVideo && (
            <span className="flex items-center gap-0.5 text-cyan-300 animate-pulse" title="Video Feed Available">
              <Video className="w-3 h-3" /> FEED
            </span>
          )}
          <span className="text-slate-400">D{data.depth}</span>
        </div>
      </div>

      {/* Node Title */}
      <h3 className="text-xs font-bold text-slate-100 mt-1.5 truncate leading-tight font-sans">
        {data.title}
      </h3>

      {/* Divergence Trigger */}
      {data.divergence_trigger && (
        <p className="text-[10px] text-amber-300/90 truncate mt-0.5 font-mono">
          &gt; {data.divergence_trigger}
        </p>
      )}

      {/* Divergence Storyboard Sketch Visual (Showing Significant Branch Change) */}
      {storyboardUrl && (
        <div
          className="relative mt-2 rounded overflow-hidden border bg-black shadow-inner group/art"
          style={{ borderColor: theme.border }}
        >
          {/* Tactical Corner brackets */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l pointer-events-none z-10" style={{ borderColor: theme.border }} />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r pointer-events-none z-10" style={{ borderColor: theme.border }} />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l pointer-events-none z-10" style={{ borderColor: theme.border }} />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r pointer-events-none z-10" style={{ borderColor: theme.border }} />

          <img
            src={storyboardUrl}
            alt={data.title}
            className="w-full h-24 object-cover filter contrast-115 brightness-95 group-hover/art:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Bottom badge overlay */}
          <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] pointer-events-none font-mono">
            <span
              className="px-1 py-0.5 rounded bg-black/85 font-bold uppercase tracking-wider flex items-center gap-0.5 border"
              style={{ color: theme.border, borderColor: theme.border }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              {data.depth === 0
                ? 'QUANTUM PAD'
                : data.depth === 1
                ? 'TEMPORAL ANCHOR'
                : data.depth === 2
                ? 'BRANCH DIVERGENCE'
                : data.depth === 3
                ? 'TACTICAL PIVOT'
                : 'CLIMAX REALITY'}
            </span>
            <span className="text-slate-300 bg-black/75 px-1 rounded">
              PANEL D{data.depth}
            </span>
          </div>
        </div>
      )}

      {/* Quick Metrics Bar */}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 text-[10px]">
        <span className="text-slate-400">
          PYM: <b className="text-rose-400">{data.pym_particles_remaining}</b>
        </span>
        <span className="text-slate-400">
          AWARE: <b className="text-amber-400">{Math.round((data.thanos_awareness || 0) * 100)}%</b>
        </span>
        <span className="text-slate-400">
          WIN: <b className="text-emerald-400">{Math.round((data.victory_probability || 0) * 100)}%</b>
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 !bg-cyan-400 !border !border-slate-900"
      />
    </div>
  );
});

const nodeTypes = {
  mobiusNode: MobiusCustomNode,
};

export default function GraphCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  reactFlowInstanceRef,
}) {
  return (
    <div className="flex-1 h-full relative bg-[#06090e]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          if (reactFlowInstanceRef) {
            reactFlowInstanceRef.current = instance;
          }
        }}
        fitView
        minZoom={0.15}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(0, 240, 255, 0.08)" gap={30} size={1} />
        <FlowControls position="bottom-left" showInteractive={false} />
        <MiniMap
          nodeStrokeColor={(n) => n.data?.theme?.border || '#00f0ff'}
          nodeColor={(n) => n.data?.theme?.bg || 'rgba(0, 240, 255, 0.2)'}
          nodeBorderRadius={3}
          maskColor="rgba(6, 9, 14, 0.85)"
          className="!bottom-4 !right-4 !border !border-cyan-500/30 !bg-slate-950/80 !rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}

