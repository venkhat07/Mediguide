# 🏥 MedGuideAI — Multilingual Post-Discharge Care & Patient Education Portal

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini 2.5 Flash](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![WhatsApp API](https://img.shields.io/badge/WhatsApp-2Chat%20API-25D366?logo=whatsapp&logoColor=white)](https://2chat.co/)

**MedGuideAI** transforms complex hospital clinical discharge summaries into simplified, patient-friendly instructions delivered directly via **WhatsApp** in the patient's native language as both formatted text and spoken audio voice notes.

---

## 🌟 Key Features

- 📄 **Multimodal PDF Clinical Extraction:** Automatically ingests raw clinical discharge summaries (PDFs / Images) and extracts patient names, diagnoses, prescriptions, dosage schedules, diet, activity limits, and emergency red flags using **Google Gemini 2.5 Flash**.
- 🌐 **Multilingual Medical Simplification:** Converts high-level medical jargon into clear instructions written at a **6th-grade reading level** across multiple regional languages (**Tamil, Hindi, Telugu, Malayalam, Kannada, English**).
- 🎙️ **Multi-Chunk AI Voice Narration:** Synthesizes clear, spoken audio care notes in the patient's native tongue and generates publicly hosted MP3 audio notes.
- 📱 **Automated WhatsApp Care Packets:** Dispatches rich-text care instructions alongside playable voice notes directly to the patient's WhatsApp via the **2Chat API Gateway**.
- 💬 **Grounded Clinical Q&A:** An AI post-discharge assistant grounded strictly in the patient's actual discharge plan to answer questions safely without hallucination.
- ⚡ **Workflow Automation:** Integrates with **SNS Workbench / SNS Agent Builder** (n8n-compatible) low-code webhooks for enterprise hospital workflow orchestration.

---

## 🏗️ Architecture & Technology Stack

\\\mermaid
graph TD
    A[Clinical Dashboard - React 18 + Vite] --> B[Multimodal LLM - Gemini 2.5 Flash]
    A --> C[Workflow Engine - SNS Workbench / n8n]
    A --> D[Voice Engine - TTS + Audio Host]
    A --> E[Messaging Gateway - 2Chat WhatsApp API]
    
    B -->|Structured Medical JSON| A
    C -->|Webhook Orchestration| A
    D -->|Seamless Hosted MP3| E
    E -->|Text + Audio Voice Note| F[Patient WhatsApp +91 Recipient]
\\\

- **Frontend:** React 18, React Router DOM v6, Lucide Icons, Modern CSS3 Clinical Theme
- **Build Tool:** Vite 5 with dev proxy for CORS-free API routing
- **AI & LLM:** Google Gemini 3.6 Flash (\gemini-3.6-flash\) with JSON Schema Enforcement
- **Messaging:** 2Chat WhatsApp API
- **Audio / Voice:** Multi-sentence TTS engine & Catbox public MP3 hosting
- **Workflow Backend:** SNS Workbench / n8n Webhook Architecture

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Installation
\\\ash
git clone https://github.com/YOUR_USERNAME/medguideai.git
cd medguideai
npm install
\\\

### 3. Environment Setup
Copy the example environment file and configure your API keys:
\\\ash
cp .env.example .env
\\\

Edit \.env\:
\\\env
VITE_API_BASE_URL=https://api.agents.snsihub.ai/webhook
VITE_DISCHARGE_WEBHOOK_URL=https://api.agents.snsihub.ai/webhook/discharge-summary/process
VITE_USE_MOCK=false
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
\\\

### 4. Run Development Server
\\\ash
npm run dev
\\\
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

\\\	ext
medguideai/
├── backend/
│   ├── sns-agent-builder/   # SNS Agent Builder low-code workflow definitions
│   └── sns-workbench/       # n8n-compatible webhook workflows
├── src/
│   ├── components/          # Reusable UI components (Audio player, Cards, Simulator)
│   ├── data/                # Mock data & fallback clinical stores
│   ├── pages/               # Application views (Dashboard, Upload, Communications)
│   ├── services/            # API integration (Gemini, 2Chat, Webhooks, TTS)
│   └── utils/               # Speech helpers, date formatting, and utilities
├── .env.example             # Template for environment configuration
├── vite.config.js           # Vite dev proxy & build configuration
└── package.json             # Project dependencies and build scripts
\\\

---

## 📄 License
MIT License. Built for educational and clinical research demonstration.
