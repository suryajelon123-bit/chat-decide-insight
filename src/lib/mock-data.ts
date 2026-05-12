export type Language = "en" | "hi" | "ta" | "kn";

export type AnswerBlock =
  | { type: "kpi"; label: string; value: string; delta?: string; deltaDir?: "up" | "down" | "flat" }
  | { type: "trend"; label: string; points: number[]; period: string }
  | { type: "interpretation"; text: string }
  | { type: "drivers"; items: { label: string; impact: string; tone: "neg" | "pos" | "neutral" }[] }
  | { type: "remedials"; items: string[] }
  | { type: "breakdown"; label: string; rows: { name: string; value: string; delta?: string; tone?: "pos" | "neg" }[] }
  | { type: "followups"; items: string[] };

export type Source = {
  table: string;
  filters: string[];
  timeRange: string;
  rows: number;
};

export type Answer = {
  id: string;
  question: string;
  language: Language;
  source: Source;
  blocks: AnswerBlock[];
  createdAt: string;
};

export type Turn =
  | { id: string; role: "user"; text: string; language: Language; createdAt: string }
  | { id: string; role: "assistant"; answer: Answer };

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

export const ROLES = ["Program Manager", "State Lead", "District Lead"] as const;

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
  collective: string;
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
    appTagline: "Shikshagraha Insights",
    newConversation: "New conversation",
    role: "Role",
    saved: "Saved prompts",
    recent: "Recent threads",
    language: "Language",
    welcomeTitle: "Ask anything about the Shikshagraha movement",
    welcomeSubtitle: "Real-time numbers from the Shikshagraha dashboard — micro-improvements, leaders, schools, and community impact. Ask in your language, get answers in your language.",
    composerPlaceholder: "Ask about a metric, trend, or what to do next…",
    ask: "Ask",
    thinking: "Querying dashboard, grounding response…",
    contextHeader: "Active context",
    state: "State",
    collective: "Collective",
    dateRange: "Date range",
    sourceTrace: "Source trace",
    table: "Table",
    filters: "Filters applied",
    timeRange: "Time range",
    rows: "Rows scanned",
    groundedNote: "Grounded responses. Metric values come from the Shikshagraha dashboard. Insights and remedials are AI-generated and clearly labeled.",
    followupHeader: "Ask a follow-up",
    fact: "Fact",
    insight: "Insight",
    interpretation: "Interpretation",
    drivers: "Likely drivers",
    remedials: "Recommended actions",
    starterHeader: "Try one of these to get started",
    share: "Share",
    trustChip: "Live · Shikshagraha dashboard",
  },
  hi: {
    appTagline: "शिक्षाग्रह इनसाइट्स",
    newConversation: "नई बातचीत",
    role: "भूमिका",
    saved: "सहेजे गए प्रश्न",
    recent: "हाल की बातचीत",
    language: "भाषा",
    welcomeTitle: "शिक्षाग्रह आंदोलन के बारे में कुछ भी पूछें",
    welcomeSubtitle: "शिक्षाग्रह डैशबोर्ड से लाइव आंकड़े — सूक्ष्म सुधार, नेता, स्कूल और सामुदायिक प्रभाव। अपनी भाषा में पूछें, अपनी भाषा में उत्तर पाएं।",
    composerPlaceholder: "किसी मीट्रिक, ट्रेंड या अगले कदम के बारे में पूछें…",
    ask: "पूछें",
    thinking: "डैशबोर्ड से डेटा निकाला जा रहा है…",
    contextHeader: "सक्रिय संदर्भ",
    state: "राज्य",
    collective: "सामूहिक",
    dateRange: "अवधि",
    sourceTrace: "स्रोत विवरण",
    table: "तालिका",
    filters: "लागू फ़िल्टर",
    timeRange: "समय सीमा",
    rows: "स्कैन की गई पंक्तियाँ",
    groundedNote: "तथ्य आधारित उत्तर। आंकड़े शिक्षाग्रह डैशबोर्ड से हैं। व्याख्या और सुझाव AI द्वारा उत्पन्न हैं।",
    followupHeader: "एक और प्रश्न पूछें",
    fact: "तथ्य",
    insight: "विश्लेषण",
    interpretation: "व्याख्या",
    drivers: "संभावित कारण",
    remedials: "सुझाई गई कार्रवाई",
    starterHeader: "शुरू करने के लिए इनमें से एक चुनें",
    share: "साझा करें",
    trustChip: "लाइव · शिक्षाग्रह डैशबोर्ड",
  },
  ta: {
    appTagline: "ஷிக்ஷாக்ரஹா நுண்ணறிவு",
    newConversation: "புதிய உரையாடல்",
    role: "பங்கு",
    saved: "சேமித்த கேள்விகள்",
    recent: "சமீபத்திய உரையாடல்கள்",
    language: "மொழி",
    welcomeTitle: "ஷிக்ஷாக்ரஹா இயக்கம் பற்றி எதையும் கேளுங்கள்",
    welcomeSubtitle: "ஷிக்ஷாக்ரஹா டாஷ்போர்டில் இருந்து நேரடி எண்கள் — நுண் முன்னேற்றங்கள், தலைவர்கள், பள்ளிகள், சமூக தாக்கம். உங்கள் மொழியில் கேளுங்கள், உங்கள் மொழியில் பதில் பெறுங்கள்.",
    composerPlaceholder: "ஒரு அளவீடு, போக்கு அல்லது அடுத்த நடவடிக்கை பற்றி கேளுங்கள்…",
    ask: "கேள்",
    thinking: "டாஷ்போர்டில் இருந்து தரவு பெறப்படுகிறது…",
    contextHeader: "செயல் சூழல்",
    state: "மாநிலம்",
    collective: "கூட்டு",
    dateRange: "கால அளவு",
    sourceTrace: "மூல விவரம்",
    table: "அட்டவணை",
    filters: "பயன்படுத்திய வடிகட்டிகள்",
    timeRange: "கால வரம்பு",
    rows: "ஸ்கேன் செய்யப்பட்ட வரிசைகள்",
    groundedNote: "உண்மை அடிப்படையிலான பதில்கள். எண்கள் ஷிக்ஷாக்ரஹா டாஷ்போர்டில் இருந்து. விளக்கம் மற்றும் பரிந்துரைகள் AI மூலம் உருவாக்கப்பட்டவை.",
    followupHeader: "மேலும் ஒரு கேள்வி கேளுங்கள்",
    fact: "உண்மை",
    insight: "நுண்ணறிவு",
    interpretation: "விளக்கம்",
    drivers: "சாத்தியமான காரணங்கள்",
    remedials: "பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்",
    starterHeader: "தொடங்க இவற்றில் ஒன்றை முயற்சிக்கவும்",
    share: "பகிர்",
    trustChip: "நேரடி · ஷிக்ஷாக்ரஹா டாஷ்போர்டு",
  },
  kn: {
    appTagline: "ಶಿಕ್ಷಾಗ್ರಹ ಒಳನೋಟಗಳು",
    newConversation: "ಹೊಸ ಸಂಭಾಷಣೆ",
    role: "ಪಾತ್ರ",
    saved: "ಉಳಿಸಿದ ಪ್ರಶ್ನೆಗಳು",
    recent: "ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆಗಳು",
    language: "ಭಾಷೆ",
    welcomeTitle: "ಶಿಕ್ಷಾಗ್ರಹ ಚಳವಳಿಯ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ",
    welcomeSubtitle: "ಶಿಕ್ಷಾಗ್ರಹ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ನೇರ ಸಂಖ್ಯೆಗಳು — ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು, ನಾಯಕರು, ಶಾಲೆಗಳು ಮತ್ತು ಸಮುದಾಯ ಪ್ರಭಾವ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರ ಪಡೆಯಿರಿ.",
    composerPlaceholder: "ಮೆಟ್ರಿಕ್, ಟ್ರೆಂಡ್ ಅಥವಾ ಮುಂದಿನ ಹಂತದ ಬಗ್ಗೆ ಕೇಳಿ…",
    ask: "ಕೇಳಿ",
    thinking: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ಡೇಟಾ ಪಡೆಯಲಾಗುತ್ತಿದೆ…",
    contextHeader: "ಸಕ್ರಿಯ ಸಂದರ್ಭ",
    state: "ರಾಜ್ಯ",
    collective: "ಸಾಮೂಹಿಕ",
    dateRange: "ಕಾಲಾವಧಿ",
    sourceTrace: "ಮೂಲ ವಿವರ",
    table: "ಕೋಷ್ಟಕ",
    filters: "ಅನ್ವಯಿಸಿದ ಫಿಲ್ಟರ್‌ಗಳು",
    timeRange: "ಸಮಯ ಶ್ರೇಣಿ",
    rows: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಸಾಲುಗಳು",
    groundedNote: "ಸತ್ಯ ಆಧಾರಿತ ಉತ್ತರಗಳು. ಸಂಖ್ಯೆಗಳು ಶಿಕ್ಷಾಗ್ರಹ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ. ವ್ಯಾಖ್ಯಾನ ಮತ್ತು ಸಲಹೆಗಳು AI ರಚಿತ.",
    followupHeader: "ಮತ್ತೊಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ",
    fact: "ಸತ್ಯ",
    insight: "ಒಳನೋಟ",
    interpretation: "ವ್ಯಾಖ್ಯಾನ",
    drivers: "ಸಂಭಾವ್ಯ ಕಾರಣಗಳು",
    remedials: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು",
    starterHeader: "ಪ್ರಾರಂಭಿಸಲು ಇವುಗಳಲ್ಲಿ ಒಂದನ್ನು ಪ್ರಯತ್ನಿಸಿ",
    share: "ಹಂಚಿಕೊಳ್ಳಿ",
    trustChip: "ನೇರ · ಶಿಕ್ಷಾಗ್ರಹ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  },
};

