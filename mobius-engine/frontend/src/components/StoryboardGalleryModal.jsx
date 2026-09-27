import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, ChevronRight, Compass, ShieldAlert, ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../utils/assetHelper';

export const STORYBOARD_GALLERY = [
  {
    id: 'vormir_clint',
    anchorId: 'VORMIR_BARTON_SACRIFICE',
    branchKey: 'VORMIR',
    title: 'Vormir 2014: Hawkeye Sacrifice (Clint Dies)',
    theater: 'Peak of Mount Golgotha, Vormir',
    year: '2014',
    image: '/storyboards/vormir_clint_sacrifice.jpg',
    significance: 'HAWKEYE FALLEN // NATASHA SURVIVES',
    summary:
      'In this divergent reality, Clint Barton overpowers Natasha, fires an electrified grapple arrow to pin her to the snowy ledge, and hurls himself into the cosmic chasm. Clint falls backward into the swirling golden void with peaceful acceptance. Natasha awakens alone in the flooded basin clutching the Soul Stone in tears. She returns to 2023 bearing Clint’s quiver, personally leading the Compound trench defense to honor his sacrifice.',
    divergenceTrigger: 'Clint Pins Natasha -> Detaches Cable -> Hawkeye Leaps to His Death',
    tacticalPivot: 'Natasha secures Soul Stone alone; commands the ground defense and leads the trench run against Corvus Glaive.',
  },
  {
    id: 'vormir_dual',
    anchorId: 'VORMIR_DUAL_FALL',
    branchKey: 'VORMIR',
    title: 'Vormir 2014: Mutual Precipice Plunge (Both Die)',
    theater: 'Peak of Mount Golgotha, Vormir',
    year: '2014',
    image: '/storyboards/vormir_dual_fall.jpg',
    significance: 'CATASTROPHIC DOUBLE CASUALTY // ZERO SOUL STONE',
    summary:
      'During their frenzied grapple at the edge of the abyss, the anchor piton snaps under their combined momentum. Both Clint and Natasha tumble together down into the cosmic vortex. The summit remains empty and silent under the black celestial eclipse. At the 2023 Quantum Tunnel, the platform returns completely empty. With both operatives dead, the Soul Stone is lost forever, dooming the Avengers to fight Thanos without a completed Gauntlet.',
    divergenceTrigger: 'Mutual Grapple Over Edge -> Anchor Piton Snaps -> Both Operatives Plunge',
    tacticalPivot: 'Mission failure: Time heist collapses without the Soul Stone; leads directly to Thanos Double Snap or TVA reset.',
  },
  {
    id: 'vormir_natasha',
    anchorId: 'VORMIR_NATASHA_SACRIFICE',
    branchKey: 'VORMIR',
    title: 'Vormir 2014: Black Widow Sacrifice (Natasha Dies)',
    theater: 'Peak of Mount Golgotha, Vormir',
    year: '2014',
    image: '/storyboards/vormir_2014.jpg',
    significance: 'SACRED TIMELINE CANON // NATASHA DIES',
    summary:
      'Under the cosmic eclipse, Natasha Romanoff breaks Clint’s desperate grasp and kicks off the cliff face. Clint awakens in the flooded basin clutching the orange Soul Stone in grief. Clint returns to 2023 alone, and the Nano Gauntlet is forged by Tony and Bruce.',
    divergenceTrigger: 'Natasha Kicks Off Wall -> Cosmic Exchange Fulfilled -> Clint Obtains Stone',
    tacticalPivot: 'Clint returns to 2023; Bruce Banner performs the Blip Snap to bring back the fallen.',
  },
  {
    id: 'ny_elevator',
    anchorId: 'NY_ELEVATOR_BLUFF_FAIL',
    branchKey: 'NY',
    title: 'New York 2012: Glass Elevator Strike Brawl',
    theater: 'Stark Tower Glass Elevator, 2012',
    year: '2012',
    image: '/storyboards/ny_elevator_brawl.jpg',
    significance: 'HYDRA COMPROMISE // HIGH-RISE MELEE',
    summary:
      'Jasper Sitwell and Brock Rumlow see through Steve Rogers’s "Hail Hydra" gambit inside the glass elevator. Ten armed STRIKE operatives draw electro-shock batons and magnetic handcuffs. Cap engages in brutal close-quarters combat, defeats Rumlow, magnetic-releases his shield to shatter the panoramic glass, and free-falls 30 stories into the lobby fountain with the Mind Scepter.',
    divergenceTrigger: 'Elevator Whisper Bluff Fails -> Rumlow Draws Batons -> Glass Shatter Parachute Dive',
    tacticalPivot: 'Cap extracts Scepter via the atrium fountain; evades Hydra Quinjets across Manhattan.',
  },
  {
    id: 'ny_astral',
    anchorId: 'NY_ANCIENT_ONE_DENIAL',
    branchKey: 'NY',
    title: 'New York 2012: Sanctum Astral Eviction',
    theater: 'Sanctum Sanctorum Rooftop, Greenwich Village',
    year: '2012',
    image: '/storyboards/ny_ancient_one_astral.jpg',
    significance: 'ASTRAL PLANE PERSUASION // TIME STONE GAMBIT',
    summary:
      'The Ancient One refuses to surrender the Time Stone, thrusting Bruce Banner’s glowing astral form out of the Hulk’s physical body with a palm strike. Floating as a translucent spirit over the New York skyline, Banner reveals that Doctor Strange gave the Time Stone to Thanos intentionally for the 1-in-14-million victory. The Ancient One realizes Strange’s design and entrusts the Eye of Agamotto.',
    divergenceTrigger: 'Ancient One Astral Palm Strike -> Soul Ejected from Hulk -> 14 Million Futures Revelation',
    tacticalPivot: 'Banner re-enters physical body with Eye of Agamotto; time stone secured for 2023.',
  },
  {
    id: 'ny_2012',
    anchorId: 'NY_TESSERACT_DROP',
    branchKey: 'NY',
    title: 'New York 2012: Tesseract Briefcase Drop',
    theater: 'Stark Tower Lobby, 2012',
    year: '2012',
    image: '/storyboards/ny_2012.jpg',
    significance: 'LOKI GOBI DESERT TELEPORTATION',
    summary:
      'Tony Stark simulates cardiac arrest, but 2012 Hulk bursts furiously through the lobby stairwell, blasting the briefcase open. Loki grabs the glowing blue Space Stone and teleports into the Gobi Desert. Left with no Space Stone, Tony and Steve burn 2 Pym particles to execute a 1970 Camp Lehigh leap.',
    divergenceTrigger: '2012 Hulk Stairwell Smash -> Briefcase Slides -> Loki Teleports Away',
    tacticalPivot: 'Emergency quantum leap to Camp Lehigh 1970 for alternate Tesseract and Hank Pym vials.',
  },
  {
    id: 'asgard_2013',
    anchorId: 'ASGARD_EXTRACTION_FAIL',
    branchKey: 'ASGARD',
    title: 'Asgard 2013: Einherjar Royal Pursuit',
    theater: 'Royal Palace of Valaskjalf, Asgard',
    year: '2013',
    image: '/storyboards/asgard_2013.jpg',
    significance: 'REALITY STONE EXTRACTION // PALACE CHASE',
    summary:
      'Rocket extracts the Aether from Jane Foster with a quantum syringe, but triggers Asgardian arcane alarms. Einherjar royal guards chase Rocket across golden palace arches, while Thor summons Mjolnir and creates a blinding lightning storm to cover their quantum jump.',
    divergenceTrigger: 'Arcane Ward Detection -> Einherjar Pursuit -> Thor Lightning Barrage',
    tacticalPivot: 'Thor recalls Mjolnir and blasts palace sentries to escape back through the quantum tunnel.',
  },
  {
    id: 'morag_2014',
    anchorId: 'MORAG_NEBULA_SYNC',
    branchKey: 'MORAG',
    title: 'Morag 2014: Nebula Cybernetic Memory Sync',
    theater: 'Temple of the Power Stone / Sanctuary II Orbit',
    year: '2014',
    image: '/storyboards/morag_2014.jpg',
    significance: 'THANOS MULTIVERSE AWARENESS',
    summary:
      'Nebula’s 2023 cybernetic network syncs with 2014 Sanctuary II. Thanos intercepts her holographic visual memories, discovering his future victory, his death, and the 2023 Avengers time-heist.',
    divergenceTrigger: 'Cybernetic Frequency Clash -> Holographic Memory Stream Uploaded to Sanctuary II',
    tacticalPivot: 'Rhodey disconnects Nebula’s neural link and escapes, but Thanos plots a quantum incursion.',
  },
  {
    id: 'compound_2023',
    anchorId: 'ROOT_AVENGERS_FACILITY_2023',
    branchKey: 'ALL',
    title: 'Avengers Compound 2023: Thanos Orbital Showdown',
    theater: 'Upstate New York Avengers Facility',
    year: '2023',
    image: '/storyboards/compound_2023.jpg',
    significance: 'TEMPORAL INCURSION CLIMAX',
    summary:
      'Sanctuary II jumps through the quantum tunnel brought by 2014 Nebula, carpet-bombing the Avengers Facility. Thanos sits amidst the flaming ruins with his dual-bladed sword, awaiting the final confrontation.',
    divergenceTrigger: 'Quantum Tunnel Breach -> Orbital Bombardment -> Multiverse Climax',
    tacticalPivot: 'Nano Gauntlet assembly and final Tony Stark sacrifice snap to eliminate Thanos.',
  },
];

