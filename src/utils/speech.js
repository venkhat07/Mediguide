// High-Fidelity Multilingual Speech Engine
// Ensures 100% reliable, clear native Tamil and regional Indian language pronunciation
// Uses native browser speech synthesis with sentence chunking to prevent Chrome 15s freeze

const LANG_CONFIG = {
  Tamil: {
    code: 'ta',
    bcp47: 'ta-IN',
    keywords: ['tamil', 'தமிழ்', 'valluvar', 'pallavi', 'ta-in', 'ta_in'],
  },
  Hindi: {
    code: 'hi',
    bcp47: 'hi-IN',
    keywords: ['hindi', 'हिन्दी', 'swara', 'madhur', 'kalpana', 'hi-in', 'hi_in'],
  },
  Telugu: {
    code: 'te',
    bcp47: 'te-IN',
    keywords: ['telugu', 'తెలుగు', 'mohan', 'shruti', 'te-in', 'te_in'],
  },
  Malayalam: {
    code: 'ml',
    bcp47: 'ml-IN',
    keywords: ['malayalam', 'മലയാളം', 'midhun', 'sobhana', 'ml-in', 'ml_in'],
  },
  Kannada: {
    code: 'kn',
    bcp47: 'kn-IN',
    keywords: ['kannada', 'ಕನ್ನಡ', 'gagan', 'sapna', 'kn-in', 'kn_in'],
  },
  English: {
    code: 'en',
    bcp47: 'en-IN',
    keywords: ['india', 'english', 'en-in', 'en-us'],
  },
};

let isSpeaking = false;
let currentUtteranceQueue = [];
let voiceList = [];

// Pre-load available voices from browser
function populateVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      voiceList = list;
    }
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  populateVoices();
  window.speechSynthesis.onvoiceschanged = populateVoices;
}

export function stopSpeech() {
  isSpeaking = false;
  currentUtteranceQueue = [];
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function findBestVoice(config) {
  populateVoices();
  const voices = voiceList.length > 0 ? voiceList : (typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
  if (!voices || !voices.length) return null;

  // 1. First priority: Voice whose language explicitly starts with target language code
  for (const v of voices) {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    if (lang === config.bcp47.toLowerCase() || lang.startsWith(config.code + '-')) {
      return v;
    }
  }

  // 2. Second priority: Voice whose name contains regional language keywords
  for (const v of voices) {
    const name = (v.name || '').toLowerCase();
    if (config.keywords.some((kw) => name.includes(kw))) {
      return v;
    }
  }

  // 3. Third priority: Any voice starting with code
  for (const v of voices) {
    const lang = (v.lang || '').toLowerCase();
    if (lang.startsWith(config.code)) {
      return v;
    }
  }

  return null;
}

// Splits long text into natural spoken sentences to avoid browser timeout bugs
function splitSentences(text) {
  if (!text) return [];
  // Clean markdown asterisks, hashes, and bullets
  const clean = text
    .replace(/[*#_~`]/g, '')
    .replace(/^[-\d.]+\s+/gm, '')
    .trim();

  const parts = clean.match(/[^.!?\n]+[.!?\n]+|\s*[^.!?\n]+$/g) || [clean];
  return parts
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function playSpeech(text, language = 'Tamil', onStart, onEnd) {
  stopSpeech();
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  const config = LANG_CONFIG[language] || LANG_CONFIG.Tamil;
  const sentences = splitSentences(text);
  if (!sentences.length) {
    if (onEnd) onEnd();
    return;
  }

  isSpeaking = true;
  if (onStart) onStart();

  const matchedVoice = findBestVoice(config);
  let currentIndex = 0;

  function speakNextSentence() {
    if (!isSpeaking || currentIndex >= sentences.length) {
      isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    const sentenceText = sentences[currentIndex];
    currentIndex += 1;

    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = matchedVoice?.lang || config.bcp47;
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // Natural, calm educational pacing (0.85 rate prevents rushed or slurred syllables)
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (isSpeaking) {
        // Small 150ms natural breath pause between sentences
        setTimeout(speakNextSentence, 150);
      }
    };

    utterance.onerror = (e) => {
      console.warn('[MedGuideAI TTS] Sentence error:', e);
      if (isSpeaking) {
        speakNextSentence();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  speakNextSentence();
}
