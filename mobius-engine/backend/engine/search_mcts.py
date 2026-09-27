"""Monte Carlo Tree Search (MCTS) engine for deep narrative rollouts (Depths 3-6)."""

import math
import random
from typing import Dict, List, Optional, Tuple
import networkx as nx

from .state_models import TimelineNode, CharacterStatus
from .agents import MobiusAgents


class MCTSSimulator:
    """Simulates adversarial timeline branches and resolves compound showdowns via MCTS."""

    def __init__(self, agents: MobiusAgents, exploration_c: float = 1.414):
        self.agents = agents
        self.c = exploration_c

    def run_mcts(
        self,
        graph: nx.DiGraph,
        max_depth: int = 5,
        iterations_per_leaf: int = 15,
    ) -> nx.DiGraph:
        """Expands tactical leaves from Depth 2 up to max_depth using MCTS."""
        frontier = [
            n for n in graph.nodes()
            if graph.nodes[n]["data"].depth == 2 and not graph.nodes[n]["data"].is_terminal
        ]

        for leaf_id in frontier:
            for _ in range(iterations_per_leaf):
                selected_node_id = self._select_and_expand(graph, leaf_id, max_depth)
                selected_node = graph.nodes[selected_node_id]["data"]

                victory_score, final_entropy = self._simulate_playout(selected_node, max_depth)
                self._backpropagate(graph, selected_node_id, victory_score)

        return graph

    def _select_and_expand(self, graph: nx.DiGraph, start_node_id: str, max_depth: int) -> str:
        """UCT selection to find a leaf, then expands it if depth permits."""
        current_id = start_node_id

        while True:
            current_data: TimelineNode = graph.nodes[current_id]["data"]
            if current_data.is_terminal or current_data.depth >= max_depth:
                return current_id

            children = list(graph.successors(current_id))
            if not children:
                return self._expand_node(graph, current_id, max_depth)

            unvisited = [c for c in children if graph.nodes[c]["data"].visit_count == 0]
            if unvisited:
                return random.choice(unvisited)

            total_visits = current_data.visit_count + 1
            best_score = -float("inf")
            best_child = children[0]

            for child_id in children:
                child_data: TimelineNode = graph.nodes[child_id]["data"]
                mean_val = (child_data.total_value / child_data.visit_count) if child_data.visit_count > 0 else 0.5
                uct = mean_val + self.c * math.sqrt(math.log(total_visits) / (child_data.visit_count + 1e-5))
                if uct > best_score:
                    best_score = uct
                    best_child = child_id

            current_id = best_child

    def _expand_node(self, graph: nx.DiGraph, parent_id: str, max_depth: int = 5) -> str:
        """Creates next narrative node: Recovery Agent -> Adversary Agent -> Compound Showdown."""
        parent_node: TimelineNode = graph.nodes[parent_id]["data"]
        next_depth = parent_node.depth + 1

        if next_depth == 3:
            recovery_plan = self.agents.plan_tactical_recovery(parent_node)
            child_id = f"{parent_id}_REC"
            child_node = parent_node.clone_child(
                new_id=child_id,
                title=recovery_plan["title"],
                narrative_summary=recovery_plan["narrative"],
                divergence_trigger=recovery_plan["action_name"],
                particles_cost=recovery_plan["particles_cost"],
            )
            child_node.pym_particles_remaining += recovery_plan.get("particles_gained", 0)
            child_node.thanos_awareness = min(1.0, child_node.thanos_awareness + recovery_plan["thanos_awareness_delta"])
            child_node.tva_entropy_index = min(100.0, child_node.tva_entropy_index + recovery_plan["tva_entropy_delta"])
            for stone, secured in recovery_plan["stones_secured"].items():
                child_node.stones_secured[stone] = secured
            if recovery_plan["recovers_character"] and recovery_plan["recovers_character"] in child_node.characters:
                child_node.characters[recovery_plan["recovers_character"]].status = "Active"

        elif next_depth == 4:
            counter_plan = self.agents.plan_adversary_counter(parent_node)
            child_id = f"{parent_id}_ADV"
            child_node = parent_node.clone_child(
                new_id=child_id,
                title=counter_plan["title"],
                narrative_summary=counter_plan["narrative"],
                divergence_trigger=f"Counter: {counter_plan['adversary_name']}",
                particles_cost=counter_plan["particles_loss"],
            )
            child_node.thanos_awareness = min(1.0, child_node.thanos_awareness + counter_plan["thanos_awareness_delta"])
            child_node.tva_entropy_index = min(100.0, child_node.tva_entropy_index + counter_plan["tva_entropy_delta"])

        else:
            child_id = f"{parent_id}_FIN"
            child_node = parent_node.clone_child(
                new_id=child_id,
                title="Climactic Compound Confrontation",
                narrative_summary="The assembled forces converge at the 2023 Avengers Compound for the decisive Nano-Gauntlet activation.",
                divergence_trigger="Compound Quantum Convergence",
                particles_cost=0,
            )
            self._resolve_terminal_showdown(child_node)

        if next_depth >= max_depth:
            self._resolve_terminal_showdown(child_node)
        else:
            child_node.evaluate_terminal()

        graph.add_node(child_node.node_id, data=child_node)
        graph.add_edge(parent_id, child_node.node_id, action=child_node.divergence_trigger or "Progression")
        return child_node.node_id

    def _resolve_terminal_showdown(self, node: TimelineNode):
        """Resolves compound battle outcomes based on secured stones, awareness, and specific branch history."""
        pid = node.node_id.upper()

        if node.tva_entropy_index >= 85.0:
            node.is_terminal = True
            node.terminal_verdict = "TVA_RESET"
            node.title = "Terminal: TVA Temporal Reset"
            node.narrative_summary = (
                "The timeline exceeded the red line threshold of 85.0 variance entropy. "
                "TVA Minutemen detonate Chrono Reset charges, disintegrating the branch timeline from history."
            )
            node.victory_probability = 0.0
            return

        # Dual death on Vormir or Red Skull rejection: Soul Stone never acquired!
        if ("DUAL" in pid or "RED_SKULL" in pid) and not node.stones_secured.get("Soul"):
            node.is_terminal = True
            node.terminal_verdict = "THANOS_DOUBLE_SNAP"
            node.title = "Terminal: Incomplete Gauntlet Overrun (Both Lost on Vormir)"
            node.narrative_summary = (
                "With both Clint and Natasha lost in the Vormir cosmic abyss, the Avengers have zero Soul Stone. "
                "The Nano Gauntlet cannot be forged. Sanctuary II annihilates the compound defenses; 2014 Thanos claims the remaining stones "
                "and shreds the universe down to its last atom to birth a new reality."
            )
            node.victory_probability = 0.0
            return

        if node.pym_particles_remaining <= 0 and sum(node.stones_secured.values()) < 4:
            node.is_terminal = True
            node.terminal_verdict = "TIMELINE_STRANDED"
            node.title = "Terminal: Operatives Chronally Stranded"
            node.narrative_summary = (
                "With zero Pym particles remaining and essential stones lost, the Avengers are permanently "
                "stranded across disparate historical epochs without a way home."
            )
            node.victory_probability = 0.05
            return

        # Clint died on Vormir -> Natasha survived and leads Compound defense
        if "BARTON" in pid:
            node.is_terminal = True
            node.terminal_verdict = "PRIME_VICTORY"
            node.title = "Terminal: Natasha's Bittersweet Victory (Clint Fallen)"
            node.narrative_summary = (
                "Natasha Romanoff coordinates the compound perimeter defense, personally delivering the Nano Gauntlet to Iron Man. "
                "Tony Stark performs the sacrifice snap, disintegrating Thanos's armada. The universe is saved, but Clint's family returns "
                "to an empty farm—honoring Hawkeye's ultimate sacrifice."
            )
            node.victory_probability = 0.90
            return

        if node.thanos_awareness >= 0.70:
            if node.stones_secured.get("Power") and node.stones_secured.get("Space") and node.pym_particles_remaining > 0:
                node.is_terminal = True
                node.terminal_verdict = "PYRRHIC_VICTORY"
                node.title = "Terminal: Pyrrhic Stark Snap"
                node.narrative_summary = (
                    "Thanos's flagship devastates the Compound. Tony Stark wrests the stones into his armor and snaps, "
                    "dusting Thanos's armada at the cost of his life and heavy Avengers casualties."
                )
                node.victory_probability = 0.65
            else:
                node.is_terminal = True
                node.terminal_verdict = "THANOS_DOUBLE_SNAP"
                node.title = "Terminal: Thanos Double Snap"
                node.narrative_summary = (
                    "2014 Thanos overruns the ruined Compound, recovers the Infinity Stones, "
                    "and shreds this universe down to its last atom to create a grateful new reality."
                )
                node.victory_probability = 0.0
        else:
            node.is_terminal = True
            node.terminal_verdict = "PRIME_VICTORY"
            node.title = "Terminal: Prime Timeline Victory"
            node.narrative_summary = (
                "The Avengers assemble the Nano-Gauntlet. Bruce Banner performs the Blip Snap, restoring the fallen. "
                "Past Thanos is repelled with minimal collateral damage and timeline integrity is preserved."
            )
            node.victory_probability = 0.95

    def _simulate_playout(self, node: TimelineNode, max_depth: int) -> Tuple[float, float]:
        """Runs fast-forward simulation rollout from node to terminal state."""
        current_particles = node.pym_particles_remaining
        current_thanos = node.thanos_awareness
        current_entropy = node.tva_entropy_index
        secured_stones = sum(node.stones_secured.values())

        if node.is_terminal:
            if node.terminal_verdict == "PRIME_VICTORY":
                return 1.0, current_entropy
            elif node.terminal_verdict == "PYRRHIC_VICTORY":
                return 0.5, current_entropy
            elif node.terminal_verdict == "TIMELINE_STRANDED":
                return 0.05, current_entropy
            else:
                return 0.0, current_entropy

        steps_remaining = max(1, max_depth - node.depth)
        for _ in range(steps_remaining):
            current_thanos = min(1.0, current_thanos + random.uniform(0.05, 0.20))
            current_entropy = min(100.0, current_entropy + random.uniform(5.0, 15.0))
            if current_particles > 0 and random.random() < 0.4:
                current_particles -= 1
                secured_stones = min(6, secured_stones + 1)

            if current_entropy >= 85.0:
                return 0.0, current_entropy
            if current_particles == 0 and secured_stones < 4:
                return 0.05, current_entropy

        if current_thanos > 0.75:
            return 0.0 if secured_stones < 5 else 0.5, current_entropy
        else:
            return 1.0 if secured_stones >= 4 else 0.5, current_entropy

    def _backpropagate(self, graph: nx.DiGraph, start_node_id: str, victory_score: float):
        """Propagates score up the DAG path to the root."""
        curr = start_node_id
        while curr:
            node_data: TimelineNode = graph.nodes[curr]["data"]
            node_data.visit_count += 1
            node_data.total_value += victory_score
            node_data.victory_probability = round(node_data.total_value / node_data.visit_count, 3)
            curr = node_data.parent_id
