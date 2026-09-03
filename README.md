# AI/NLP Engine to Detect SIF Precursors (SIH26165)
> **Smart India Hackathon (SIH 2026) Problem Statement SIH26165**  
> **Sponsoring Organization:** Oil India Limited (OIL)  
> **Theme:** Smart Automation | **Category:** Software  
> **Live Web Application:** [https://sih-eta-blond.vercel.app](https://sih-eta-blond.vercel.app)

---

## 📌 Executive Summary

**Oil India Limited (OIL)** generates vast quantities of Health, Safety, Security, and Environment (HSSE) documentation—specifically **Unsafe-Act (UA)**, **Unsafe-Condition (UC)**, and **Near-Miss (NM)** field reports across drilling rigs, pipeline networks, and refineries.

Traditional safety management relies on lagging indicators (analyzing incidents after harm occurs). **SIH26165** transitions safety operations from reactive to proactive by deploying an **AI and Natural Language Processing (NLP) Engine** to detect **Serious Injury & Fatality (SIF) Precursors**—events with high potential energy or missing critical safeguards—before catastrophic accidents happen.

---

## ⚡ Key Features

- **Embedded Hybrid AI/NLP Engine**:
  - **IOGP Energy Wheel Rule Engine**: Classifies hazards into 6 High-Energy categories (Gravity/Height, Stored Pressure, Toxic Gas/Chemical, Mechanical/Crane Hoisting, Electrical/LOTO, Thermal/Hot Work).
  - **Multilingual NLP Tokenizer**: Supports free-text safety reports in English, Hindi (Devanagari & Hinglish), and Assamese (Bengali script & Romanized keywords).
  - **SIF Risk Probability Meter (0-100%)**: Quantitative scoring algorithm evaluating energy exposure & safeguard omissions.
  - **Historical Incident Vector Matching**: Matches current reports against historical OIL safety archives (`HIST-2024-882`, `HIST-2023-419`, `HIST-2025-104`) to surface past lessons learned.
  - **Root Cause Taxonomy Codes**: Assigns official IOGP/OSHA codes (`RC-HEIGHT-01`, `RC-PRESS-02`, `RC-GAS-03`, `RC-LIFT-04`).

- **Five Operational Dashboards & Modules**:
  1. **Executive Dashboard**: KPI metrics, high-energy exposure bar charts, SIF risk donut matrix, active priority SIF alert feed.
  2. **Live Incident AI Analyzer**: Real-time free-text analyzer, real-world OIL presets (Duliajan Rig #4, Digboi Refinery, Moran Gas Field), Web Speech API voice dictation, and step-by-step AI safety mitigations.
  3. **Batch Dataset Ingestion**: Bulk triage table with CSV upload support, facility filters, search, and CSV export.
  4. **Regional Risk Heatmaps**: Geospatial risk status across OIL hubs (Duliajan, Digboi, Moran, Nahorkatia, Guwahati, Jorhat) and root cause radar charts.
  5. **IOGP Standards & Energy Wheel Guide**: Interactive visual workflow diagram & operational guide for field safety engineers.

- **Emergency Directive & PDF Generator**:
  - Generates official Oil India Limited Emergency Safety Alerts with client-side downloadable PDF export (`jspdf`).

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 8, Tailwind CSS
- **Visualization**: Recharts, Lucide React Icons
- **PDF Generation**: jsPDF
- **NLP & Classification**: Custom JavaScript Vectorizer, N-gram Tokenizer, Energy Wheel Rules Engine
- **Deployment**: Vercel (`https://sih-eta-blond.vercel.app`)

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/ranjanashish2706/SIF-Precursor-AI-NLP-Intelligence-Engine.git

# 2. Navigate to project directory
cd SIF-Precursor-AI-NLP-Intelligence-Engine

# 3. Install dependencies
npm install

# 4. Start local dev server (Runs on http://127.0.0.1:3000)
npm run dev

# 5. Build for production
npm run build
```

---

## 📄 License
Developed for Smart India Hackathon (SIH 2026) for Oil India Limited (OIL).
