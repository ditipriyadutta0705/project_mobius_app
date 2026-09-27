"""Serializes NetworkX timeline graph into React Flow compatible JSON with positions and theme colors."""

from typing import Dict, List, Any, Optional
import networkx as nx
from .state_models import TimelineNode, TimelineGraphExport


def get_node_theme(node: TimelineNode) -> Dict[str, str]:
    """Returns visual color classification based on timeline state."""
    if node.terminal_verdict == "THANOS_DOUBLE_SNAP":
        return {
            "type": "crimson",
            "border": "#ef4444",
            "bg": "rgba(239, 68, 68, 0.15)",
            "glow": "0 0 15px rgba(239, 68, 68, 0.5)",
            "badge": "THANOS VICTORY",
        }
    elif node.terminal_verdict == "TVA_RESET":
        return {
            "type": "purple",
            "border": "#c084fc",
            "bg": "rgba(192, 132, 252, 0.15)",
            "glow": "0 0 15px rgba(192, 132, 252, 0.5)",
            "badge": "TVA RESET",
        }
    elif node.terminal_verdict in ("PRIME_VICTORY", "PYRRHIC_VICTORY"):
        return {
            "type": "cyan",
            "border": "#00f0ff",
            "bg": "rgba(0, 240, 255, 0.15)",
            "glow": "0 0 15px rgba(0, 240, 255, 0.5)",
            "badge": node.terminal_verdict.replace("_", " "),
        }
    elif node.terminal_verdict == "TIMELINE_STRANDED":
        return {
            "type": "amber",
            "border": "#f59e0b",
            "bg": "rgba(245, 158, 11, 0.15)",
            "glow": "0 0 15px rgba(245, 158, 11, 0.5)",
            "badge": "STRANDED",
        }
    elif node.depth <= 1:
        return {
            "type": "cyan",
            "border": "#00f0ff",
            "bg": "rgba(0, 240, 255, 0.12)",
            "glow": "0 0 12px rgba(0, 240, 255, 0.4)",
            "badge": "CANONICAL ANCHOR" if node.depth == 1 else "QUANTUM INSERTION",
        }
    else:
        return {
            "type": "amber",
            "border": "#f59e0b",
            "bg": "rgba(245, 158, 11, 0.12)",
            "glow": "0 0 12px rgba(245, 158, 11, 0.4)",
            "badge": "DIVERGENCE BRANCH",
        }


def get_node_storyboard(node: TimelineNode) -> Optional[str]:
    """Matches nodes to their authentic hand-drawn cinematic concept storyboard sketch.
    Returns None for intermediate tactical nodes so they stay sleek Stark HUD cards."""
    nid = node.node_id.upper()
    title = node.title.upper()
    trigger = (node.divergence_trigger or "").upper()
    summary = node.narrative_summary.upper()
    depth = node.depth

    # Vormir Divergence 1: Clint Sacrifices Himself (Hawkeye Dies)
    if "BARTON" in nid or ("HAWKEYE" in title and "SACRIFICE" in title):
        return "/storyboards/vormir_clint_sacrifice.jpg"

    # Vormir Divergence 2: Both Die (Dual Precipice Plunge)
    if "DUAL" in nid or "BOTH" in trigger or "PITON" in trigger or "MUTUAL" in title:
        return "/storyboards/vormir_dual_fall.jpg"

    # Vormir Divergence 3: Natasha Sacrifices Herself (Canonical)
    if "NATASHA" in nid or ("WIDOW" in title and "SACRIFICE" in title) or nid == "ANCHOR_VORMIR_2014":
        return "/storyboards/vormir_2014.jpg"

    # New York Divergence 1: Hydra Elevator Brawl
    if "ELEVATOR" in nid or "ELEVATOR" in trigger or "HYDRA" in title or "RUMBLOW" in summary:
        return "/storyboards/ny_elevator_brawl.jpg"

    # New York Divergence 2: Ancient One Astral Eviction
    if "ANCIENT" in nid or "ASTRAL" in nid or "SANCTUM" in trigger or "ASTRAL" in title:
        return "/storyboards/ny_ancient_one_astral.jpg"

    # New York Divergence 3: Tesseract Drop & Loki Escapes
    if "TESSERACT" in nid or "BRIEFCASE" in trigger or nid == "ANCHOR_NY_2012":
        return "/storyboards/ny_2012.jpg"

    # Asgard Divergence: Aether Syringe & Royal Guards Chase
    if "ASGARD" in nid and (depth <= 2 or "EXTRACTION" in nid or "ROYAL" in nid):
        return "/storyboards/asgard_2013.jpg"

    # Morag Divergence: Nebula Cybernetic Memory Sync
    if "MORAG" in nid and (depth <= 2 or "NEBULA" in nid or "SYNC" in trigger):
        return "/storyboards/morag_2014.jpg"

    # Compound 2023 Climax & Root Insertion
    if nid == "ROOT_AVENGERS_FACILITY_2023" or "COMPOUND" in title or ("THANOS" in title and "CLIMAX" in title):
        return "/storyboards/compound_2023.jpg"

    # Intermediate tactical nodes stay clean and sleek without fake vectors
    return None


