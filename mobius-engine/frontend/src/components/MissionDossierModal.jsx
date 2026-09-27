import React, { useState } from 'react';
import { 
  X, FileText, Download, Printer, Copy, Check, Shield, AlertTriangle, 
  Sparkles, Zap, Award, Compass, Clock, Terminal, ChevronRight
} from 'lucide-react';
import starkAudio from '../utils/audioEngine';

export default function MissionDossierModal({ isOpen, onClose, selectedNode, graphData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const data = selectedNode?.data || selectedNode || {};
  const stones = data.stones_secured || {};
  const stonesList = ['Space', 'Mind', 'Reality', 'Power', 'Time', 'Soul'];
  const securedCount = stonesList.filter(s => stones[s]).length;

  const stats = graphData?.summary_statistics || {};
  const allNodes = graphData?.nodes || [];
  
  // Identify casualties based on narrative or branch
  const getCasualtyReport = () => {
    const id = (selectedNode?.id || '').toUpperCase();
    const narrative = (data.narrative_summary || '').toLowerCase();
    
    if (narrative.includes('both clint and natasha') || id.includes('DUAL_SACRIFICE') || narrative.includes('both die')) {
      return {
        status: 'CRITICAL DOUBLE CASUALTY',
        color: 'text-red-400 border-red-500/50 bg-red-950/30',
        operatives: ['Natasha Romanoff (Black Widow) - KIA [Vormir Abyss]', 'Clint Barton (Hawkeye) - KIA [Vormir Abyss]'],
        impact: 'Soul Stone lost. Gauntlet snap rendered impossible. Severe temporal divergence.'
      };
    } else if (narrative.includes('barton sacrifices') || narrative.includes('clint leaps') || id.includes('CLINT_SACRIFICE')) {
      return {
        status: 'SINGLE CASUALTY (HAWKEYE)',
        color: 'text-amber-400 border-amber-500/50 bg-amber-950/30',
        operatives: ['Clint Barton (Hawkeye) - KIA [Vormir Summit]', 'Natasha Romanoff (Black Widow) - RETRIEVED SOUL STONE'],
        impact: 'Soul Stone secured. Romanoff returns with severe psychological trauma to calibrate the Stark Gauntlet.'
      };
    } else if (narrative.includes('romanoff') || narrative.includes('black widow') || id.includes('VORMIR')) {
      return {
        status: 'PRIME CANON SACRIFICE',
        color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',
        operatives: ['Natasha Romanoff (Black Widow) - KIA [Vormir Precipice]', 'Clint Barton (Hawkeye) - RETRIEVED SOUL STONE'],
        impact: 'Soul Stone secured under Prime Sacred Timeline parameters. Gauntlet assembly primed.'
      };
    }
    return {
      status: 'MINIMAL OPERATIVE CASUALTIES',
      color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30',
      operatives: ['All primary strike teams nominal in current temporal coordinates.'],
      impact: 'Ongoing stealth protocol active.'
    };
  };

  const casualty = getCasualtyReport();

  // Generate full markdown dossier text
  const generateMarkdownReport = () => {
    return `# S.H.I.E.L.D. // STARK INDUSTRIES CLASSIFIED TACTICAL DOSSIER
**DOCUMENT ID:** SEC-MOBIUS-616-OMEGA  
**CHRONAL EPOCH:** 2023.10.17 // QUANTUM HEIST DEBRIEF  
**SECURITY CLEARANCE:** LEVEL 7 // AVENGERS COMMAND EYES ONLY  
**DIRECTOR:** Tony Stark (Iron Man) // S.H.I.E.L.D. Special Operations  

---

## 1. EXECUTIVE MISSION SUMMARY
* **Operation Designation:** PROJECT MOBIUS (Quantum Time Heist)
* **Objective:** Traverse quantum micro-wormholes to retrieve six alternate-timeline Infinity Stones to reverse the Decimation Event without causing multiversal collapse.
* **Currently Inspected Reality:** \`${selectedNode?.id || 'NODE-616'}\`
* **Operational Theater:** ${data.temporal_anchor || 'New York / Morag / Vormir / Asgard'}
* **Outcome Verdict:** **${data.terminal_verdict || (data.is_terminal ? 'TERMINAL DIVERGENCE' : 'IN-FLIGHT OPERATION')}**
* **Stones Secured:** ${securedCount}/6 (${stonesList.filter(s => stones[s]).join(', ') || 'None'})

---

## 2. CHRONAL & QUANTUM TELEMETRY
* **Pym Particle Consumed:** ${data.pym_particles_used ?? 2} Canisters (Critical Reserve: ${12 - (data.pym_particles_used || 2)} remaining)
* **Chronal Entropy Level:** ${data.entropy_level ?? 25}% (TVA Red-Line Threshold: 80%)
* **Thanos Awareness Index:** ${data.thanos_awareness ?? 15}% (Sanctuary II Incursion Probability)
* **Divergence Trigger Event:** ${data.divergence_trigger || 'Standard Heist Infiltration'}

---

## 3. CASUALTY & SACRIFICE RECORD
* **Status:** ${casualty.status}
${casualty.operatives.map(o => `* **Operative:** ${o}`).join('\n')}
* **Strategic Assessment:** ${casualty.impact}

---

## 4. TACTICAL NARRATIVE DEBRIEF
> "${data.narrative_summary || 'No narrative telemetry recorded for this node.'}"

---

## 5. GLOBAL MULTIVERSE MAPPING STATISTICS
* **Total Realities Mapped:** ${stats.total_nodes || allNodes.length}
* **Victory Probability Rate:** ${stats.overall_win_rate || 62.5}%
* **Average Chronal Entropy:** ${stats.average_entropy || 38.4}%
* **Thanos Threat Rating:** ${stats.average_thanos_awareness || 32.1}%
* **Optimal Path Identified:**
${allNodes.filter(n => n.data?.terminal_verdict === 'PRIME_VICTORY').slice(0, 3).map((n, i) => `  ${i+1}. [${n.id}] ${n.data?.title}: ${n.data?.narrative_summary.slice(0, 100)}...`).join('\n')}

---

## 6. S.H.I.E.L.D. EMERGENCY DIRECTIVES
1. **Pym Conservation:** Under no circumstances should operatives initiate secondary micro-jumps without verified Pym canister replenishment from Camp Lehigh (1970).
2. **TVA Incursion Protocol:** If Chronal Entropy exceeds 75%, activate quantum dampeners immediately to prevent Minutemen timeline pruning.
3. **Gauntlet Synchronization:** Nano Gauntlet requires all six resonant frequencies aligned before biological attachment. Only Thor or Bruce Banner authorized for neural contact.

================================================================================
AUTHENTICATED BY: J.A.R.V.I.S. // STARK QUANTUM PROBABILITY SUITE v2.0
================================================================================
`;
  };

  const handleDownload = () => {
    starkAudio.playHoloBlip(800, 0.1);
    const content = generateMarkdownReport();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AVENGERS_TACTICAL_DOSSIER_${selectedNode?.id || 'MOBIUS-616'}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    starkAudio.speak("Tactical dossier generated and encrypted for offline storage, sir.");
  };

  const handlePrint = () => {
    starkAudio.playHoloBlip(950, 0.1);
    window.print();
  };

  const handleCopy = () => {
    starkAudio.playHoloBlip(1100, 0.08);
    const content = generateMarkdownReport();
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      starkAudio.speak("Dossier copied to clipboard.");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Dossier Card Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#080d14] border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden font-sans">
        
        {/* Top Classified Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border border-cyan-400/50 bg-cyan-950/60 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                  TOP SECRET // LEVEL 7
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  PROJECT MOBIUS TACTICAL DOSSIER
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                DOC ID: SEC-MOBIUS-616-Ω // AVENGERS STRATEGIC COMMAND
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy Report to Clipboard"
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print or Save as PDF"
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownload}
              title="Download Full Markdown Dossier"
              className="px-3.5 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-xs font-mono text-cyan-300 flex items-center gap-1.5 font-semibold transition shadow-[0_0_12px_rgba(0,240,255,0.25)]"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download .MD</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-sm font-sans" id="printable-dossier">
          
          {/* Header Watermark / Title */}
          <div className="border border-cyan-500/20 bg-slate-950/60 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute right-4 top-2 text-[64px] font-black text-cyan-500/5 select-none font-mono">
              STARK 616
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px]">Target Reality Node</span>
                <p className="font-bold text-cyan-400 text-sm mt-0.5">{selectedNode?.id || 'ALPHA-001'}</p>
                <p className="text-slate-400 text-[11px]">{data.title || 'Temporal Incursion Point'}</p>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px]">Temporal Anchor</span>
                <p className="font-bold text-amber-300 text-sm mt-0.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 inline" /> {data.temporal_anchor || 'Multi-Anchor Operational Theater'}
                </p>
                <p className="text-slate-400 text-[11px]">Quantum coordinates synced</p>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px]">Outcome Assessment</span>
                <p className={`font-bold text-sm mt-0.5 ${
                  data.terminal_verdict === 'PRIME_VICTORY' ? 'text-emerald-400' :
                  data.terminal_verdict === 'PYRRHIC_VICTORY' ? 'text-amber-400' :
                  data.terminal_verdict ? 'text-red-400' : 'text-cyan-400'
                }`}>
                  {data.terminal_verdict || 'Active Heist Branch'}
                </p>
                <p className="text-slate-400 text-[11px]">
                  {data.is_terminal ? 'Terminal Reality End' : 'In-Flight Path'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Infinity Stones Telemetry */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Infinity Stones Retrieval Status ({securedCount}/6)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {[
                { name: 'Space', color: '#38bdf8', icon: '🌌' },
                { name: 'Mind', color: '#facc15', icon: '🧠' },
                { name: 'Reality', color: '#ef4444', icon: '🔴' },
                { name: 'Power', color: '#c084fc', icon: '⚡' },
                { name: 'Time', color: '#22c55e', icon: '⏳' },
                { name: 'Soul', color: '#f97316', icon: '✨' },
              ].map(st => {
                const secured = Boolean(stones[st.name]);
                return (
                  <div
                    key={st.name}
                    className={`p-3 rounded-lg border flex flex-col items-center text-center transition-all ${
                      secured
                        ? 'border-cyan-400/50 bg-cyan-950/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                        : 'border-slate-800 bg-slate-950/40 opacity-40'
                    }`}
                  >
                    <span className="text-xl mb-1">{st.icon}</span>
                    <span className="font-mono text-xs font-bold" style={{ color: secured ? st.color : '#64748b' }}>
                      {st.name}
                    </span>
                    <span className={`text-[10px] font-mono mt-1 px-1.5 py-0.5 rounded ${
                      secured ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {secured ? 'SECURED' : 'UNRETRIEVED'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Quantum Telemetry & Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Pym Canister Consumption
              </span>
              <p className="text-xl font-bold font-mono text-cyan-300 mt-1">
                {data.pym_particles_used ?? 2} / 12 <span className="text-xs text-slate-400">Used</span>
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((data.pym_particles_used || 2) / 12) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-purple-400" /> Chronal Entropy Level
              </span>
              <p className="text-xl font-bold font-mono text-purple-300 mt-1">
                {data.entropy_level ?? 25}%
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (data.entropy_level || 25))}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/50">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Thanos Incursion Risk
              </span>
              <p className="text-xl font-bold font-mono text-amber-300 mt-1">
                {data.thanos_awareness ?? 15}%
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (data.thanos_awareness || 15))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Casualty & Sacrifice Assessment */}
          <div className={`p-4 rounded-lg border ${casualty.color}`}>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              Casualty & Sacrifice Assessment: {casualty.status}
            </div>
            <ul className="space-y-1 font-mono text-xs mb-2">
              {casualty.operatives.map((op, i) => (
                <li key={i} className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-cyan-400" />
                  <span>{op}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-300 italic">
              <strong>Strategic Consequence:</strong> {casualty.impact}
            </p>
          </div>

          {/* Section 4: Narrative Log */}
          <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Chronal Intelligence Log
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded border border-slate-800/80">
              "{data.narrative_summary || 'Synchronizing with Stark quantum probability database...'}"
            </p>
          </div>

          {/* Section 5: Strategic Avengers Directives */}
          <div className="border border-cyan-500/20 bg-slate-950/40 rounded-lg p-4 font-mono text-xs text-slate-300">
            <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider mb-2.5">
              S.H.I.E.L.D. Contingency Protocols
            </h4>
            <div className="space-y-2">
              <p>• <strong>Pym Scarcity:</strong> If Pym reserves fall below 2 units, abort all temporal branches and converge on 1970 Lehigh coordinates.</p>
              <p>• <strong>TVA Intervention:</strong> If Chronal Entropy reaches 80%, deploy temporal anchor beacon to avoid localized timeline erasure.</p>
              <p>• <strong>Soul Exchange Law:</strong> An eternal exchange is irreversible across all multiversal manifolds. Soul Stone retrieval requires conscious emotional surrender.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between font-mono text-[11px] text-slate-500 select-none">
          <span>STARK ENTERPRISES // QUANTUM HEIST ARCHIVE</span>
          <span>AUTHORIZED BY ANTHONY E. STARK</span>
        </div>
      </div>
    </div>
  );
}
