"""Canonical baseline anchors and tactical divergence seeds for Project Mobius."""

from typing import Dict, List
from .state_models import CharacterStatus, TimelineNode


def create_initial_characters() -> Dict[str, CharacterStatus]:
    """Generates the primary 2023 Avengers roster."""
    return {
        "Tony Stark": CharacterStatus(name="Tony Stark", status="Active", location="Stark Tower 2012"),
        "Steve Rogers": CharacterStatus(name="Steve Rogers", status="Active", location="Stark Tower 2012"),
        "Scott Lang": CharacterStatus(name="Scott Lang", status="Active", location="Stark Tower 2012"),
        "Bruce Banner": CharacterStatus(name="Bruce Banner", status="Active", location="Sanctum Sanctorum 2012"),
        "Thor Odinson": CharacterStatus(name="Thor Odinson", status="Active", location="Asgard Palace 2013"),
        "Rocket Raccoon": CharacterStatus(name="Rocket Raccoon", status="Active", location="Asgard Palace 2013"),
        "James Rhodes": CharacterStatus(name="James Rhodes", status="Active", location="Morag Vault 2014"),
        "Nebula": CharacterStatus(name="Nebula", status="Active", location="Morag Vault 2014"),
        "Clint Barton": CharacterStatus(name="Clint Barton", status="Active", location="Vormir Peak 2014"),
        "Natasha Romanoff": CharacterStatus(name="Natasha Romanoff", status="Active", location="Vormir Peak 2014"),
    }


def get_root_node() -> TimelineNode:
    """Returns Layer 0 root insertion node at the 2023 Avengers Compound."""
    return TimelineNode(
        node_id="ROOT_AVENGERS_FACILITY_2023",
        parent_id=None,
        depth=0,
        title="Avengers Compound: Quantum Tunnel Insertion",
        narrative_summary=(
            "Avengers Compound, Upstate New York (October 2023). Quantum Tunnel is calibrated. "
            "Fourteen non-renewable Pym particle doses distributed across three operational strike teams. "
            "Simultaneous jumps executed to New York (2012), Asgard (2013), and Morag/Vormir (2014)."
        ),
        divergence_trigger=None,
        pym_particles_remaining=4,
        stones_secured={
            "Space": False,
            "Mind": False,
            "Reality": False,
            "Power": False,
            "Time": False,
            "Soul": False,
        },
        thanos_awareness=0.0,
        tva_entropy_index=0.0,
        characters=create_initial_characters(),
        visit_count=1,
        total_value=0.5,
        victory_probability=0.5,
        is_terminal=False,
    )


def get_layer0_anchors() -> List[TimelineNode]:
    """Generates Layer 1 canonical insertion coordinates for the four operational theaters."""
    root = get_root_node()

    ny = root.clone_child(
        new_id="ANCHOR_NY_2012",
        title="Anchor: New York (May 4, 2012)",
        narrative_summary=(
            "Stark Tower and Sanctum Sanctorum. Team NY deploys to secure the Space Stone (Tesseract), "
            "Mind Stone (Chitauri Scepter), and Time Stone (Eye of Agamotto) amidst the Chitauri invasion aftermath."
        ),
        divergence_trigger="Canonical Infiltration Commenced",
        particles_cost=0,
    )
    ny.thanos_awareness = 0.05
    ny.tva_entropy_index = 5.0

    asgard = root.clone_child(
        new_id="ANCHOR_ASGARD_2013",
        title="Anchor: Asgard (November 2013)",
        narrative_summary=(
            "Royal Palace of Asgard during the Dark Elf invasion. Thor and Rocket infiltrate the royal chambers "
            "to extract the Reality Stone (Aether) from Jane Foster."
        ),
        divergence_trigger="Canonical Infiltration Commenced",
        particles_cost=0,
    )
    asgard.thanos_awareness = 0.02
    asgard.tva_entropy_index = 4.0

    morag = root.clone_child(
        new_id="ANCHOR_MORAG_2014",
        title="Anchor: Morag (2014)",
        narrative_summary=(
            "Submerged Temple of the Power Stone. War Machine and Nebula land on the geyser plains "
            "to intercept Peter Quill and extract the Power Stone (Orb) before Ronan arrives."
        ),
        divergence_trigger="Canonical Infiltration Commenced",
        particles_cost=0,
    )
    morag.thanos_awareness = 0.10
    morag.tva_entropy_index = 8.0

    vormir = root.clone_child(
        new_id="ANCHOR_VORMIR_2014",
        title="Anchor: Vormir (2014)",
        narrative_summary=(
            "Desolate peak of Vormir. Clint Barton and Natasha Romanoff ascend the mountain "
            "to locate the Soul Stone, meeting the Stonekeeper at the summit."
        ),
        divergence_trigger="Canonical Infiltration Commenced",
        particles_cost=0,
    )
    vormir.thanos_awareness = 0.05
    vormir.tva_entropy_index = 6.0

    return [ny, asgard, morag, vormir]