// ---------------- Suggested starter questions (valuable, per language) ----------------
export const SUGGESTED_PROMPTS: Record<Language, string[]> = {
  en: [
    "How many micro-improvements have been initiated across India so far?",
    "Which states have the most schools driving improvements?",
    "What is the trend in leaders engaged over the last 6 months?",
    "How can we grow community-led improvements faster?",
  ],
  hi: [
    "अब तक भारत भर में कितने सूक्ष्म सुधार शुरू हुए हैं?",
    "किस राज्य में सबसे अधिक स्कूल सुधार में शामिल हैं?",
    "पिछले 6 महीनों में जुड़े नेताओं का रुझान क्या है?",
    "समुदाय-नेतृत्व वाले सुधारों को तेज़ी से कैसे बढ़ाया जाए?",
  ],
  ta: [
    "இந்தியா முழுவதும் இதுவரை எத்தனை நுண் முன்னேற்றங்கள் தொடங்கப்பட்டுள்ளன?",
    "எந்த மாநிலங்களில் மிக அதிகமான பள்ளிகள் முன்னேற்றத்தில் ஈடுபட்டுள்ளன?",
    "கடந்த 6 மாதங்களில் ஈடுபட்ட தலைவர்களின் போக்கு என்ன?",
    "சமூகம் வழிநடத்தும் முன்னேற்றங்களை விரைவாக எவ்வாறு வளர்ப்பது?",
  ],
  kn: [
    "ಇಲ್ಲಿಯವರೆಗೆ ಭಾರತದಾದ್ಯಂತ ಎಷ್ಟು ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲಾಗಿದೆ?",
    "ಯಾವ ರಾಜ್ಯಗಳಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಶಾಲೆಗಳು ಸುಧಾರಣೆಯಲ್ಲಿ ತೊಡಗಿವೆ?",
    "ಕಳೆದ 6 ತಿಂಗಳಲ್ಲಿ ತೊಡಗಿಸಿಕೊಂಡ ನಾಯಕರ ಪ್ರವೃತ್ತಿ ಏನು?",
    "ಸಮುದಾಯ ನೇತೃತ್ವದ ಸುಧಾರಣೆಗಳನ್ನು ವೇಗವಾಗಿ ಬೆಳೆಸುವುದು ಹೇಗೆ?",
  ],
};

export const RECENT_THREADS: Record<Language, { id: string; title: string; time: string }[]> = {
  en: [
    { id: "t1", title: "Micro-improvements — state breakdown", time: "2h ago" },
    { id: "t2", title: "Leader engagement trend", time: "Yesterday" },
    { id: "t3", title: "Community-led improvements outlook", time: "2d ago" },
    { id: "t4", title: "Funds mobilised vs target", time: "5d ago" },
  ],
  hi: [
    { id: "t1", title: "सूक्ष्म सुधार — राज्यवार विवरण", time: "2 घंटे पहले" },
    { id: "t2", title: "नेताओं की भागीदारी का रुझान", time: "कल" },
    { id: "t3", title: "समुदाय-नेतृत्व सुधार दृष्टिकोण", time: "2 दिन पहले" },
    { id: "t4", title: "जुटाई गई धनराशि बनाम लक्ष्य", time: "5 दिन पहले" },
  ],
  ta: [
    { id: "t1", title: "நுண் முன்னேற்றங்கள் — மாநில விவரம்", time: "2 மணி முன்" },
    { id: "t2", title: "தலைவர் ஈடுபாட்டு போக்கு", time: "நேற்று" },
    { id: "t3", title: "சமூக வழிநடத்தல் முன்னேற்றம்", time: "2 நாட்கள் முன்" },
    { id: "t4", title: "திரட்டப்பட்ட நிதி vs இலக்கு", time: "5 நாட்கள் முன்" },
  ],
  kn: [
    { id: "t1", title: "ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು — ರಾಜ್ಯವಾರು", time: "2 ಗಂಟೆ ಹಿಂದೆ" },
    { id: "t2", title: "ನಾಯಕರ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ಪ್ರವೃತ್ತಿ", time: "ನಿನ್ನೆ" },
    { id: "t3", title: "ಸಮುದಾಯ ನೇತೃತ್ವದ ಸುಧಾರಣೆಗಳು", time: "2 ದಿನ ಹಿಂದೆ" },
    { id: "t4", title: "ಸಂಗ್ರಹಿಸಿದ ನಿಧಿ vs ಗುರಿ", time: "5 ದಿನ ಹಿಂದೆ" },
  ],
};

// ---------------- Localised answer templates (Shikshagraha live numbers) ----------------
type Template = Omit<Answer, "id" | "question" | "language" | "createdAt">;