def export_timeline_graph(graph: nx.DiGraph) -> TimelineGraphExport:
    """Calculates hierarchical layout coordinates and exports graph to React Flow format."""
    depth_buckets: Dict[int, List[str]] = {}
    for node_id in graph.nodes():
        node_data: TimelineNode = graph.nodes[node_id]["data"]
        d = node_data.depth
        depth_buckets.setdefault(d, []).append(node_id)

    react_nodes = []
    x_gap = 480
    y_gap = 270

    for depth, node_ids in sorted(depth_buckets.items()):
        total_in_depth = len(node_ids)
        y_start = -((total_in_depth - 1) * y_gap) / 2

        for idx, node_id in enumerate(node_ids):
            node_data: TimelineNode = graph.nodes[node_id]["data"]
            theme = get_node_theme(node_data)
            node_data.storyboard_url = get_node_storyboard(node_data)
            
            x_pos = 100 + (depth * x_gap)
            y_pos = 350 + y_start + (idx * y_gap)

            react_nodes.append({
                "id": node_id,
                "type": "mobiusNode",
                "position": {"x": x_pos, "y": y_pos},
                "data": {
                    **node_data.model_dump(),
                    "theme": theme,
                }
            })

    # Export edges
    react_edges = []
    edge_idx = 0
    for u, v, edata in graph.edges(data=True):
        source_data: TimelineNode = graph.nodes[u]["data"]
        target_data: TimelineNode = graph.nodes[v]["data"]
        target_theme = get_node_theme(target_data)

        react_edges.append({
            "id": f"e-{u}-{v}-{edge_idx}",
            "source": u,
            "target": v,
            "animated": True,
            "label": edata.get("action", ""),
            "style": {
                "stroke": target_theme["border"],
                "strokeWidth": 2,
            },
        })
        edge_idx += 1

    # Calculate summary metrics
    total_nodes = len(react_nodes)
    terminals = [n["data"] for n in react_nodes if n["data"].get("is_terminal")]
    prime_wins = sum(1 for t in terminals if t.get("terminal_verdict") == "PRIME_VICTORY")
    pyrrhic_wins = sum(1 for t in terminals if t.get("terminal_verdict") == "PYRRHIC_VICTORY")
    thanos_snaps = sum(1 for t in terminals if t.get("terminal_verdict") == "THANOS_DOUBLE_SNAP")
    tva_resets = sum(1 for t in terminals if t.get("terminal_verdict") == "TVA_RESET")
    stranded = sum(1 for t in terminals if t.get("terminal_verdict") == "TIMELINE_STRANDED")

    avg_entropy = sum(n["data"]["tva_entropy_index"] for n in react_nodes) / max(1, total_nodes)
    avg_thanos = sum(n["data"]["thanos_awareness"] for n in react_nodes) / max(1, total_nodes)
    overall_win_rate = ((prime_wins * 1.0 + pyrrhic_wins * 0.5) / max(1, len(terminals))) * 100

    summary_stats = {
        "total_nodes": total_nodes,
        "total_terminals": len(terminals),
        "prime_victories": prime_wins,
        "pyrrhic_victories": pyrrhic_wins,
        "thanos_snaps": thanos_snaps,
        "tva_resets": tva_resets,
        "stranded_count": stranded,
        "overall_win_rate": round(overall_win_rate, 1),
        "average_entropy": round(avg_entropy, 1),
        "average_thanos_awareness": round(avg_thanos * 100, 1),
    }

    return TimelineGraphExport(
        nodes=react_nodes,
        edges=react_edges,
        summary_statistics=summary_stats,
    )

