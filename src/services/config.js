// ---------------------------------------------------------------------------
// Central place for backend and SNS Workbench configuration.
// ---------------------------------------------------------------------------

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://your-sns-workbench-domain.com/webhook'
).replace(/\/+$/, '');

export const DISCHARGE_WEBHOOK_URL =
  import.meta.env.VITE_DISCHARGE_WEBHOOK_URL || `${API_BASE_URL}/api/mediguide/master`;

export const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDrY0crZ8bCIv1uj64RMb0FOVZ3u9G-ck0';

// Detect whether a real SNS Workbench URL has been configured
export const isLiveBackendConfigured = () => {
  if (import.meta.env.VITE_USE_MOCK === 'true') return false;
  if (DISCHARGE_WEBHOOK_URL && DISCHARGE_WEBHOOK_URL.startsWith('http')) return true;
  if (!API_BASE_URL) return false;
  if (
    API_BASE_URL.includes('your-sns-workbench-domain') ||
    API_BASE_URL.includes('REPLACE_WITH')
  ) {
    return false;
  }
  return true;
};

export const ENDPOINTS = {
  patients: '/patients',
  patient: (id) => `/patients/${id}`,
  createPatient: '/patients',
  uploadDischargeSummary: '/discharge-summary/upload',
  processDischargeSummary: '/discharge-summary/process',
  sendWhatsApp: '/communications/whatsapp/send',
  generateVoice: '/communications/voice/generate',
  generateVideo: '/communications/video/generate',
  askPatientQuestion: '/qna/ask',
  login: '/auth/login',
  stats: '/dashboard/stats',
};

// Default simulated network latency when running in local mock fallback mode
export const MOCK_DELAY_MS = 600;
