// ---------------------------------------------------------------------------
// MediGuide AI — Persistent Clinical Database Manager
//
// Provides persistent storage across sessions, browser restarts, and logins
// for:
// 1. Registered patients and EHR records
// 2. Extracted and translated discharge summaries
// 3. WhatsApp and voice dispatch communication logs
// 4. Clinical Q&A conversation message histories
// 5. Clinical operations audit logs
// ---------------------------------------------------------------------------

import {
  mockPatients,
  mockCommunicationHistory,
  mockConversations,
} from '../data/mockData.js';

const STORAGE_KEYS = {
  PATIENTS: 'medguide_db_patients',
  COMMUNICATIONS: 'medguide_db_communications',
  CONVERSATIONS: 'medguide_db_conversations',
  AUDIT_LOG: 'medguide_db_audit_log',
  SESSION: 'medguide_session',
};

// In-memory cache synced with storage
let patientsCache = null;
let communicationsCache = null;
let conversationsCache = null;
let auditLogCache = null;

// Safe localStorage access
function getStorage(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }
  } catch (err) {
    console.warn(`[Database ⚠️] Error reading ${key} from storage:`, err);
  }
  return null;
}

function setStorage(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`[Database ⚠️] Error writing ${key} to storage:`, err);
  }
}

// ---------------------------------------------------------------------------
// Database Initialization
// ---------------------------------------------------------------------------
export function initDatabase() {
  // 1. Initialize Patients
  const storedPatients = getStorage(STORAGE_KEYS.PATIENTS);
  const legacyPatients = getStorage('medguide_patients');

  if (Array.isArray(storedPatients) && storedPatients.length > 0) {
    patientsCache = storedPatients;
  } else if (Array.isArray(legacyPatients) && legacyPatients.length > 0) {
    patientsCache = legacyPatients;
    setStorage(STORAGE_KEYS.PATIENTS, patientsCache);
  } else {
    patientsCache = [...mockPatients];
    setStorage(STORAGE_KEYS.PATIENTS, patientsCache);
  }
  setStorage('medguide_patients', patientsCache);

  // 2. Initialize Communications
  const storedComms = getStorage(STORAGE_KEYS.COMMUNICATIONS);
  if (storedComms && typeof storedComms === 'object') {
    communicationsCache = storedComms;
  } else {
    communicationsCache = { ...mockCommunicationHistory };
    setStorage(STORAGE_KEYS.COMMUNICATIONS, communicationsCache);
  }

  // 3. Initialize Conversations
  const storedConvs = getStorage(STORAGE_KEYS.CONVERSATIONS);
  if (storedConvs && typeof storedConvs === 'object') {
    conversationsCache = storedConvs;
  } else {
    conversationsCache = { ...mockConversations };
    setStorage(STORAGE_KEYS.CONVERSATIONS, conversationsCache);
  }

  // 4. Initialize Audit Log
  const storedAudit = getStorage(STORAGE_KEYS.AUDIT_LOG);
  if (Array.isArray(storedAudit)) {
    auditLogCache = storedAudit;
  } else {
    auditLogCache = [
      {
        id: 'aud_init',
        timestamp: new Date().toISOString(),
        action: 'system_initialized',
        description: 'Hospital Clinical Database initialized',
      },
    ];
    setStorage(STORAGE_KEYS.AUDIT_LOG, auditLogCache);
  }

  console.log(`[Database 🗄️] Initialized: ${patientsCache.length} patients loaded.`);
}

// Ensure database is ready
function ensureDb() {
  if (!patientsCache || !communicationsCache || !conversationsCache) {
    initDatabase();
  }
}

// ---------------------------------------------------------------------------
// Patient Operations
// ---------------------------------------------------------------------------
export function getAllPatients() {
  ensureDb();
  return [...patientsCache];
}

export function getPatientById(id) {
  ensureDb();
  return patientsCache.find((p) => p.id === id) || null;
}

export function savePatient(patientData) {
  ensureDb();
  if (!patientData || !patientData.id) return null;

  const existingIndex = patientsCache.findIndex((p) => p.id === patientData.id);
  const updatedRecord = {
    ...(existingIndex >= 0 ? patientsCache[existingIndex] : {}),
    ...patientData,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    patientsCache[existingIndex] = updatedRecord;
  } else {
    updatedRecord.createdAt = updatedRecord.createdAt || new Date().toISOString();
    patientsCache = [updatedRecord, ...patientsCache];
  }

  setStorage(STORAGE_KEYS.PATIENTS, patientsCache);
  setStorage('medguide_patients', patientsCache);
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(`patient_${updatedRecord.id}`, JSON.stringify(updatedRecord));
    }
  } catch (_) {}
  logAuditOperation('save_patient', updatedRecord.id, `Patient ${updatedRecord.name} (MRN-${updatedRecord.id}) saved to database`);
  return updatedRecord;
}

export function deletePatient(id) {
  ensureDb();
  patientsCache = patientsCache.filter((p) => p.id !== id);
  setStorage(STORAGE_KEYS.PATIENTS, patientsCache);
  setStorage('medguide_patients', patientsCache);
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(`patient_${id}`);
    }
  } catch (_) {}

  if (communicationsCache[id]) {
    delete communicationsCache[id];
    setStorage(STORAGE_KEYS.COMMUNICATIONS, communicationsCache);
  }

  if (conversationsCache[id]) {
    delete conversationsCache[id];
    setStorage(STORAGE_KEYS.CONVERSATIONS, conversationsCache);
  }

  logAuditOperation('delete_patient', id, `Patient MRN-${id} deleted from database`);
}

