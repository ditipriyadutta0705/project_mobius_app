"""Main CLI and API entrypoint for Project Mobius."""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).parent))

from engine.state_models import TimelineNode
from engine.agents import MobiusAgents
from engine.anchors import get_root_node
from engine.search_bfs import BFSTacticalSearch
from engine.search_mcts import MCTSSimulator
from engine.video_agent import VideoAgent
from engine.graph_exporter import export_timeline_graph


def run_simulation(
    depth: int = 4,
    mcts_iterations: int = 15,
    render_videos: bool = True,
    output_path: Optional[str] = None,
    clips_dir: Optional[str] = None,
):
    """Executes the dual-search simulation pipeline and outputs serialized graph."""
    base_dir = Path(__file__).resolve().parent.parent
    if output_path is None:
        output_path = str(base_dir / "backend" / "data" / "timeline_graph.json")
    if clips_dir is None:
        clips_dir = str(base_dir / "frontend" / "public" / "clips")

    print("=" * 65)
    print(" PROJECT MOBIUS: TEMPORAL INCURSION & PROBABILITY ENGINE")
    print("=" * 65)
    print(f"[*] Search Parameters: Max Depth={depth} | MCTS Iterations/Leaf={mcts_iterations}")
    print(f"[*] Render Looped Clips: {render_videos}")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    os.makedirs(clips_dir, exist_ok=True)

    agents = MobiusAgents()
    video_agent = VideoAgent(output_dir=clips_dir)

    print("\n[+] Phase 1: Executing Exhaustive BFS Tactical Anchor Sweep (Depths 0-2)...")
    bfs = BFSTacticalSearch(agents=agents)
    graph = bfs.build_tactical_graph()
    print(f"    -> Generated {len(graph.nodes)} tactical baseline & micro-failure nodes.")

    if depth > 2:
        print(f"\n[+] Phase 2: Executing MCTS Deep Rollouts (Depths 3 to {depth})...")
        mcts = MCTSSimulator(agents=agents)
        graph = mcts.run_mcts(graph, max_depth=depth, iterations_per_leaf=mcts_iterations)
        print(f"    -> Graph expanded to {len(graph.nodes)} total nodes across multiverse branches.")

    print("\n[+] Phase 3: Synthesizing Cinematic Prompts & Looped Video Feeds...")
    rendered_count = 0
    for node_id in graph.nodes():
        node_data: TimelineNode = graph.nodes[node_id]["data"]
        node_data.cinematic_prompt = video_agent.generate_cinematic_prompt(node_data)

        should_render = (
            render_videos and (
                node_data.is_terminal
                or node_data.depth <= 2
                or "REC" in node_id
                or "ADV" in node_id
            )
        )

        if should_render:
            try:
                clip_url = video_agent.render_hud_clip(node_data)
                node_data.video_clip_url = clip_url
                node_data.video_status = "ready"
                rendered_count += 1
            except Exception as e:
                print(f"    [!] Error rendering clip for {node_id}: {e}")
                node_data.video_status = "failed"

    print(f"    -> Synthesized {rendered_count} tactical H.264 .mp4 video clips in {clips_dir}")

    print(f"\n[+] Phase 4: Serializing graph payload for React Flow...")
    exported_data = export_timeline_graph(graph)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(exported_data.model_dump(), f, indent=2)

    frontend_data_dir = str(base_dir / "frontend" / "src" / "data")
    os.makedirs(frontend_data_dir, exist_ok=True)
    with open(os.path.join(frontend_data_dir, "timeline_graph.json"), "w", encoding="utf-8") as f:
        json.dump(exported_data.model_dump(), f, indent=2)

    print(f"    -> Exported graph saved to: {output_path}")
    print("\n" + "=" * 65)
    print(" SIMULATION SUMMARY:")
    stats = exported_data.summary_statistics
    print(f"  • Total Multiverse Nodes:    {stats['total_nodes']}")
    print(f"  • Terminal Realities:        {stats['total_terminals']}")
    print(f"  • Prime Victories:           {stats['prime_victories']}")
    print(f"  • Pyrrhic Victories:         {stats['pyrrhic_victories']}")
    print(f"  • Thanos Double Snaps:       {stats['thanos_snaps']}")
    print(f"  • TVA Timeline Resets:       {stats['tva_resets']}")
    print(f"  • Operatives Stranded:       {stats['stranded_count']}")
    print(f"  • Overall Victory Rate:      {stats['overall_win_rate']}%")
    print(f"  • Average TVA Entropy:       {stats['average_entropy']}")
    print(f"  • Average Thanos Awareness:  {stats['average_thanos_awareness']}%")
    print("=" * 65 + "\n")
    return exported_data


def start_server(host: str = "127.0.0.1", port: int = 8000):
    """Launches FastAPI backend server to serve graph data and clips."""
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    import uvicorn

    app = FastAPI(title="Project Mobius API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    data_file = Path("mobius-engine/backend/data/timeline_graph.json")
    clips_path = Path("mobius-engine/frontend/public/clips")

    if clips_path.exists():
        app.mount("/clips", StaticFiles(directory=str(clips_path)), name="clips")

    @app.get("/api/graph")
    def get_graph():
        if data_file.exists():
            with open(data_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"error": "Graph not yet simulated. Run simulation first."}

    print(f"Starting Project Mobius API Server on http://{host}:{port}")
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Project Mobius: Agentic Multiverse Time Heist Simulator")
    parser.add_argument("--depth", type=int, default=4, help="Maximum search tree depth (default: 4)")
    parser.add_argument("--mcts-iterations", type=int, default=15, help="Playout iterations per leaf (default: 15)")
    parser.add_argument("--render-videos", action="store_true", default=True, help="Render synthetic video clips")
    parser.add_argument("--no-videos", action="store_false", dest="render_videos", help="Skip rendering video clips")
    parser.add_argument("--serve", action="store_true", help="Launch FastAPI server")
    parser.add_argument("--port", type=int, default=8000, help="Port for API server")
    args = parser.parse_args()

    if args.serve:
        start_server(port=args.port)
    else:
        run_simulation(
            depth=args.depth,
            mcts_iterations=args.mcts_iterations,
            render_videos=args.render_videos,
        )