const T: Record<Language, Record<"micro" | "schools" | "leaders" | "community" | "funds" | "default", Template>> = {
  en: {
    micro: {
      source: { table: "fact_micro_improvements", filters: ["country = India", "status = initiated"], timeRange: "All time · live", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "Micro-improvements initiated", value: "14,95,470", delta: "+8.4% MoM", deltaDir: "up" },
        { type: "trend", label: "Monthly micro-improvements", period: "Last 12 months", points: [62, 68, 74, 81, 88, 94, 102, 110, 118, 124, 131, 138] },
        { type: "interpretation", text: "Micro-improvements continue to compound — over 14.9 lakh have now been initiated across 16 states and 47 districts. Growth has stayed consistently above 8% month-on-month, driven primarily by teacher-led classroom changes." },
        { type: "breakdown", label: "Top contributing states", rows: [
          { name: "Uttar Pradesh", value: "3,84,210", delta: "+11.2%", tone: "pos" },
          { name: "Madhya Pradesh", value: "2,71,540", delta: "+9.6%", tone: "pos" },
          { name: "Karnataka", value: "1,98,120", delta: "+8.4%", tone: "pos" },
          { name: "Tamil Nadu", value: "1,42,360", delta: "+7.1%", tone: "pos" },
        ]},
        { type: "followups", items: [
          "Show schools driving improvements in Uttar Pradesh",
          "How many leaders contributed to these improvements?",
          "What kinds of micro-improvements are most common?",
        ]},
      ],
    },
    schools: {
      source: { table: "fact_schools_engaged", filters: ["status = driving improvements"], timeRange: "All time · live", rows: 211167 },
      blocks: [
        { type: "kpi", label: "Schools driving improvements", value: "2,11,167", delta: "+6.7% MoM", deltaDir: "up" },
        { type: "interpretation", text: "Over 2.11 lakh public schools are now actively driving improvements — about 21% of India's 1 million public school target. Growth is led by states with strong CSO–government partnerships." },
        { type: "breakdown", label: "Top states by participating schools", rows: [
          { name: "Uttar Pradesh", value: "48,920", delta: "+9.1%", tone: "pos" },
          { name: "Karnataka", value: "31,440", delta: "+7.8%", tone: "pos" },
          { name: "Madhya Pradesh", value: "27,810", delta: "+6.4%", tone: "pos" },
          { name: "Tamil Nadu", value: "22,150", delta: "+5.9%", tone: "pos" },
          { name: "Maharashtra", value: "19,640", delta: "+5.2%", tone: "pos" },
        ]},
        { type: "remedials", items: [
          "Replicate the UP Systemic Leadership model in 3 next-tier states.",
          "Onboard 5 new momentum partners focused on under-represented states.",
          "Run a quarterly principals' samvaad in the 10 lowest-coverage districts.",
        ]},
        { type: "followups", items: [
          "Which districts have the lowest school participation?",
          "Compare schools engaged vs leaders driving",
          "What is the path to 5 lakh schools?",
        ]},
      ],
    },
    leaders: {
      source: { table: "fact_leaders_engaged", filters: ["status = driving improvements"], timeRange: "Last 6 months · live", rows: 390664 },
      blocks: [
        { type: "kpi", label: "Leaders driving improvements", value: "3,90,664", delta: "+12.1% over 6m", deltaDir: "up" },
        { type: "trend", label: "Monthly leader engagement", period: "Last 6 months", points: [285, 302, 320, 341, 366, 390] },
        { type: "interpretation", text: "Leader engagement crossed 3.9 lakh — driven by women's collectives and youth leadership cohorts. Growth has accelerated in the last 2 months as new district cohorts came online." },
        { type: "drivers", items: [
          { label: "Women Leadership Collective onboarding", impact: "+1.6 lakh", tone: "pos" },
          { label: "Youth Leadership cohorts (12 districts)", impact: "+72,000", tone: "pos" },
          { label: "Principal samvaads (UP, MP)", impact: "+48,000", tone: "pos" },
          { label: "Drop-off in 2 districts post-cohort", impact: "−9,200", tone: "neg" },
        ]},
        { type: "followups", items: [
          "Which collective drives most leader engagement?",
          "Show drop-off by district",
          "How do leaders convert into school improvements?",
        ]},
      ],
    },
    community: {
      source: { table: "fact_community_improvements", filters: ["led_by = community"], timeRange: "All time · live", rows: 35735 },
      blocks: [
        { type: "kpi", label: "Community-led improvements", value: "35,735", delta: "+14.2% MoM", deltaDir: "up" },
        { type: "interpretation", text: "Community-led improvements are the fastest-growing segment but still only ~2.4% of total micro-improvements. Scaling community ownership is the highest-leverage opportunity for the next quarter." },
        { type: "remedials", items: [
          "Launch a Shiksha Samvaad in every district with <50 community improvements.",
          "Equip 500 women leaders with the parent-engagement playbook.",
          "Pair each new community cohort with a momentum partner for 90 days.",
          "Publish monthly community impact stories on Mohini to amplify role models.",
        ]},
        { type: "followups", items: [
          "Which districts have zero community improvements?",
          "What drives a community improvement to succeed?",
          "Estimate impact if we double community cohorts",
        ]},
      ],
    },
    funds: {
      source: { table: "fact_funds_mobilised", filters: ["currency = INR"], timeRange: "FY · live", rows: 27 },
      blocks: [
        { type: "kpi", label: "Funds mobilised", value: "₹27 crore", delta: "+18% YoY", deltaDir: "up" },
        { type: "interpretation", text: "₹27 crore has been mobilised across 44 momentum partners and 15 strategic partners. Funding mix is healthy but concentrated — top 5 funders account for ~62% of inflows." },
        { type: "followups", items: [
          "Show funds by partner type",
          "Which partners are at risk of churn?",
          "What's the cost per micro-improvement?",
        ]},
      ],
    },
    default: {
      source: { table: "fact_movement_overview", filters: ["scope = India"], timeRange: "All time · live", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "Movement footprint", value: "16 states · 47 districts", delta: "Active", deltaDir: "flat" },
        { type: "breakdown", label: "Live numbers from the dashboard", rows: [
          { name: "Micro-improvements initiated", value: "14,95,470" },
          { name: "Leaders driving improvements", value: "3,90,664" },
          { name: "Schools driving improvements", value: "2,11,167" },
          { name: "Community-led improvements", value: "35,735" },
          { name: "Momentum partners", value: "44" },
          { name: "Strategic partners", value: "15" },
          { name: "Funds mobilised (INR)", value: "₹27 crore" },
        ]},
        { type: "interpretation", text: "Shikshagraha is active across 16 states and 47 districts. Schools driving improvements have crossed 2.11 lakh — about 21% of the 1 million school vision. The next inflection point is community ownership." },
        { type: "followups", items: [
          "Show the trend of micro-improvements",
          "Which states have most schools engaged?",
          "How can we grow community-led improvements?",
        ]},
      ],
    },
  },
  hi: {
    micro: {
      source: { table: "fact_micro_improvements", filters: ["देश = भारत", "स्थिति = प्रारंभ"], timeRange: "अब तक · लाइव", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "शुरू किए गए सूक्ष्म सुधार", value: "14,95,470", delta: "+8.4% मासिक", deltaDir: "up" },
        { type: "trend", label: "मासिक सूक्ष्म सुधार", period: "पिछले 12 महीने", points: [62, 68, 74, 81, 88, 94, 102, 110, 118, 124, 131, 138] },
        { type: "interpretation", text: "सूक्ष्म सुधार लगातार बढ़ रहे हैं — 16 राज्यों और 47 ज़िलों में अब तक 14.9 लाख से अधिक शुरू हो चुके हैं। मासिक वृद्धि लगातार 8% से ऊपर बनी हुई है, जिसका मुख्य कारण शिक्षक-नेतृत्व वाले कक्षा परिवर्तन हैं।" },
        { type: "breakdown", label: "शीर्ष योगदान देने वाले राज्य", rows: [
          { name: "उत्तर प्रदेश", value: "3,84,210", delta: "+11.2%", tone: "pos" },
          { name: "मध्य प्रदेश", value: "2,71,540", delta: "+9.6%", tone: "pos" },
          { name: "कर्नाटक", value: "1,98,120", delta: "+8.4%", tone: "pos" },
          { name: "तमिलनाडु", value: "1,42,360", delta: "+7.1%", tone: "pos" },
        ]},
        { type: "followups", items: [
          "उत्तर प्रदेश में सुधार करने वाले स्कूल दिखाएँ",
          "इन सुधारों में कितने नेताओं ने योगदान दिया?",
          "किस प्रकार के सूक्ष्म सुधार सबसे आम हैं?",
        ]},
      ],
    },
    schools: {
      source: { table: "fact_schools_engaged", filters: ["स्थिति = सुधार में सक्रिय"], timeRange: "अब तक · लाइव", rows: 211167 },
      blocks: [
        { type: "kpi", label: "सुधार करने वाले स्कूल", value: "2,11,167", delta: "+6.7% मासिक", deltaDir: "up" },
        { type: "interpretation", text: "2.11 लाख से अधिक सरकारी स्कूल अब सक्रिय रूप से सुधार कर रहे हैं — यह भारत के 10 लाख स्कूल लक्ष्य का लगभग 21% है। मजबूत CSO–सरकार साझेदारी वाले राज्य अग्रणी हैं।" },
        { type: "breakdown", label: "शीर्ष राज्य (भागीदार स्कूल)", rows: [
          { name: "उत्तर प्रदेश", value: "48,920", delta: "+9.1%", tone: "pos" },
          { name: "कर्नाटक", value: "31,440", delta: "+7.8%", tone: "pos" },
          { name: "मध्य प्रदेश", value: "27,810", delta: "+6.4%", tone: "pos" },
          { name: "तमिलनाडु", value: "22,150", delta: "+5.9%", tone: "pos" },
          { name: "महाराष्ट्र", value: "19,640", delta: "+5.2%", tone: "pos" },
        ]},
        { type: "remedials", items: [
          "UP के सिस्टमिक लीडरशिप मॉडल को अगले 3 राज्यों में दोहराएँ।",
          "कम भागीदारी वाले राज्यों के लिए 5 नए मोमेंटम पार्टनर जोड़ें।",
          "10 सबसे कम कवरेज वाले ज़िलों में त्रैमासिक प्रधानाचार्य संवाद आयोजित करें।",
        ]},
        { type: "followups", items: [
          "किन ज़िलों में स्कूल भागीदारी सबसे कम है?",
          "स्कूल बनाम नेताओं की तुलना दिखाएँ",
          "5 लाख स्कूलों तक पहुँचने का रास्ता क्या है?",
        ]},
      ],
    },
    leaders: {
      source: { table: "fact_leaders_engaged", filters: ["स्थिति = सक्रिय"], timeRange: "पिछले 6 माह · लाइव", rows: 390664 },
      blocks: [
        { type: "kpi", label: "सक्रिय नेता", value: "3,90,664", delta: "+12.1% (6 माह)", deltaDir: "up" },
        { type: "trend", label: "मासिक नेता भागीदारी", period: "पिछले 6 माह", points: [285, 302, 320, 341, 366, 390] },
        { type: "interpretation", text: "नेताओं की भागीदारी 3.9 लाख पार कर गई है — महिला सामूहिक और युवा नेतृत्व समूहों के नेतृत्व में। पिछले 2 महीनों में नए ज़िला समूहों के जुड़ने से वृद्धि तेज हुई है।" },
        { type: "drivers", items: [
          { label: "महिला नेतृत्व सामूहिक की भर्ती", impact: "+1.6 लाख", tone: "pos" },
          { label: "युवा नेतृत्व समूह (12 ज़िले)", impact: "+72,000", tone: "pos" },
          { label: "प्रधानाचार्य संवाद (UP, MP)", impact: "+48,000", tone: "pos" },
          { label: "2 ज़िलों में समूह के बाद गिरावट", impact: "−9,200", tone: "neg" },
        ]},
        { type: "followups", items: [
          "कौन सा सामूहिक सबसे अधिक भागीदारी लाता है?",
          "ज़िलावार गिरावट दिखाएँ",
          "नेता स्कूल सुधार में कैसे बदलते हैं?",
        ]},
      ],
    },
    community: {
      source: { table: "fact_community_improvements", filters: ["नेतृत्व = समुदाय"], timeRange: "अब तक · लाइव", rows: 35735 },
      blocks: [
        { type: "kpi", label: "समुदाय-नेतृत्व सुधार", value: "35,735", delta: "+14.2% मासिक", deltaDir: "up" },
        { type: "interpretation", text: "समुदाय-नेतृत्व सुधार सबसे तेजी से बढ़ रहे हैं लेकिन कुल का केवल ~2.4% हैं। अगली तिमाही के लिए समुदाय की भागीदारी बढ़ाना सबसे बड़ा अवसर है।" },
        { type: "remedials", items: [
          "हर ज़िले में जहाँ <50 समुदाय सुधार हैं, शिक्षा संवाद शुरू करें।",
          "500 महिला नेताओं को अभिभावक भागीदारी प्लेबुक से सुसज्जित करें।",
          "हर नए समुदाय समूह को 90 दिनों के लिए मोमेंटम पार्टनर के साथ जोड़ें।",
          "मोहिनी पर मासिक समुदाय प्रभाव कहानियाँ प्रकाशित करें।",
        ]},
        { type: "followups", items: [
          "किन ज़िलों में शून्य समुदाय सुधार हैं?",
          "एक समुदाय सुधार सफल कब होता है?",
          "अगर हम समूह दोगुना करें तो प्रभाव क्या होगा?",
        ]},
      ],
    },
    funds: {
      source: { table: "fact_funds_mobilised", filters: ["मुद्रा = INR"], timeRange: "वित्तीय वर्ष · लाइव", rows: 27 },
      blocks: [
        { type: "kpi", label: "जुटाई गई धनराशि", value: "₹27 करोड़", delta: "+18% सालाना", deltaDir: "up" },
        { type: "interpretation", text: "44 मोमेंटम पार्टनर और 15 रणनीतिक पार्टनर के माध्यम से ₹27 करोड़ जुटाए गए हैं। फंडिंग मिश्रण स्वस्थ है लेकिन केंद्रित — शीर्ष 5 फंडर ~62% योगदान देते हैं।" },
        { type: "followups", items: [
          "पार्टनर प्रकार के अनुसार धनराशि दिखाएँ",
          "किन पार्टनर के छूटने का जोखिम है?",
          "प्रति सूक्ष्म सुधार लागत क्या है?",
        ]},
      ],
    },
    default: {
      source: { table: "fact_movement_overview", filters: ["क्षेत्र = भारत"], timeRange: "अब तक · लाइव", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "आंदोलन का विस्तार", value: "16 राज्य · 47 ज़िले", delta: "सक्रिय", deltaDir: "flat" },
        { type: "breakdown", label: "डैशबोर्ड के लाइव आंकड़े", rows: [
          { name: "शुरू किए गए सूक्ष्म सुधार", value: "14,95,470" },
          { name: "सक्रिय नेता", value: "3,90,664" },
          { name: "सुधार करने वाले स्कूल", value: "2,11,167" },
          { name: "समुदाय-नेतृत्व सुधार", value: "35,735" },
          { name: "मोमेंटम पार्टनर", value: "44" },
          { name: "रणनीतिक पार्टनर", value: "15" },
          { name: "जुटाई गई धनराशि", value: "₹27 करोड़" },
        ]},
        { type: "interpretation", text: "शिक्षाग्रह 16 राज्यों और 47 ज़िलों में सक्रिय है। 2.11 लाख से अधिक स्कूल सुधार कर रहे हैं — 10 लाख स्कूल के लक्ष्य का लगभग 21%। अगला बड़ा कदम समुदाय की भागीदारी है।" },
        { type: "followups", items: [
          "सूक्ष्म सुधारों का रुझान दिखाएँ",
          "किन राज्यों में सबसे अधिक स्कूल जुड़े हैं?",
          "समुदाय-नेतृत्व सुधार कैसे बढ़ाएँ?",
        ]},
      ],
    },
  },
  ta: {
    micro: {
      source: { table: "fact_micro_improvements", filters: ["நாடு = இந்தியா", "நிலை = தொடங்கப்பட்டது"], timeRange: "இதுவரை · நேரடி", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "தொடங்கப்பட்ட நுண் முன்னேற்றங்கள்", value: "14,95,470", delta: "+8.4% மாதாந்திரம்", deltaDir: "up" },
        { type: "trend", label: "மாதாந்திர நுண் முன்னேற்றங்கள்", period: "கடந்த 12 மாதங்கள்", points: [62, 68, 74, 81, 88, 94, 102, 110, 118, 124, 131, 138] },
        { type: "interpretation", text: "நுண் முன்னேற்றங்கள் தொடர்ந்து வளர்ந்து வருகின்றன — 16 மாநிலங்கள் மற்றும் 47 மாவட்டங்களில் இதுவரை 14.9 லட்சத்திற்கும் மேற்பட்டவை தொடங்கப்பட்டுள்ளன. மாதாந்திர வளர்ச்சி தொடர்ந்து 8%-க்கு மேல் உள்ளது, முக்கியமாக ஆசிரியர் வழிநடத்தும் வகுப்பறை மாற்றங்களால் இயக்கப்படுகிறது." },
        { type: "breakdown", label: "முன்னணி பங்களிப்பு மாநிலங்கள்", rows: [
          { name: "உத்தரப் பிரதேசம்", value: "3,84,210", delta: "+11.2%", tone: "pos" },
          { name: "மத்தியப் பிரதேசம்", value: "2,71,540", delta: "+9.6%", tone: "pos" },
          { name: "கர்நாடகா", value: "1,98,120", delta: "+8.4%", tone: "pos" },
          { name: "தமிழ்நாடு", value: "1,42,360", delta: "+7.1%", tone: "pos" },
        ]},
        { type: "followups", items: [
          "உத்தரப் பிரதேசத்தில் முன்னேற்றும் பள்ளிகளைக் காட்டு",
          "இவற்றில் எத்தனை தலைவர்கள் பங்களித்தனர்?",
          "எந்த வகை நுண் முன்னேற்றங்கள் பொதுவானவை?",
        ]},
      ],
    },
    schools: {
      source: { table: "fact_schools_engaged", filters: ["நிலை = முன்னேற்றத்தில்"], timeRange: "இதுவரை · நேரடி", rows: 211167 },
      blocks: [
        { type: "kpi", label: "முன்னேறும் பள்ளிகள்", value: "2,11,167", delta: "+6.7% மாதாந்திரம்", deltaDir: "up" },
        { type: "interpretation", text: "2.11 லட்சத்திற்கும் மேற்பட்ட அரசுப் பள்ளிகள் தற்போது தீவிரமாக முன்னேறி வருகின்றன — இது இந்தியாவின் 10 லட்சம் பள்ளி இலக்கில் சுமார் 21% ஆகும். வலுவான CSO–அரசு கூட்டாண்மை கொண்ட மாநிலங்கள் முன்னணியில் உள்ளன." },
        { type: "breakdown", label: "பங்கேற்கும் பள்ளிகள் வாரியான முன்னணி மாநிலங்கள்", rows: [
          { name: "உத்தரப் பிரதேசம்", value: "48,920", delta: "+9.1%", tone: "pos" },
          { name: "கர்நாடகா", value: "31,440", delta: "+7.8%", tone: "pos" },
          { name: "மத்தியப் பிரதேசம்", value: "27,810", delta: "+6.4%", tone: "pos" },
          { name: "தமிழ்நாடு", value: "22,150", delta: "+5.9%", tone: "pos" },
          { name: "மகாராஷ்டிரா", value: "19,640", delta: "+5.2%", tone: "pos" },
        ]},
        { type: "remedials", items: [
          "உத்தரப் பிரதேச அமைப்பு தலைமை மாதிரியை அடுத்த 3 மாநிலங்களில் பின்பற்றுங்கள்.",
          "குறைவான பிரதிநிதித்துவம் கொண்ட மாநிலங்களுக்கு 5 புதிய மொமெண்டம் கூட்டாளர்களைச் சேர்க்கவும்.",
          "10 குறைந்த பாதுகாப்பு மாவட்டங்களில் காலாண்டு முதல்வர் சம்வாதத்தை நடத்துங்கள்.",
        ]},
        { type: "followups", items: [
          "எந்த மாவட்டங்களில் மிகக் குறைவான பள்ளிப் பங்கேற்பு உள்ளது?",
          "ஈடுபட்ட பள்ளிகள் vs தலைவர்கள் ஒப்பிடுக",
          "5 லட்சம் பள்ளிகளுக்கு வழி என்ன?",
        ]},
      ],
    },
    leaders: {
      source: { table: "fact_leaders_engaged", filters: ["நிலை = செயலில்"], timeRange: "கடந்த 6 மாதங்கள் · நேரடி", rows: 390664 },
      blocks: [
        { type: "kpi", label: "செயல்படும் தலைவர்கள்", value: "3,90,664", delta: "+12.1% (6 மா)", deltaDir: "up" },
        { type: "trend", label: "மாதாந்திர தலைவர் ஈடுபாடு", period: "கடந்த 6 மாதங்கள்", points: [285, 302, 320, 341, 366, 390] },
        { type: "interpretation", text: "தலைவர் ஈடுபாடு 3.9 லட்சத்தைக் கடந்துள்ளது — பெண்கள் கூட்டுக்கள் மற்றும் இளைஞர் தலைமைக் குழுக்களால் இயக்கப்படுகிறது. கடந்த 2 மாதங்களில் புதிய மாவட்டக் குழுக்கள் இணைந்ததால் வளர்ச்சி வேகப்படுத்தப்பட்டுள்ளது." },
        { type: "drivers", items: [
          { label: "பெண்கள் தலைமைக் கூட்டு சேர்க்கை", impact: "+1.6 லட்சம்", tone: "pos" },
          { label: "இளைஞர் தலைமைக் குழுக்கள் (12 மாவட்டங்கள்)", impact: "+72,000", tone: "pos" },
          { label: "முதல்வர் சம்வாதம் (UP, MP)", impact: "+48,000", tone: "pos" },
          { label: "2 மாவட்டங்களில் குழுவுக்குப் பின் வீழ்ச்சி", impact: "−9,200", tone: "neg" },
        ]},
        { type: "followups", items: [
          "எந்தக் கூட்டு அதிக ஈடுபாடு கொடுக்கிறது?",
          "மாவட்டவாரியான வீழ்ச்சியைக் காட்டு",
          "தலைவர்கள் பள்ளி முன்னேற்றங்களாக எவ்வாறு மாறுகிறார்கள்?",
        ]},
      ],
    },
    community: {
      source: { table: "fact_community_improvements", filters: ["தலைமை = சமூகம்"], timeRange: "இதுவரை · நேரடி", rows: 35735 },
      blocks: [
        { type: "kpi", label: "சமூகம் வழிநடத்தும் முன்னேற்றங்கள்", value: "35,735", delta: "+14.2% மாதாந்திரம்", deltaDir: "up" },
        { type: "interpretation", text: "சமூகம் வழிநடத்தும் முன்னேற்றங்கள் வேகமாக வளர்கின்றன ஆனால் மொத்தத்தில் சுமார் 2.4% மட்டுமே. அடுத்த காலாண்டுக்கு சமூக உரிமையை அதிகரிப்பது மிகப்பெரிய வாய்ப்பு." },
        { type: "remedials", items: [
          "<50 சமூக முன்னேற்றங்கள் உள்ள ஒவ்வொரு மாவட்டத்திலும் ஷிக்ஷா சம்வாதத்தை தொடங்கவும்.",
          "500 பெண் தலைவர்களுக்கு பெற்றோர் ஈடுபாட்டு வழிகாட்டியை வழங்கவும்.",
          "ஒவ்வொரு புதிய சமூகக் குழுவையும் 90 நாட்களுக்கு மொமெண்டம் கூட்டாளியுடன் இணைக்கவும்.",
          "மோகினியில் மாதாந்திர சமூக தாக்கக் கதைகளை வெளியிடுங்கள்.",
        ]},
        { type: "followups", items: [
          "எந்த மாவட்டங்களில் பூஜ்ய சமூக முன்னேற்றம் உள்ளது?",
          "ஒரு சமூக முன்னேற்றம் வெற்றி பெற என்ன தேவை?",
          "குழுக்களை இரட்டிப்பாக்கினால் தாக்கம் என்ன?",
        ]},
      ],
    },
    funds: {
      source: { table: "fact_funds_mobilised", filters: ["நாணயம் = INR"], timeRange: "நிதியாண்டு · நேரடி", rows: 27 },
      blocks: [
        { type: "kpi", label: "திரட்டப்பட்ட நிதி", value: "₹27 கோடி", delta: "+18% ஆண்டுக்கு", deltaDir: "up" },
        { type: "interpretation", text: "44 மொமெண்டம் கூட்டாளர்கள் மற்றும் 15 மூலோபாய கூட்டாளர்கள் மூலம் ₹27 கோடி திரட்டப்பட்டுள்ளது. நிதியளிப்பு ஆரோக்கியமானது ஆனால் குவிக்கப்பட்டுள்ளது — முதல் 5 நிதியளிப்பாளர்கள் ~62% பங்களிக்கின்றனர்." },
        { type: "followups", items: [
          "கூட்டாளர் வகை வாரியாக நிதியைக் காட்டு",
          "எந்த கூட்டாளர்கள் நீங்கும் அபாயத்தில்?",
          "ஒரு நுண் முன்னேற்றத்திற்கான செலவு என்ன?",
        ]},
      ],
    },
    default: {
      source: { table: "fact_movement_overview", filters: ["எல்லை = இந்தியா"], timeRange: "இதுவரை · நேரடி", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "இயக்கத்தின் பரப்பு", value: "16 மாநிலங்கள் · 47 மாவட்டங்கள்", delta: "செயலில்", deltaDir: "flat" },
        { type: "breakdown", label: "டாஷ்போர்டில் இருந்து நேரடி எண்கள்", rows: [
          { name: "தொடங்கப்பட்ட நுண் முன்னேற்றங்கள்", value: "14,95,470" },
          { name: "செயல்படும் தலைவர்கள்", value: "3,90,664" },
          { name: "முன்னேறும் பள்ளிகள்", value: "2,11,167" },
          { name: "சமூக வழிநடத்தும் முன்னேற்றங்கள்", value: "35,735" },
          { name: "மொமெண்டம் கூட்டாளர்கள்", value: "44" },
          { name: "மூலோபாய கூட்டாளர்கள்", value: "15" },
          { name: "திரட்டப்பட்ட நிதி", value: "₹27 கோடி" },
        ]},
        { type: "interpretation", text: "ஷிக்ஷாக்ரஹா 16 மாநிலங்கள் மற்றும் 47 மாவட்டங்களில் செயலில் உள்ளது. 2.11 லட்சத்திற்கும் மேற்பட்ட பள்ளிகள் முன்னேறி வருகின்றன — 10 லட்சம் பள்ளி இலக்கில் சுமார் 21%. அடுத்த பெரிய கட்டம் சமூக உரிமை." },
        { type: "followups", items: [
          "நுண் முன்னேற்றங்களின் போக்கைக் காட்டு",
          "எந்த மாநிலங்களில் அதிக பள்ளிகள் ஈடுபட்டுள்ளன?",
          "சமூகம் வழிநடத்தும் முன்னேற்றங்களை எப்படி வளர்ப்பது?",
        ]},
      ],
    },
  },
  kn: {
    micro: {
      source: { table: "fact_micro_improvements", filters: ["ದೇಶ = ಭಾರತ", "ಸ್ಥಿತಿ = ಆರಂಭಗೊಂಡಿದೆ"], timeRange: "ಇಲ್ಲಿಯವರೆಗೆ · ನೇರ", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "ಆರಂಭಗೊಂಡ ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು", value: "14,95,470", delta: "+8.4% ಮಾಸಿಕ", deltaDir: "up" },
        { type: "trend", label: "ಮಾಸಿಕ ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು", period: "ಕಳೆದ 12 ತಿಂಗಳುಗಳು", points: [62, 68, 74, 81, 88, 94, 102, 110, 118, 124, 131, 138] },
        { type: "interpretation", text: "ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು ನಿರಂತರವಾಗಿ ಬೆಳೆಯುತ್ತಿವೆ — 16 ರಾಜ್ಯಗಳು ಮತ್ತು 47 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಇಲ್ಲಿಯವರೆಗೆ 14.9 ಲಕ್ಷಕ್ಕೂ ಹೆಚ್ಚು ಆರಂಭಗೊಂಡಿವೆ. ಮಾಸಿಕ ಬೆಳವಣಿಗೆ ನಿರಂತರವಾಗಿ 8% ಮೇಲಿದೆ, ಶಿಕ್ಷಕ ನೇತೃತ್ವದ ತರಗತಿ ಬದಲಾವಣೆಗಳಿಂದ ಚಾಲಿತವಾಗಿದೆ." },
        { type: "breakdown", label: "ಪ್ರಮುಖ ಕೊಡುಗೆದಾರ ರಾಜ್ಯಗಳು", rows: [
          { name: "ಉತ್ತರ ಪ್ರದೇಶ", value: "3,84,210", delta: "+11.2%", tone: "pos" },
          { name: "ಮಧ್ಯ ಪ್ರದೇಶ", value: "2,71,540", delta: "+9.6%", tone: "pos" },
          { name: "ಕರ್ನಾಟಕ", value: "1,98,120", delta: "+8.4%", tone: "pos" },
          { name: "ತಮಿಳುನಾಡು", value: "1,42,360", delta: "+7.1%", tone: "pos" },
        ]},
        { type: "followups", items: [
          "ಉತ್ತರ ಪ್ರದೇಶದಲ್ಲಿ ಸುಧಾರಿಸುವ ಶಾಲೆಗಳನ್ನು ತೋರಿಸಿ",
          "ಎಷ್ಟು ನಾಯಕರು ಕೊಡುಗೆ ನೀಡಿದ್ದಾರೆ?",
          "ಯಾವ ಬಗೆಯ ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು ಸಾಮಾನ್ಯ?",
        ]},
      ],
    },
    schools: {
      source: { table: "fact_schools_engaged", filters: ["ಸ್ಥಿತಿ = ಸುಧಾರಣೆಯಲ್ಲಿ"], timeRange: "ಇಲ್ಲಿಯವರೆಗೆ · ನೇರ", rows: 211167 },
      blocks: [
        { type: "kpi", label: "ಸುಧಾರಿಸುವ ಶಾಲೆಗಳು", value: "2,11,167", delta: "+6.7% ಮಾಸಿಕ", deltaDir: "up" },
        { type: "interpretation", text: "2.11 ಲಕ್ಷಕ್ಕೂ ಹೆಚ್ಚು ಸರ್ಕಾರಿ ಶಾಲೆಗಳು ಈಗ ಸಕ್ರಿಯವಾಗಿ ಸುಧಾರಿಸುತ್ತಿವೆ — ಭಾರತದ 10 ಲಕ್ಷ ಶಾಲೆ ಗುರಿಯ ಸುಮಾರು 21%. ಬಲವಾದ CSO–ಸರ್ಕಾರ ಪಾಲುದಾರಿಕೆ ಹೊಂದಿರುವ ರಾಜ್ಯಗಳು ಮುಂಚೂಣಿಯಲ್ಲಿವೆ." },
        { type: "breakdown", label: "ಭಾಗವಹಿಸುವ ಶಾಲೆಗಳ ಪ್ರಕಾರ ಪ್ರಮುಖ ರಾಜ್ಯಗಳು", rows: [
          { name: "ಉತ್ತರ ಪ್ರದೇಶ", value: "48,920", delta: "+9.1%", tone: "pos" },
          { name: "ಕರ್ನಾಟಕ", value: "31,440", delta: "+7.8%", tone: "pos" },
          { name: "ಮಧ್ಯ ಪ್ರದೇಶ", value: "27,810", delta: "+6.4%", tone: "pos" },
          { name: "ತಮಿಳುನಾಡು", value: "22,150", delta: "+5.9%", tone: "pos" },
          { name: "ಮಹಾರಾಷ್ಟ್ರ", value: "19,640", delta: "+5.2%", tone: "pos" },
        ]},
        { type: "remedials", items: [
          "UP ನ ವ್ಯವಸ್ಥಿತ ನಾಯಕತ್ವ ಮಾದರಿಯನ್ನು ಮುಂದಿನ 3 ರಾಜ್ಯಗಳಲ್ಲಿ ಪುನರಾವರ್ತಿಸಿ.",
          "ಕಡಿಮೆ ಪ್ರಾತಿನಿಧ್ಯ ಹೊಂದಿರುವ ರಾಜ್ಯಗಳಿಗೆ 5 ಹೊಸ ಮೊಮೆಂಟಮ್ ಪಾಲುದಾರರನ್ನು ಸೇರಿಸಿ.",
          "10 ಕಡಿಮೆ ಒಳಗೊಳ್ಳುವಿಕೆಯ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ತ್ರೈಮಾಸಿಕ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಸಂವಾದವನ್ನು ನಡೆಸಿ.",
        ]},
        { type: "followups", items: [
          "ಯಾವ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಶಾಲಾ ಭಾಗವಹಿಸುವಿಕೆ ಕಡಿಮೆ ಇದೆ?",
          "ತೊಡಗಿಸಿಕೊಂಡ ಶಾಲೆಗಳು vs ನಾಯಕರು ಹೋಲಿಸಿ",
          "5 ಲಕ್ಷ ಶಾಲೆಗಳಿಗೆ ದಾರಿ ಏನು?",
        ]},
      ],
    },
    leaders: {
      source: { table: "fact_leaders_engaged", filters: ["ಸ್ಥಿತಿ = ಸಕ್ರಿಯ"], timeRange: "ಕಳೆದ 6 ತಿಂಗಳು · ನೇರ", rows: 390664 },
      blocks: [
        { type: "kpi", label: "ಸಕ್ರಿಯ ನಾಯಕರು", value: "3,90,664", delta: "+12.1% (6 ತಿಂ)", deltaDir: "up" },
        { type: "trend", label: "ಮಾಸಿಕ ನಾಯಕರ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ", period: "ಕಳೆದ 6 ತಿಂಗಳು", points: [285, 302, 320, 341, 366, 390] },
        { type: "interpretation", text: "ನಾಯಕರ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ 3.9 ಲಕ್ಷ ದಾಟಿದೆ — ಮಹಿಳಾ ಸಮೂಹಗಳು ಮತ್ತು ಯುವ ನಾಯಕತ್ವ ಗುಂಪುಗಳಿಂದ ಚಾಲಿತ. ಕಳೆದ 2 ತಿಂಗಳುಗಳಲ್ಲಿ ಹೊಸ ಜಿಲ್ಲಾ ಗುಂಪುಗಳು ಸೇರಿಕೊಂಡ ಕಾರಣ ಬೆಳವಣಿಗೆ ವೇಗಗೊಂಡಿದೆ." },
        { type: "drivers", items: [
          { label: "ಮಹಿಳಾ ನಾಯಕತ್ವ ಸಮೂಹ ಸೇರ್ಪಡೆ", impact: "+1.6 ಲಕ್ಷ", tone: "pos" },
          { label: "ಯುವ ನಾಯಕತ್ವ ಗುಂಪುಗಳು (12 ಜಿಲ್ಲೆಗಳು)", impact: "+72,000", tone: "pos" },
          { label: "ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಸಂವಾದ (UP, MP)", impact: "+48,000", tone: "pos" },
          { label: "2 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಗುಂಪಿನ ನಂತರ ಇಳಿಕೆ", impact: "−9,200", tone: "neg" },
        ]},
        { type: "followups", items: [
          "ಯಾವ ಸಮೂಹ ಹೆಚ್ಚು ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ತರುತ್ತದೆ?",
          "ಜಿಲ್ಲಾವಾರು ಇಳಿಕೆ ತೋರಿಸಿ",
          "ನಾಯಕರು ಶಾಲಾ ಸುಧಾರಣೆಗಳಾಗಿ ಹೇಗೆ ಪರಿವರ್ತನೆಗೊಳ್ಳುತ್ತಾರೆ?",
        ]},
      ],
    },
    community: {
      source: { table: "fact_community_improvements", filters: ["ನೇತೃತ್ವ = ಸಮುದಾಯ"], timeRange: "ಇಲ್ಲಿಯವರೆಗೆ · ನೇರ", rows: 35735 },
      blocks: [
        { type: "kpi", label: "ಸಮುದಾಯ ನೇತೃತ್ವದ ಸುಧಾರಣೆಗಳು", value: "35,735", delta: "+14.2% ಮಾಸಿಕ", deltaDir: "up" },
        { type: "interpretation", text: "ಸಮುದಾಯ ನೇತೃತ್ವದ ಸುಧಾರಣೆಗಳು ಅತಿ ವೇಗವಾಗಿ ಬೆಳೆಯುತ್ತಿವೆ ಆದರೆ ಒಟ್ಟು ಸುಧಾರಣೆಗಳಲ್ಲಿ ಕೇವಲ ~2.4%. ಮುಂದಿನ ತ್ರೈಮಾಸಿಕಕ್ಕೆ ಸಮುದಾಯ ಮಾಲೀಕತ್ವ ಬೆಳೆಸುವುದು ಅತಿದೊಡ್ಡ ಅವಕಾಶ." },
        { type: "remedials", items: [
          "<50 ಸಮುದಾಯ ಸುಧಾರಣೆ ಇರುವ ಪ್ರತಿ ಜಿಲ್ಲೆಯಲ್ಲಿ ಶಿಕ್ಷಾ ಸಂವಾದ ಆರಂಭಿಸಿ.",
          "500 ಮಹಿಳಾ ನಾಯಕಿಯರಿಗೆ ಪೋಷಕ-ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ಮಾರ್ಗದರ್ಶಿ ಒದಗಿಸಿ.",
          "ಪ್ರತಿ ಹೊಸ ಸಮುದಾಯ ಗುಂಪನ್ನು 90 ದಿನಗಳವರೆಗೆ ಮೊಮೆಂಟಮ್ ಪಾಲುದಾರರೊಂದಿಗೆ ಜೋಡಿಸಿ.",
          "ಮೋಹಿನಿಯಲ್ಲಿ ಮಾಸಿಕ ಸಮುದಾಯ ಪ್ರಭಾವ ಕಥೆಗಳನ್ನು ಪ್ರಕಟಿಸಿ.",
        ]},
        { type: "followups", items: [
          "ಯಾವ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಶೂನ್ಯ ಸಮುದಾಯ ಸುಧಾರಣೆಗಳಿವೆ?",
          "ಒಂದು ಸಮುದಾಯ ಸುಧಾರಣೆ ಯಶಸ್ವಿಯಾಗಲು ಏನು ಬೇಕು?",
          "ಗುಂಪುಗಳನ್ನು ದ್ವಿಗುಣಗೊಳಿಸಿದರೆ ಪ್ರಭಾವ ಏನು?",
        ]},
      ],
    },
    funds: {
      source: { table: "fact_funds_mobilised", filters: ["ಕರೆನ್ಸಿ = INR"], timeRange: "ಆರ್ಥಿಕ ವರ್ಷ · ನೇರ", rows: 27 },
      blocks: [
        { type: "kpi", label: "ಸಂಗ್ರಹಿಸಿದ ನಿಧಿ", value: "₹27 ಕೋಟಿ", delta: "+18% ವಾರ್ಷಿಕ", deltaDir: "up" },
        { type: "interpretation", text: "44 ಮೊಮೆಂಟಮ್ ಪಾಲುದಾರರು ಮತ್ತು 15 ಕಾರ್ಯತಂತ್ರ ಪಾಲುದಾರರ ಮೂಲಕ ₹27 ಕೋಟಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ. ಧನಸಹಾಯ ಆರೋಗ್ಯಕರವಾಗಿದೆ ಆದರೆ ಕೇಂದ್ರೀಕೃತವಾಗಿದೆ — ಮೇಲಿನ 5 ಧನಸಹಾಯಕರು ~62% ಕೊಡುಗೆ ನೀಡುತ್ತಾರೆ." },
        { type: "followups", items: [
          "ಪಾಲುದಾರ ವಿಧದ ಪ್ರಕಾರ ನಿಧಿ ತೋರಿಸಿ",
          "ಯಾವ ಪಾಲುದಾರರು ತೊರೆಯುವ ಅಪಾಯದಲ್ಲಿದ್ದಾರೆ?",
          "ಪ್ರತಿ ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗೆ ವೆಚ್ಚ ಎಷ್ಟು?",
        ]},
      ],
    },
    default: {
      source: { table: "fact_movement_overview", filters: ["ವ್ಯಾಪ್ತಿ = ಭಾರತ"], timeRange: "ಇಲ್ಲಿಯವರೆಗೆ · ನೇರ", rows: 1495470 },
      blocks: [
        { type: "kpi", label: "ಚಳವಳಿಯ ವ್ಯಾಪ್ತಿ", value: "16 ರಾಜ್ಯಗಳು · 47 ಜಿಲ್ಲೆಗಳು", delta: "ಸಕ್ರಿಯ", deltaDir: "flat" },
        { type: "breakdown", label: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ನೇರ ಸಂಖ್ಯೆಗಳು", rows: [
          { name: "ಆರಂಭಗೊಂಡ ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳು", value: "14,95,470" },
          { name: "ಸಕ್ರಿಯ ನಾಯಕರು", value: "3,90,664" },
          { name: "ಸುಧಾರಿಸುವ ಶಾಲೆಗಳು", value: "2,11,167" },
          { name: "ಸಮುದಾಯ ನೇತೃತ್ವದ ಸುಧಾರಣೆಗಳು", value: "35,735" },
          { name: "ಮೊಮೆಂಟಮ್ ಪಾಲುದಾರರು", value: "44" },
          { name: "ಕಾರ್ಯತಂತ್ರ ಪಾಲುದಾರರು", value: "15" },
          { name: "ಸಂಗ್ರಹಿಸಿದ ನಿಧಿ", value: "₹27 ಕೋಟಿ" },
        ]},
        { type: "interpretation", text: "ಶಿಕ್ಷಾಗ್ರಹ 16 ರಾಜ್ಯಗಳು ಮತ್ತು 47 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿದೆ. 2.11 ಲಕ್ಷಕ್ಕೂ ಹೆಚ್ಚು ಶಾಲೆಗಳು ಸುಧಾರಿಸುತ್ತಿವೆ — 10 ಲಕ್ಷ ಶಾಲೆ ಗುರಿಯ ಸುಮಾರು 21%. ಮುಂದಿನ ದೊಡ್ಡ ಹಂತ ಸಮುದಾಯ ಮಾಲೀಕತ್ವ." },
        { type: "followups", items: [
          "ಸೂಕ್ಷ್ಮ ಸುಧಾರಣೆಗಳ ಪ್ರವೃತ್ತಿ ತೋರಿಸಿ",
          "ಯಾವ ರಾಜ್ಯಗಳಲ್ಲಿ ಹೆಚ್ಚು ಶಾಲೆಗಳು ತೊಡಗಿಸಿಕೊಂಡಿವೆ?",
          "ಸಮುದಾಯ ನೇತೃತ್ವದ ಸುಧಾರಣೆಗಳನ್ನು ಹೇಗೆ ಬೆಳೆಸುವುದು?",
        ]},
      ],
    },
  },
};

