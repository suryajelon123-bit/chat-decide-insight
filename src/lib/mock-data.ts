import metricsJson from "./mitra-metrics.json";

export type Language = "en" | "hi" | "ta" | "kn";

export type AnswerBlock =
  | { type: "kpi"; label: string; value: string; delta?: string; deltaDir?: "up" | "down" | "flat" }
  | { type: "trend"; label: string; points: number[]; period: string }
  | { type: "interpretation"; text: string }
  | { type: "drivers"; items: { label: string; impact: string; tone: "neg" | "pos" | "neutral" }[] }
  | { type: "remedials"; items: string[] }
  | { type: "breakdown"; label: string; rows: { name: string; value: string; delta?: string; tone?: "pos" | "neg" }[] }
  | { type: "followups"; items: string[] };

export type Source = { table: string; filters: string[]; timeRange: string; rows: number };
export type Answer = { id: string; question: string; language: Language; source: Source; blocks: AnswerBlock[]; createdAt: string };
export type Turn =
  | { id: string; role: "user"; text: string; language: Language; createdAt: string }
  | { id: string; role: "assistant"; answer: Answer };

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

export const ROLES = ["Program Manager", "Org Admin", "Tenant Admin"] as const;
export type Role = typeof ROLES[number];

// ---------------- MITRA catalog (from GW Metabase dashboards) ----------------
// Leader categories: Women Leader (WL), School Leader (SL), Youth Leader (YL)
export const LEADER_CATEGORIES = ["WL", "SL", "YL"] as const;
export const MITRA_DASHBOARDS: { dashboard: string; program: string; leader: "WL" | "SL" | "YL" | "—"; state: string }[] = [
  { dashboard: "WLC — Bihar Chaupal",            program: "Shiksha Chaupals",      leader: "WL", state: "Bihar" },
  { dashboard: "WLC — Karnataka Chavadis",       program: "Shikshana Chavadis",    leader: "WL", state: "Karnataka" },
  { dashboard: "WLC — Bihar MI Story",           program: "Shiksha Chaupals",      leader: "WL", state: "Bihar" },
  { dashboard: "WLC — Karnataka MI Story",       program: "Shikshana Chavadis",    leader: "WL", state: "Karnataka" },
  { dashboard: "Nagaland MI Story",              program: "LNF",                   leader: "SL", state: "Nagaland" },
  { dashboard: "SLC — Karnataka MI Story",       program: "SLC",                   leader: "SL", state: "Karnataka" },
  { dashboard: "YLC — Karnataka",                program: "YLC",                   leader: "YL", state: "Karnataka" },
  { dashboard: "Mega PTM",                       program: "Mega PTM",              leader: "—",  state: "All" },
  { dashboard: "Bihar Parent Perception Survey", program: "Parent perception",     leader: "—",  state: "Bihar" },
  { dashboard: "Shiksha Samvad",                 program: "Future readiness",      leader: "—",  state: "All" },
  { dashboard: "Bihar Listening Activity",       program: "Impact assessment",     leader: "—",  state: "Bihar" },
  { dashboard: "Nagaland Listening Activity",    program: "Impact assessment",     leader: "—",  state: "Nagaland" },
];

// MI discussion themes (from program documentation)
export const MI_THEMES = [
  "Poverty and Economic Barriers",
  "Legal Document linked Barriers",
  "Early Marriage",
  "Distance and Accessibility Issues",
  "Parental Attitudes and Socio-Cultural Barriers",
  "School Infrastructure and Facility Issues",
  "Teacher Capacity and Quality Issues",
  "Safety Concerns",
  "Substance Abuse and Addiction",
  "Other Factors",
] as const;

// ---------------- Programs / Filters ----------------
export type ProgramKey = "all" | "chaupal_bihar" | "chavadi_karnataka" | "mi_bihar" | "mi_karnataka";
export type StateKey = "all" | "Bihar" | "Karnataka";

export const PROGRAM_LABELS: Record<Language, Record<ProgramKey, string>> = {
  en: {
    all: "All programs",
    chaupal_bihar: "Chaupal · Bihar",
    chavadi_karnataka: "Chavadi · Karnataka",
    mi_bihar: "Micro-Improvement · Bihar",
    mi_karnataka: "Micro-Improvement · Karnataka",
  },
  hi: {
    all: "सभी कार्यक्रम",
    chaupal_bihar: "चौपाल · बिहार",
    chavadi_karnataka: "चावड़ी · कर्नाटक",
    mi_bihar: "सूक्ष्म सुधार · बिहार",
    mi_karnataka: "सूक्ष्म सुधार · कर्नाटक",
  },
  ta: {
    all: "அனைத்து திட்டங்கள்",
    chaupal_bihar: "சௌபால் · பீகார்",
    chavadi_karnataka: "சாவடி · கர்நாடகா",
    mi_bihar: "நுண் முன்னேற்றம் · பீகார்",
    mi_karnataka: "நுண் முன்னேற்றம் · கர்நாடகா",
  },
  kn: {
    all: "ಎಲ್ಲಾ ಕಾರ್ಯಕ್ರಮಗಳು",
    chaupal_bihar: "ಚೌಪಾಲ್ · ಬಿಹಾರ",
    chavadi_karnataka: "ಚಾವಡಿ · ಕರ್ನಾಟಕ",
    mi_bihar: "ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆ · ಬಿಹಾರ",
    mi_karnataka: "ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆ · ಕರ್ನಾಟಕ",
  },
};

export const STATE_LABELS: Record<Language, Record<StateKey, string>> = {
  en: { all: "All states", Bihar: "Bihar", Karnataka: "Karnataka" },
  hi: { all: "सभी राज्य", Bihar: "बिहार", Karnataka: "कर्नाटक" },
  ta: { all: "அனைத்து மாநிலங்கள்", Bihar: "பீகார்", Karnataka: "கர்நாடகா" },
  kn: { all: "ಎಲ್ಲಾ ರಾಜ್ಯಗಳು", Bihar: "ಬಿಹಾರ", Karnataka: "ಕರ್ನಾಟಕ" },
};

export const PROGRAM_KEYS: ProgramKey[] = ["all", "chaupal_bihar", "chavadi_karnataka", "mi_bihar", "mi_karnataka"];
export const STATE_KEYS: StateKey[] = ["all", "Bihar", "Karnataka"];

export const RANGES_OPT: Record<Language, { key: string; label: string }[]> = {
  en: [
    { key: "7d", label: "Last 7 days" },
    { key: "30d", label: "Last 30 days" },
    { key: "all", label: "All time" },
  ],
  hi: [
    { key: "7d", label: "पिछले 7 दिन" },
    { key: "30d", label: "पिछले 30 दिन" },
    { key: "all", label: "अब तक" },
  ],
  ta: [
    { key: "7d", label: "கடந்த 7 நாட்கள்" },
    { key: "30d", label: "கடந்த 30 நாட்கள்" },
    { key: "all", label: "இதுவரை" },
  ],
  kn: [
    { key: "7d", label: "ಕಳೆದ 7 ದಿನಗಳು" },
    { key: "30d", label: "ಕಳೆದ 30 ದಿನಗಳು" },
    { key: "all", label: "ಇಲ್ಲಿಯವರೆಗೆ" },
  ],
};

// ---------------- UI strings ----------------
type UIStrings = {
  appTagline: string;
  newConversation: string;
  role: string;
  saved: string;
  recent: string;
  language: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  composerPlaceholder: string;
  ask: string;
  thinking: string;
  contextHeader: string;
  state: string;
  program: string;
  dateRange: string;
  sourceTrace: string;
  table: string;
  filters: string;
  timeRange: string;
  rows: string;
  groundedNote: string;
  followupHeader: string;
  fact: string;
  insight: string;
  interpretation: string;
  drivers: string;
  remedials: string;
  starterHeader: string;
  share: string;
  trustChip: string;
};

