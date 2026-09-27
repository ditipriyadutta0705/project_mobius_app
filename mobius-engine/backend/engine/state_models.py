"""State models and data contracts for Project Mobius."""

from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field


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
    stones_secured: Dict[str, bool] = Field(
        default_factory=lambda: {
            "Space": False,
            "Mind": False,
            "Reality": False,
            "Power": False,
            "Time": False,
            "Soul": False,
        }
    )

    # Dynamic Meters
    thanos_awareness: float = Field(0.0, ge=0.0, le=1.0)
    tva_entropy_index: float = Field(0.0, ge=0.0, le=100.0)

    # Roster
    characters: Dict[str, CharacterStatus] = Field(default_factory=dict)

    # Visual & Video Pipeline
    cinematic_prompt: Optional[str] = Field(
        None,
        description="Cinematic text-to-video prompt formatted with camera movement and lighting.",
    )
    video_clip_url: Optional[str] = Field(
        None,
        description="Path or URL to rendered .mp4 timeline clip.",
    )
    video_status: Literal["none", "queued", "generating", "ready", "failed"] = "none"
    storyboard_url: Optional[str] = Field(
        None,
        description="Path or URL to storyboard concept sketch.",
    )

    # Search & Evaluation Metrics
    visit_count: int = 0
    total_value: float = 0.0
    victory_probability: float = 0.0
    is_terminal: bool = False
    terminal_verdict: Optional[
        Literal[
            "PRIME_VICTORY",
            "PYRRHIC_VICTORY",
            "THANOS_DOUBLE_SNAP",
            "TVA_RESET",
            "TIMELINE_STRANDED",
        ]
    ] = None

    def clone_child(
        self,
        new_id: str,
        title: str,
        narrative_summary: str,
        divergence_trigger: Optional[str] = None,
        particles_cost: int = 0,
    ) -> "TimelineNode":
        """Generate a child node inheriting state with resource decrement."""
        new_particles = max(0, self.pym_particles_remaining - particles_cost)
        new_stones = dict(self.stones_secured)
        new_characters = {k: v.model_copy() for k, v in self.characters.items()}
        return TimelineNode(
            node_id=new_id,
            parent_id=self.node_id,
            depth=self.depth + 1,
            title=title,
            narrative_summary=narrative_summary,
            divergence_trigger=divergence_trigger,
            pym_particles_remaining=new_particles,
            stones_secured=new_stones,
            thanos_awareness=self.thanos_awareness,
            tva_entropy_index=self.tva_entropy_index,
            characters=new_characters,
        )

    def evaluate_terminal(self) -> None:
        """Evaluate deterministic terminal state and verdicts."""
        if self.tva_entropy_index >= 85.0:
            self.is_terminal = True
            self.terminal_verdict = "TVA_RESET"
            self.victory_probability = 0.0
            return

        if self.pym_particles_remaining == 0 and sum(self.stones_secured.values()) < 6:
            self.is_terminal = True
            self.terminal_verdict = "TIMELINE_STRANDED"
            self.victory_probability = 0.05
            return

        if self.thanos_awareness >= 0.95 and self.depth >= 4:
            if sum(self.stones_secured.values()) < 6:
                self.is_terminal = True
                self.terminal_verdict = "THANOS_DOUBLE_SNAP"
                self.victory_probability = 0.0
                return

        # Check full victory condition if depth reaches compound or all stones gathered
        if sum(self.stones_secured.values()) == 6:
            deceased_count = sum(
                1 for c in self.characters.values() if c.status == "Deceased"
            )
            self.is_terminal = True
            if deceased_count > 2 or self.thanos_awareness > 0.70:
                self.terminal_verdict = "PYRRHIC_VICTORY"
                self.victory_probability = 0.50
            else:
                self.terminal_verdict = "PRIME_VICTORY"
                self.victory_probability = 0.95


class TimelineGraphExport(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]
    summary_statistics: Dict