// Keyword routing — works across English + Indic transliteration cues
function routeIntent(q: string): "micro" | "schools" | "leaders" | "community" | "funds" | "default" {
  const s = q.toLowerCase();
  const has = (...k: string[]) => k.some((w) => s.includes(w));
  if (has("micro", "improvement", "सूक्ष्म", "सुधार", "நுண்", "முன்னேற்ற", "ಸೂಕ್ಷ್ಮ", "ಸುಧಾರಣ")) return "micro";
  if (has("school", "स्कूल", "शाला", "பள்ளி", "ಶಾಲೆ")) return "schools";
  if (has("leader", "engaged", "engagement", "नेता", "नेतृत्व", "தலைவர்", "ஈடுபாடு", "ನಾಯಕ")) return "leaders";
  if (has("community", "samvaad", "समुदाय", "சமூக", "ಸಮುದಾಯ")) return "community";
  if (has("fund", "money", "crore", "धन", "करोड़", "நிதி", "கோடி", "ನಿಧಿ", "ಕೋಟಿ")) return "funds";
  return "default";
}

export function generateAnswer(question: string, language: Language): Answer {
  const intent = routeIntent(question);
  const template = T[language][intent];
  return {
    id: crypto.randomUUID(),
    question,
    language,
    createdAt: new Date().toISOString(),
    ...template,
  };
}

