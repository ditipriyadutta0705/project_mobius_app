"""Cinematic Prompt Synthesizer and Video Generation Engine for Project Mobius."""

import math
import os
from typing import Optional
import cv2
import numpy as np
import imageio

from .state_models import TimelineNode


class VideoAgent:
    """Generates cinematic prompts and renders looping Stark HUD hologram video feeds."""

    def __init__(self, output_dir: str = "mobius-engine/frontend/public/clips"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_cinematic_prompt(self, node: TimelineNode) -> str:
        """Synthesizes high-fidelity camera, lighting, and action descriptions for video generation."""
        title = node.title
        trigger = node.divergence_trigger or "Baseline insertion"
        summary = node.narrative_summary

        if node.terminal_verdict == "THANOS_DOUBLE_SNAP":
            palette = "Grim crimson atmospheric haze, blinding purple celestial plasma fire, harsh chiaroscuro shadows"
            camera = "Slow orbital tracking shot sweeping past crumbling debris, rack focus to towering warship"
        elif node.terminal_verdict == "TVA_RESET":
            palette = "Brilliant incandescent golden amber timedoors, neon violet chronal decay, stark prismatic lens flares"
            camera = "Rapid Dutch-angle zoom in, followed by a time-dilation freeze and chronal implosion sweep"
        elif node.terminal_verdict in ("PRIME_VICTORY", "PYRRHIC_VICTORY"):
            palette = "Brilliant arc-reactor cyan, electric blue gamma discharge, epic golden rim lighting"
            camera = "Sweeping heroic low-angle crane shot ascending past the Avengers as lightning erupts"
        elif "Asgard" in title or "Asgard" in summary:
            palette = "Opulent Asgardian gold halls, glowing crimson Aether tendrils, deep indigo shadow accents"
            camera = "Fluid handheld steadicam gliding through royal palace arches, whip pans on royal guards"
        elif "Morag" in title or "Morag" in summary:
            palette = "Desolate aqua rainstorms, eerie violet Power Stone luminescence, reflective wet obsidian ruins"
            camera = "Atmospheric dolly push across misty geyser plains focusing on temple vault doors"
        elif "Vormir" in title or "Vormir" in summary:
            palette = "Somber eclipse violet, brooding cloud ceiling, radiant amber Soul realm horizon"
            camera = "High-altitude vertiginous top-down crane looking down sheer cliff face into the cosmic vortex"
        else:
            palette = "High-contrast tactical Stark blue, stark halogen reflections on glass catwalks, holographic HUD reflections"
            camera = "Dynamic 35mm handheld tracking shot amidst shattered glass and elevator shafts"

        prompt = (
            f"5-second cinematic film clip, 4K resolution, photorealistic cinematic lighting. "
            f"Scene: {title}. Divergence Event: {trigger}. {summary[:120]}... "
            f"Visual Tone: {palette}. Camera Dynamics: {camera}. 35mm anamorphic lens, subtle film grain, "
            f"Stark holographic telemetry reflections, seamless 5-second loop."
        )
        return prompt

    def render_hud_clip(
        self,
        node: TimelineNode,
        duration_sec: float = 4.0,
        fps: int = 30,
        width: int = 640,
        height: int = 368,
    ) -> str:
        """Renders an animated browser-compatible H.264 Stark HUD Video Clip."""
        filename = f"{node.node_id}.mp4"
        filepath = os.path.join(self.output_dir, filename)

        total_frames = int(duration_sec * fps)

        # Determine theme color (BGR for OpenCV drawing)
        if node.terminal_verdict == "THANOS_DOUBLE_SNAP":
            theme_color = (40, 50, 235)      # Red / Crimson
            accent_color = (80, 100, 255)
            badge_text = "TERMINAL: THANOS INVASION"
        elif node.terminal_verdict == "TVA_RESET":
            theme_color = (210, 80, 180)     # Neon Violet / Purple
            accent_color = (255, 140, 230)
            badge_text = "TERMINAL: TVA RESET PURGE"
        elif node.terminal_verdict in ("PRIME_VICTORY", "PYRRHIC_VICTORY"):
            theme_color = (240, 220, 0)      # Cyan / Bright Blue
            accent_color = (255, 255, 100)
            badge_text = "TIMELINE RESOLUTION: VICTORY"
        elif node.depth <= 1:
            theme_color = (235, 180, 20)      # Cyan / Teal
            accent_color = (255, 230, 80)
            badge_text = "CANONICAL TEMPORAL ANCHOR"
        else:
            theme_color = (30, 150, 245)      # Amber / Orange
            accent_color = (60, 190, 255)
            badge_text = "CAUSALITY RUPTURE DETECTED"

        # Use imageio with H.264 codec for universal HTML5 browser playback
        writer = imageio.get_writer(
            filepath,
            fps=fps,
            codec="libx264",
            pixelformat="yuv420p",
            macro_block_size=16,
        )

        for frame_idx in range(total_frames):
            t = frame_idx / fps
            phase = (frame_idx / total_frames) * 2 * math.pi

            # Deep sci-fi backdrop
            img = np.zeros((height, width, 3), dtype=np.uint8)
            img[:] = (12, 16, 24)

            # Grid lines
            grid_spacing = 30
            for x in range(0, width, grid_spacing):
                cv2.line(img, (x, 0), (x, height), (22, 28, 38), 1)
            for y in range(0, height, grid_spacing):
                cv2.line(img, (0, y), (width, y), (22, 28, 38), 1)

            # Center Holographic Reticle / Rotating Radar
            cx, cy = width // 2, height // 2 + 10
            base_radius = 75

            # Outer rotating dashed circle
            angle_offset = phase
            for i in range(12):
                a1 = angle_offset + (i * math.pi / 6)
                a2 = a1 + 0.25
                pt1 = (int(cx + (base_radius + 20) * math.cos(a1)), int(cy + (base_radius + 20) * math.sin(a1)))
                pt2 = (int(cx + (base_radius + 20) * math.cos(a2)), int(cy + (base_radius + 20) * math.sin(a2)))
                cv2.line(img, pt1, pt2, theme_color, 2)

            # Inner pulsating circle
            pulsing_r = int(base_radius + 6 * math.sin(phase * 2))
            cv2.circle(img, (cx, cy), pulsing_r, theme_color, 1)
            cv2.circle(img, (cx, cy), max(2, int(pulsing_r * 0.4)), accent_color, 1)

            # Rotating crosshairs
            rad = angle_offset * 1.5
            x1 = int(cx + pulsing_r * math.cos(rad))
            y1 = int(cy + pulsing_r * math.sin(rad))
            x2 = int(cx - pulsing_r * math.cos(rad))
            y2 = int(cy - pulsing_r * math.sin(rad))
            cv2.line(img, (x1, y1), (x2, y2), theme_color, 1)

            # Oscilloscope / Quantum Waveform across lower mid section
            wave_y = cy + 60
            pts = []
            for wx in range(80, width - 80, 4):
                freq1 = 0.05
                freq2 = 0.12
                wy = int(wave_y + 14 * math.sin(wx * freq1 + phase * 3) + 7 * math.cos(wx * freq2 - phase * 2))
                pts.append((wx, wy))
            if len(pts) > 1:
                cv2.polylines(img, [np.array(pts, dtype=np.int32)], False, accent_color, 2)

            # Stark HUD Corner Brackets
            corner_len = 24
            margin = 15
            cv2.line(img, (margin, margin), (margin + corner_len, margin), theme_color, 2)
            cv2.line(img, (margin, margin), (margin, margin + corner_len), theme_color, 2)
            cv2.line(img, (width - margin, margin), (width - margin - corner_len, margin), theme_color, 2)
            cv2.line(img, (width - margin, margin), (width - margin, margin + corner_len), theme_color, 2)
            cv2.line(img, (margin, height - margin), (margin + corner_len, height - margin), theme_color, 2)
            cv2.line(img, (margin, height - margin), (margin, height - margin - corner_len), theme_color, 2)
            cv2.line(img, (width - margin, height - margin), (width - margin - corner_len, height - margin), theme_color, 2)
            cv2.line(img, (width - margin, height - margin), (width - margin, height - margin - corner_len), theme_color, 2)

            # Animated Scanlines
            scan_y = int((frame_idx * 5) % height)
            cv2.line(img, (0, scan_y), (width, scan_y), (100, 160, 255), 1)

            # Subtle interlacing
            for sy in range(0, height, 4):
                img[sy, :, :] = (img[sy, :, :].astype(np.float32) * 0.85).astype(np.uint8)

            # Stark HUD Text Overlay
            cv2.putText(img, "STARK IND // TEMPORAL FEED 007-B", (30, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 200, 220), 1, cv2.LINE_AA)
            cv2.putText(img, badge_text, (30, 52), cv2.FONT_HERSHEY_SIMPLEX, 0.50, theme_color, 2, cv2.LINE_AA)

            clean_title = (node.title[:38] + "..") if len(node.title) > 38 else node.title
            cv2.putText(img, f"NODE: {node.node_id}", (30, height - 44), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (160, 180, 200), 1, cv2.LINE_AA)
            cv2.putText(img, clean_title.upper(), (30, height - 26), cv2.FONT_HERSHEY_SIMPLEX, 0.46, (240, 245, 255), 1, cv2.LINE_AA)

            # Live Telemetry metrics right-aligned
            cv2.putText(img, f"DEPTH: {node.depth} // PYM: {node.pym_particles_remaining}/4", (width - 230, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (180, 200, 220), 1, cv2.LINE_AA)
            cv2.putText(img, f"THANOS AWARENESS: {int(node.thanos_awareness * 100)}%", (width - 230, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (60, 150, 255), 1, cv2.LINE_AA)
            cv2.putText(img, f"TVA ENTROPY: {node.tva_entropy_index:.1f}%", (width - 230, 68), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (220, 120, 240), 1, cv2.LINE_AA)
            cv2.putText(img, f"REC [LIVE] 00:0{int(t)}:{(frame_idx % 30):02d}", (width - 170, height - 26), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (50, 255, 120), 1, cv2.LINE_AA)

            # Convert BGR to RGB for imageio
            rgb_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            writer.append_data(rgb_frame)

        writer.close()
        return f"/clips/{filename}"
