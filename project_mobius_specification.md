# PROJECT MOBIUS: AGENTIC MULTIVERSE TIME HEIST SIMULATOR

> **System Designation:** Project Mobius (Temporal Incursion & Probability Engine)  
> **Target Runtime:** Autonomous Agent Execution Environment (Desktop Agent / Antigravity)  
> **Output:** Deterministic Multiverse Graph Engine + Interactive Stark HUD Visualizer + Cinematic Timeline Video Feeds  

---

## 1. Project Overview & Goals

Project Mobius is an autonomous multi-agent simulation framework that models the 2023 Avengers "Time Heist" as an expansive, branching directed acyclic graph (DAG). 

Rather than treating the mission as a single linear movie narrative, the system models physical constraints, causality ruptures, resource scarcity, and adversary reactions through a dual-search architecture:

1. **Breadth-First Search (BFS):** Deterministically maps every micro-failure at initial temporal anchors (New York 2012, Asgard 2013, Morag 2014, Vormir 2014) across depth levels 1 and 2.
2. **Monte Carlo Tree Search (MCTS):** Simulates deep downstream timeline consequences, incursion entropy, and 2023 compound confrontation outcomes using stochastic playouts up to depth level 6.
3. **Cinematic Visual Engine:** Synthesizes dedicated 5-second animated/cinematic video loops for critical divergence points and terminal states, directly viewable within an interactive Stark Industries Holographic HUD.

### Core Objectives
* **Exhaustive Permutation Mapping:** Identify all immediate points of tactical failure (bluffs, resource drops, physical combat, timeline leaks).
* **Adversarial Causality Simulation:** Pit an adaptive **Heist Recovery Agent** against a **Timeline Entropy / Adversary Agent** (Thanos, Hydra, 2012 Stark, TVA).
* **Deterministic Resource Physics:** Strictly enforce non-renewable Pym particles, captured Infinity Stones, character incapacitations, and Thanos awareness meters.
* **Holographic Interactive Delivery:** Export the entire simulation into a visual, browsable React Flow web application color-coded by survival probability and variance.
* **Cinematic Video Integration:** Automatically generate or synthesize looped visual broadcast clips (`.mp4`) for major timeline deviations and display them in the node inspector.

---

## 2. Directory Layout & Target File Tree

The autonomous agent must scaffold and implement the following structure:

```text
mobius-engine/
├── backend/
│   ├── engine/
│   │   ├── __init__.py
│   │   ├── state_models.py       # Pydantic schemas, resource vectors, terminal rules
│   │   ├── anchors.py            # Canonical baseline anchors & divergence seeds
│   │   ├── agents.py             # Heist Agent, Adversary Agent, TVA Evaluator
│   │   ├── video_agent.py        # Cinematic prompt synthesis & video generator
│   │   ├── search_bfs.py         # Exhaustive tactical layer explorer (Depth 1-2)
│   │   ├── search_mcts.py        # Strategic rollout & backpropagation engine
│   │   └── graph_exporter.py     # Serializes graph into React Flow / Cytoscape JSON
│   ├── data/
│   │   └── timeline_graph.json   # Generated output graph with media references
│   ├── main.py                   # CLI entrypoint to run simulation pipeline
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── clips/                # Generated video clips (.mp4)
│   ├── src/
│   │   ├── components/
│   │   │   ├── GraphCanvas.jsx   # React Flow interactive timeline canvas
│   │   │   ├── NodeDetails.jsx   # Stark HUD inspector for selected timeline node
│   │   │   ├── HoloVideoPlayer.jsx # Looped timeline clip player with scanlines
│   │   │   ├── MetricsBar.jsx    # Global victory rate, entropy, stone counters
│   │   │   └── Controls.jsx      # Filter by branch, failure type, or terminal state
│   │   ├── App.jsx
│   │   └── index.css             # Dark sci-fi / Stark HUD styling
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 3. System Architecture & Algorithms

```
[Layer 0: Canonical Insertion]
  ├── New York (2012)
  ├── Asgard (2013)
  └── Morag / Vormir (2014)
           │
     (BFS Phase: Depth 1-2)
     Exhaustive deterministic failure injection across all anchors
           │
     [Rupture Nodes Generated]
           │
     (MCTS Phase: Rollouts Depth 3-6)
     Adversarial loop -> Resource evaluation -> Terminal showdown resolution
           │
     [Backpropagation & Value Function]
     Avengers Victory Rate (0.0 - 1.0) | TVA Entropy Index (0 - 100)
           │
     (Visual Engine: Selected Divergences & Terminals)
     Cinematic Prompt Synthesizer -> Video Asset Generator (.mp4)
           │
     [JSON Graph Payload] ───> [React Flow Canvas + Hologram Video Inspector]
