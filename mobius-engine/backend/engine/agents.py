"""Multi-agent intelligence layer for Project Mobius."""

import os
import random
from typing import Dict, Any, Optional
from .state_models import TimelineNode

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


class MobiusAgents:
    """Orchestrates multi-agent narrative generation."""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.client = None
        if GENAI_AVAILABLE and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception:
                self.client = None

    def plan_tactical_recovery(self, parent: TimelineNode) -> Dict[str, Any]:
        """Recovery Agent: Devises specific counter-plans reflecting true divergent realities."""
        trigger = parent.divergence_trigger or ""
        pid = parent.node_id.upper()
        particles = parent.pym_particles_remaining

        # Vormir Scenario 1: Clint Sacrifices Himself (Natasha Survives)
        if "BARTON" in pid or "HAWKEYE" in trigger.upper():
            return {
                "action_name": "Black Widow Solitary Soul Stone Return",
                "title": "Natasha Awakens in Vormir Basin (Clint Sacrificed)",
                "narrative": (
                    "Natasha Romanoff awakens face-up in the flooded basin beneath the cosmic eclipse, clutching the glowing orange Soul Stone. "
                    "Shattered by Clint Barton's lethal plunge to save her life, Natasha straps his quiver to her shoulder, activates her quantum GPS, "
                    "and returns to 2023 alone. She confronts Tony and Steve: 'Clint died so we could have this stone. We don't lose today.'"
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Soul": True},
                "thanos_awareness_delta": 0.05,
                "tva_entropy_delta": 10.0,
                "recovers_character": "Natasha Romanoff",
            }

        # Vormir Scenario 2: Natasha Sacrifices Herself (Clint Survives)
        if "NATASHA" in pid or "NATASHA" in trigger.upper() or "WIDOW" in trigger.upper():
            return {
                "action_name": "Hawkeye Solitary Soul Stone Return",
                "title": "Clint Awakens in Vormir Basin (Natasha Sacrificed)",
                "narrative": (
                    "Clint Barton awakens in the shallow pool beneath the golden eclipse, clutching the Soul Stone. "
                    "Overwhelmed with grief after failing to prevent Natasha's fatal leap, Clint leaps back to the 2023 Compound alone, "
                    "delivering the fifth stone to Tony Stark and Bruce Banner for the Nano Gauntlet."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Soul": True},
                "thanos_awareness_delta": 0.05,
                "tva_entropy_delta": 10.0,
                "recovers_character": "Clint Barton",
            }

        # Vormir Scenario 3: Both Die (Dual Precipice Plunge)
        if "DUAL" in pid or "BOTH" in trigger.upper() or "PITON" in trigger.upper():
            return {
                "action_name": "Quantum Pad Silence: Both Operatives Lost",
                "title": "Catastrophic Double Loss on Vormir",
                "narrative": (
                    "The 2023 Quantum Tunnel counts down to zero. The platform flashes with chronal energy—but emerges completely empty. "
                    "Both Clint Barton and Natasha Romanoff perished in the Vormir cosmic abyss when their anchor cable snapped. "
                    "The Soul Stone rests unclaimed on the desolate planet. The Avengers are down two founders with no Soul Stone to forge the Gauntlet."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Soul": False},
                "thanos_awareness_delta": 0.15,
                "tva_entropy_delta": 45.0,
                "recovers_character": None,
            }

        # Vormir Scenario 4: Red Skull Rejection
        if "RED_SKULL" in pid or "REJECTION" in trigger.upper():
            return {
                "action_name": "Emergency Vormir Abort & Quantum Retreat",
                "title": "Vormir Cosmic Rejection Abort",
                "narrative": (
                    "With the Stonekeeper sealing the cosmic eclipse against their tactical combat, Clint and Natasha burn their reserve Pym dose "
                    "to jump back to 2023 empty-handed. Tony Stark scrambles to analyze if alternate multiverse timelines possess an accessible Soul Stone."
                ),
                "particles_cost": 1,
                "particles_gained": 0,
                "stones_secured": {"Soul": False},
                "thanos_awareness_delta": 0.08,
                "tva_entropy_delta": 25.0,
                "recovers_character": None,
            }

        # New York: Tesseract Briefcase Drop
        if "TESSERACT" in pid or "BRIEFCASE" in trigger.upper() or "TESSERACT" in trigger.upper():
            if particles >= 2:
                return {
                    "action_name": "1970 Camp Lehigh Temporal Leap",
                    "title": "Camp Lehigh 1970 Infiltration",
                    "narrative": (
                        "Tony Stark and Steve Rogers burn 2 Pym particles to execute an emergency temporal leap "
                        "to the S.H.I.E.L.D. bunker in Camp Lehigh, New Jersey (April 7, 1970) to acquire both "
                        "the earlier Tesseract and Hank Pym's reserve particle vials."
                    ),
                    "particles_cost": 2,
                    "particles_gained": 4,
                    "stones_secured": {"Space": True},
                    "thanos_awareness_delta": 0.05,
                    "tva_entropy_delta": 15.0,
                    "recovers_character": None,
                }
            else:
                return {
                    "action_name": "Desperate Stark Tower Melee",
                    "title": "Lobby Security Firefight",
                    "narrative": (
                        "With insufficient Pym particles to jump to 1970, Tony Stark deploys micro-repulsors into the "
                        "Stark Tower lobby to intercept Loki before the trickster teleports with the Tesseract."
                    ),
                    "particles_cost": 0,
                    "particles_gained": 0,
                    "stones_secured": {"Space": False},
                    "thanos_awareness_delta": 0.10,
                    "tva_entropy_delta": 25.0,
                    "recovers_character": None,
                }

        # New York: Elevator Bluff Fail
        if "ELEVATOR" in pid or "ELEVATOR" in trigger.upper():
            return {
                "action_name": "Glass Elevator Breach & Parachute Descent",
                "title": "Elevator Melee Victory & Scepter Extraction",
                "narrative": (
                    "Surrounded in the glass elevator, Steve Rogers magnetic-releases his shield to batter Rumlow's STRIKE team, "
                    "shatters the exterior glass pane, and free-falls into the Stark Tower atrium fountain with the Chitauri Mind Scepter in hand."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Mind": True},
                "thanos_awareness_delta": 0.03,
                "tva_entropy_delta": 14.0,
                "recovers_character": "Steve Rogers",
            }

        # New York: Ancient One Astral Eviction
        if "ANCIENT_ONE" in pid or "ASTRAL" in trigger.upper() or "SANCTUM" in trigger.upper():
            return {
                "action_name": "Astral Negotiation on Sanctum Roof",
                "title": "Ancient One Surrenders Time Stone",
                "narrative": (
                    "Floating in astral form over Greenwich Village, Bruce Banner convinces the Ancient One that Doctor Strange "
                    "surrendered the Time Stone to Thanos intentionally as part of a 14-million-to-1 endgame gamble. Realizing Strange's intent, "
                    "she returns Banner to his body and entrusts the Eye of Agamotto."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Time": True},
                "thanos_awareness_delta": 0.01,
                "tva_entropy_delta": 8.0,
                "recovers_character": "Bruce Banner",
            }

        # New York: 2012 Cap Mirror Match
        if "CAP_MIRROR" in pid or "MIRROR" in trigger.upper():
            return {
                "action_name": "Bucky Barnes Psychological Stun",
                "title": "Mirror Match Reversal & Catwalk Jump",
                "narrative": (
                    "Choked on the catwalk by 2012 Cap, 2023 Steve gasps 'Bucky is alive!' The shocking revelation stuns 2012 Cap, "
                    "allowing Steve to reverse the sleeper hold, secure the Mind Stone scepter, and leap to the lower catwalk."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Mind": True},
                "thanos_awareness_delta": 0.02,
                "tva_entropy_delta": 12.0,
                "recovers_character": "Steve Rogers",
            }

        # Asgard: Extraction Fail
        if "EXTRACTION" in pid or "AETHER" in trigger.upper():
            return {
                "action_name": "Quantum Syringe Recalibration & Thor Lightning Storm",
                "title": "Aether Extracted & Mjolnir Summoned",
                "narrative": (
                    "Rocket adjusts the syringe frequency to counteract the Reality Stone's erratic surge, drawing the dark crimson Aether "
                    "while Thor summons lightning across Valaskjalf to blind the Einherjar guards and recall Mjolnir."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Reality": True},
                "thanos_awareness_delta": 0.03,
                "tva_entropy_delta": 10.0,
                "recovers_character": "Thor Odinson",
            }

        # Asgard: Frigga Interdiction
        if "FRIGGA" in pid or "FRIGGA" in trigger.upper():
            return {
                "action_name": "Frigga's Royal Sanctuary & Blessing",
                "title": "Frigga Conceals Thor & Grants Mjolnir",
                "narrative": (
                    "Queen Frigga sees through Thor's sorrow from the future. She weaves Asgardian illusion runes to cloak Thor and Rocket "
                    "from Odin's sentinels, blessing their mission and willingly yielding Mjolnir."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Reality": True},
                "thanos_awareness_delta": 0.02,
                "tva_entropy_delta": 10.0,
                "recovers_character": "Thor Odinson",
            }

        # Morag: Nebula Sync
        if "NEBULA" in pid or "SYNC" in trigger.upper():
            return {
                "action_name": "Emergency Neural Disconnect & Power Orb Secure",
                "title": "Neural Link Severed on Morag",
                "narrative": (
                    "Rhodey uses an arc-welder to sever Nebula's corrupted temporal cybernetic receiver. They secure the Power Stone orb "
                    "and initiate emergency recall, but her memory files of the 2023 Gauntlet have already uploaded to Sanctuary II."
                ),
                "particles_cost": 1,
                "particles_gained": 0,
                "stones_secured": {"Power": True},
                "thanos_awareness_delta": 0.35,
                "tva_entropy_delta": 22.0,
                "recovers_character": "James Rhodes",
            }

        # Morag: Rhodey Down
        if "RHODEY" in pid or "KORATH" in trigger.upper():
            return {
                "action_name": "War Machine Bunker Buster Salvo",
                "title": "Korath Ambush Shattered",
                "narrative": (
                    "War Machine fires shoulder-mounted bunker busters to obliterate Korath's Sakaaran squad, "
                    "rescuing Nebula and securing the Power Orb before Ronan's fleet can arrive."
                ),
                "particles_cost": 0,
                "particles_gained": 0,
                "stones_secured": {"Power": True},
                "thanos_awareness_delta": 0.15,
                "tva_entropy_delta": 15.0,
                "recovers_character": "James Rhodes",
            }

        return {
            "action_name": "Compound Regroup & Quantum Recalibration",
            "title": "Emergency Quantum Rally",
            "narrative": (
                "The Avengers burn a contingency Pym vial to extract back to the 2023 Quantum Tunnel, "
                "scrambling tactical scanners to contain cascading timeline ruptures."
            ),
            "particles_cost": 1,
            "particles_gained": 0,
            "stones_secured": {},
            "thanos_awareness_delta": 0.05,
            "tva_entropy_delta": 12.0,
            "recovers_character": None,
        }

    def plan_adversary_counter(self, parent: TimelineNode) -> Dict[str, Any]:
        """Adversary Agent: Devises divergent counters reflecting the exact preceding branch history."""
        pid = parent.node_id.upper()
        thanos_meter = parent.thanos_awareness
        entropy = parent.tva_entropy_index

        # Counter when Clint died on Vormir (Natasha leading Gauntlet defense)
        if "BARTON" in pid:
            return {
                "adversary_name": "2014 Thanos & Black Order Incursion",
                "title": "Natasha's Compound Trench Defense (Honoring Clint)",
                "narrative": (
                    "Sanctuary II rains orbital fire onto the Avengers Compound. Driven by grief over Clint's sacrifice, "
                    "Natasha Romanoff takes the Nano Gauntlet across the flooded ruins, using Widow's bite and Clint's bow "
                    "to cut down Outriders and hold off Corvus Glaive."
                ),
                "thanos_awareness_delta": 0.20,
                "tva_entropy_delta": 15.0,
                "particles_loss": 0,
                "casualties": [],
                "stone_threat": "Soul",
            }

        # Counter when Both died on Vormir (No Soul Stone!)
        if "DUAL" in pid:
            return {
                "adversary_name": "2014 Thanos Orbital Decimation",
                "title": "Incomplete Gauntlet & Compound Massacre",
                "narrative": (
                    "Without the Soul Stone, the Avengers cannot forge the Nano Gauntlet. When Sanctuary II bombards the compound, "
                    "the Avengers are divided, demoralized by the loss of Natasha and Clint, and unable to perform the restorative snap, "
                    "facing Thanos's army in an unwinnable conventional siege."
                ),
                "thanos_awareness_delta": 0.40,
                "tva_entropy_delta": 35.0,
                "particles_loss": 1,
                "casualties": ["War Machine"],
                "stone_threat": "All",
            }

        # Counter when Natasha died on Vormir (Clint leading Gauntlet run)
        if "NATASHA" in pid:
            return {
                "adversary_name": "2014 Thanos Orbital Salvo",
                "title": "Hawkeye's Subterranean Gauntlet Run (Honoring Natasha)",
                "narrative": (
                    "Clint Barton sprint-carries the Nano Gauntlet through the collapsing underground bunker, "
                    "fighting off waves of Outriders in the darkness, determined that Natasha's death will not be in vain."
                ),
                "thanos_awareness_delta": 0.20,
                "tva_entropy_delta": 15.0,
                "particles_loss": 0,
                "casualties": [],
                "stone_threat": "Soul",
            }

        # Counter when Elevator failed (Alexander Pierce Hydra mobilization)
        if "ELEVATOR" in pid:
            return {
                "adversary_name": "Hydra High Command (Alexander Pierce)",
                "title": "Triskelion Airborne Quinjet Intercept",
                "narrative": (
                    "Alexander Pierce initiates S.H.I.E.L.D. code black, scrambling automated Quinjets with 30mm cannons "
                    "over the Hudson River to shoot down Cap and recover the Chitauri Scepter."
                ),
                "thanos_awareness_delta": 0.05,
                "tva_entropy_delta": 20.0,
                "particles_loss": 0,
                "casualties": [],
                "stone_threat": "Mind",
            }

        # Counter when Ancient One was involved (Astral distortion)
        if "ANCIENT_ONE" in pid:
            return {
                "adversary_name": "Dark Dimension Echo & S.H.I.E.L.D. Radar",
                "title": "Sanctum Mystic Resonance Anomaly",
                "narrative": (
                    "The immense astral displacement triggers cosmic frequency blips detected by 2012 S.H.I.E.L.D. radar, "
                    "surrounding the Sanctum Sanctorum perimeter with tactical containment vehicles."
                ),
                "thanos_awareness_delta": 0.04,
                "tva_entropy_delta": 12.0,
                "particles_loss": 0,
                "casualties": [],
                "stone_threat": "Time",
            }

        # Counter when Nebula was synced (Thanos quantum jump)
        if thanos_meter > 0.40 or "NEBULA" in pid or "MORAG" in pid:
            return {
                "adversary_name": "2014 Thanos / Sanctuary II",
                "title": "Sanctuary II Quantum Incursion",
                "narrative": (
                    "Using reverse-engineered Pym particles from captured Nebula's memory drive, "
                    "Thanos warps his flagship Sanctuary II through the quantum realm directly above the 2023 Compound, "
                    "raining orbital bombardment missiles."
                ),
                "thanos_awareness_delta": 0.35,
                "tva_entropy_delta": 25.0,
                "particles_loss": 1,
                "casualties": ["War Machine"],
                "stone_threat": "Power",
            }

        if entropy > 60.0:
            return {
                "adversary_name": "TVA Minutemen Patrol",
                "title": "TVA Reset Charge Deployment",
                "narrative": (
                    "Time Variance Authority Minutemen step through glowing golden Timedoors with pruning batons, "
                    "planting Chrono Reset Charges to purge the runaway timeline anomaly."
                ),
                "thanos_awareness_delta": 0.0,
                "tva_entropy_delta": 20.0,
                "particles_loss": 1,
                "casualties": [],
                "stone_threat": None,
            }

        return {
            "adversary_name": "2012 Stark Security & S.H.I.E.L.D.",
            "title": "STARK Perimeter Intercept",
            "narrative": (
                "2012 Tony Stark's FRIDAY AI identifies temporal signature blips and seals the subterranean "
                "Stark Tower sub-levels, forcing a confrontation."
            ),
            "thanos_awareness_delta": 0.08,
            "tva_entropy_delta": 10.0,
            "particles_loss": 0,
            "casualties": [],
            "stone_threat": "Space",
        }