export default function StoryboardGalleryModal({ isOpen, onClose, onSelectBranch }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!isOpen) return null;

  const current = STORYBOARD_GALLERY[activeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh] overflow-hidden font-mono">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                PROJECT MOBIUS // DIVERGENCE STORYBOARDS
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold uppercase">
                  9 DIVERGENT REALITY SCENARIOS
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Visualizing the significant deviations from the Sacred Timeline across temporal anchors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storyboard Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900/60 border-b border-slate-800 overflow-x-auto">
          {STORYBOARD_GALLERY.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 border ${
                activeIndex === idx
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{item.year}</span>
              <span className="font-normal opacity-80">|</span>
              <span className="truncate max-w-[120px]">{item.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Modal Main Content: Image & Detailed Branch Intel */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Big Storyboard Concept Image */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/60 bg-black aspect-video shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none z-10" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none z-10" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none z-10" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none z-10" />

              <img
                src={resolveAssetUrl(current.image)}
                alt={current.title}
                className="w-full h-full object-cover filter contrast-110"
              />

              {/* Watermark / Badge */}
              <div className="absolute top-3 left-3 bg-black/80 border border-amber-500/60 px-2 py-1 rounded text-[10px] text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {current.significance}
              </div>

              <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded text-[11px] text-slate-300 font-mono border border-slate-700">
                {current.theater}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-9 gap-1.5 mt-1">
              {STORYBOARD_GALLERY.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative rounded-md overflow-hidden aspect-video border transition ${
                    activeIndex === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={resolveAssetUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Mission Intel & Significant Change */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  TEMPORAL BRANCH ANALYSIS
                </span>
                <h3 className="text-lg font-bold text-slate-100 font-sans leading-tight mt-1">
                  {current.title}
                </h3>
                <span className="text-xs text-slate-400">{current.theater}</span>
              </div>

              {/* Significant Change Callout */}
              <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20 flex flex-col gap-1.5">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> SIGNIFICANT MULTIVERSE DIVERGENCE
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {current.summary}
                </p>
              </div>

              {/* Divergence Trigger */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/80 flex flex-col gap-1">
                <span className="text-[10px] uppercase text-cyan-400 font-semibold tracking-wider">
                  DIVERGENCE TRIGGER SEQUENCE
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {current.divergenceTrigger}
                </span>
              </div>

              {/* Tactical Pivot */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/80 flex flex-col gap-1">
                <span className="text-[10px] uppercase text-emerald-400 font-semibold tracking-wider">
                  TACTICAL RECOVERY PIVOT
                </span>
                <span className="text-xs text-slate-300 font-sans">
                  {current.tacticalPivot}
                </span>
              </div>
            </div>

            {/* Action Button: Jump to Branch on Graph */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (onSelectBranch) onSelectBranch(current.branchKey, current.anchorId);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
              >
                <Compass className="w-4 h-4" /> Focus This Branch on Canvas
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