```

### 3.1. Hybrid Search Mechanics

#### Phase 1: BFS Tactical Anchor Sweep (Exhaustive)
* Traverses all primary insertion coordinates up to depth level 2.
* Generates all discrete operational failure points:
  * **New York 2012:** Tony drops Tesseract briefcase; Cap fails elevator Hydra bluff; 2012 Cap wins mirror match; Ancient One denies Bruce Banner.
  * **Asgard 2013:** Rocket fails Aether extraction; Thor triggers Royal Guard alert; Frigga confiscates Mjolnir.
  * **Morag 2014:** Nebula syncs with 2014 Thanos network; Rhodey incapacitated; Power Stone casing seal fails.
  * **Vormir 2014:** Barton sacrifices self instead of Natasha; Red Skull rejects sacrifice; Dual-refusal deadlock.

#### Phase 2: Monte Carlo Tree Search (Deep Rollouts)
* **Selection:** Employs Upper Confidence Bound applied to Trees (UCT):
  $$UCT = \bar{X}_j + c \sqrt{\frac{\ln N}{n_j}}$$
* **Expansion:** Adversary Agent selects the most destabilizing counter-maneuver.
* **Simulation (Fast-Forward Playout):** Runs iterative narrative turns until a **Terminal Condition** is reached.
* **Backpropagation:** Propagates two scalar scores upward:
  1. `victory_score`: $1.0$ (Stark Snap / Thanos Defeated), $0.5$ (Pyrrhic Win), $0.0$ (Thanos Double Snap / Universe Erased).
  2. `entropy_index`: Numerical scale of timeline deviation (triggers TVA Reset if $\ge 85.0$).

---

## 4. Data Contracts & State Vector

The engine enforces strict typing via **Pydantic v2**.

### `backend/engine/state_models.py`

```python
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Literal

class CharacterStatus(BaseModel):
    name: str
    status: Literal["Active", "Incapacitated", "MIA", "Deceased", "Captured"]
    location: str

class TimelineNode(BaseModel):
    node_id: str
    parent_id: Optional[str] = None
    depth: int
    title: str
    narrative_summary: str
    divergence_trigger: Optional[str] = None
    
    # Deterministic Physics & Resources
    pym_particles_remaining: int = Field(ge=0, default=4)
    stones_secured: Dict[str, bool] = Field(default_factory=lambda: {
        "Space": False, "Mind": False, "Reality": False,
        "Power": False, "Time": False, "Soul": False
    })
    
    # Dynamic Meters
    thanos_awareness: float = Field(0.0, ge=0.0, le=1.0)
    tva_entropy_index: float = Field(0.0, ge=0.0, le=100.0)
    
    # Roster
    characters: Dict[str, CharacterStatus] = Field(default_factory=dict)
    
    # Visual & Video Pipeline
    cinematic_prompt: Optional[str] = Field(
        None,
        description="Cinematic text-to-video prompt formatted with camera movement and lighting."
    )
    video_clip_url: Optional[str] = Field(
        None,
        description="Path or URL to rendered .mp4 timeline clip."
    )
    video_status: Literal["none", "queued", "generating", "ready", "failed"] = "none"

    # Search & Evaluation Metrics
    visit_count: int = 0
    total_value: float = 0.0
    victory_probability: float = 0.0
    is_terminal: bool = False
    terminal_verdict: Optional[Literal[
        "PRIME_VICTORY", "PYRRHIC_VICTORY", "THANOS_DOUBLE_SNAP", "TVA_RESET", "TIMELINE_STRANDED"
    ]] = None

class TimelineGraphExport(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]
    summary_statistics: Dict
