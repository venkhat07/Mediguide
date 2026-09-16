// Fictional demo data only. No real patient information.

export const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

export const mockPatients = [
  {
    id: 'P1001',
    name: 'Alex Kumar',
    phone: '+91 98765 43210',
    language: 'Tamil',
    dischargeDate: '2026-09-05',
    processingStatus: 'Completed',
    whatsappStatus: 'Delivered',
    diagnosis: ['வகை 2 நீரிழிவு நோய் (Type 2 Diabetes)', 'லேசான ரத்த அழுத்தம் (Mild Hypertension)'],
    medications: [
      { name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily', duration: '30 days', explanation: 'ரத்த சர்க்கரை அளவை சீராக வைக்க உதவும். உணவுக்குப் பின் சாப்பிடவும்.' },
      { name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily', duration: '30 days', explanation: 'ரத்த அழுத்தத்தைக் கட்டுக்குள் வைக்க உதவும். தினமும் காலையில் ஒரே நேரத்தில் சாப்பிடவும்.' },
    ],
    diet: ['சர்க்கரை மற்றும் இனிப்பு உணவுகளைக் குறைக்கவும்', 'காய்கறிகள் மற்றும் முழு தானியங்களை அதிகம் சேர்க்கவும்', 'குளிர்ந்த மற்றும் இனிப்பு பானங்களைத் தவிர்க்கவும்'],
    restrictions: ['1 வாரத்திற்கு கடுமையான எடை தூக்குவதைத் தவிர்க்கவும்', 'தினமும் எளிய நடைப்பயிற்சி செய்யவும்'],
    followUp: ['சர்க்கரை அளவை பரிசோதிக்க 2 வாரங்களில் மருத்துவமனைக்கு வரவும்', 'மருத்துவரிடம் வரும் போது பரிசோதனை அறிக்கையை எடுத்து வரவும்'],
    warningSigns: ['மயக்கம் அல்லது பார்வை மங்குதல்', 'அதிக தாகம் அல்லது அடிக்கடி சிறுநீர் கழித்தல்', 'நெஞ்சு வலி அல்லது கடுமையான மூச்சுத்திணறல்'],
    patientExplanation:
      'உங்கள் ரத்த சர்க்கரை மற்றும் ரத்த அழுத்தம் சற்று அதிகமாக உள்ளதால், மருத்துவர் இரண்டு மாத்திரைகளை பரிந்துரைத்துள்ளார். மெட்ஃபோர்மின் மாத்திரையை காலை மற்றும் இரவு உணவுக்குப் பின்னும், ஆம்லோடிபின் மாத்திரையை தினமும் காலையிலும் எடுத்துக் கொள்ளவும். சர்க்கரை உணவுகளை குறைத்து, தினமும் நடைப்பயிற்சி செய்து, 2 வாரங்களில் மருத்துவரை மீண்டும் பார்க்கவும்.',
  },
  {
    id: 'P1002',
    name: 'Priya Sharma',
    phone: '+91 91234 56780',
    language: 'Hindi',
    dischargeDate: '2026-09-07',
    processingStatus: 'Completed',
    whatsappStatus: 'Sent',
    diagnosis: ['तीव्र ब्रोंकाइटिस (Acute Bronchitis)'],
    medications: [
      { name: 'Azithromycin', dosage: '500 mg', frequency: 'Once daily', duration: '3 days', explanation: 'सीने के संक्रमण को ठीक करने के लिए एंटीबायोटिक। पूरा कोर्स समाप्त करें।' },
      { name: 'Cetirizine', dosage: '10 mg', frequency: 'Once at night', duration: '5 days', explanation: 'खांसी और गले की जलन को कम करता है। रात को लें।' },
    ],
    diet: ['गुनगुना पानी और गर्म तरल पदार्थ पिएं', 'ठंडी चीजें और आइसक्रीम से बचें'],
    restrictions: ['3-4 दिनों के लिए घर पर आराम करें', 'धूल और धुएं वाले वातावरण से बचें'],
    followUp: ['यदि 7 दिनों के बाद भी खांसी बनी रहे तो दोबारा आएं'],
    warningSigns: ['102°F से अधिक तेज बुखार', 'सांस लेने में अत्यधिक कठिनाई', 'सीने में दर्द या भारीपन'],
    patientExplanation:
      'आपके सीने के संक्रमण का इलाज किया गया है। कृपया 3 दिनों तक एंटीबायोटिक का पूरा कोर्स लें, गुनगुना पानी पिएं और घर पर आराम करें। यदि बुखार बहुत तेज हो जाए या सांस लेने में परेशानी हो, तो तुरंत अस्पताल आएं।',
  },
  {
    id: 'P1003',
    name: 'Arun Raj',
    phone: '+91 90000 11122',
    language: 'English',
    dischargeDate: '2026-09-09',
    processingStatus: 'Processing',
    whatsappStatus: 'Pending',
    diagnosis: ['Post-operative recovery – Appendectomy'],
    medications: [
      { name: 'Paracetamol', dosage: '650 mg', frequency: 'Every 6 hours if needed', duration: '5 days', explanation: 'For pain relief after surgery.' },
      { name: 'Pantoprazole', dosage: '40 mg', frequency: 'Once daily before breakfast', duration: '5 days', explanation: 'Protects your stomach while on other medicines.' },
    ],
    diet: ['Start with light, easily digestible food', 'Gradually return to a normal diet over a few days'],
    restrictions: ['No heavy lifting for 4 weeks', 'Avoid strenuous exercise'],
    followUp: ['Suture removal in 7 days at the surgical clinic'],
    warningSigns: ['Redness, swelling or discharge at the wound site', 'Fever', 'Severe abdominal pain'],
    patientExplanation:
      'Your surgery went well. Take it easy for the next few weeks, avoid heavy lifting, and keep the wound area clean and dry. Come back in 7 days to have your stitches removed.',
  },
  {
    id: 'P1004',
    name: 'Meena Krishnan',
    phone: '+91 93456 78901',
    language: 'Malayalam',
    dischargeDate: '2026-09-10',
    processingStatus: 'Pending',
    whatsappStatus: 'Pending',
    diagnosis: [],
    medications: [],
    diet: [],
    restrictions: [],
    followUp: [],
    warningSigns: [],
    patientExplanation: '',
  },
];

export const mockCommunicationHistory = {
  P1001: [
    { date: '2026-09-05 11:20 AM', channel: 'WhatsApp', language: 'Tamil', contentType: 'Text explanation', status: 'Delivered' },
    { date: '2026-09-05 11:25 AM', channel: 'WhatsApp', language: 'Tamil', contentType: 'Voice explanation', status: 'Delivered' },
    { date: '2026-09-06 09:10 AM', channel: 'WhatsApp', language: 'Tamil', contentType: 'Q&A response', status: 'Delivered' },
  ],
  P1002: [
    { date: '2026-09-07 04:40 PM', channel: 'WhatsApp', language: 'Hindi', contentType: 'Text explanation', status: 'Sent' },
  ],
  P1003: [],
  P1004: [],
};

export const mockConversations = {
  P1001: [
    { from: 'patient', text: 'What is this medicine for?', time: '2026-09-06 09:02 AM' },
    { from: 'ai', text: 'This medicine has been prescribed to help control your blood pressure. Please take it exactly as instructed in your discharge summary.', time: '2026-09-06 09:02 AM', status: 'Delivered' },
    { from: 'patient', text: 'Can I eat rice?', time: '2026-09-06 09:08 AM' },
    { from: 'ai', text: 'Rice in small portions is fine. Try to balance it with vegetables and avoid large portions of white rice, since it can raise your blood sugar.', time: '2026-09-06 09:09 AM', status: 'Delivered' },
  ],
  P1002: [
    { from: 'patient', text: 'Should I take the tablet before or after food?', time: '2026-09-07 06:30 PM' },
    { from: 'ai', text: 'You can take Azithromycin after food to reduce the chance of stomach discomfort.', time: '2026-09-07 06:31 PM', status: 'Delivered' },
  ],
  P1003: [],
  P1004: [],
};

export const dashboardStats = {
  totalPatients: mockPatients.length,
  summariesProcessed: mockPatients.filter((p) => p.processingStatus === 'Completed').length,
  messagesSent: 4,
  pendingProcessing: mockPatients.filter((p) => p.processingStatus !== 'Completed').length,
};