export const UI: Record<Language, UIStrings> = {
  en: {
    appTagline: "MITRA Conversational Insights",
    newConversation: "New conversation",
    role: "Role",
    saved: "Saved prompts",
    recent: "Recent threads",
    language: "Language",
    welcomeTitle: "Ask anything about MITRA",
    welcomeSubtitle: "Live data from MITRA — Chaupal (Bihar), Chavadi (Karnataka), and Micro-Improvement story conversations. Ask in your language, get answers in your language.",
    composerPlaceholder: "Ask about engagement, drop-off, top topics, or what to do next…",
    ask: "Ask",
    thinking: "Querying MITRA conversations…",
    contextHeader: "Active context",
    state: "State",
    program: "Program",
    dateRange: "Date range",
    sourceTrace: "Source trace",
    table: "Dataset",
    filters: "Filters applied",
    timeRange: "Time range",
    rows: "Rows scanned",
    groundedNote: "Grounded responses. Numbers come from MITRA conversation logs (Chaupal, Chavadi, MI). Insights and remedials are AI-generated and clearly labeled.",
    followupHeader: "Ask a follow-up",
    fact: "Fact",
    insight: "Insight",
    interpretation: "Interpretation",
    drivers: "Likely drivers",
    remedials: "Recommended actions",
    starterHeader: "Try one of these to get started",
    share: "Share",
    trustChip: "Live · MITRA",
  },
  hi: {
    appTagline: "MITRA संवाद इनसाइट्स",
    newConversation: "नई बातचीत",
    role: "भूमिका",
    saved: "सहेजे गए प्रश्न",
    recent: "हाल की बातचीत",
    language: "भाषा",
    welcomeTitle: "MITRA के बारे में कुछ भी पूछें",
    welcomeSubtitle: "MITRA से लाइव डेटा — चौपाल (बिहार), चावड़ी (कर्नाटक) और सूक्ष्म सुधार कहानियाँ। अपनी भाषा में पूछें, अपनी भाषा में उत्तर पाएं।",
    composerPlaceholder: "भागीदारी, छूटना, मुख्य विषय या अगले कदम के बारे में पूछें…",
    ask: "पूछें",
    thinking: "MITRA संवाद से डेटा निकाला जा रहा है…",
    contextHeader: "सक्रिय संदर्भ",
    state: "राज्य",
    program: "कार्यक्रम",
    dateRange: "अवधि",
    sourceTrace: "स्रोत विवरण",
    table: "डेटासेट",
    filters: "लागू फ़िल्टर",
    timeRange: "समय सीमा",
    rows: "स्कैन की गई पंक्तियाँ",
    groundedNote: "तथ्य आधारित उत्तर। आंकड़े MITRA संवाद लॉग से हैं। व्याख्या और सुझाव AI द्वारा उत्पन्न हैं।",
    followupHeader: "एक और प्रश्न पूछें",
    fact: "तथ्य",
    insight: "विश्लेषण",
    interpretation: "व्याख्या",
    drivers: "संभावित कारण",
    remedials: "सुझाई गई कार्रवाई",
    starterHeader: "शुरू करने के लिए इनमें से एक चुनें",
    share: "साझा करें",
    trustChip: "लाइव · MITRA",
  },
  ta: {
    appTagline: "MITRA உரையாடல் நுண்ணறிவு",
    newConversation: "புதிய உரையாடல்",
    role: "பங்கு",
    saved: "சேமித்த கேள்விகள்",
    recent: "சமீபத்திய உரையாடல்கள்",
    language: "மொழி",
    welcomeTitle: "MITRA பற்றி எதையும் கேளுங்கள்",
    welcomeSubtitle: "MITRA-வில் இருந்து நேரடி தரவு — சௌபால் (பீகார்), சாவடி (கர்நாடகா), நுண் முன்னேற்ற கதைகள். உங்கள் மொழியில் கேளுங்கள், உங்கள் மொழியில் பதில் பெறுங்கள்.",
    composerPlaceholder: "ஈடுபாடு, விலகல், முன்னணி தலைப்புகள் அல்லது அடுத்த நடவடிக்கை பற்றி கேளுங்கள்…",
    ask: "கேள்",
    thinking: "MITRA உரையாடல்களில் இருந்து தரவு பெறப்படுகிறது…",
    contextHeader: "செயல் சூழல்",
    state: "மாநிலம்",
    program: "திட்டம்",
    dateRange: "கால அளவு",
    sourceTrace: "மூல விவரம்",
    table: "தரவுத்தொகுப்பு",
    filters: "பயன்படுத்திய வடிகட்டிகள்",
    timeRange: "கால வரம்பு",
    rows: "ஸ்கேன் செய்யப்பட்ட வரிசைகள்",
    groundedNote: "உண்மை அடிப்படையிலான பதில்கள். எண்கள் MITRA உரையாடல் பதிவுகளில் இருந்து. விளக்கம் மற்றும் பரிந்துரைகள் AI மூலம் உருவாக்கப்பட்டவை.",
    followupHeader: "மேலும் ஒரு கேள்வி கேளுங்கள்",
    fact: "உண்மை",
    insight: "நுண்ணறிவு",
    interpretation: "விளக்கம்",
    drivers: "சாத்தியமான காரணங்கள்",
    remedials: "பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்",
    starterHeader: "தொடங்க இவற்றில் ஒன்றை முயற்சிக்கவும்",
    share: "பகிர்",
    trustChip: "நேரடி · MITRA",
  },
  kn: {
    appTagline: "MITRA ಸಂಭಾಷಣಾ ಒಳನೋಟಗಳು",
    newConversation: "ಹೊಸ ಸಂಭಾಷಣೆ",
    role: "ಪಾತ್ರ",
    saved: "ಉಳಿಸಿದ ಪ್ರಶ್ನೆಗಳು",
    recent: "ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆಗಳು",
    language: "ಭಾಷೆ",
    welcomeTitle: "MITRA ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ",
    welcomeSubtitle: "MITRA-ನಿಂದ ನೇರ ಡೇಟಾ — ಚೌಪಾಲ್ (ಬಿಹಾರ), ಚಾವಡಿ (ಕರ್ನಾಟಕ), ಸೂಕ್ಷ್ಮ ಸುಧಾರಣಾ ಕಥೆಗಳು. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರ ಪಡೆಯಿರಿ.",
    composerPlaceholder: "ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ, ಇಳಿಕೆ, ಮುಖ್ಯ ವಿಷಯಗಳು ಅಥವಾ ಮುಂದಿನ ಹಂತದ ಬಗ್ಗೆ ಕೇಳಿ…",
    ask: "ಕೇಳಿ",
    thinking: "MITRA ಸಂಭಾಷಣೆಗಳಿಂದ ಡೇಟಾ ಪಡೆಯಲಾಗುತ್ತಿದೆ…",
    contextHeader: "ಸಕ್ರಿಯ ಸಂದರ್ಭ",
    state: "ರಾಜ್ಯ",
    program: "ಕಾರ್ಯಕ್ರಮ",
    dateRange: "ಕಾಲಾವಧಿ",
    sourceTrace: "ಮೂಲ ವಿವರ",
    table: "ಡೇಟಾಸೆಟ್",
    filters: "ಅನ್ವಯಿಸಿದ ಫಿಲ್ಟರ್‌ಗಳು",
    timeRange: "ಸಮಯ ಶ್ರೇಣಿ",
    rows: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಸಾಲುಗಳು",
    groundedNote: "ಸತ್ಯ ಆಧಾರಿತ ಉತ್ತರಗಳು. ಸಂಖ್ಯೆಗಳು MITRA ಸಂಭಾಷಣಾ ದಾಖಲೆಗಳಿಂದ. ವ್ಯಾಖ್ಯಾನ ಮತ್ತು ಸಲಹೆಗಳು AI ರಚಿತ.",
    followupHeader: "ಮತ್ತೊಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ",
    fact: "ಸತ್ಯ",
    insight: "ಒಳನೋಟ",
    interpretation: "ವ್ಯಾಖ್ಯಾನ",
    drivers: "ಸಂಭಾವ್ಯ ಕಾರಣಗಳು",
    remedials: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು",
    starterHeader: "ಪ್ರಾರಂಭಿಸಲು ಇವುಗಳಲ್ಲಿ ಒಂದನ್ನು ಪ್ರಯತ್ನಿಸಿ",
    share: "ಹಂಚಿಕೊಳ್ಳಿ",
    trustChip: "ನೇರ · MITRA",
  },
};

