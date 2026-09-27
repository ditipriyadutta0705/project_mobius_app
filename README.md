# 🌀 PROJECT MOBIUS: Multiverse Time Heist Engine

> **"Time travel! Since we're thinking of it, let's just make it happen."** — Tony Stark

Project Mobius is an agentic Monte Carlo Tree Search (MCTS) simulation engine and interactive Stark Holographic HUD modeling divergent multiverse timelines of the Avengers 2023 Quantum Time Heist.

[![Deploy to GitHub Pages](https://github.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ⚡ Live Demo (GitHub Pages & Vercel)

This repository includes an automatic GitHub Actions deployment pipeline that compiles and publishes the Stark Holographic HUD to GitHub Pages upon push.

### 🚀 Enabling Free Deployment on GitHub (Takes 30 Seconds)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initialize Project Mobius with Stark Holographic HUD"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. That's it! GitHub Actions will automatically run `.github/workflows/deploy.yml` and provide your public live dashboard URL (e.g. `https://<your-username>.github.io/<your-repo-name>/`).

---

## 🌟 Key Features

* **Interactive Stark Holographic Graph HUD**:
  * Built on `@xyflow/react` (React Flow) with neon glowing edges, custom thematic badges, and directional arrows.
  * Filter timelines by anchor theater (*New York 2012*, *Asgard 2013*, *Morag 2014*, *Vormir 2014*) or outcome verdict (*Prime Victory*, *Pyrrhic Victory*, *Thanos Double Snap*, *TVA Reset*, *Stranded*).
* **Authentic Hand-Drawn Storyboard Concept Art**:
  * Cinematic hand-drawn storyboard sketches illustrating key multiversal splits (e.g., *Clint Barton falling on Vormir*, *Dual sacrifice plunge*, *Hydra glass elevator brawl*, *Ancient One astral spirit eviction*, *Thanos in the ruins*).
  * 9-panel Storyboard Concept Art Deck modal with in-depth narrative divergence analysis.
* **Stark J.A.R.V.I.S. / F.R.I.D.A.Y. Soundscapes & SFX**:
  * **Procedural Sub-Bass Reactor Hum**: Ambient drone synthesized live in the browser via the Web Audio API.
  * **Holographic Audio Cues**: Interactive chirps, quantum jump shifts, high-entropy warning klaxons, and harmonious victory chimes.
  * **Neural Voice Synthesizer**: Speech engine allowing users to toggle between J.A.R.V.I.S. and F.R.I.D.A.Y. tactical briefings.
* **Classified S.H.I.E.L.D. Mission Dossier**:
  * Level 7 clearance tactical debrief generator.
  * Dynamic operative casualty tracker, Infinity Stone checklist, and quantum fuel expenditure telemetry.
  * One-click **Download Markdown (.md)** and **Print to PDF**.
* **Timeline Playback Mode (Chronal Stepper)**:
  * Automated chronal sequence player stepping through key operational paths with synchronized graph centering.

---

## 💻 Local Quickstart

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Python 3.10+](https://www.python.org/) (optional, only needed for re-running MCTS simulations)

### Option A: Windows 1-Click Launchers
* Run `start_frontend.bat` to launch the Stark HUD at `http://localhost:5173`.
* Run `start_backend.bat` to re-simulate timelines with Monte Carlo Tree Search.

### Option B: Terminal Setup
```bash
# Navigate to the frontend
cd mobius-engine/frontend

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📁 Repository Structure

```text
project_mobius/
├── .github/
│   └── workflows/
│       └── deploy.yml             # Automatic GitHub Pages CI/CD workflow
├── mobius-engine/
│   ├── backend/                   # Python MCTS Engine & Simulation logic
│   │   ├── engine/
│   │   │   ├── search_mcts.py     # Monte Carlo Tree Search algorithm
│   │   │   ├── state_models.py    # QuantumHeistState & action transitions
│   │   │   └── graph_exporter.py  # Exporter to React Flow schema
│   │   └── data/                  # Exported timeline graph JSON
│   └── frontend/                  # React + Vite + Tailwind Stark HUD
│       ├── public/
│       │   └── storyboards/       # Authentic hand-drawn concept sketches
│       └── src/
│           ├── components/        # GraphCanvas, NodeDetails, Dossier, Stepper
│           ├── utils/             # Web Audio synthesizer & Asset resolver
│           └── App.jsx            # Main Stark Hologram dashboard
├── start_frontend.bat             # 1-click Windows frontend launcher
├── start_backend.bat              # 1-click Windows simulation runner
├── vercel.json                    # 1-click Vercel deployment configuration
└── README.md
```

---

## 🛡️ License & Acknowledgements
Inspired by Marvel Studios' *Avengers: Endgame* and *Loki*. Built for demonstration, research, and interactive multiversal storytelling.
