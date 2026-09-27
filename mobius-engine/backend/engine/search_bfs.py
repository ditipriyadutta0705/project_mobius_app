"""Breadth-First Search (BFS) tactical explorer across Depths 0, 1, and 2."""

from collections import deque
from typing import Dict, List, Tuple
import networkx as nx

from .state_models import TimelineNode, CharacterStatus
from .anchors import get_root_node, get_layer0_anchors, BFS_TACTICAL_SEEDS
from .agents import MobiusAgents


class BFSTacticalSearch:
    """Deterministically explores immediate tactical micro-failures across all anchors."""

    def __init__(self, agents: MobiusAgents):
        self.agents = agents
        self.graph = nx.DiGraph()

    def build_tactical_graph(self) -> nx.DiGraph:
        """Executes exhaustive BFS up to Depth 2 starting from the 2023 Quantum Tunnel."""
        self.graph.clear()
        
        # Depth 0: Root
        root = get_root_node()
        self.graph.add_node(root.node_id, data=root)

        # Depth 1: Four canonical mission theaters
        anchors = get_layer0_anchors()
        for anchor in anchors:
            self.graph.add_node(anchor.node_id, data=anchor)
            self.graph.add_edge(root.node_id, anchor.node_id, action="Quantum Temporal Insertion")

            # Depth 2: Exhaustive micro-failures for each anchor
            seeds = BFS_TACTICAL_SEEDS.get(anchor.node_id, [])
            for seed in seeds:
                child_id = seed["id"]
                child_title = seed["title"]
                child_narrative = seed["narrative"]
                child_trigger = seed["divergence_trigger"]
                
                # Clone state from anchor
                child_node = anchor.clone_child(
                    new_id=child_id,
                    title=child_title,
                    narrative_summary=child_narrative,
                    divergence_trigger=child_trigger,
                    particles_cost=seed.get("particles_cost", 0),
                )
                
                # Apply deltas
                child_node.thanos_awareness = min(1.0, child_node.thanos_awareness + seed.get("thanos_awareness_delta", 0.0))
                child_node.tva_entropy_index = min(100.0, child_node.tva_entropy_index + seed.get("tva_entropy_delta", 0.0))
                
                # Stone status
                for stone_name, status in seed.get("stone_effect", {}).items():
                    child_node.stones_secured[stone_name] = status

                # Character status update
                char_name = seed.get("affected_character")
                char_status = seed.get("character_status")
                if char_name and char_status and char_name in child_node.characters:
                    child_node.characters[char_name] = CharacterStatus(
                        name=char_name,
                        status=char_status,
                        location=anchor.title
                    )

                child_node.evaluate_terminal()

                # Add to graph
                self.graph.add_node(child_node.node_id, data=child_node)
                self.graph.add_edge(anchor.node_id, child_node.node_id, action=child_trigger)

        return self.graph