// ---------------- Suggested starter questions ----------------
export const SUGGESTED_PROMPTS: Record<Language, string[]> = {
  en: [
    "How many parents engaged with MITRA so far?",
    "Which stages have the most drop-off?",
    "Compare Bihar Chaupal vs Karnataka Chavadi engagement",
    "What are the top discussion topics in PTM conversations?",
    "Show daily conversation trend",
    "How can we improve conversation completion rate?",
  ],
  hi: [
    "अब तक कितने अभिभावकों ने MITRA से बातचीत की है?",
    "किन चरणों में सबसे अधिक छूटना हो रहा है?",
    "बिहार चौपाल बनाम कर्नाटक चावड़ी की भागीदारी की तुलना करें",
    "PTM बातचीत में मुख्य चर्चा विषय क्या हैं?",
    "दैनिक बातचीत प्रवृत्ति दिखाएँ",
    "बातचीत पूर्णता दर कैसे बेहतर करें?",
  ],
  ta: [
    "இதுவரை எத்தனை பெற்றோர் MITRA-வுடன் ஈடுபட்டுள்ளனர்?",
    "எந்த நிலைகளில் அதிகபட்ச விலகல் உள்ளது?",
    "பீகார் சௌபால் vs கர்நாடகா சாவடி ஈடுபாட்டை ஒப்பிடு",
    "PTM உரையாடல்களில் முன்னணி விவாத தலைப்புகள் என்ன?",
    "தினசரி உரையாடல் போக்கைக் காட்டு",
    "உரையாடல் முடிவு விகிதத்தை எப்படி மேம்படுத்துவது?",
  ],
  kn: [
    "ಇಲ್ಲಿಯವರೆಗೆ ಎಷ್ಟು ಪೋಷಕರು MITRA-ನಲ್ಲಿ ತೊಡಗಿಸಿಕೊಂಡಿದ್ದಾರೆ?",
    "ಯಾವ ಹಂತಗಳಲ್ಲಿ ಹೆಚ್ಚು ಇಳಿಕೆ ಆಗುತ್ತಿದೆ?",
    "ಬಿಹಾರ ಚೌಪಾಲ್ vs ಕರ್ನಾಟಕ ಚಾವಡಿ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ಹೋಲಿಸಿ",
    "PTM ಸಂಭಾಷಣೆಗಳಲ್ಲಿ ಮುಖ್ಯ ಚರ್ಚಾ ವಿಷಯಗಳು ಯಾವುವು?",
    "ದೈನಂದಿನ ಸಂಭಾಷಣಾ ಪ್ರವೃತ್ತಿಯನ್ನು ತೋರಿಸಿ",
    "ಸಂಭಾಷಣೆ ಪೂರ್ಣಗೊಳಿಸುವ ದರವನ್ನು ಹೇಗೆ ಸುಧಾರಿಸುವುದು?",
  ],
};

export const RECENT_THREADS: Record<Language, { id: string; title: string; time: string }[]> = {
  en: [
    { id: "t1", title: "Bihar Chaupal — weekly engagement", time: "2h ago" },
    { id: "t2", title: "PTM attendance barriers — top themes", time: "Yesterday" },
    { id: "t3", title: "Karnataka MI completion rate", time: "2d ago" },
    { id: "t4", title: "Drop-off by conversation stage", time: "5d ago" },
  ],
  hi: [
    { id: "t1", title: "बिहार चौपाल — साप्ताहिक भागीदारी", time: "2 घंटे पहले" },
    { id: "t2", title: "PTM उपस्थिति बाधाएँ — मुख्य विषय", time: "कल" },
    { id: "t3", title: "कर्नाटक MI पूर्णता दर", time: "2 दिन पहले" },
    { id: "t4", title: "चरण के अनुसार छूटना", time: "5 दिन पहले" },
  ],
  ta: [
    { id: "t1", title: "பீகார் சௌபால் — வாராந்திர ஈடுபாடு", time: "2 மணி முன்" },
    { id: "t2", title: "PTM வருகை தடைகள் — முன்னணி தலைப்புகள்", time: "நேற்று" },
    { id: "t3", title: "கர்நாடகா MI முடிவு விகிதம்", time: "2 நாட்கள் முன்" },
    { id: "t4", title: "நிலை வாரியான விலகல்", time: "5 நாட்கள் முன்" },
  ],
  kn: [
    { id: "t1", title: "ಬಿಹಾರ ಚೌಪಾಲ್ — ಸಾಪ್ತಾಹಿಕ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ", time: "2 ಗಂಟೆ ಹಿಂದೆ" },
    { id: "t2", title: "PTM ಹಾಜರಾತಿ ಅಡೆತಡೆಗಳು — ಮುಖ್ಯ ವಿಷಯಗಳು", time: "ನಿನ್ನೆ" },
    { id: "t3", title: "ಕರ್ನಾಟಕ MI ಪೂರ್ಣಗೊಳಿಸುವ ದರ", time: "2 ದಿನ ಹಿಂದೆ" },
    { id: "t4", title: "ಹಂತಗಳ ಪ್ರಕಾರ ಇಳಿಕೆ", time: "5 ದಿನ ಹಿಂದೆ" },
  ],
};

// ---------------- Metrics access ----------------
type Metrics = {
  total_msgs: number;
  total_sessions: number;
  by_day: [string, number][];
  by_day_sess: [string, number][];
  by_stage: [string, number][];
  by_status: [string, number][];
  by_program: [string, number][];
  by_program_sess: [string, number][];
  by_state: [string, number][];
};
const METRICS = metricsJson as unknown as Record<string, Metrics>;

function metricsFor(program: ProgramKey, state: StateKey): Metrics {
  if (program !== "all") return METRICS[program];
  if (state !== "all") return METRICS[state];
  return METRICS.all;
}

const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (n: number, d: number) => (d ? ((n / d) * 100).toFixed(1) + "%" : "—");

// Pretty stage names
const STAGE_NAMES: Record<string, Record<Language, string>> = {
  SCHOOL_NAME: { en: "School name", hi: "स्कूल का नाम", ta: "பள்ளி பெயர்", kn: "ಶಾಲೆಯ ಹೆಸರು" },
  PTM_DISCUSSION_TOPICS: { en: "PTM discussion topics", hi: "PTM चर्चा विषय", ta: "PTM விவாத தலைப்புகள்", kn: "PTM ಚರ್ಚಾ ವಿಷಯಗಳು" },
  SCHOOL_EXPERIENCE_FEEDBACK: { en: "School experience feedback", hi: "स्कूल अनुभव प्रतिक्रिया", ta: "பள்ளி அனுபவ கருத்து", kn: "ಶಾಲಾ ಅನುಭವ ಪ್ರತಿಕ್ರಿಯೆ" },
  PTM_SCHEDULING_PREFERENCE: { en: "PTM scheduling preference", hi: "PTM समय वरीयता", ta: "PTM நேர விருப்பம்", kn: "PTM ಸಮಯ ಆದ್ಯತೆ" },
  PTM_ATTENDANCE_BARRIERS: { en: "PTM attendance barriers", hi: "PTM उपस्थिति बाधाएँ", ta: "PTM வருகை தடைகள்", kn: "PTM ಹಾಜರಾತಿ ಅಡೆತಡೆಗಳು" },
  RESOURCE_AVAILABILITY: { en: "Resource availability", hi: "संसाधन उपलब्धता", ta: "வள கிடைப்பு", kn: "ಸಂಪನ್ಮೂಲ ಲಭ್ಯತೆ" },
  PROGRAM_AWARENESS: { en: "Program awareness", hi: "कार्यक्रम जागरूकता", ta: "திட்ட விழிப்புணர்வு", kn: "ಕಾರ್ಯಕ್ರಮ ಜಾಗೃತಿ" },
  SCHOOL_REPUTATION: { en: "School reputation", hi: "स्कूल प्रतिष्ठा", ta: "பள்ளி கௌரவம்", kn: "ಶಾಲಾ ಗೌರವ" },
  INTRODUCTION: { en: "Introduction", hi: "परिचय", ta: "அறிமுகம்", kn: "ಪರಿಚಯ" },
  APPRECIATION: { en: "Appreciation", hi: "प्रशंसा", ta: "பாராட்டு", kn: "ಮೆಚ್ಚುಗೆ" },
};
const stageName = (s: string, lang: Language) => STAGE_NAMES[s]?.[lang] ?? s.replace(/_/g, " ").toLowerCase();

