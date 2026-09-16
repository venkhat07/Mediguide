# MedGuideAI — SNS Workbench & Agent Builder Backend Integration Guide

This directory provides the backend workflow files formatted for **SNS Workbench Agent Builder** (the React Flow-based workflow canvas used by SNS Institutions).

---

## 📁 Workflow Directories

1. **`backend/sns-agent-builder/`** *(Use this for your SNS Workbench Agent Builder!)*
   - Formatted specifically with the **Agent Builder** native schema (`nodes` + `edges` with `toolId` definitions).
   - **`01-ai-discharge-processor.json`**: Webhook ➔ PDF Extractor ➔ Gemini 1.5 Medical LLM ➔ Webhook Response.
   - **`02-patients-api.json`**: Webhook ➔ Webhook Response for patient records & statistics.
   - **`03-whatsapp-dispatcher.json`**: Webhook ➔ WhatsApp Message Node ➔ Webhook Response.
   - **`04-qna-assistant.json`**: Webhook ➔ Gemini Q&A Model with clinical safety guardrails ➔ Webhook Response.

2. **`backend/sns-workbench/`**
   - Standard n8n-compatible JSON definitions (for standalone n8n deployments).

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
