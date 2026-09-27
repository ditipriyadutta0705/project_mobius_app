import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import MetricsBar from './components/MetricsBar';
import Controls from './components/Controls';
import GraphCanvas from './components/GraphCanvas';
import NodeDetails from './components/NodeDetails';
import TimelineStepper from './components/TimelineStepper';
import HoloTheaterModal from './components/HoloTheaterModal';
import StoryboardGalleryModal from './components/StoryboardGalleryModal';
import MissionDossierModal from './components/MissionDossierModal';
import initialGraphData from './data/timeline_graph.json';
import starkAudio from './utils/audioEngine';

export default function App() {
  const [graphData] = useState(initialGraphData);
  const [nodes, , onNodesChange] = useNodesState(initialGraphData.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState(initialGraphData.edges || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [isStoryboardGalleryOpen, setIsStoryboardGalleryOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Audio & Voice Synthesizer States
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [voicePersona, setVoicePersona] = useState('JARVIS');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedVerdict, setSelectedVerdict] = useState('ALL');

  const reactFlowInstanceRef = useRef(null);

  useEffect(() => {
    if (!selectedNode && graphData.nodes && graphData.nodes.length > 0) {
      setSelectedNode(graphData.nodes[0]);
    }
  }, [graphData, selectedNode]);

  // Audio Toggle Handler
  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    starkAudio.setMuted(nextMuted);
  };

  // Persona Toggle Handler
  const handleTogglePersona = () => {
    const nextPersona = voicePersona === 'JARVIS' ? 'FRIDAY' : 'JARVIS';
    setVoicePersona(nextPersona);
    starkAudio.setVoicePersona(nextPersona);
  };

  // Speech Toggle Handler
  const handleToggleSpeech = () => {
    const nextSpeech = !isSpeechEnabled;
    setIsSpeechEnabled(nextSpeech);
    starkAudio.toggleSpeech(nextSpeech);
  };

  // Keyboard shortcut: Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsTheaterOpen(false);
        setIsStoryboardGalleryOpen(false);
        setIsDossierOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered nodes logic
  const filteredNodes = useMemo(() => {
    if (!graphData.nodes) return [];

    return graphData.nodes.map((node) => {
      const data = node.data;
      let isVisible = true;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = data.title.toLowerCase().includes(q);
        const matchesTrigger = (data.divergence_trigger || '').toLowerCase().includes(q);
        const matchesSummary = data.narrative_summary.toLowerCase().includes(q);
        const matchesId = node.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTrigger && !matchesSummary && !matchesId) {
          isVisible = false;
        }
      }

      // Branch match
      if (selectedBranch !== 'ALL') {
        const id = node.id.toUpperCase();
        if (selectedBranch === 'NY' && !id.includes('NY')) isVisible = false;
        if (selectedBranch === 'ASGARD' && !id.includes('ASGARD')) isVisible = false;
        if (selectedBranch === 'MORAG' && !id.includes('MORAG')) isVisible = false;
        if (selectedBranch === 'VORMIR' && !id.includes('VORMIR')) isVisible = false;
      }

      // Verdict match
      if (selectedVerdict !== 'ALL') {
        if (selectedVerdict === 'ACTIVE' && data.is_terminal) isVisible = false;
        if (selectedVerdict !== 'ACTIVE' && data.terminal_verdict !== selectedVerdict) isVisible = false;
      }

      return {
        ...node,
        style: {
          ...node.style,
          opacity: isVisible ? 1 : 0.15,
          pointerEvents: isVisible ? 'all' : 'none',
        },
      };
    });
  }, [graphData.nodes, searchQuery, selectedBranch, selectedVerdict]);

  // Audio cue dispatcher on node focus
  const triggerNodeAudioFeedback = useCallback((node) => {
    if (!node || !node.data) return;
    const data = node.data;

    if (data.terminal_verdict === 'PRIME_VICTORY') {
      starkAudio.playVictoryChime();
      starkAudio.speak("Prime victory confirmed. Sacred timeline preserved.");
    } else if (data.terminal_verdict === 'THANOS_DOUBLE_SNAP') {
      starkAudio.playGauntletSnap();
      starkAudio.speak("Catastrophic timeline failure. Thanos double snap detected.");
    } else if ((data.entropy_level || 0) > 75) {
      starkAudio.playAlarmKlaxon();
      starkAudio.speak("Warning. Chronal entropy exceeding safety parameters.");
    } else if ((data.thanos_awareness || 0) > 65) {
      starkAudio.playAlarmKlaxon();
      starkAudio.speak("Sanctuary Two tracking detected.");
    } else {
      starkAudio.playHoloBlip(1400, 0.06);
    }
  }, []);

  const handleNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    triggerNodeAudioFeedback(node);
  }, [triggerNodeAudioFeedback]);

  const handleResetView = useCallback(() => {
    starkAudio.playHoloBlip(1100, 0.08);
    if (reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView({ padding: 0.2, duration: 600 });
    }
  }, []);

  const handleStepperSelectNode = useCallback((node) => {
    setSelectedNode(node);
    triggerNodeAudioFeedback(node);
    if (reactFlowInstanceRef.current && node.position) {
      reactFlowInstanceRef.current.setCenter(
        node.position.x + 130,
        node.position.y + 60,
        { zoom: 1.15, duration: 600 }
      );
    }
  }, [triggerNodeAudioFeedback]);

  const handleSelectStoryboardBranch = useCallback((branchKey, anchorId) => {
    starkAudio.playHoloBlip(1500, 0.08);
    setSelectedBranch(branchKey);
    const target = graphData.nodes?.find(n => n.id === anchorId);
    if (target) {
      setSelectedNode(target);
      triggerNodeAudioFeedback(target);
      if (reactFlowInstanceRef.current && target.position) {
        reactFlowInstanceRef.current.setCenter(
          target.position.x + 140,
          target.position.y + 60,
          { zoom: 1.2, duration: 700 }
        );
      }
    }
  }, [graphData.nodes, triggerNodeAudioFeedback]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#06090e] text-slate-100 relative">
      {/* Top HUD Telemetry Bar with Sound Controls & Dossier Trigger */}
      <MetricsBar
        stats={graphData.summary_statistics}
        selectedNode={selectedNode?.data || selectedNode}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        voicePersona={voicePersona}
        onTogglePersona={handleTogglePersona}
        isSpeechEnabled={isSpeechEnabled}
        onToggleSpeech={handleToggleSpeech}
        onOpenDossier={() => {
          starkAudio.playHoloBlip(1300, 0.09);
          setIsDossierOpen(true);
        }}
      />

      {/* Main Workspace: Graph Canvas + Side Inspector */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Floating Controls / Search Filter Bar */}
        <Controls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedVerdict={selectedVerdict}
          setSelectedVerdict={setSelectedVerdict}
          onResetView={handleResetView}
          onOpenStoryboards={() => {
            starkAudio.playHoloBlip(1200, 0.08);
            setIsStoryboardGalleryOpen(true);
          }}
        />

        {/* Timeline Playback Chronal Stepper */}
        <TimelineStepper
          allNodes={graphData.nodes}
          onSelectNode={handleStepperSelectNode}
        />

        {/* React Flow Interactive Graph */}
        <GraphCanvas
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          reactFlowInstanceRef={reactFlowInstanceRef}
        />

        {/* Side Inspector Drawer */}
        {selectedNode && (
          <NodeDetails
            node={selectedNode}
            onClose={() => {
              starkAudio.playHoloBlip(800, 0.05);
              setSelectedNode(null);
            }}
            onOpenTheater={() => {
              starkAudio.playHoloBlip(1600, 0.1);
              setIsTheaterOpen(true);
            }}
          />
        )}
      </div>

      {/* Full-Screen Hologram Theater Modal */}
      <HoloTheaterModal
        node={selectedNode}
        isOpen={isTheaterOpen}
        onClose={() => setIsTheaterOpen(false)}
      />

      {/* Storyboard Concept Art Deck Modal */}
      <StoryboardGalleryModal
        isOpen={isStoryboardGalleryOpen}
        onClose={() => setIsStoryboardGalleryOpen(false)}
        onSelectBranch={handleSelectStoryboardBranch}
      />

      {/* S.H.I.E.L.D. / Stark Mission Dossier Export Modal */}
      <MissionDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        selectedNode={selectedNode}
        graphData={graphData}
      />
    </div>
  );
}