const PROGRAM_DATASETS: Record<ProgramKey, string> = {
  all: "mitra.conversations (all programs)",
  chaupal_bihar: "mitra.bihar_chaupal",
  chavadi_karnataka: "mitra.karnataka_chavadi",
  mi_bihar: "mitra.bihar_micro_improvement",
  mi_karnataka: "mitra.karnataka_micro_improvement",
};

// ---------------- Filter scoping for "Last N days" ----------------
function filterDays(byDay: [string, number][], rangeKey: string): [string, number][] {
  if (rangeKey === "all" || byDay.length === 0) return byDay;
  const n = rangeKey === "7d" ? 7 : rangeKey === "30d" ? 30 : 0;
  if (!n) return byDay;
  return byDay.slice(-n);
}

// ---------------- Intent routing ----------------
type Intent = "volume" | "completion" | "stages" | "compare_program" | "compare_state" | "trend" | "default";
function routeIntent(q: string): Intent {
  const s = q.toLowerCase();
  const has = (...k: string[]) => k.some((w) => s.includes(w));
  if (has("complete", "completion", "drop", "drop-off", "dropoff", "abandon", "पूर्ण", "छूट", "முடி", "விலக", "ಪೂರ್ಣ", "ಇಳಿಕ")) return "completion";
  if (has("stage", "topic", "theme", "discussion", "barrier", "चरण", "विषय", "बाधा", "நிலை", "தலைப்பு", "தடை", "ಹಂತ", "ವಿಷಯ", "ಅಡೆತಡೆ")) return "stages";
  if (has("compare", "vs", "versus", "bihar vs", "chaupal", "chavadi", "तुलना", "बनाम", "ஒப்பி", "vs", "ಹೋಲಿಸಿ", "vs")) {
    if (has("bihar", "karnataka", "बिहार", "कर्नाटक", "பீகார்", "கர்நாடகா", "ಬಿಹಾರ", "ಕರ್ನಾಟಕ", "state", "राज्य", "மாநில", "ರಾಜ್ಯ")) return "compare_state";
    return "compare_program";
  }
  if (has("trend", "daily", "weekly", "over time", "रुझान", "दैनिक", "போக்கு", "தினசரி", "ಪ್ರವೃತ್ತಿ", "ದೈನಂದಿನ")) return "trend";
  if (has("how many", "count", "total", "engaged", "parent", "session", "message", "कितने", "कुल", "अभिभावक", "एत்தனை", "மொத்த", "ஈடுபாடு", "ಎಷ್ಟು", "ಒಟ್ಟು", "ಪೋಷಕ")) return "volume";
  return "default";
}

// ---------------- Localized labels for blocks ----------------
const L = {
  en: {
    totalConvos: "Total messages exchanged",
    totalSessions: "Unique parent sessions",
    completionRate: "Completion rate",
    completed: "Completed sessions",
    dailyTrend: "Daily messages",
    last7: "Last 7 days",
    topStages: "Top conversation stages",
    statusBreakdown: "Conversation status breakdown",
    programCompare: "Engagement by program",
    stateCompare: "Engagement by state",
    overview: "MITRA snapshot",
    ds: "Dataset",
    timeAll: "All time · live",
    timeRecent: "Recent activity · live",
  },
  hi: {
    totalConvos: "कुल संदेश",
    totalSessions: "अद्वितीय अभिभावक सत्र",
    completionRate: "पूर्णता दर",
    completed: "पूर्ण सत्र",
    dailyTrend: "दैनिक संदेश",
    last7: "पिछले 7 दिन",
    topStages: "मुख्य बातचीत चरण",
    statusBreakdown: "बातचीत स्थिति विवरण",
    programCompare: "कार्यक्रम के अनुसार भागीदारी",
    stateCompare: "राज्य के अनुसार भागीदारी",
    overview: "MITRA सारांश",
    ds: "डेटासेट",
    timeAll: "अब तक · लाइव",
    timeRecent: "हाल की गतिविधि · लाइव",
  },
  ta: {
    totalConvos: "மொத்த செய்திகள்",
    totalSessions: "தனிப்பட்ட பெற்றோர் அமர்வுகள்",
    completionRate: "முடிவு விகிதம்",
    completed: "முடிக்கப்பட்ட அமர்வுகள்",
    dailyTrend: "தினசரி செய்திகள்",
    last7: "கடந்த 7 நாட்கள்",
    topStages: "முன்னணி உரையாடல் நிலைகள்",
    statusBreakdown: "உரையாடல் நிலை பகுப்பாய்வு",
    programCompare: "திட்டத்தின் படி ஈடுபாடு",
    stateCompare: "மாநிலத்தின் படி ஈடுபாடு",
    overview: "MITRA சுருக்கம்",
    ds: "தரவுத்தொகுப்பு",
    timeAll: "இதுவரை · நேரடி",
    timeRecent: "சமீபத்திய செயல்பாடு · நேரடி",
  },
  kn: {
    totalConvos: "ಒಟ್ಟು ಸಂದೇಶಗಳು",
    totalSessions: "ಅನನ್ಯ ಪೋಷಕ ಸೆಷನ್‌ಗಳು",
    completionRate: "ಪೂರ್ಣಗೊಳಿಸುವ ದರ",
    completed: "ಪೂರ್ಣಗೊಂಡ ಸೆಷನ್‌ಗಳು",
    dailyTrend: "ದೈನಂದಿನ ಸಂದೇಶಗಳು",
    last7: "ಕಳೆದ 7 ದಿನಗಳು",
    topStages: "ಮುಖ್ಯ ಸಂಭಾಷಣಾ ಹಂತಗಳು",
    statusBreakdown: "ಸಂಭಾಷಣಾ ಸ್ಥಿತಿ ವಿವರ",
    programCompare: "ಕಾರ್ಯಕ್ರಮದ ಪ್ರಕಾರ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ",
    stateCompare: "ರಾಜ್ಯದ ಪ್ರಕಾರ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ",
    overview: "MITRA ಸಾರಾಂಶ",
    ds: "ಡೇಟಾಸೆಟ್",
    timeAll: "ಇಲ್ಲಿಯವರೆಗೆ · ನೇರ",
    timeRecent: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ · ನೇರ",
  },
};

// ---------------- Answer builders ----------------
export type AnswerContext = {
  program: ProgramKey;
  state: StateKey;
  rangeKey: string;
  rangeLabel: string;
  role: Role;
};