// Right-rail context options (per language)
export const STATES_OPT: Record<Language, string[]> = {
  en: ["All India", "Uttar Pradesh", "Karnataka", "Madhya Pradesh", "Tamil Nadu", "Maharashtra"],
  hi: ["संपूर्ण भारत", "उत्तर प्रदेश", "कर्नाटक", "मध्य प्रदेश", "तमिलनाडु", "महाराष्ट्र"],
  ta: ["இந்தியா முழுவதும்", "உத்தரப் பிரதேசம்", "கர்நாடகா", "மத்தியப் பிரதேசம்", "தமிழ்நாடு", "மகாராஷ்டிரா"],
  kn: ["ಇಡೀ ಭಾರತ", "ಉತ್ತರ ಪ್ರದೇಶ", "ಕರ್ನಾಟಕ", "ಮಧ್ಯ ಪ್ರದೇಶ", "ತಮಿಳುನಾಡು", "ಮಹಾರಾಷ್ಟ್ರ"],
};

export const COLLECTIVES_OPT: Record<Language, string[]> = {
  en: ["All collectives", "System Leadership", "Women Leadership", "Youth Leadership", "Commons"],
  hi: ["सभी सामूहिक", "सिस्टम नेतृत्व", "महिला नेतृत्व", "युवा नेतृत्व", "कॉमन्स"],
  ta: ["அனைத்து கூட்டுகள்", "அமைப்பு தலைமை", "பெண்கள் தலைமை", "இளைஞர் தலைமை", "காமன்ஸ்"],
  kn: ["ಎಲ್ಲಾ ಸಮೂಹಗಳು", "ವ್ಯವಸ್ಥಿತ ನಾಯಕತ್ವ", "ಮಹಿಳಾ ನಾಯಕತ್ವ", "ಯುವ ನಾಯಕತ್ವ", "ಕಾಮನ್ಸ್"],
};

export const RANGES_OPT: Record<Language, string[]> = {
  en: ["Today", "Last 7 days", "Last 30 days", "This quarter"],
  hi: ["आज", "पिछले 7 दिन", "पिछले 30 दिन", "इस तिमाही"],
  ta: ["இன்று", "கடந்த 7 நாட்கள்", "கடந்த 30 நாட்கள்", "இந்த காலாண்டு"],
  kn: ["ಇಂದು", "ಕಳೆದ 7 ದಿನಗಳು", "ಕಳೆದ 30 ದಿನಗಳು", "ಈ ತ್ರೈಮಾಸಿಕ"],
};
