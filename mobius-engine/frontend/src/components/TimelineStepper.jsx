import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Compass, Activity, FastForward } from 'lucide-react';
import starkAudio from '../utils/audioEngine';
import { resolveAssetUrl } from '../utils/assetHelper';

export const TIMELINE_PATHS = [
  {
    name: "Path 1: New York 1970 Lehigh Pivot",
    theater: "New York 2012 / 1970",
    sequence: [
      "ROOT_AVENGERS_FACILITY_2023",
      "ANCHOR_NY_2012",
      "NY_TESSERACT_DROP",
      "NY_TESSERACT_DROP_REC",
      "NY_TESSERACT_DROP_REC_ADV"
    ]
  },
  {
    name: "Path 2: Asgard Aether & Mjolnir Secure",
    theater: "Asgard 2013",
    sequence: [
      "ROOT_AVENGERS_FACILITY_2023",
      "ANCHOR_ASGARD_2013",
      "ASGARD_EXTRACTION_FAIL",
      "ASGARD_EXTRACTION_FAIL_REC",
      "ASGARD_EXTRACTION_FAIL_REC_ADV"
    ]
  },
  {
    name: "Path 3: Morag Sanctuary II Incursion",
    theater: "Morag 2014 / Sanctuary II",
    sequence: [
      "ROOT_AVENGERS_FACILITY_2023",
      "ANCHOR_MORAG_2014",
      "MORAG_NEBULA_SYNC",
      "MORAG_NEBULA_SYNC_REC",
      "MORAG_NEBULA_SYNC_REC_ADV"
    ]
  },
  {
    name: "Path 4: Vormir Hawkeye Soul Sacrifice",
    theater: "Vormir 2014",
    sequence: [
      "ROOT_AVENGERS_FACILITY_2023",
      "ANCHOR_VORMIR_2014",
      "VORMIR_BARTON_SACRIFICE",
      "VORMIR_BARTON_SACRIFICE_REC",
      "VORMIR_BARTON_SACRIFICE_REC_ADV"
    ]
  }
];

export default function TimelineStepper({ onSelectNode, allNodes }) {
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2500); // ms per step

  const currentPath = TIMELINE_PATHS[selectedPathIndex];
  const currentNodeId = currentPath.sequence[currentStepIndex];

  // Lookup node data
  const currentNode = allNodes?.find(n => n.id === currentNodeId);

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < currentPath.sequence.length - 1) {
            starkAudio.playQuantumStep(true);
            return prev + 1;
          } else {
            setIsPlaying(false);
            starkAudio.speak("Timeline playback sequence concluded.");
            return prev;
          }
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentPath, speed]);

  // Synchronize canvas selection when step changes
  useEffect(() => {
    if (currentNode && onSelectNode) {
      onSelectNode(currentNode);
    }
  }, [currentStepIndex, selectedPathIndex]);

  const handleNext = () => {
    if (currentStepIndex < currentPath.sequence.length - 1) {
      starkAudio.playQuantumStep(true);
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      starkAudio.playQuantumStep(false);
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleTogglePlay = () => {
    starkAudio.playHoloBlip(1200, 0.08);
    setIsPlaying(!isPlaying);
  };

  const handleSelectPath = (e) => {
    starkAudio.playHoloBlip(900, 0.06);
    setSelectedPathIndex(Number(e.target.value));
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <div className="bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 rounded-xl px-4 py-2.5 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center gap-4 text-xs font-mono select-none">
        {/* Path Selector */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
            <Compass className="w-3 h-3" /> TIMELINE PLAYBACK PATH
          </span>
          <select
            value={selectedPathIndex}
            onChange={handleSelectPath}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 max-w-[220px]"
          >
            {TIMELINE_PATHS.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-700 transition"
            title="Previous Step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(0,240,255,0.4)] transition"
            title={isPlaying ? "Pause Playback" : "Start Timeline Playback"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === currentPath.sequence.length - 1}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-200 border border-slate-700 transition"
            title="Next Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Step Readout & Storyboard Thumbnail */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
          {currentNode?.data?.storyboard_url && (
            <div
              className="relative w-14 h-10 rounded overflow-hidden border border-amber-500/60 bg-black flex-shrink-0 cursor-pointer group shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              onClick={() => {
                starkAudio.playHoloBlip(1400, 0.08);
                currentNode && onSelectNode && onSelectNode(currentNode);
              }}
              title="Click to focus on this storyboard moment"
            >
              <img
                src={resolveAssetUrl(currentNode.data.storyboard_url)}
                alt="Storyboard Sketch"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
            </div>
          )}
          <div className="flex flex-col min-w-[200px]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">CHRONO SEQUENCE</span>
              <span className="text-cyan-400 font-bold">
                STEP {currentStepIndex + 1}/{currentPath.sequence.length}
              </span>
            </div>
            <span className="text-slate-200 font-sans font-semibold text-xs truncate max-w-[240px]">
              {currentNode?.data?.title || currentNodeId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