function makeSource(ctx: AnswerContext, lang: Language, m: Metrics): Source {
  const filters: string[] = [];
  filters.push(`${UI[lang].role} = ${ctx.role}`);
  filters.push(`${UI[lang].program} = ${PROGRAM_LABELS[lang][ctx.program]}`);
  filters.push(`${UI[lang].state} = ${STATE_LABELS[lang][ctx.state]}`);
  return {
    table: PROGRAM_DATASETS[ctx.program],
    filters,
    timeRange: ctx.rangeLabel,
    rows: m.total_msgs,
  };
}

// ---------------- Role lens: who decides what ----------------
// Program Manager: operational dials (cohorts, content variants, facilitator deployment, sample-size driven experiments)
// Org Admin:       cross-program rollups, SLAs, data quality, escalations, capacity planning
// Tenant Admin:    multi-tenant governance, access policies, data residency, platform health, billing/quota
function roleScope(role: Role, lang: Language): string {
  const en = {
    "Program Manager": "Program Manager view — focus on cohort experiments, facilitator deployment, and content-variant decisions.",
    "Org Admin": "Org Admin view — focus on cross-program SLAs, data-quality gates, and capacity reallocation across states.",
    "Tenant Admin": "Tenant Admin view — focus on tenant-level governance, access policies, telemetry health, and quota planning.",
  } as const;
  const hi = {
    "Program Manager": "कार्यक्रम प्रबंधक दृष्टि — कोहर्ट प्रयोग, फैसिलिटेटर नियुक्ति, और कंटेंट वैरिएंट निर्णय।",
    "Org Admin": "ऑर्ग एडमिन दृष्टि — कार्यक्रमों में SLA, डेटा-गुणवत्ता गेट, राज्यों में क्षमता पुनः-आवंटन।",
    "Tenant Admin": "टेनेंट एडमिन दृष्टि — टेनेंट गवर्नेंस, एक्सेस नीतियाँ, टेलीमेट्री स्वास्थ्य, और कोटा योजना।",
  } as const;
  const ta = {
    "Program Manager": "திட்ட மேலாளர் பார்வை — கூட்டப் பரிசோதனைகள், எளிமைப்படுத்துநர் ஒதுக்கீடு, உள்ளடக்க மாறுபாடு முடிவுகள்.",
    "Org Admin": "ஒர்க் நிர்வாகி பார்வை — திட்டங்கள் முழுவதும் SLA, தரவுத் தரக் கட்டுப்பாடுகள், மாநில திறன் மறுஒதுக்கீடு.",
    "Tenant Admin": "டெனண்ட் நிர்வாகி பார்வை — டெனண்ட் ஆளுகை, அணுகல் கொள்கைகள், தொலைஅளவு ஆரோக்கியம், ஒதுக்கீட்டு திட்டமிடல்.",
  } as const;
  const kn = {
    "Program Manager": "ಕಾರ್ಯಕ್ರಮ ವ್ಯವಸ್ಥಾಪಕ ನೋಟ — ಕೋಹೋರ್ಟ್ ಪ್ರಯೋಗಗಳು, ಫೆಸಿಲಿಟೇಟರ್ ನಿಯೋಜನೆ, ವಿಷಯ ರೂಪಾಂತರ ನಿರ್ಧಾರಗಳು.",
    "Org Admin": "ಆರ್ಗ್ ಅಡ್ಮಿನ್ ನೋಟ — ಕಾರ್ಯಕ್ರಮ-ವ್ಯಾಪಿ SLA, ಡೇಟಾ-ಗುಣಮಟ್ಟ ಗೇಟ್‌ಗಳು, ರಾಜ್ಯ ಸಾಮರ್ಥ್ಯ ಮರು ಹಂಚಿಕೆ.",
    "Tenant Admin": "ಟೆನೆಂಟ್ ಅಡ್ಮಿನ್ ನೋಟ — ಟೆನೆಂಟ್ ಆಡಳಿತ, ಪ್ರವೇಶ ನೀತಿಗಳು, ಟೆಲಿಮೆಟ್ರಿ ಆರೋಗ್ಯ, ಕೋಟಾ ಯೋಜನೆ.",
  } as const;
  return ({ en, hi, ta, kn } as const)[lang][role];
}

// ---------------- Data-driven remediation library ----------------
// Outputs experiment specs (hypothesis · variant · sample size · primary metric · MDE · guardrail)
// rather than UX cosmetics. Tailored per role and per intent.
type Topic = "completion" | "stages" | "trend" | "volume" | "compare" | "themes" | "default";