```

---

## 5. Agent Architecture

Use an LLM client wrapper implementing structured outputs:

1. **Divergence Agent:** Injects precise physical or interpersonal failure events into canonical anchor points.
2. **Tactical Recovery Agent (Avengers):** Formulates pivot strategies based on remaining Pym particles (e.g., fallback to 1970 Camp Lehigh, secondary Aether extraction).
3. **Adversary Agent (Chaos / Thanos / Hydra):** Capitalizes on failures (e.g., 2014 Thanos reverse-engineers Pym particles; Alexander Pierce seizes the Scepter).
4. **Temporal Arbiter (TVA / Resolution):** Evaluates whether the scenario resolves at the 2023 Compound or terminates via TVA reset charges.
5. **Cinematic Visual Director Agent (`video_agent.py`):** Converts divergence text into high-octane 5-second camera and lighting prompts, interfacing with the video generation backend or programmatic HUD fallback.

---

## 6. Frontend Specifications (Stark Hologram UI)

The frontend provides a synchronized dual-view dashboard:

```
┌────────────────────────────────────────────────────────┬──────────────────────────────────┐
│  PROJECT MOBIUS // TEMPORAL VARIANCE HUD               │  INSPECTOR: NODE #NY12_CAP_FAIL  │
├────────────────────────────────────────────────────────┼──────────────────────────────────┤
│                                                        │  [ HOLOGRAPHIC VIDEO FEED ]      │
│     (2012 NY) ───[Elevator Bluff OK]───> [Scepter Win] │  ┌────────────────────────────┐  │
│         │                                              │  │  ▶ 0:04 / 0:06 (Loop)      │  │
│         └───[Cap Mirror Match Loss]                    │  │  2012 Cap pins 2023 Steve  │  │
│                     │                                  │  │  to the glass walkway.     │  │
│                     ▼                                  │  └────────────────────────────┘  │
│              [Loki Escapes]                            │                                  │
│                     │                                  │  DIVERGENCE TRIGGER:             │
│                     ▼                                  │  "Cap failed 2012 mirror match"  │
│           [1970 Lehigh Pivot]                          │                                  │
│                     │                                  │  RESOURCE METRICS:               │
│                     ▼                                  │  • Pym Particles: [■■□□] 2/4     │
│           [Compound Ambush 2023]                       │  • Mind Stone: [UNSECURED]       │
│                                                        │  • Thanos Awareness: 84%         │
│  [ Interactive React Flow Graph Canvas ]               │  • Victory Chance: 31%           │
└────────────────────────────────────────────────────────┴──────────────────────────────────┘
```

### Key UI Features
* **Graph Canvas:** Built with `@xyflow/react` (React Flow).
* **Color Encoding:**
  * **Cyan / Blue:** Prime 616 Canon / Stable branches.
  * **Amber / Orange:** Major Divergence / Severe resource depletion.
  * **Crimson / Red:** Thanos Victory / Total Universe Annihilation.
  * **Neon Purple / Violet:** TVA Pruned / Incursion collapse.
* **Side Inspector Drawer:**
  * Displays **HoloVideoPlayer**: Auto-playing looped video clip with scanlines and timestamp overlay for supported nodes.
  * Live Stone checklist, Pym Particle meters, and Thanos awareness gauges.
  * Full narrative summary and casualty list.
* **Top Metric Bar:** Total Timelines Mapped, Victory Rate %, Terminal State Breakdown, and Incursion Risk Index.

---

## 7. Autonomous Agent Handoff Protocol

Follow these sequential milestones to construct and run the system autonomously.

### Step 1: Backend Foundation & Data Modeling
1. Create `backend/requirements.txt`:
   ```text
   pydantic>=2.5.0
   networkx>=3.2.0
   google-genai>=0.1.1
   python-dotenv>=1.0.0
   uvicorn>=0.28.0
   fastapi>=0.110.0
   ```
2. Implement `state_models.py` using the Pydantic schema defined in Section 4.
3. Implement `anchors.py` defining initial canonical mission states for New York (2012), Asgard (2013), Morag (2014), and Vormir (2014).

### Step 2: Agent Logic & Dual-Search Engine
1. Implement `agents.py` with structured JSON output prompts for Divergence, Recovery, Adversary, and TVA Arbiter.
2. Implement `search_bfs.py` executing exhaustive exploration across Depth 1–2.
3. Implement `search_mcts.py` running UCT selection, fast playouts, and backpropagation to Depth 6.
4. Implement `video_agent.py`:
   * Writes cinematic prompts for all terminal nodes and primary divergence nodes.
   * Interfaces with a video generation API (e.g., Google Veo / Runway) or generates animated WebGL/Canvas video clips saved directly into `frontend/public/clips/{node_id}.mp4`.
5. Implement `graph_exporter.py` transforming the NetworkX graph into React Flow compatible node and edge collections with embedded `video_clip_url` fields.

### Step 3: Simulation Pipeline Run
1. Run `python backend/main.py --depth 4 --mcts-iterations 15 --render-videos`.
2. Verify that `backend/data/timeline_graph.json` contains at least 25 connected timeline nodes and that key nodes link to valid `.mp4` video clips in `frontend/public/clips/`.

### Step 4: Frontend Scaffolding & Integration
1. Scaffold a React app inside `frontend/` using Vite and Tailwind CSS.
2. Install dependencies:
   ```bash
   npm install @xyflow/react lucide-react clsx tailwind-merge
   ```
3. Implement `GraphCanvas.jsx`, `NodeDetails.jsx`, and `HoloVideoPlayer.jsx`.
4. Connect the exported `timeline_graph.json` to the React Flow state.

### Step 5: End-to-End Verification
1. Ensure dragging and zooming on the React Flow canvas works without latency.
2. Clicking a node opens the inspector, showing its real-time stats and playing its corresponding timeline clip.
3. Confirm that selecting a node without an explicit video falls back gracefully to a tactical telemetry animation.

---

## 8. Verification & Success Criteria

| Milestone | Acceptance Condition |
| :--- | :--- |
| **Data Integrity** | $100\%$ of generated nodes strictly adhere to the `TimelineNode` Pydantic model with no missing fields. |
| **Graph Topology** | Graph is a valid DAG (Directed Acyclic Graph) with zero orphaned nodes or circular loops. |
| **State Consistency** | Pym particles decrement on temporal hops; deceased operatives cannot participate in subsequent downstream actions. |
| **Video Playback** | Clicking a divergence node successfully plays a looping `.mp4` clip inside the Stark HUD inspector. |
| **Interactive Canvas** | React Flow canvas boots without errors, renders nodes cleanly, and updates the inspector sidebar on click. |