# Tactical BFS Micro-Failures Catalog (Depth 1-2 Divergences)
BFS_TACTICAL_SEEDS = {
    "ANCHOR_NY_2012": [
        {
            "id": "NY_TESSERACT_DROP",
            "title": "Tesseract Briefcase Rupture",
            "narrative": "Tony Stark drops the Tesseract briefcase when 2012 Hulk smashes through the stairwell doors. The briefcase pops open and slides across the marble lobby towards Loki.",
            "divergence_trigger": "Hulk Stairwell Impact / Briefcase Dropped",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.05,
            "tva_entropy_delta": 30.0,
            "affected_character": "Tony Stark",
            "character_status": "Active",
            "stone_effect": {"Space": False},
        },
        {
            "id": "NY_ELEVATOR_BLUFF_FAIL",
            "title": "Hydra Elevator Compromise",
            "narrative": "Jasper Sitwell and Brock Rumlow detect subtle cadence flaws in Captain America's 'Hail Hydra' whisper. Strike team draws taser batons inside the elevator shaft.",
            "divergence_trigger": "Elevator Whisper Bluff Failed",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.02,
            "tva_entropy_delta": 20.0,
            "affected_character": "Steve Rogers",
            "character_status": "Active",
            "stone_effect": {"Mind": False},
        },
        {
            "id": "NY_CAP_MIRROR_LOSS",
            "title": "2012 Cap Mirror Match Defeat",
            "narrative": "2012 Captain America pins 2023 Steve Rogers to the glass walkway in a sleeper chokehold after suspecting Loki's shapeshifting illusions.",
            "divergence_trigger": "Mirror Match Combat Defeat",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.03,
            "tva_entropy_delta": 25.0,
            "affected_character": "Steve Rogers",
            "character_status": "Incapacitated",
            "stone_effect": {"Mind": False},
        },
        {
            "id": "NY_ANCIENT_ONE_DENIAL",
            "title": "Sanctum Astral Eviction",
            "narrative": "The Ancient One refuses Bruce Banner's plea, citing the catastrophic divergence of branching timelines without the Time Stone, and thrusts Banner's astral form from the Hulk body.",
            "divergence_trigger": "Ancient One Refusal & Astral Ejection",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.01,
            "tva_entropy_delta": 22.0,
            "affected_character": "Bruce Banner",
            "character_status": "Incapacitated",
            "stone_effect": {"Time": False},
        },
    ],
    "ANCHOR_ASGARD_2013": [
        {
            "id": "ASGARD_EXTRACTION_FAIL",
            "title": "Aether Syringe Malfunction",
            "narrative": "Rocket Raccoon's quantum extraction syringe fails against Jane Foster's erratic Reality Stone surge, triggering Asgardian royal alarm chimes across the palace.",
            "divergence_trigger": "Aether Extraction Device Failure",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.02,
            "tva_entropy_delta": 24.0,
            "affected_character": "Rocket Raccoon",
            "character_status": "Active",
            "stone_effect": {"Reality": False},
        },
        {
            "id": "ASGARD_ROYAL_ALERT",
            "title": "Einherjar Royal Guard Interception",
            "narrative": "Thor is cornered in the royal armory by Einherjar guards and Volstagg while attempting to procure both the Aether extractor and Mjolnir.",
            "divergence_trigger": "Palace Sentry Lockdown",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.01,
            "tva_entropy_delta": 18.0,
            "affected_character": "Thor Odinson",
            "character_status": "Active",
            "stone_effect": {"Reality": False},
        },
        {
            "id": "ASGARD_FRIGGA_CONFISCATION",
            "title": "Frigga Temporal Interdiction",
            "narrative": "Queen Frigga sees through Thor's temporal origin immediately and seizes Mjolnir, warning that stripping Asgard of its protective hammer will doom the realm to Malekith.",
            "divergence_trigger": "Frigga Confiscates Mjolnir",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.02,
            "tva_entropy_delta": 32.0,
            "affected_character": "Thor Odinson",
            "character_status": "Active",
            "stone_effect": {"Reality": False},
        },
    ],
    "ANCHOR_MORAG_2014": [
        {
            "id": "MORAG_NEBULA_SYNC",
            "title": "Sanctuary II Cybernetic Uplink",
            "narrative": "Nebula's temporal cybernetics accidentally sync with the 2014 Sanctuary II cloud network. Thanos intercepts her visual memory files containing the 2018 Decimation and 2023 Heist.",
            "divergence_trigger": "Cybernetic Neural Cloud Hijack",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.50,
            "tva_entropy_delta": 35.0,
            "affected_character": "Nebula",
            "character_status": "Captured",
            "stone_effect": {"Power": False},
        },
        {
            "id": "MORAG_RHODEY_DOWN",
            "title": "Korath Ambush at Morag Vault",
            "narrative": "Korath the Pursuer and Sakaaran mercenaries arrive early at the temple, hitting War Machine with heavy ion blasters before the Power Orb can be stowed.",
            "divergence_trigger": "Korath Pursuer Heavy Ambush",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.25,
            "tva_entropy_delta": 22.0,
            "affected_character": "James Rhodes",
            "character_status": "Incapacitated",
            "stone_effect": {"Power": False},
        },
        {
            "id": "MORAG_POWER_SEAL_BREACH",
            "title": "Orb Thermal Containment Rupture",
            "narrative": "The forcefield clamp slips, exposing the raw purple celestial radiation of the Power Stone. Geysers ignite in violent purple plasma storms.",
            "divergence_trigger": "Cosmic Power Stone Containment Breach",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.15,
            "tva_entropy_delta": 28.0,
            "affected_character": "James Rhodes",
            "character_status": "Active",
            "stone_effect": {"Power": False},
        },
    ],
    "ANCHOR_VORMIR_2014": [
        {
            "id": "VORMIR_NATASHA_SACRIFICE",
            "title": "Black Widow Sacrifice (Natasha Dies)",
            "narrative": "Natasha Romanoff kicks off the cliff face, breaking Clint's desperate grip and plunging into the radiant golden abyss. Clint awakens in the flooded basin clutching the Soul Stone in tears.",
            "divergence_trigger": "Natasha Breaks Grip / Falls into Abyss",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.05,
            "tva_entropy_delta": 10.0,
            "affected_character": "Natasha Romanoff",
            "character_status": "Deceased",
            "stone_effect": {"Soul": True},
        },
        {
            "id": "VORMIR_BARTON_SACRIFICE",
            "title": "Hawkeye Sacrifice (Clint Dies)",
            "narrative": "Clint Barton overpowers Natasha, pins her with an electrified grapple arrow, and hurls himself into the cosmic void. Clint falls backward into the golden clouds as Natasha screams from the precipice.",
            "divergence_trigger": "Hawkeye Overpowers Black Widow Sacrifice",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.05,
            "tva_entropy_delta": 15.0,
            "affected_character": "Clint Barton",
            "character_status": "Deceased",
            "stone_effect": {"Soul": True},
        },
        {
            "id": "VORMIR_DUAL_FALL",
            "title": "Mutual Precipice Plunge (Both Die)",
            "narrative": "In their frantic grapple on the frozen precipice, the anchor piton snaps under their combined momentum. Both Clint and Natasha tumble together into the abyssal cosmic vortex. The summit remains empty and silent.",
            "divergence_trigger": "Anchor Piton Snaps / Both Plunge into Void",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.10,
            "tva_entropy_delta": 45.0,
            "affected_character": "Clint Barton",
            "character_status": "Deceased",
            "stone_effect": {"Soul": False},
        },
        {
            "id": "VORMIR_RED_SKULL_REJECT",
            "title": "Stonekeeper Sacrificial Rejection",
            "narrative": "The Red Skull rejects their desperate mutual struggle: 'The Stone demands an everlasting exchange of genuine surrender, not a tactical combat duel.' The Soul Stone remains locked in the cosmic eclipse.",
            "divergence_trigger": "Red Skull Rejection of Tactical Suicide",
            "particles_cost": 0,
            "thanos_awareness_delta": 0.08,
            "tva_entropy_delta": 40.0,
            "affected_character": "Natasha Romanoff",
            "character_status": "Active",
            "stone_effect": {"Soul": False},
        },
    ],
}