function remediationsFor(role: Role, topic: Topic, lang: Language): string[] {
  const PM: Record<Topic, string[]> = {
    completion: [
      "A/B test: split PTM_DISCUSSION_TOPICS into 2 shorter prompts. Control = current; Variant = chunked. n≥1,800/arm, primary = COMPLETED rate, MDE +3pp, 14-day run, guardrail = avg messages/session.",
      "Cohort experiment: enable a 24-hour WhatsApp re-engagement nudge for PAUSED sessions in 3 randomized districts; compare reactivation rate vs 3 holdout districts.",
      "Stratify completion by facilitator: flag bottom-quartile facilitators (>15pp below district median, n≥30 sessions) and trigger a structured coaching loop.",
      "Set a weekly alert when COMPLETED rate drops >5pp WoW at the block level; auto-create a triage ticket with the top 3 drop-off stages.",
    ],
    stages: [
      "Funnel diagnostic: compute stage-to-stage retention; any stage with <70% pass-through becomes a candidate for a content variant test.",
      "A/B test the lowest-retention stage with 2 alternative phrasings (n≥1,500/arm, MDE +4pp on next-stage entry, 10-day run).",
      "Quasi-experiment: roll out the winning variant in 1 state and use the other state as a synthetic control; report DiD on completion.",
      "Add a guardrail metric: drop-off must not increase on adjacent stages by more than 1.5pp before promoting the variant.",
    ],
    trend: [
      "Pre-PTM nudge experiment: send outreach 24h before predicted peak in 50% of blocks (random assignment); measure peak-day session lift vs control.",
      "Time-series anomaly rule: alert when daily messages deviate >2σ from a 28-day rolling baseline; auto-attach the top 3 stages and likely cause.",
      "Capacity-plan against the 95th-percentile peak day, not the mean — re-baseline every 4 weeks.",
    ],
    volume: [
      "Run a power calculation before any rollout: with current weekly base, an MDE of +2pp on completion needs ~3,400 sessions/arm.",
      "Tag every outreach campaign with a UTM-style cohort id so volume lift can be attributed (campaign vs organic vs facilitator-driven).",
      "Sampling audit: pull a 500-session random sample monthly and verify language detection + stage labels (target ≥97% agreement).",
    ],
    compare: [
      "Difference-in-differences: pick a leading state as treatment, lagging state as control, and measure completion delta after rolling out the next content change.",
      "Normalize by active-facilitator-days before comparing programs — raw counts mix scale with intensity.",
      "Build a propensity-matched cohort across Bihar and Karnataka on session-length and stage entry to make program comparisons causal, not just descriptive.",
    ],
    themes: [
      "Tag MI stories to the 10 canonical themes; alert when any theme exceeds 1.5× its 8-week baseline share — that is a signal for a targeted intervention.",
      "Run a content experiment for the top-2 themes (e.g., Distance, Parental Attitudes): test 2 facilitator scripts, n≥1,200 stories/arm, primary = theme-resolution flag, 21-day run.",
      "Cross-tab themes × district to identify hot-spots (>2σ above state mean) and prioritize field deployment there.",
    ],
    default: [
      "Stand up a weekly experiment review: every active A/B test reports power, lift, p-value, and guardrail status.",
      "Adopt a freeze rule: no metric definition changes during an active experiment window.",
    ],
  };
  const ORG: Record<Topic, string[]> = {
    completion: [
      "Set an org-level SLA: ≥40% COMPLETED rate per program-state cell; auto-escalate cells under SLA for two consecutive weeks.",
      "Reallocate facilitator hours from over-capacity blocks (utilization <60%) to under-served blocks (waitlist >2 weeks).",
      "Mandate a data-quality gate: program-state cells with <90% stage-label coverage are excluded from the org-level KPI until backfilled.",
    ],
    stages: [
      "Standardize the stage taxonomy across Chaupal and Chavadi so cross-program funnels are comparable; deprecate any stage with <0.5% volume.",
      "Quarterly content audit: any stage with ≥2 underperforming variants is escalated to the content design council.",
    ],
    trend: [
      "Forecast next-quarter session volume per state using a 12-week trailing AR(1) and pre-position field-team capacity ±15% around the forecast.",
      "Define an org-wide anomaly threshold (>2σ of 28-day baseline) that triggers cross-program review, not just program-level.",
    ],
    volume: [
      "Publish a monthly capacity ratio (sessions per active facilitator per week) by state; investigate cells outside the [P25, P75] band.",
      "Audit the top 5% of high-volume facilitators for quality drift — high volume without quality erodes the dataset.",
    ],
    compare: [
      "Convert raw program counts into per-1,000-active-facilitator rates before any cross-state board reporting.",
      "Triangulate program comparisons with a 3-source check (MITRA logs · facilitator reports · field audit) before resourcing decisions.",
    ],
    themes: [
      "Map themes to state-level program priorities; flag any state where the top 3 themes do not match the published focus areas.",
      "Stand up a quarterly theme council with field, content, and policy leads to reweight remediation budgets.",
    ],
    default: [
      "Publish a single org KPI tree: Reach → Engagement → Completion → Theme-resolution. Every dashboard must roll up to one of these nodes.",
      "Enforce a metric-definition registry; reject ad-hoc KPIs in board decks.",
    ],
  };
  const TENANT: Record<Topic, string[]> = {
    completion: [
      "Validate that each tenant's COMPLETED rate is computed against the same status enum; flag tenants with custom statuses for normalization.",
      "Set per-tenant ingestion SLOs: <0.5% missing status, <2-hour event-to-warehouse latency; alert on breach.",
    ],
    stages: [
      "Audit tenants for stage-name drift; require a mapping table for any custom stage before it appears in cross-tenant rollups.",
      "Enforce a schema-version pin per tenant; block rollout of new stages until the schema review passes.",
    ],
    trend: [
      "Track per-tenant API quota consumption against the trend; pre-grant headroom for tenants approaching 80% of quota.",
      "Watch for telemetry gaps (>4 contiguous low-volume hours) that look like outages, not behavior.",
    ],
    volume: [
      "Per-tenant cost-per-session metric; alert on tenants whose unit cost is >1.5× the platform median.",
      "Enforce data-residency: confirm Bihar/Karnataka events are written only to the in-region store.",
    ],
    compare: [
      "Normalize cross-tenant comparisons by active-org-days and license tier before sharing with leadership.",
      "Surface tenants whose access policy diverges from the org default (e.g., role-based access disabled).",
    ],
    themes: [
      "Confirm theme taxonomy is identical across tenants; reject local additions outside the canonical 10.",
      "Quota-protect theme-classification jobs so a high-volume tenant cannot starve smaller tenants.",
    ],
    default: [
      "Health-check the platform: ingestion lag, classification queue depth, error rate, per-tenant quota. Anything red gates new feature rollout.",
      "Quarterly access-policy review per tenant; remove dormant roles (>90 days unused).",
    ],
  };
  const map = role === "Org Admin" ? ORG : role === "Tenant Admin" ? TENANT : PM;
  const en = map[topic] ?? map.default;
  if (lang === "en") return en;
  // Lightweight translation: prefix the original (English remediation specs are deliberately precise; we keep technical terms)
  const prefix = lang === "hi" ? "डेटा-संचालित कार्रवाई: " : lang === "ta" ? "தரவு சார்ந்த நடவடிக்கை: " : "ಡೇಟಾ ಆಧಾರಿತ ಕ್ರಮ: ";
  return en.map((s) => prefix + s);
}

function buildVolume(ctx: AnswerContext, lang: Language): AnswerBlock[] {
  const m = metricsFor(ctx.program, ctx.state);
  const lab = L[lang];
  const days = filterDays(m.by_day, ctx.rangeKey);
  const msgsInRange = days.reduce((a, [, c]) => a + c, 0);
  const sessDays = filterDays(m.by_day_sess, ctx.rangeKey);
  const sessInRange = sessDays.reduce((a, [, c]) => a + c, 0);
  return [
    { type: "kpi", label: lab.totalConvos, value: fmt(msgsInRange), delta: ctx.rangeLabel, deltaDir: "up" },
    { type: "kpi", label: lab.totalSessions, value: fmt(sessInRange), delta: pct(sessInRange, m.total_sessions) + " of all-time", deltaDir: "flat" },
    { type: "trend", label: lab.dailyTrend, period: ctx.rangeLabel, points: days.map(([, c]) => c) },
    {
      type: "interpretation",
      text:
        lang === "en"
          ? `Across ${PROGRAM_LABELS.en[ctx.program]} (${STATE_LABELS.en[ctx.state]}), ${fmt(msgsInRange)} messages were exchanged in ${ctx.rangeLabel.toLowerCase()} from ${fmt(sessInRange)} parent sessions. Activity peaks during PTM cycles — the top 3 days account for the majority of volume.`
          : lang === "hi"
            ? `${PROGRAM_LABELS.hi[ctx.program]} (${STATE_LABELS.hi[ctx.state]}) में ${ctx.rangeLabel} के दौरान ${fmt(sessInRange)} अभिभावक सत्रों से ${fmt(msgsInRange)} संदेशों का आदान-प्रदान हुआ। PTM चक्रों के दौरान गतिविधि चरम पर रहती है।`
            : lang === "ta"
              ? `${PROGRAM_LABELS.ta[ctx.program]} (${STATE_LABELS.ta[ctx.state]}) இல் ${ctx.rangeLabel} காலத்தில் ${fmt(sessInRange)} பெற்றோர் அமர்வுகளில் இருந்து ${fmt(msgsInRange)} செய்திகள் பரிமாறப்பட்டன. PTM சுழற்சிகளின் போது செயல்பாடு உச்சத்தில் உள்ளது.`
              : `${PROGRAM_LABELS.kn[ctx.program]} (${STATE_LABELS.kn[ctx.state]}) ನಲ್ಲಿ ${ctx.rangeLabel} ಅವಧಿಯಲ್ಲಿ ${fmt(sessInRange)} ಪೋಷಕ ಸೆಷನ್‌ಗಳಿಂದ ${fmt(msgsInRange)} ಸಂದೇಶಗಳು ವಿನಿಮಯವಾದವು. PTM ಚಕ್ರಗಳಲ್ಲಿ ಚಟುವಟಿಕೆ ಗರಿಷ್ಠ ಮಟ್ಟದಲ್ಲಿರುತ್ತದೆ.`,
    },
    { type: "followups", items: SUGGESTED_PROMPTS[lang].slice(1, 4) },
  ];
}

