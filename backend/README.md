# MedGuideAI — SNS Workbench & Agent Builder Backend Integration Guide

This directory provides the backend workflow files formatted for **SNS Workbench Agent Builder** (the React Flow-based workflow canvas used by SNS Institutions).

---

## 📁 Workflow Directories

1. **`backend/sns-agent-builder/`** *(For SNS Workbench Agent Builder visual canvas!)*
   - **`unified-master-workflow.json`**: ⭐ **All-in-One Master Workflow with Integrated Database** (Single webhook ➔ Router ➔ Clinical Database + Gemini AI + WhatsApp + Q&A).
   - `01-ai-discharge-processor.json`: Standalone Discharge summary processing pipeline.
   - `02-patients-api.json`: Standalone Patient records directory sync.
   - `03-whatsapp-dispatcher.json`: Standalone WhatsApp text & audio notification dispatcher.
   - `04-qna-assistant.json`: Standalone Post-discharge Q&A assistant with safety guardrails.

2. **`backend/sns-workbench/`** *(For standalone n8n / enterprise workflow engines)*
   - **`unified-master-workflow.json`**: Complete n8n master workflow with PostgreSQL / Supabase Database nodes.
   - Standalone workflow definitions for modular deployment.

---

## 🚀 How to Import into Agent Builder

1. Open **SNS Workbench / Agent Builder** in your browser.
2. In the workflow list, click **Import Workflow** or **+ Add Workflow** ➔ **Import**.
3. Choose the files from the **`backend/sns-agent-builder/`** directory:
   - `01-ai-discharge-processor.json`
   - `02-patients-api.json`
   - `03-whatsapp-dispatcher.json`
   - `04-qna-assistant.json`
4. The canvas will render the nodes with connection lines immediately!
5. Add your Google Gemini API key or credentials in the **Gemini** node.
6. Toggle **Active** to turn on the webhook URLs.
7. Copy the production webhook URL into your `medguideai/.env`:
   ```env
   VITE_API_BASE_URL=https://your-sns-workbench-domain.com/webhook
   VITE_USE_MOCK=false
   ```