// ---------------------------------------------------------------------------
// Communication History Operations
// ---------------------------------------------------------------------------
export function getPatientCommunications(patientId) {
  ensureDb();
  return communicationsCache[patientId] ? [...communicationsCache[patientId]] : [];
}

export function addPatientCommunication(patientId, entry) {
  ensureDb();
  if (!patientId) return null;

  const newEntry = {
    id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    date: entry.date || new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    channel: entry.channel || 'WhatsApp',
    language: entry.language || 'English',
    contentType: entry.contentType || 'Text & Voice Summary',
    status: entry.status || 'Delivered',
    phone: entry.phone || '',
    patientName: entry.patientName || '',
    ...entry,
  };

  communicationsCache[patientId] = [newEntry, ...(communicationsCache[patientId] || [])];
  setStorage(STORAGE_KEYS.COMMUNICATIONS, communicationsCache);

  // Update patient whatsappStatus
  const patient = getPatientById(patientId);
  if (patient) {
    savePatient({ ...patient, whatsappStatus: newEntry.status });
  }

  logAuditOperation('whatsapp_dispatch', patientId, `Dispatched ${newEntry.contentType} to ${patientId} (${newEntry.status})`);
  return newEntry;
}

// ---------------------------------------------------------------------------
// Q&A Conversation Operations
// ---------------------------------------------------------------------------
export function getPatientConversation(patientId) {
  ensureDb();
  return conversationsCache[patientId] ? [...conversationsCache[patientId]] : [];
}

export function addPatientMessage(patientId, message) {
  ensureDb();
  if (!patientId) return null;

  const msgObj = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    time: message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    from: message.from || 'patient',
    text: message.text || '',
    status: message.status || 'Delivered',
    ...message,
  };

  conversationsCache[patientId] = [...(conversationsCache[patientId] || []), msgObj];
  setStorage(STORAGE_KEYS.CONVERSATIONS, conversationsCache);
  return msgObj;
}

// ---------------------------------------------------------------------------
// Audit Log Operations
// ---------------------------------------------------------------------------
export function logAuditOperation(action, patientId, description, details = {}) {
  ensureDb();
  const entry = {
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    patientId: patientId || '',
    description: description || '',
    details,
  };

  auditLogCache = [entry, ...(auditLogCache || []).slice(0, 199)];
  setStorage(STORAGE_KEYS.AUDIT_LOG, auditLogCache);
}

export function getAuditLog() {
  ensureDb();
  return [...auditLogCache];
}

// ---------------------------------------------------------------------------
// Dashboard Statistics Computation
// ---------------------------------------------------------------------------
export function computeDashboardStats() {
  ensureDb();
  const total = patientsCache.length;
  const processed = patientsCache.filter((p) => p.processingStatus === 'Completed').length;
  const totalMessages = Object.values(communicationsCache).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
  const pending = patientsCache.filter((p) => p.processingStatus !== 'Completed').length;

  return {
    totalPatients: total,
    summariesProcessed: processed,
    messagesSent: totalMessages || 4,
    pendingProcessing: pending,
  };
}

// ---------------------------------------------------------------------------
// Remote Sync Integration (PostgreSQL / SNS Master Webhook)
// ---------------------------------------------------------------------------
export function mergeRemoteRows(remoteRows) {
  ensureDb();
  if (!Array.isArray(remoteRows) || remoteRows.length === 0) return patientsCache;

  const existingMap = new Map(patientsCache.map((p) => [p.id, p]));

  for (const row of remoteRows) {
    const rowId = row.id || row.mrn || row.patientId;
    if (!rowId) continue;

    const existing = existingMap.get(rowId);
    const merged = {
      ...(existing || {}),
      ...row,
      id: rowId,
      name: row.name || row.patientName || existing?.name || 'Patient',
      phone: row.phone || row.recipientPhoneNumber || existing?.phone || '+91 89036 43218',
      language: row.language || existing?.language || 'Tamil',
      dischargeDate: row.dischargeDate || existing?.dischargeDate || new Date().toISOString().split('T')[0],
      processingStatus: row.processingStatus || (row.diagnosis?.length ? 'Completed' : (existing?.processingStatus || 'Pending')),
      whatsappStatus: row.whatsappStatus || existing?.whatsappStatus || 'Pending',
      diagnosis: row.diagnosis || row.diagnoses || existing?.diagnosis || [],
      medications: row.medications || existing?.medications || [],
      diet: row.diet || row.dietaryGuidelines || existing?.diet || [],
      restrictions: row.restrictions || row.activityRestrictions || existing?.restrictions || [],
      followUp: row.followUp || existing?.followUp || [],
      warningSigns: row.warningSigns || existing?.warningSigns || [],
      patientExplanation: row.patientExplanation || row.explanation || existing?.patientExplanation || '',
    };
    existingMap.set(rowId, merged);
  }

  patientsCache = Array.from(existingMap.values());
  setStorage(STORAGE_KEYS.PATIENTS, patientsCache);
  setStorage('medguide_patients', patientsCache);
  console.log(`[Database 🔄] Merged ${remoteRows.length} remote database rows into persistent store.`);
  return patientsCache;
}

// Initialize on module load
initDatabase();