function buildCompletion(ctx: AnswerContext, lang: Language): AnswerBlock[] {
  const m = metricsFor(ctx.program, ctx.state);
  const lab = L[lang];
  const total = m.by_status.reduce((a, [, c]) => a + c, 0);
  const get = (k: string) => m.by_status.find(([s]) => s === k)?.[1] ?? 0;
  const completed = get("COMPLETED");
  const inProgress = get("IN_PROGRESS");
  const paused = get("PAUSED");
  const started = get("STARTED");
  const rate = pct(completed, total);
  return [
    { type: "kpi", label: lab.completionRate, value: rate, delta: `${fmt(completed)} / ${fmt(total)} sessions`, deltaDir: "flat" },
    {
      type: "breakdown",
      label: lab.statusBreakdown,
      rows: [
        { name: lang === "en" ? "Completed" : lang === "hi" ? "पूर्ण" : lang === "ta" ? "முடிந்தது" : "ಪೂರ್ಣ", value: fmt(completed), delta: pct(completed, total), tone: "pos" },
        { name: lang === "en" ? "In progress" : lang === "hi" ? "जारी" : lang === "ta" ? "நடைபெற்றுக்கொண்டிருக்கிறது" : "ಪ್ರಗತಿಯಲ್ಲಿದೆ", value: fmt(inProgress), delta: pct(inProgress, total) },
        { name: lang === "en" ? "Started but not engaged" : lang === "hi" ? "शुरू, लेकिन निष्क्रिय" : lang === "ta" ? "தொடங்கி நிறுத்தப்பட்டது" : "ಪ್ರಾರಂಭವಾದ ಆದರೆ ಸಕ್ರಿಯವಲ್ಲ", value: fmt(started), delta: pct(started, total), tone: "neg" },
        { name: lang === "en" ? "Paused" : lang === "hi" ? "रुका हुआ" : lang === "ta" ? "இடைநிறுத்தப்பட்டது" : "ವಿರಾಮಗೊಂಡಿದೆ", value: fmt(paused), delta: pct(paused, total) },
      ],
    },
    {
      type: "interpretation",
      text: roleScope(ctx.role, lang) + " " + (
        lang === "en"
          ? `Of ${fmt(total)} sessions, ${rate} reached COMPLETED. The largest leak is between INTRODUCTION → PTM_DISCUSSION_TOPICS (${pct(started, total)} stall as STARTED-but-inactive). Treat this as the primary lever for the next experimentation cycle.`
          : lang === "hi"
            ? `${fmt(total)} सत्रों में से ${rate} पूर्ण हुए। सबसे बड़ा रिसाव परिचय → PTM चर्चा विषय के बीच है (${pct(started, total)} STARTED-निष्क्रिय)। अगले प्रयोग चक्र के लिए यही प्रमुख लीवर है।`
            : lang === "ta"
              ? `${fmt(total)} அமர்வுகளில் ${rate} முடிந்தது. மிகப்பெரிய கசிவு INTRODUCTION → PTM தலைப்புகளுக்கு இடையில் (${pct(started, total)} செயலற்றது). அடுத்த சோதனை சுழற்சிக்கான முதன்மை லீவர்.`
              : `${fmt(total)} ಸೆಷನ್‌ಗಳಲ್ಲಿ ${rate} ಪೂರ್ಣಗೊಂಡಿವೆ. ಅತಿ ದೊಡ್ಡ ಸೋರಿಕೆ INTRODUCTION → PTM ಚರ್ಚಾ ವಿಷಯಗಳ ನಡುವೆ (${pct(started, total)} ನಿಷ್ಕ್ರಿಯ). ಮುಂದಿನ ಪ್ರಯೋಗ ಚಕ್ರಕ್ಕೆ ಪ್ರಮುಖ ಲೀವರ್.`
      ),
    },
    {
      type: "drivers",
      items: [
        { label: lang === "en" ? "Long PTM topic stage causing fatigue" : "PTM विषय चरण थकान का कारण", impact: pct(inProgress, total), tone: "neg" },
        { label: lang === "en" ? "Drop-off after introduction" : "परिचय के बाद छूटना", impact: pct(started, total), tone: "neg" },
        { label: lang === "en" ? "Strong appreciation stage retention" : "प्रशंसा चरण में अच्छा बने रहना", impact: "+", tone: "pos" },
      ],
    },
    {
      type: "remedials",
      items: remediationsFor(ctx.role, "completion", lang),
    },
    { type: "followups", items: SUGGESTED_PROMPTS[lang].filter((_, i) => i !== 5).slice(0, 3) },
  ];
}

function buildStages(ctx: AnswerContext, lang: Language): AnswerBlock[] {
  const m = metricsFor(ctx.program, ctx.state);
  const lab = L[lang];
  const top = m.by_stage.slice(0, 8);
  const total = top.reduce((a, [, c]) => a + c, 0);
  return [
    { type: "kpi", label: lang === "en" ? "Stages tracked" : lang === "hi" ? "ट्रैक किए गए चरण" : lang === "ta" ? "கண்காணிக்கப்பட்ட நிலைகள்" : "ಟ್ರ್ಯಾಕ್ ಮಾಡಿದ ಹಂತಗಳು", value: String(m.by_stage.length), delta: fmt(total) + " msgs in top 8", deltaDir: "flat" },
    {
      type: "breakdown",
      label: lab.topStages,
      rows: top.map(([s, c]) => ({ name: stageName(s, lang), value: fmt(c), delta: pct(c, m.total_msgs), tone: "pos" as const })),
    },
    {
      type: "interpretation",
      text:
        lang === "en"
          ? `PTM-related stages dominate engagement: discussion topics, scheduling, and attendance barriers together drive over a third of all messages. School experience feedback is the strongest qualitative signal — it's where parents share what's working.`
          : lang === "hi"
            ? `PTM से जुड़े चरण भागीदारी में अग्रणी हैं: चर्चा विषय, समय निर्धारण, और उपस्थिति बाधाएँ मिलकर सभी संदेशों का एक तिहाई से अधिक हैं। स्कूल अनुभव फीडबैक सबसे मजबूत गुणात्मक संकेत है।`
            : lang === "ta"
              ? `PTM தொடர்பான நிலைகள் ஈடுபாட்டில் முன்னணியில் உள்ளன: விவாத தலைப்புகள், அட்டவணை, மற்றும் வருகை தடைகள் ஒன்றாக அனைத்து செய்திகளில் மூன்றில் ஒரு பகுதிக்கு மேல் உள்ளன.`
              : `PTM ಸಂಬಂಧಿತ ಹಂತಗಳು ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆಯಲ್ಲಿ ಮುಂಚೂಣಿಯಲ್ಲಿವೆ: ಚರ್ಚಾ ವಿಷಯಗಳು, ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಹಾಜರಾತಿ ಅಡೆತಡೆಗಳು ಒಟ್ಟಾಗಿ ಎಲ್ಲಾ ಸಂದೇಶಗಳ ಮೂರನೇ ಒಂದು ಭಾಗಕ್ಕಿಂತ ಹೆಚ್ಚು.`,
    },
    { type: "followups", items: SUGGESTED_PROMPTS[lang].slice(2, 5) },
  ];
}

function buildProgramCompare(_ctx: AnswerContext, lang: Language): AnswerBlock[] {
  const lab = L[lang];
  const programs: ProgramKey[] = ["chaupal_bihar", "chavadi_karnataka", "mi_bihar", "mi_karnataka"];
  return [
    {
      type: "breakdown",
      label: lab.programCompare,
      rows: programs.map((p) => {
        const m = METRICS[p];
        return { name: PROGRAM_LABELS[lang][p], value: fmt(m.total_msgs), delta: fmt(m.total_sessions) + " sessions", tone: "pos" as const };
      }),
    },
    {
      type: "interpretation",
      text:
        lang === "en"
          ? "All four programs are running at near-equal scale (~105K messages each, ~58K sessions). Bihar Chaupal and Karnataka Chavadi mirror each other closely; Micro-Improvement story conversations are slightly larger in both states because parents tend to share longer narratives."
          : lang === "hi"
            ? "चारों कार्यक्रम लगभग समान पैमाने पर चल रहे हैं (~1.05 लाख संदेश प्रत्येक, ~58 हज़ार सत्र)। बिहार चौपाल और कर्नाटक चावड़ी एक-दूसरे का प्रतिबिम्ब हैं; सूक्ष्म सुधार कहानी बातचीत थोड़ी बड़ी है।"
            : lang === "ta"
              ? "நான்கு திட்டங்களும் கிட்டத்தட்ட சம அளவில் இயங்குகின்றன (~1.05 லட்சம் செய்திகள் ஒவ்வொன்றும், ~58 ஆயிரம் அமர்வுகள்). நுண் முன்னேற்ற கதை உரையாடல்கள் சற்று பெரியவை."
              : "ನಾಲ್ಕು ಕಾರ್ಯಕ್ರಮಗಳು ಬಹುತೇಕ ಸಮಾನ ಪ್ರಮಾಣದಲ್ಲಿ ನಡೆಯುತ್ತಿವೆ (~1.05 ಲಕ್ಷ ಸಂದೇಶಗಳು ಪ್ರತಿ, ~58 ಸಾವಿರ ಸೆಷನ್‌ಗಳು). ಸೂಕ್ಷ್ಮ ಸುಧಾರಣಾ ಕಥಾ ಸಂಭಾಷಣೆಗಳು ಸ್ವಲ್ಪ ದೊಡ್ಡವು.",
    },
    { type: "followups", items: SUGGESTED_PROMPTS[lang].slice(0, 3) },
  ];
}

function buildStateCompare(_ctx: AnswerContext, lang: Language): AnswerBlock[] {
  const lab = L[lang];
  const states: StateKey[] = ["Bihar", "Karnataka"];
  return [
    {
      type: "breakdown",
      label: lab.stateCompare,
      rows: states.map((st) => {
        const m = METRICS[st];
        return { name: STATE_LABELS[lang][st], value: fmt(m.total_msgs), delta: fmt(m.total_sessions) + " sessions", tone: "pos" as const };
      }),
    },
    {
      type: "interpretation",
      text:
        lang === "en"
          ? "Karnataka shows marginally higher message volume than Bihar across the same conversation surfaces, suggesting parents engage in slightly longer threads — a healthy depth signal."
          : lang === "hi"
            ? "कर्नाटक में बिहार की तुलना में थोड़ी अधिक संदेश मात्रा है, जो दर्शाता है कि अभिभावक अधिक लंबी बातचीत में भाग लेते हैं।"
            : lang === "ta"
              ? "பீகாரை விட கர்நாடகாவில் சற்று அதிக செய்தி அளவு உள்ளது, பெற்றோர்கள் நீண்ட உரையாடல்களில் ஈடுபடுகிறார்கள் என்பதைக் காட்டுகிறது."
              : "ಬಿಹಾರಕ್ಕಿಂತ ಕರ್ನಾಟಕದಲ್ಲಿ ಸ್ವಲ್ಪ ಹೆಚ್ಚಿನ ಸಂದೇಶ ಪ್ರಮಾಣವಿದೆ.",
    },
    { type: "followups", items: SUGGESTED_PROMPTS[lang].slice(1, 4) },
  ];
}

function buildTrend(ctx: AnswerContext, lang: Language): AnswerBlock[] {
  const m = metricsFor(ctx.program, ctx.state);
  const lab = L[lang];
  const days = filterDays(m.by_day, ctx.rangeKey);
  return [
    { type: "trend", label: lab.dailyTrend, period: ctx.rangeLabel, points: days.map(([, c]) => c) },
    {
      type: "breakdown",
      label: lang === "en" ? "Top days by activity" : lang === "hi" ? "सबसे सक्रिय दिन" : lang === "ta" ? "முன்னணி நாட்கள்" : "ಮುಖ್ಯ ದಿನಗಳು",
      rows: [...days].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([d, c]) => ({ name: d, value: fmt(c), tone: "pos" as const })),
    },
    {
      type: "interpretation",
      text:
        lang === "en"
          ? `Activity is concentrated in PTM windows. The 3 highest-volume days carry roughly 70% of weekly messages — schedule outreach campaigns 1 day before these peaks.`
          : lang === "hi"
            ? `गतिविधि PTM विंडो में केंद्रित है। शीर्ष 3 दिन साप्ताहिक संदेशों का लगभग 70% लाते हैं — इन शिखरों से 1 दिन पहले अभियान चलाएँ।`
            : lang === "ta"
              ? `செயல்பாடு PTM காலங்களில் குவிந்துள்ளது. மிக உயர் 3 நாட்கள் வாராந்திர செய்திகளில் ~70% கொண்டுள்ளன.`
              : `ಚಟುವಟಿಕೆ PTM ಅವಧಿಗಳಲ್ಲಿ ಕೇಂದ್ರೀಕೃತವಾಗಿದೆ. ಅಗ್ರ 3 ದಿನಗಳು ಸಾಪ್ತಾಹಿಕ ಸಂದೇಶಗಳ ~70% ಹೊಂದಿವೆ.`,
    },
    { type: "followups", items: SUGGESTED_PROMPTS[lang].slice(0, 3) },
  ];
}

function buildDefault(ctx: AnswerContext, lang: Language): AnswerBlock[] {
  const m = metricsFor(ctx.program, ctx.state);
  const lab = L[lang];
  return [
    { type: "kpi", label: lab.overview, value: `${fmt(m.total_msgs)} msgs · ${fmt(m.total_sessions)} sessions`, delta: ctx.rangeLabel, deltaDir: "flat" },
    {
      type: "breakdown",
      label: lab.programCompare,
      rows: (["chaupal_bihar", "chavadi_karnataka", "mi_bihar", "mi_karnataka"] as ProgramKey[]).map((p) => ({
        name: PROGRAM_LABELS[lang][p],
        value: fmt(METRICS[p].total_msgs),
        delta: fmt(METRICS[p].total_sessions) + " sessions",
      })),
    },
    {
      type: "interpretation",
      text:
        lang === "en"
          ? "MITRA is live across Bihar and Karnataka, running Chaupal/Chavadi parent conversations and Micro-Improvement story collection. Together the four programs have logged 4.23 lakh messages across 2.34 lakh parent sessions in the most recent month."
          : lang === "hi"
            ? "MITRA बिहार और कर्नाटक में सक्रिय है, चौपाल/चावड़ी अभिभावक बातचीत और सूक्ष्म सुधार कहानियाँ चला रहा है। चारों कार्यक्रमों ने हाल के महीने में 4.23 लाख संदेश और 2.34 लाख सत्र दर्ज किए हैं।"
            : lang === "ta"
              ? "MITRA பீகார் மற்றும் கர்நாடகாவில் இயங்குகிறது, சௌபால்/சாவடி பெற்றோர் உரையாடல்கள் மற்றும் நுண் முன்னேற்ற கதைகளை சேகரிக்கிறது. நான்கு திட்டங்களும் சேர்ந்து 4.23 லட்சம் செய்திகளை பதிவு செய்துள்ளன."
              : "MITRA ಬಿಹಾರ ಮತ್ತು ಕರ್ನಾಟಕದಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿದೆ. ನಾಲ್ಕು ಕಾರ್ಯಕ್ರಮಗಳು ಒಟ್ಟಾಗಿ 4.23 ಲಕ್ಷ ಸಂದೇಶಗಳನ್ನು ದಾಖಲಿಸಿವೆ.",
    },
    { type: "followups", items: SUGGESTED_PROMPTS[lang].slice(0, 3) },
  ];
}

export function generateAnswer(question: string, language: Language, ctx: AnswerContext): Answer {
  const intent = routeIntent(question);
  const m = metricsFor(ctx.program, ctx.state);
  let blocks: AnswerBlock[];
  switch (intent) {
    case "volume": blocks = buildVolume(ctx, language); break;
    case "completion": blocks = buildCompletion(ctx, language); break;
    case "stages": blocks = buildStages(ctx, language); break;
    case "compare_program": blocks = buildProgramCompare(ctx, language); break;
    case "compare_state": blocks = buildStateCompare(ctx, language); break;
    case "trend": blocks = buildTrend(ctx, language); break;
    default: blocks = buildDefault(ctx, language);
  }
  return {
    id: crypto.randomUUID(),
    question,
    language,
    createdAt: new Date().toISOString(),
    source: makeSource(ctx, language, m),
    blocks,
  };
}
