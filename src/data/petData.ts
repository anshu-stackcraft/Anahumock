/**
 * Authoritative UPSSSC PET Exam Pattern, Detailed Syllabus & Slide Deck Data
 * Based on official Uttar Pradesh Subordinate Services Selection Commission notifications
 */

export interface PetSubject {
  id: string;
  nameEn: string;
  nameHi: string;
  marks: number;
  category: 'gs' | 'aptitude' | 'language' | 'high_yield';
  highYield: boolean;
  questionCount: number;
  descriptionEn: string;
  descriptionHi: string;
  topicsEn: string[];
  topicsHi: string[];
  recommendedBooks: string[];
  keyTipsEn: string;
  keyTipsHi: string;
}

export interface SlideContent {
  id: number;
  taglineEn: string;
  taglineHi: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  type: 'intro' | 'pattern' | 'weightage' | 'gs_deepdive' | 'aptitude_deepdive' | 'mega_sections' | 'current_affairs' | 'study_plan' | 'booklist' | 'exam_day';
  badge: string;
  keyStats?: { labelEn: string; labelHi: string; value: string; hintEn: string; hintHi: string }[];
  bulletPoints?: { titleEn: string; titleHi: string; descEn: string; descHi: string; highlight?: boolean }[];
  tableData?: { [key: string]: string | number }[];
  speakerNotesEn: string;
  speakerNotesHi: string;
}

export interface QuizQuestion {
  id: number;
  subjectEn: string;
  subjectHi: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
}

export interface PostCutoffInfo {
  postEn: string;
  postHi: string;
  approxVacancies: string;
  targetPercentile: string;
  safeRawScore: string;
  department: string;
}

export const EXAM_OVERVIEW = {
  examNameEn: "UPSSSC Preliminary Eligibility Test (PET)",
  examNameHi: "यूपीएसएसएससी प्रारम्भिक अर्हकारी परीक्षा (PET)",
  conductingBodyEn: "Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)",
  conductingBodyHi: "उत्तर प्रदेश अधीनस्थ सेवा चयन आयोग (लखनऊ)",
  examLevel: "State Level (Uttar Pradesh - Group B & C Recruitment)",
  mode: "Offline (OMR Based Pen & Paper)",
  durationMins: 120,
  totalQuestions: 100,
  totalMarks: 100,
  marksPerQuestion: 1,
  negativeMarking: 0.25,
  scoreValidityYears: 1,
  difficultyBenchmark: "NCERT Secondary (Class 10th) to Senior Secondary (Class 12th)",
};

export const PET_SUBJECTS: PetSubject[] = [
  {
    id: "history",
    nameEn: "Indian History",
    nameHi: "भारतीय इतिहास",
    marks: 5,
    category: "gs",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Ancient, Medieval, and Early British administration impact on Indian socio-economic fabric.",
    descriptionHi: "प्राचीन, मध्यकालीन और ब्रिटिश शासन का भारतीय सामाजिक व आर्थिक प्रभाव।",
    topicsEn: [
      "Indus Valley Civilization (हड़प्पा सभ्यता)",
      "Vedic Culture & Epics (वैदिक संस्कृति)",
      "Buddhism - Gautam Buddha (Life & Teachings)",
      "Jainism - Mahavira (Life & Teachings)",
      "Maurya Dynasty (King Ashoka)",
      "Gupta Dynasty (Samudragupta, Chandragupta II)",
      "Harshavardhana Era",
      "Rajput Period",
      "Delhi Sultanate Period",
      "Mughal Empire (Administration, Architecture)",
      "Maratha Empire (Shivaji Maharaj)",
      "Rise of British Rule & First War of Independence (1857)",
      "Socio-Economic Impact of British Rule"
    ],
    topicsHi: [
      "सिन्धु घाटी की सभ्यता",
      "वैदिक संस्कृति",
      "बौद्ध धर्म: गौतम बुद्ध (जीवनी एवं शिक्षाएं)",
      "जैन धर्म: महावीर (जीवनी एवं शिक्षाएं)",
      "मौर्य वंश: सम्राट अशोक",
      "गुप्त वंश: समुद्रगुप्त, चन्द्रगुप्त द्वितीय",
      "हर्षवर्धन",
      "राजपूत काल",
      "सल्तनत काल",
      "मुगल साम्राज्य",
      "मराठा",
      "ब्रिटिश राज का अभ्युदय एवं प्रथम स्वतंत्रता संग्राम",
      "ब्रिटिश राज का सामाजिक-आर्थिक प्रभाव"
    ],
    recommendedBooks: ["Lucent Samanya Gyan (General Knowledge)", "Ghatna Chakra Purvavlokan (History)"],
    keyTipsEn: "Focus heavily on Ashoka edicts, Buddhist Councils (dates & presidents), and 1857 revolt leaders.",
    keyTipsHi: "अशोक के शिलालेख, चारों बौद्ध संगीतियां (स्थान व अध्यक्ष) और 1857 क्रांति के केंद्रों पर ध्यान दें।"
  },
  {
    id: "inm",
    nameEn: "Indian National Movement",
    nameHi: "भारतीय राष्ट्रीय आन्दोलन",
    marks: 5,
    category: "gs",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Freedom struggle from early nationalist phase to Independence and Subhash Chandra Bose.",
    descriptionHi: "स्वाधीनता संग्राम के प्रारम्भिक वर्ष से लेकर आज़ादी व नेताजी सुभाष चन्द्र बोस तक।",
    topicsEn: [
      "Initial Phase of Freedom Movement (1885-1905)",
      "Swadeshi & Boycott Movement (1905, Bengal Partition)",
      "Revolutionary Movements & Rise of Militant Nationalism",
      "Legislative Amendments & Government of India Act 1935",
      "Quit India Movement (1942)",
      "Azad Hind Fauj & Netaji Subhash Chandra Bose",
      "Role of Mahatma Gandhi & Major Mass Satyagrahas (Champaran, Kheda, NCM, CDM)"
    ],
    topicsHi: [
      "स्वाधीनता आन्दोलन के प्रारम्भिक वर्ष",
      "स्वदेशी तथा सविनय अवज्ञा आन्दोलन: महात्मा गांधी तथा अन्य नेताओं की भूमिका",
      "क्रान्तिकारी आन्दोलन तथा उग्र राष्ट्रवाद का उदय",
      "विधायी संशोधन तथा ब्रिटिश इंडिया एक्ट, 1935",
      "भारत छोड़ो आन्दोलन, आज़ाद हिन्द फौज तथा नेताजी सुभाष चन्द्र बोस"
    ],
    recommendedBooks: ["Spectrum Modern History Summary", "Ghatna Chakra Modern History"],
    keyTipsEn: "Government of India Act 1935 and Gandhi's movements frequently appear in almost every shift.",
    keyTipsHi: "भारत शासन अधिनियम 1935 और गांधी जी के सभी प्रमुख आंदोलनों के वर्ष जरूर याद करें।"
  },
  {
    id: "geography",
    nameEn: "Geography",
    nameHi: "भूगोल",
    marks: 5,
    category: "gs",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Physical and political geography of India and the world with focus on rivers, climate and demographics.",
    descriptionHi: "भारत एवं विश्व का भौतिक व राजनीतिक भूगोल, नदियां, पर्वत, जलवायु व जनसांख्यिकी।",
    topicsEn: [
      "Rivers & River Valley Projects (India & World)",
      "Groundwater Resources",
      "Mountains, Hills & Glaciers (Himalayas, Western Ghats)",
      "Deserts & Dry Regions",
      "Forests & Wildlife Sanctuaries in India/UP",
      "Mineral Resources (Special focus on India)",
      "Political Geography of India & World",
      "Climate & Weather Zones",
      "Time Zones (IST vs GMT calculations)",
      "Demographic Changes, Census 2011 & Migration"
    ],
    topicsHi: [
      "नदियां तथा नदियों की घाटी",
      "भूजल संसाधन",
      "पर्वत, पहाड़ियाँ तथा हिमनद",
      "मरुस्थल और शुष्क क्षेत्र",
      "वन संसाधन",
      "खनिज संसाधन (विशेषकर भारत में)",
      "भारत एवं विश्व का राजनीतिक भूगोल",
      "जलवायु तथा मौसम",
      "टाइम जोन (Time Zone)",
      "जनसांख्यिकीय परिवर्तन तथा प्रवास (जनगणना 2011)"
    ],
    recommendedBooks: ["Mahesh Barnwal Geography or Lucent GK", "UP Special Geography Map Book"],
    keyTipsEn: "Memorize tributary rivers of Ganga, Yamuna, Godavari and Census 2011 UP sex ratio and literacy stats.",
    keyTipsHi: "गंगा, यमुना और दक्षिण भारत की नदियों की सहायक नदियां तथा 2011 जनगणना के आंकड़े देखें।"
  },
  {
    id: "economy",
    nameEn: "Indian Economy",
    nameHi: "भारतीय अर्थव्यवस्था",
    marks: 5,
    category: "gs",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Economic evolution from 1947 to 1991, Five-Year Plans, and Post-2014 economic structural reforms.",
    descriptionHi: "1947 से 1991 तक की अर्थव्यवस्था, पंचवर्षीय योजनाएं तथा वर्ष 2014 के पश्चात के आर्थिक सुधार।",
    topicsEn: [
      "Economy from 1947 to 1991",
      "Planning Commission & Five-Year Plans (1st to 12th)",
      "Development of Mixed Economy: Private & Public Sector",
      "Green Revolution (Harit Kranti) & White Revolution (Operation Flood)",
      "Bank Nationalization (1969 & 1980) & Banking Reforms",
      "1991 Economic LPG Reforms (Liberalization, Privatization, Globalization)",
      "Post-2014 Economic Reforms: Agricultural Reforms",
      "Structural & Labor Reforms",
      "GST (Goods & Services Tax) Features & Implementation"
    ],
    topicsHi: [
      "भारतीय अर्थव्यवस्था (1947 से 1991 तक)",
      "योजना आयोग तथा पंचवर्षीय योजनाएं",
      "मिश्रित अर्थव्यवस्था का विकास: निजी एवं सार्वजनिक क्षेत्र",
      "हरित क्रांति एवं दुग्ध विकास/ऑपरेशन फ्लड",
      "बैंकों का राष्ट्रीयकरण तथा सुधार",
      "वर्ष 1991 में आर्थिक सुधार तथा उसके बाद की अर्थव्यवस्था",
      "वर्ष 2014 के पश्चात के आर्थिक सुधार: कृषि, ढांचागत व श्रम सुधार",
      "आर्थिक सुधार एवं GST"
    ],
    recommendedBooks: ["Lucent Economy Chapter", "NITI Aayog & Budget Highlights Summary"],
    keyTipsEn: "1st, 2nd, 5th Five Year Plans and GST constitutional amendment (101st) are recurring favorites.",
    keyTipsHi: "प्रथम, द्वितीय, पांचवीं पंचवर्षीय योजना और 101वां संविधान संशोधन (GST) हर बार पूछा जाता है।"
  },
  {
    id: "polity",
    nameEn: "Indian Constitution & Public Admin",
    nameHi: "भारतीय संविधान एवं लोक प्रशासन",
    marks: 5,
    category: "gs",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Core framework of Indian Constitution, Fundamental Rights, Parliamentary setup, Judiciary and Local Self-Govt.",
    descriptionHi: "संविधान के प्रमुख लक्षण, मौलिक अधिकार, संसदीय व्यवस्था, न्यायपालिका व पंचायती राज।",
    topicsEn: [
      "Salient Features of Indian Constitution",
      "Directive Principles of State Policy (DPSP - Articles 36-51)",
      "Fundamental Rights (Articles 12-35) & Fundamental Duties (Article 51A)",
      "Parliamentary System & Central Executive (President, PM, Council)",
      "Federal System, Union & States Relations",
      "Judiciary: Supreme Court and High Courts",
      "District Administration System",
      "Local Bodies & Panchayati Raj Institutions (73rd & 74th Amendments)"
    ],
    topicsHi: [
      "भारतीय संविधान की मुख्य विशेषताएं",
      "राज्य के नीति-निर्देशक सिद्धान्त (DPSP)",
      "मौलिक अधिकार एवं मौलिक कर्तव्य",
      "संसदीय प्रणाली",
      "संघीय प्रणाली, संघ एवं केन्द्र-शासित प्रदेश, केन्द्र-राज्य सम्बन्ध",
      "न्यायिक ढांचा: सर्वोच्च न्यायालय, उच्च न्यायालय",
      "जिला प्रशासन",
      "स्थानीय निकाय तथा पंचायती राज संस्थाएं (73वां व 74वां संशोधन)"
    ],
    recommendedBooks: ["M. Laxmikanth (Selective) or Lucent Polity", "Constitution Articles Pocket Chart"],
    keyTipsEn: "Articles 14-32 (Rights), 40 (Panchayats), 44 (UCC), 73rd amendment (Panchayati Raj 11th Schedule) are must-know.",
    keyTipsHi: "अनुच्छेद 21, 32, 40 (ग्राम पंचायत), 44 (समान नागरिक संहिता) और 73वां संविधान संशोधन अनिवार्य रूप से पढ़ें।"
  },
  {
    id: "science",
    nameEn: "General Science",
    nameHi: "सामान्य विज्ञान",
    marks: 5,
    category: "aptitude",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Elementary daily-life applications of Physics, Chemistry, and Human Biology.",
    descriptionHi: "दैनिक जीवन में उपयोगी भौतिक विज्ञान, रसायन विज्ञान एवं जीव विज्ञान के प्रारम्भिक सिद्धांत।",
    topicsEn: [
      "Basic Physics: Units, Work, Energy, Motion, Sound, Light (Reflection/Refraction), Electricity",
      "Basic Chemistry: Elements, Compounds, Acids, Bases, Salts, Metals & Non-metals, Everyday Chemicals",
      "Basic Biology: Human Anatomy, Vitamins & Deficiency Diseases, Digestive & Circulatory System, Plant Botany"
    ],
    topicsHi: [
      "प्रारम्भिक भौतिक विज्ञान (मात्रक, प्रकाश, ध्वनि, कार्य व ऊर्जा)",
      "प्रारम्भिक रसायन विज्ञान (अम्ल-क्षार-लवण, धातु-अधातु, दैनिक जीवन के रसायन)",
      "प्रारम्भिक जीव विज्ञान (मानव शरीर क्रिया, विटामिन व रोग, रक्त परिसंचरण, पादप)"
    ],
    recommendedBooks: ["Lucent General Science", "Class 9 & 10 NCERT Science Highlights"],
    keyTipsEn: "Vitamins chemical names (e.g., Vitamin C - Ascorbic Acid), eye defects, and SI units give easy 3-4 marks.",
    keyTipsHi: "विटामिन के रासायनिक नाम, दृष्टि दोष (निकट/दूर दृष्टि) और SI मात्रक से सीधे प्रश्न आते हैं।"
  },
  {
    id: "arithmetic",
    nameEn: "Elementary Arithmetic",
    nameHi: "प्रारम्भिक अंकगणित",
    marks: 5,
    category: "aptitude",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Foundational arithmetic operations essential for both standalone math and later Data Interpretation.",
    descriptionHi: "अंकगणित के मूलभूत नियम जो सीधे 5 अंक तथा आगे 20 अंक के ग्राफ/तालिका में काम आते हैं।",
    topicsEn: [
      "Whole Numbers, Fractions and Decimals (पूर्ण संख्या, भिन्न तथा दशमलव)",
      "Percentage (प्रतिशतता - basic conversions and applied problems)",
      "Simple Arithmetic Equations (साधारण अंकगणितीय समीकरण)",
      "Square and Square Roots (वर्ग एवं वर्गमूल)",
      "Exponents and Powers / Indices (घातांक एवं घात)",
      "Average (औसत - group average, age problems)"
    ],
    topicsHi: [
      "पूर्ण संख्या, भिन्न तथा दशमलव",
      "प्रतिशतता (Percentage)",
      "साधारण अंकगणितीय समीकरण",
      "वर्ग एवं वर्गमूल",
      "घातांक एवं घात",
      "औसत (Average)"
    ],
    recommendedBooks: ["RS Aggarwal Quantitative Aptitude (Selected chapters)", "Youth Competition Times Maths"],
    keyTipsEn: "Mastering Percentage and Average here directly powers the 20 Marks Graph & Table DI sections!",
    keyTipsHi: "प्रतिशत और औसत को मजबूत करें, क्योंकि ग्राफ और तालिका के 20 नंबर भी इसी पर आधारित हैं।"
  },
  {
    id: "general_hindi",
    nameEn: "General Hindi",
    nameHi: "सामान्य हिन्दी",
    marks: 5,
    category: "language",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Grammar, vocabulary, and notable Hindi literature authors and works.",
    descriptionHi: "हिन्दी व्याकरण, शब्दावली एवं प्रसिद्ध रचनाएं तथा उनके रचनाकार।",
    topicsEn: [
      "Sandhi (संधि: स्वर, व्यंजन, विसर्ग संधि)",
      "Vilom Shabd (विलोम शब्द - Antonyms)",
      "Paryayvachi Shabd (पर्यायवाची शब्द - Synonyms)",
      "Vakyansho ke liye Ek Shabd (वाक्यांशों के लिए एक शब्द)",
      "Ling (लिंग - Masculine/Feminine)",
      "Samshrut Bhinnarthak Shabd (समश्रुत भिन्नार्थक शब्द)",
      "Muhavare evam Lokoktiyan (मुहावरे एवं लोकोक्तियां)",
      "Samanya Ashuddhiyan (सामान्य अशुद्धियां - Spelling & Sentence Correction)",
      "Lekhak aur unki Rachnayein (लेखक एवं रचनाएं - गद्य एवं पद्य)"
    ],
    topicsHi: [
      "संधि (दीर्घ, गुण, वृद्धि, यण, अयादि संधि)",
      "विलोम शब्द",
      "पर्यायवाची शब्द",
      "वाक्यांशों के लिए एक शब्द",
      "लिंग (पुल्लिंग/स्त्रीलिंग)",
      "समश्रुत भिन्नार्थक शब्द",
      "मुहावरे एवं लोकोक्तियां",
      "सामान्य अशुद्धियां (वर्तनी एवं वाक्य)",
      "लेखक एवं रचनाएं (गद्य एवं पद्य)"
    ],
    recommendedBooks: ["Aditya Publication Samanya Hindi", "Dr. Vasudev Nandan Prasad Hindi"],
    keyTipsEn: "Solve previous 5 years UPSSSC papers; 80% vocabulary questions are repeated directly from Aditya Pub.",
    keyTipsHi: "आदित्य पब्लिकेशन या यूथ कम्पटीशन के पिछले वर्षों के विलोम, पर्यायवाची और मुहावरे रट लें।"
  },
  {
    id: "general_english",
    nameEn: "General English",
    nameHi: "सामान्य अंग्रेजी",
    marks: 5,
    category: "language",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Basic functional English grammar, vocabulary, and unseen reading comprehension passage.",
    descriptionHi: "अंग्रेजी व्याकरण (Articles, Prepositions, Active/Passive) तथा एक छोटा गद्यांश आधारित प्रश्न।",
    topicsEn: [
      "English Grammar (Tenses, Prepositions, Subject-Verb Agreement, Voice)",
      "Vocabulary (Synonyms, Antonyms, One-word Substitution)",
      "Unseen Comprehension Passage with 2-3 objective questions"
    ],
    topicsHi: [
      "अंग्रेजी व्याकरण (व्याकरणिक नियम, प्रीपोजिशन, आर्टिकल)",
      "शब्दावली (समानार्थी, विलोम शब्द)",
      "अपठित गद्यांश पर आधारित प्रश्न"
    ],
    recommendedBooks: ["Neetu Singh English Grammar (Basic Rules)", "Arihant General English"],
    keyTipsEn: "Usually 3 questions are direct passage finding + 2 questions on Synonyms/Antonyms. Easy 4+ marks with practice.",
    keyTipsHi: "आम तौर पर 3 प्रश्न सीधे पैसेज से खोजकर हल होते हैं और 2 प्रश्न वोकैब के होते हैं।"
  },
  {
    id: "reasoning",
    nameEn: "Logic & Reasoning",
    nameHi: "तर्क एवं तर्कशक्ति",
    marks: 5,
    category: "aptitude",
    highYield: false,
    questionCount: 5,
    descriptionEn: "Verbal and non-verbal logical reasoning concepts with standard pattern formats.",
    descriptionHi: "तार्किक व विश्लेषणात्मक योग्यता: कोडिंग, रक्त सम्बन्ध, कैलेंडर, घड़ी व क्रम व्यवस्था।",
    topicsEn: [
      "Order & Ranking / Large & Small (क्रम एवं रैंकिंग / वृहत् एवं लघु)",
      "Blood Relations (रक्त सम्बन्ध)",
      "Odd One Out / Segregation (समूह से भिन्न को अलग करना)",
      "Calendar and Clock (कैलेंडर एवं घड़ी)",
      "Cause and Effect (कारण और प्रभाव)",
      "Coding-Decoding (Number and Letter patterns)",
      "Consequential Statements / Logical Deductions (निगमनात्मक तर्क)"
    ],
    topicsHi: [
      "क्रम एवं रैंकिंग (Order & Ranking)",
      "सम्बन्ध (Blood Relations)",
      "समूह से भिन्न को अलग करना (Odd One Out)",
      "कैलेंडर एवं घड़ी (Calendar & Clock)",
      "कारण और प्रभाव (Cause & Effect)",
      "कोडिंग-डिकोडिंग (संख्या तथा अक्षर कोडिंग)",
      "निगमनात्मक तर्क / कथन एवं निष्कर्ष"
    ],
    recommendedBooks: ["Piyush Varshney Reasoning or Lucent Verbal Reasoning", "Rakesh Yadav Reasoning"],
    keyTipsEn: "Calendar day finding formula and alphabet positional values (A=1 ... Z=26) will secure full 5/5 marks.",
    keyTipsHi: "कैलेंडर का डे-फाइंडिंग सूत्र और वर्णमाला की प्लेस वैल्यू (EJOTY) याद रखें, 5/5 पूरे अंक मिलेंगे।"
  },
  {
    id: "current_affairs",
    nameEn: "Current Affairs",
    nameHi: "सामयिकी (करेंट अफेयर्स)",
    marks: 10,
    category: "high_yield",
    highYield: true,
    questionCount: 10,
    descriptionEn: "Crucial 10-mark section covering National, International and Uttar Pradesh state events of last 6-8 months.",
    descriptionHi: "सर्वाधिक महत्वपूर्ण 10 अंक: पिछले 6 से 8 माह की राष्ट्रीय, अंतरराष्ट्रीय एवं यूपी विशेष घटनाएं।",
    topicsEn: [
      "National Events, Bills, Schemes & Government Initiatives",
      "Uttar Pradesh Specific Schemes, Infrastructure & Budget Initiatives",
      "International Summits (G20, BRICS, SCO, COP)",
      "Sports Tournaments, Medals & Champions (Olympics, Asian Games, Cricket World Cup)",
      "Military Exercises, Defence Deployments & Science-Tech Missions (ISRO)",
      "Appointments, Resignations & Committees",
      "Reports, Indices (Hunger, HDI, Happiness) & Rank of India",
      "Honors, Awards (Padma Awards, Nobel, Khel Ratna, Sahitya Akademi)"
    ],
    topicsHi: [
      "राष्ट्रीय घटनाएं, सरकारी योजनाएं व नीतियां",
      "उत्तर प्रदेश विशेष योजनाएं, एक्सप्रेसवे व बजट घोषणाएं",
      "अंतरराष्ट्रीय शिखर सम्मेलन एवं समझौते",
      "खेलकूद: प्रमुख प्रतियोगिताएं, पदक विजेता व स्थल",
      "सैन्य युद्धाभ्यास, इसरो (ISRO) अंतरिक्ष मिशन",
      "प्रमुख नियुक्तियां एवं चर्चित व्यक्ति",
      "सूचकांक (वैश्विक भुखमरी, खुशहाली सूचकांक में भारत का स्थान)",
      "प्रमुख राष्ट्रीय व अंतरराष्ट्रीय पुरस्कार व सम्मान"
    ],
    recommendedBooks: ["Drishti Current Affairs (Eye / Drishti वार्षिकी)", "Eduteria Current Affairs", "Speedy Current Affairs"],
    keyTipsEn: "Revise last 6 months intensively. Give special attention to ISRO missions, UP expressways & sports.",
    keyTipsHi: "परीक्षा से पिछले 6 महीनों की दृष्टि वार्षिकी या स्पीडी का बार-बार रिवीजन करें।"
  },
  {
    id: "general_awareness",
    nameEn: "General Awareness (Static GK)",
    nameHi: "सामान्य जागरूकता (स्टैटिक जीके)",
    marks: 10,
    category: "high_yield",
    highYield: true,
    questionCount: 10,
    descriptionEn: "High-yield 10 marks of static knowledge including geography, polity organs, world bodies, arts and culture.",
    descriptionHi: "10 अंक का अत्यंत स्कोरिंग भाग: पड़ोसी देश, राजधानी-मुद्रा, संसद, संगठन, दिवस व कला-संस्कृति।",
    topicsEn: [
      "India's Neighboring Countries (Border lengths, Capitals, Currencies)",
      "States & Union Territories of India: Capitals & Governors",
      "Indian Parliament: Lok Sabha, Rajya Sabha & Legislative Assemblies",
      "National & International Days and Dates (Earth Day, Environment Day, etc.)",
      "World Organizations and their Headquarters (UN, WHO, UNESCO, WTO, IMF)",
      "Indian Tourism Destinations, Monuments & UNESCO World Heritage Sites",
      "Art & Culture of India: Classical & Folk Dances, Festivals of UP and India",
      "Books & Authors (Historical masterpieces and celebrated modern works)",
      "Awards & Honors (National & International)",
      "Climate Change & Environmental Conventions"
    ],
    topicsHi: [
      "भारत के पड़ोसी देश (सीमाएं, राजधानी व मुद्राएं)",
      "देश, राजधानी एवं मुद्रा (Country, Capital, Currency)",
      "भारत के राज्य तथा केन्द्र शासित प्रदेश",
      "भारतीय संसद, राज्य सभा, लोक सभा और विधान सभा, विधान परिषद्",
      "राष्ट्रीय एवं अन्तर्राष्ट्रीय दिवस",
      "विश्व संगठन एवं उनके मुख्यालय (UN, WHO, WTO, UNESCO आदि)",
      "भारतीय पर्यटन स्थल एवं यूनेस्को धरोहर",
      "भारत की कला एवं संस्कृति (शास्त्रीय नृत्य, लोकनृत्य व मेले)",
      "भारत एवं विश्व के खेल",
      "भारतीय अनुसंधान संगठन (मुख्यालय व केंद्र)",
      "प्रसिद्ध पुस्तकें एवं उनके लेखक",
      "पुरस्कार एवं विजेता",
      "जलवायु परिवर्तन एवं पर्यावरण"
    ],
    recommendedBooks: ["Lucent Static GK Miscellaneous Section (विविध)", "Naveen Sharma Sir Static GK"],
    keyTipsEn: "Headquarters of UN agencies (Geneva/Paris/New York), UP folk dances (Charkula, Nautanki, Raslila) are recurring 100% guarantee.",
    keyTipsHi: "अंतरराष्ट्रीय संगठनों के मुख्यालय और यूपी के लोकनृत्य (चरकुला, रासलीला, कजरी, नौटंकी) हर शिफ्ट में आते हैं।"
  },
  {
    id: "hindi_passage",
    nameEn: "Hindi Unseen Passage Analysis",
    nameHi: "अपठित हिन्दी गद्यांश का विवेचन",
    marks: 10,
    category: "high_yield",
    highYield: true,
    questionCount: 10,
    descriptionEn: "2 Unseen Hindi Passages with 5 objective analytical questions each. Maximum marks with zero formula memorization.",
    descriptionHi: "2 अपठित गद्यांश, प्रत्येक पर 5-5 प्रश्न (कुल 10 प्रश्न = 10 अंक)। समझ आधारित सर्वाधिक स्कोरिंग क्षेत्र।",
    topicsEn: [
      "Hindi Prose Comprehension Passage 1 (5 Questions - 5 Marks)",
      "Hindi Prose Comprehension Passage 2 (5 Questions - 5 Marks)",
      "Theme identification, vocabulary in context, contextual inferencing",
      "Author's viewpoint and moral conclusion deduction"
    ],
    topicsHi: [
      "अपठित हिन्दी गद्यांश 1 (5 प्रश्न - 5 अंक)",
      "अपठित हिन्दी गद्यांश 2 (5 प्रश्न - 5 अंक)",
      "गद्यांश का केंद्रीय भाव एवं शीर्षक चयन",
      "गद्यांश में प्रयुक्त शब्दों के अर्थ एवं व्याकरणिक प्रयोग",
      "लेखक का दृष्टिकोण एवं निष्कर्ष आधारित प्रश्न"
    ],
    recommendedBooks: ["Previous Years UPSSSC PET Solved Papers (2021, 2022, 2023)", "Youth Competition PET Practice Sets"],
    keyTipsEn: "Read the 5 questions FIRST before reading the passage; this lets you highlight answers on first reading in 3-4 minutes.",
    keyTipsHi: "गद्यांश पढ़ने से पहले उसके 5 प्रश्न पढ़ें। इससे पढ़ते समय ही सही उत्तर तुरंत पेंसिल से रेखांकित हो जाते हैं।"
  },
  {
    id: "graph_di",
    nameEn: "Graph Interpretation & Analysis",
    nameHi: "ग्राफ की व्याख्या एवं विश्लेषण",
    marks: 10,
    category: "high_yield",
    highYield: true,
    questionCount: 10,
    descriptionEn: "2 Line graphs or Bar charts with 5 calculation questions each. The true rank decider in PET.",
    descriptionHi: "2 ग्राफ (बार चार्ट या रेखा ग्राफ), प्रत्येक पर 5 प्रश्न (कुल 10 प्रश्न = 10 अंक)। यही परीक्षा में रैंक तय करता है।",
    topicsEn: [
      "Line Graph Interpretation (2 Graphs, 5 questions each)",
      "Bar Graph / Multi-bar chart analysis",
      "Ratio, Percentage increase/decrease calculations",
      "Average production/sales comparison across consecutive years"
    ],
    topicsHi: [
      "ग्राफ 1 की व्याख्या एवं विश्लेषण (5 प्रश्न - 5 अंक)",
      "ग्राफ 2 की व्याख्या एवं विश्लेषण (5 प्रश्न - 5 अंक)",
      "रेखा ग्राफ (Line Graph) एवं दंड आरेख (Bar Chart)",
      "प्रतिशत वृद्धि/कमी, अनुपात तथा वर्षों का तुलनात्मक औसत"
    ],
    recommendedBooks: ["UPSSSC PET Special DI by Ankit Bhati Sir (Rojgar with Ankit)", "Youth Competition DI Master"],
    keyTipsEn: "Calculate approximate values; avoid multiplying long decimals unless options are extremely close (<1% difference).",
    keyTipsHi: "दशमलव के जटिल गुणा-भाग के बजाय निकटतम मान (Approximation) का उपयोग करें, समय बहुत बचेगा।"
  },
  {
    id: "table_di",
    nameEn: "Table Interpretation & Analysis",
    nameHi: "तालिका की व्याख्या एवं विश्लेषण",
    marks: 10,
    category: "high_yield",
    highYield: true,
    questionCount: 10,
    descriptionEn: "2 Tabular datasets with 5 questions each. Requires disciplined row/column arithmetic and speed.",
    descriptionHi: "2 तालिकाएं (Tables), प्रत्येक पर 5 प्रश्न (कुल 10 प्रश्न = 10 अंक)। शांत मन से त्वरित गणना की आवश्यकता।",
    topicsEn: [
      "Table 1 Analysis (Multi-column numerical dataset - 5 Marks)",
      "Table 2 Analysis (Missing data / Percentage breakdown - 5 Marks)",
      "Cross-table aggregation, sum of categories, highest/lowest proportion",
      "Year-on-year growth rate calculation from tabular data"
    ],
    topicsHi: [
      "तालिका 1 की व्याख्या एवं विश्लेषण (5 प्रश्न - 5 अंक)",
      "तालिका 2 की व्याख्या एवं विश्लेषण (5 प्रश्न - 5 अंक)",
      "बहु-स्तंभीय आंकड़ों का विश्लेषण, श्रेणीवार योग व तुलना",
      "वार्षिक विकास दर व विभिन्न मदों के अनुपातों की गणना"
    ],
    recommendedBooks: ["UPSSSC PET PYQ Compilation", "Ghatna Chakra Table & Graph Special"],
    keyTipsEn: "Check column units (thousands vs lakhs, % vs absolute numbers). Unit traps are UPSSSC's favorite trick.",
    keyTipsHi: "तालिका में इकाई (हजार, लाख, प्रतिशत या करोड़) को ध्यान से देखें। सबसे ज्यादा गलतियां इकाई ध्यान न देने से होती हैं।"
  }
];

export const SLIDES_DATA: SlideContent[] = [
  {
    id: 1,
    taglineEn: "Comprehensive Exam Architecture",
    taglineHi: "सम्पूर्ण परीक्षा रूपरेखा एवं परिचय",
    titleEn: "UPSSSC PET Exam Master Blueprint",
    titleHi: "यूपीएसएसएससी पीईटी परीक्षा मास्टर ब्लूप्रिंट",
    subtitleEn: "Your definitive roadmap to scoring 80+ marks and qualifying for top Uttar Pradesh Group B & C posts.",
    subtitleHi: "80+ अंक प्राप्त कर उत्तर प्रदेश की शीर्ष समूह 'ख' एवं 'ग' भर्तियों (लेखपाल, वी.डी.ओ.) के लिए अर्हता प्राप्त करने की संपूर्ण रणनीति।",
    type: "intro",
    badge: "Official Commission Pattern",
    keyStats: [
      { labelEn: "Total Questions", labelHi: "कुल प्रश्न", value: "100", hintEn: "1 Mark Each (MCQ)", hintHi: "प्रत्येक 1 अंक का बहुविकल्पीय" },
      { labelEn: "Exam Duration", labelHi: "परीक्षा अवधि", value: "120 Min", hintEn: "2 Full Hours", hintHi: "पूरे 2 घंटे का समय" },
      { labelEn: "Negative Marking", labelHi: "नकारात्मक अंकन", value: "-0.25", hintEn: "1/4 Mark deduction", hintHi: "1/4 अंक की कटौती" },
      { labelEn: "Scorecard Validity", labelHi: "स्कोरकार्ड वैधता", value: "1 Year", hintEn: "Valid for all UP mains", hintHi: "सभी मुख्य परीक्षाओं हेतु मान्य" }
    ],
    bulletPoints: [
      {
        titleEn: "Mandatory Eligibility Gateway",
        titleHi: "अनिवार्य अर्हकारी परीक्षा",
        descEn: "Without PET percentile, candidates cannot apply for UP Lekhpal, VDO (Gram Vikas Adhikari), Junior Assistant, Forest Guard, or Cane Supervisor mains exams.",
        descHi: "पीईटी के बिना आप लेखपाल, ग्राम विकास अधिकारी (VDO), कनिष्ठ सहायक, वन रक्षक जैसी किसी भी मुख्य परीक्षा में आवेदन नहीं कर सकते।"
      },
      {
        titleEn: "Percentile-Driven Cutoffs",
        titleHi: "पर्सेंटाइल आधारित मुख्य परीक्षा शॉर्टलिस्टिंग",
        descEn: "UPSSSC shortlists 15 to 30 times candidates based on normalized PET scores. A raw score above 75 (98+ percentile) guarantees calls for almost every vacancy.",
        descHi: "आयोग रिक्तियों के 15 से 30 गुना अभ्यर्थियों को पीईटी स्कोर पर बुलाता है। 75+ रॉ स्कोर (98+ पर्सेंटाइल) से हर भर्ती की मुख्य परीक्षा का रास्ता खुलता है।"
      },
      {
        titleEn: "Standardized NCERT Secondary Level",
        titleHi: "एनसीईआरटी सेकेंडरी स्तर का पाठ्यक्रम",
        descEn: "Questions in Science, Math, Geography and History are strictly bounded within Class 10 to 12 NCERT standards, making targeted revision highly effective.",
        descHi: "विज्ञान, गणित, भूगोल और इतिहास के प्रश्न कक्षा 10 से 12 के एनसीईआरटी स्तर पर आधारित होते हैं, जिसे सही रणनीति से आसानी से पूरा किया जा सकता है।"
      }
    ],
    speakerNotesEn: "Welcome students to the UPSSSC PET master orientation. Emphasize that PET is not just a qualifying test—it's a competitive percentile race where every decimal point decides whether you get to write the Lekhpal or VDO Mains exam.",
    speakerNotesHi: "छात्रों को स्पष्ट करें कि पीईटी केवल पास करने वाली परीक्षा नहीं है, बल्कि एक पर्सेंटाइल की दौड़ है। यहाँ 1-1 नंबर आपकी मुख्य परीक्षा में बैठने की पात्रता तय करता है।"
  },
  {
    id: 2,
    taglineEn: "Structure & Scoring Mathematics",
    taglineHi: "परीक्षा संरचना एवं अंकन गणित",
    titleEn: "Exam Pattern & Negative Marking Mathematics",
    titleHi: "परीक्षा पैटर्न एवं 1/4th नेगेटिव मार्किंग का गणित",
    subtitleEn: "Mastering the trade-off between speed, risk mitigation, and accuracy under 120 minutes.",
    subtitleHi: "120 मिनट के भीतर गति, सटीकता और जोखिम प्रबंधन का सही संतुलन।",
    type: "pattern",
    badge: "Marking Protocol",
    keyStats: [
      { labelEn: "Total Marks", labelHi: "पूर्णांक", value: "100", hintEn: "Equal weight per question", hintHi: "प्रत्येक प्रश्न समान अंक" },
      { labelEn: "Time Per Question", labelHi: "प्रति प्रश्न समय", value: "72 Sec", hintEn: "120 mins / 100 Qs", hintHi: "120 मिनट / 100 प्रश्न" },
      { labelEn: "Net Penalty Formula", labelHi: "नेगेटिव पेनल्टी", value: "1 : 0.25", hintEn: "4 wrong cancels 1 right", hintHi: "4 गलत पर 1 सही अंक कटेगा" },
      { labelEn: "Safe Attempt Target", labelHi: "सुरक्षित प्रयास", value: "88-92", hintEn: "With 90%+ accuracy", hintHi: "90%+ सटीकता के साथ" }
    ],
    bulletPoints: [
      {
        titleEn: "The 0.25 Negative Marking Reality",
        titleHi: "0.25 नेगेटिव मार्किंग का प्रभाव",
        descEn: "If you guess 4 questions and get 1 right and 3 wrong: Net gain = +1.00 - 0.75 = +0.25. Intelligent 50-50 elimination is mathematically advantageous, but blind wild guessing destroys percentiles.",
        descHi: "यदि आप 2 विकल्पों में भ्रमित हैं और समझदारी से तुक्का लगाते हैं तो गणित आपके पक्ष में है; लेकिन अंधाधुंध 4 गलत करने पर 1 पूरा कमाया हुआ अंक शून्य हो जाता है।"
      },
      {
        titleEn: "Time Allocation in 120 Minutes",
        titleHi: "120 मिनट का समय विभाजन",
        descEn: "Phase 1 (0-40 min): 50 GS/Language direct questions. Phase 2 (40-95 min): 20 DI + 5 Math + 5 Reasoning. Phase 3 (95-120 min): OMR bubble filling & tough review.",
        descHi: "पहले 40 मिनट में सीधे 50 जीएस/हिन्दी प्रश्न निपटाएं। 40 से 95 मिनट में 20 अंक का डीआई व गणित हल करें। अंतिम 25 मिनट ओएमआर गोला भरने व रीचेक हेतु रखें।"
      },
      {
        titleEn: "OMR Sheet Discipline",
        titleHi: "ओएमआर शीट भरने की सावधानी",
        descEn: "Never leave bubbling for the last 5 minutes. Fill OMR section by section (after every 25 questions) to eliminate bubble shift errors.",
        descHi: "अंतिम 5 मिनट में 100 गोले एक साथ भरने की गलती कभी न करें। प्रत्येक 25 प्रश्न हल करने के बाद साथ-साथ ओएमआर भरें।"
      }
    ],
    speakerNotesEn: "Explain the risk-reward calculation of negative marking. Show why candidates scoring 75+ typically attempt 88-92 questions rather than playing too safe (65 attempts) or reckless (99 attempts with 25 errors).",
    speakerNotesHi: "छात्रों को बताएं कि 75+ अंक लाने वाले अभ्यर्थी आमतौर पर 88 से 92 प्रश्न हल करते हैं। बहुत कम प्रयास (65) या बहुत अधिक गलतियां (25) दोनों घातक हैं।"
  },
  {
    id: 3,
    taglineEn: "The 50:50 Golden Ratio",
    taglineHi: "50:50 का स्वर्णिम नियम",
    titleEn: "15-Section Marks Weightage Matrix",
    titleHi: "15 विषयों का अंक भार एवं वरीयता क्रम",
    subtitleEn: "Discover why just 5 sections hold 50% of the entire paper while 10 subjects share the remaining 50%.",
    subtitleHi: "जानिए क्यों केवल 5 खंडों में पूरे 50 अंक समाहित हैं, जबकि 10 विषय मिलकर शेष 50 अंक बनाते हैं।",
    type: "weightage",
    badge: "Strategic Allocation",
    keyStats: [
      { labelEn: "High-Yield Tier", labelHi: "हाई-यील्ड खंड (5 विषय)", value: "50 Marks", hintEn: "DI (20) + Hindi Passages (10) + CA & GK (20)", hintHi: "डीआई (20) + गद्यांश (10) + करेंट व जीके (20)" },
      { labelEn: "General Studies Tier", labelHi: "जीएस कोर (5 विषय)", value: "25 Marks", hintEn: "History, INM, Geo, Economy, Polity (5 each)", hintHi: "इतिहास, आंदोलन, भूगोल, अर्थव्यवस्था, राजव्यवस्था" },
      { labelEn: "Skill & Languages", labelHi: "कौशल व भाषाएं (5 विषय)", value: "25 Marks", hintEn: "Math (5) + Hindi (5) + Eng (5) + Reason (5) + Sci (5)", hintHi: "गणित, सामान्य हिन्दी, अंग्रेजी, रीजनिंग, विज्ञान" }
    ],
    bulletPoints: [
      {
        titleEn: "The 'Game Changer' Top 5 (50 Marks)",
        titleHi: "टॉप 5 गेम चेंजर खंड (50 अंक)",
        descEn: "Graph DI (10) + Table DI (10) + Hindi Unseen Passages (10) + Current Affairs (10) + Static General Awareness (10). Scoring 45/50 here guarantees top 1% state rank.",
        descHi: "ग्राफ (10) + तालिका (10) + हिन्दी गद्यांश (10) + करेंट अफेयर्स (10) + सामान्य जागरूकता (10)। यहाँ 45+ लाना राज्य में टॉप 1% रैंक की गारंटी है।"
      },
      {
        titleEn: "The 'Trap' of Over-Studying GS Core (25 Marks)",
        titleHi: "जीएस में अति-समय गंवाने से बचें",
        descEn: "Many aspirants spend 80% of preparation time reading thick history or economy books for just 5 marks each. Smart study demands balanced 5-mark high-frequency revision.",
        descHi: "अक्सर छात्र 80% समय इतिहास व अर्थशास्त्र की मोटी किताबों में गंवा देते हैं जबकि प्रत्येक से केवल 5 अंक आने हैं। यहाँ केवल चुनिंदा मुख्य टॉपिक ही पढ़ें।"
      },
      {
        titleEn: "Language & Aptitude 100% Accuracy (25 Marks)",
        titleHi: "भाषा एवं रीजनिंग में 100% स्कोरिंग लक्ष्य",
        descEn: "Reasoning (5), Basic Hindi grammar (5), and Elementary Math (5) offer predictable, deterministic questions where 15/15 is easily achievable.",
        descHi: "रीजनिंग (5), सामान्य हिन्दी व्याकरण (5) और प्रारंभिक अंकगणित (5) में पूरे 15 में से 15 अंक आसानी से लाए जा सकते हैं।"
      }
    ],
    speakerNotesEn: "Highlight the 50:50 principle. Emphasize that preparation must be proportional to marks weightage, not subject thickness. DI alone is worth 4 full humanities subjects combined!",
    speakerNotesHi: "छात्रों को समझाएं कि केवल डीआई (20 अंक) इतिहास, भूगोल, अर्थशास्त्र और संविधान चारों विषयों के बराबर अंक रखता है!"
  },
  {
    id: 4,
    taglineEn: "Core Humanities Analysis",
    taglineHi: "मानविकी एवं सामान्य अध्ययन विश्लेषण",
    titleEn: "General Studies Deep Dive (25 Marks)",
    titleHi: "सामान्य अध्ययन: 5 विषय, 25 अंक का सटीक विश्लेषण",
    subtitleEn: "History (5), National Movement (5), Geography (5), Economy (5), Polity (5).",
    subtitleHi: "भारतीय इतिहास (5), राष्ट्रीय आन्दोलन (5), भूगोल (5), अर्थव्यवस्था (5) एवं संविधान (5)।",
    type: "gs_deepdive",
    badge: "5 x 5 = 25 Marks",
    bulletPoints: [
      {
        titleEn: "Ancient & Medieval History (5 Marks)",
        titleHi: "प्राचीन एवं मध्यकालीन इतिहास (5 अंक)",
        descEn: "High-Frequency: Indus Valley sites (Lothal, Kalibangan), Buddhist councils (Rajgriha, Vaishali, Pataliputra, Kashmir), Ashoka Rock Edicts, Samudragupta (Prayag Prashasti), Delhi Sultanate tax terms, Mughal administrative titles (Mansabdari).",
        descHi: "प्रमुख केंद्र: सिन्धु घाटी स्थल (लोथल, कालीबंगा), चारों बौद्ध संगीतियां, अशोक के शिलालेख, समुद्रगुप्त, मुगल मनसबदारी व सल्तनत काल के कर।"
      },
      {
        titleEn: "Indian National Movement (5 Marks)",
        titleHi: "भारतीय राष्ट्रीय आन्दोलन (5 अंक)",
        descEn: "High-Frequency: Swadeshi 1905, 1916 Lucknow Pact, Rowlatt Act & Jallianwala Bagh 1919, Non-Cooperation 1920, Dandi March 1930, Government of India Act 1935, Quit India 1942, Subhash Chandra Bose INA.",
        descHi: "प्रमुख केंद्र: 1905 स्वदेशी, 1916 लखनऊ समझौता, 1919 जलियांवाला बाग, 1920 असहयोग, 1930 दांडी यात्रा, 1935 अधिनियम, 1942 भारत छोड़ो, आज़ाद हिन्द फौज।"
      },
      {
        titleEn: "Geography & Census 2011 (5 Marks)",
        titleHi: "भूगोल एवं जनगणना 2011 (5 अंक)",
        descEn: "High-Frequency: River origins & tributaries (Narmada, Tapi, Ganga, Godavari), Himalayan passes (Zoji La, Shipki La), IST 82.5° East states, Tropic of Cancer 8 states, Census 2011 UP literacy/sex ratio/population density.",
        descHi: "प्रमुख केंद्र: नदियों के उद्गम व सहायक नदियां, हिमालय के दर्रे, कर्क रेखा के 8 राज्य, भारतीय मानक समय रेखा, 2011 की जनगणना के यूपी आंकड़े।"
      },
      {
        titleEn: "Economy & Post-2014 Reforms (5 Marks)",
        titleHi: "अर्थव्यवस्था एवं 2014 के बाद के सुधार (5 अंक)",
        descEn: "High-Frequency: Five Year Plans targets (Mahalanobis model 2nd plan, Gadgil 3rd plan), 1969 Bank nationalization, Green Revolution Father (MS Swaminathan/Norman Borlaug), GST Council Article 279A, NITI Aayog structure.",
        descHi: "प्रमुख केंद्र: द्वितीय पंचवर्षीय योजना (महालनोबिस), 1969 में 14 बैंकों का राष्ट्रीयकरण, हरित क्रांति, 101वां संविधान संशोधन (GST) व नीति आयोग।"
      },
      {
        titleEn: "Constitution & Panchayati Raj (5 Marks)",
        titleHi: "भारतीय संविधान एवं पंचायती राज (5 अंक)",
        descEn: "High-Frequency: Fundamental Rights (Art 14, 19, 21, 32), DPSP (Art 39A, 40, 44, 45, 50), Fundamental Duties (42nd Amendment, 11 duties), 73rd & 74th Amendments (11th & 12th Schedules, 29 & 18 subjects), Supreme Court Writs.",
        descHi: "प्रमुख केंद्र: मूल अधिकार (अनु. 21, 32), नीति-निर्देशक तत्व (अनु. 40, 44), 73वां संशोधन (11वीं अनुसूची के 29 विषय), सर्वोच्च न्यायालय की 5 रिटें।"
      }
    ],
    speakerNotesEn: "Tell students: In GS, do NOT read cover-to-cover text books. Use Lucent or Ghatna Chakra summary tables and prioritize the 5 bullet points shown here to score 20+ out of 25 with minimum study hours.",
    speakerNotesHi: "छात्रों को गाइड करें: जीएस के लिए मोटी किताबें न पढ़ें। घटना चक्र या लूसेंट के टेबल्स और इन 5 स्लाइड बुलेट्स को दोहराकर 25 में से 20+ अंक पाए जा सकते हैं।"
  },
  {
    id: 5,
    taglineEn: "High Accuracy Deterministic Sections",
    taglineHi: "शत-प्रतिशत सटीकता वाले विषय",
    titleEn: "Aptitude, Science & Languages (25 Marks)",
    titleHi: "अंकगणित, विज्ञान, तर्कशक्ति एवं भाषाएं (25 अंक)",
    subtitleEn: "Math (5), Science (5), Hindi Grammar (5), English (5), Reasoning (5).",
    subtitleHi: "प्रारम्भिक अंकगणित (5), विज्ञान (5), सामान्य हिन्दी (5), अंग्रेजी (5) एवं रीजनिंग (5)।",
    type: "aptitude_deepdive",
    badge: "5 x 5 = 25 Marks",
    bulletPoints: [
      {
        titleEn: "Elementary Arithmetic (5 Marks)",
        titleHi: "प्रारम्भिक अंकगणित (5 अंक)",
        descEn: "Percentage calculation, Fraction to decimal conversions, Square root shortcuts (e.g., √(0.0064)), Exponents laws (a^m * a^n), Average of consecutive series. Essential stepping stone for DI.",
        descHi: "प्रतिशत मान (1/2 = 50%, 1/8 = 12.5%), दशमलव वर्गमूल, घातांक नियम तथा लगातार संख्याओं का औसत। यह डीआई की भी नींव है।"
      },
      {
        titleEn: "General Science (5 Marks)",
        titleHi: "सामान्य विज्ञान (5 अंक)",
        descEn: "Physics (SI units, Ohm's law, Light refraction, concave/convex mirrors). Chemistry (Baking soda, Washing soda, Bleaching powder formulas, pH values). Biology (Vitamins, Blood groups, human hormones).",
        descHi: "भौतिकी (मात्रक, दर्पण व लेंस), रसायन (बेकिंग सोडा, ब्लीचिंग पाउडर, प्लास्टर ऑफ पेरिस सूत्र, pH मान), जीवविज्ञान (विटामिन, रक्त समूह, अंतःस्रावी ग्रंथियां)।"
      },
      {
        titleEn: "General Hindi Grammar (5 Marks)",
        titleHi: "सामान्य हिन्दी व्याकरण (5 अंक)",
        descEn: "Sandhi identification (Dirgha, Guna, Vriddhi, Yan, Ayadi), Antonyms (विलोम), Synonyms (पर्यायवाची), One-word substitution, Idioms (मुहावरे), Famous authors (Premchand, Jaishankar Prasad, Ramdhari Singh Dinkar).",
        descHi: "स्वर संधि के 5 भेद, महत्वपूर्ण विलोम, पर्यायवाची, वाक्यांश के लिए एक शब्द, मुहावरे तथा प्रेमचंद, दिनकर, जयशंकर प्रसाद की अमर कृतियां।"
      },
      {
        titleEn: "General English (5 Marks)",
        titleHi: "सामान्य अंग्रेजी (5 अंक)",
        descEn: "1 short reading passage (3 direct search-and-find questions), 1 synonym question, 1 antonym question. Zero negative marking risk if attempted with careful context matching.",
        descHi: "1 संक्षिप्त पैसेज (3 सीधे प्रश्न) + 1 सिनोनिम + 1 एंटोनिम। पैसेज की पंक्तियों से मिलान करके आसानी से 4-5 अंक मिल जाते हैं।"
      },
      {
        titleEn: "Logic & Reasoning (5 Marks)",
        titleHi: "तर्क एवं तर्कशक्ति (5 अंक)",
        descEn: "Blood relations (pointing-type puzzles), Alphabet Coding (shifts +2/-3), Calendar date to day conversion, Ranking (Left + Right - 1 = Total), Odd one out classification.",
        descHi: "रक्त सम्बन्ध, कोडिंग-डिकोडिंग, कैलेंडर (दिन ज्ञात करना), रैंकिंग सूत्र (बायां + दायां - 1 = कुल), तथा विजातीय छांटना। यहाँ 5/5 अंक पक्के हैं।"
      }
    ],
    speakerNotesEn: "Emphasize that this 25-mark block contains almost no ambiguity. Unlike History or Current Affairs where questions can come from anywhere, Math formulas and Hindi grammar rules are finite and fixed.",
    speakerNotesHi: "छात्रों को बताएं कि यह 25 अंक का ब्लॉक गणितीय निश्चितता वाला है। यहाँ नियम निश्चित हैं और पूरे 25 में से 22-24 अंक लाए जा सकते हैं।"
  },
  {
    id: 6,
    taglineEn: "The 30-Mark Deciding Arena",
    taglineHi: "30 अंक का सबसे बड़ा निर्णायक क्षेत्र",
    titleEn: "Mega High-Yield: DI & Hindi Passages (30 Marks)",
    titleHi: "महा-स्कोरिंग खंड: 20 अंक डीआई + 10 अंक हिन्दी गद्यांश",
    subtitleEn: "Graph Interpretation (10), Table Interpretation (10), Hindi Unseen Passages (10).",
    subtitleHi: "ग्राफ व्याख्या (10), तालिका व्याख्या (10) तथा अपठित हिन्दी गद्यांश (10)।",
    type: "mega_sections",
    badge: "30% of Entire Paper",
    keyStats: [
      { labelEn: "Data Interpretation", labelHi: "आंकड़ा व्याख्या (DI)", value: "20 Marks", hintEn: "2 Graphs (10) + 2 Tables (10)", hintHi: "2 ग्राफ (10) + 2 तालिकाएं (10)" },
      { labelEn: "Hindi Passages", labelHi: "हिन्दी गद्यांश", value: "10 Marks", hintEn: "2 Passages x 5 Questions", hintHi: "2 गद्यांश x 5 प्रश्न" },
      { labelEn: "Recommended Daily Drill", labelHi: "दैनिक अभ्यास लक्ष्य", value: "4 DI + 2 Passages", hintEn: "30 minutes daily practice", hintHi: "रोजाना 30 मिनट अभ्यास" }
    ],
    bulletPoints: [
      {
        titleEn: "Data Interpretation (DI) Secrets (20 Marks)",
        titleHi: "ग्राफ एवं तालिका (DI) के 3 स्वर्णिम नियम",
        descEn: "Rule 1: Master the 3 core calculations—Percentage Change ((Final - Initial)/Initial * 100), Ratio (A : B), and Group Average. Rule 2: Round off numbers when answers differ widely. Rule 3: Always check units (Crores vs Thousands).",
        descHi: "नियम 1: केवल 3 सूत्र (प्रतिशत परिवर्तन, अनुपात, औसत) पर 90% प्रश्न होते हैं। नियम 2: विकल्पों में दूरी होने पर एप्रोक्सीमेशन करें। नियम 3: हजार व लाख की इकाई जांचें।"
      },
      {
        titleEn: "Mastering Unseen Hindi Passages (10 Marks)",
        titleHi: "अपठित हिन्दी गद्यांश हल करने की वैज्ञानिक तकनीक",
        descEn: "Step 1: Read all 5 questions first in 60 seconds. Step 2: Read the passage with a focused mental scanner. Step 3: Never inject your personal opinion; answer strictly according to what the passage states.",
        descHi: "चरण 1: पहले 60 सेकंड में पांचों प्रश्न पढ़ें। चरण 2: फिर गद्यांश पढ़ते ही उत्तर तुरंत रेखांकित करें। चरण 3: अपने व्यक्तिगत ज्ञान से नहीं, केवल गद्यांश के आधार पर उत्तर दें।"
      },
      {
        titleEn: "Why DI Decides Your 99th Percentile",
        titleHi: "डीआई ही क्यों तय करता है 99वां पर्सेंटाइल?",
        descEn: "In past PET papers (2022 & 2023), DI had lengthy calculations. Students who practiced 100+ DI sets before the exam solved them in 25 minutes; unprepared students panicked and lost 15+ marks.",
        descHi: "पीईटी 2022 व 2023 में डीआई गणनात्मक आया था। जिन्होंने पहले 100+ डीआई हल किए थे, उन्होंने 25 मिनट में पूरे 20 अंक बटोरे, जबकि बाकी छात्र समय के अभाव में पिछड़ गए।"
      }
    ],
    speakerNotesEn: "Dedicate special time here! Explain why DI sets are the single most rewarding return on investment (ROI) in UPSSSC PET. Every student must solve 2 graphs and 2 tables every single day until exam day.",
    speakerNotesHi: "इस स्लाइड पर विशेष जोर दें! छात्रों से कहें कि आज ही से प्रतिदिन 2 ग्राफ और 2 तालिकाएं हल करने का नियम बना लें। यही सिलेक्शन की चाबी है।"
  },
  {
    id: 7,
    taglineEn: "Dynamic & Static Awareness",
    taglineHi: "समसामयिकी एवं सामान्य जागरूकता",
    titleEn: "Current Affairs & Static GK Mastery (20 Marks)",
    titleHi: "करेंट अफेयर्स (10) एवं सामान्य जागरूकता (10 अंक)",
    subtitleEn: "National, International & UP Special Current Affairs + Comprehensive Static Awareness.",
    subtitleHi: "राष्ट्रीय, अंतरराष्ट्रीय व यूपी विशेष करेंट + पड़ोसी देश, संगठन, दिवस व कला-संस्कृति।",
    type: "current_affairs",
    badge: "20 Marks Pure Scoring",
    bulletPoints: [
      {
        titleEn: "Current Affairs (10 Marks) - 6 Month Golden Window",
        titleHi: "करेंट अफेयर्स (10 अंक) - पिछले 6 माह की रणनीति",
        descEn: "Focus areas: Major Union & UP Government Schemes, G20 / SCO / BRICS Summits, ISRO Missions (Chandrayaan, Aditya L1, Gaganyaan), Asian Games / Olympic medalists, Major Appointments (CJI, Election Commissioners, RBI), and Global Indices (Happiness, Hunger).",
        descHi: "प्रमुख विषय: केंद्र व यूपी सरकार की जनकल्याण योजनाएं, प्रमुख अंतरराष्ट्रीय शिखर सम्मेलन, इसरो अंतरिक्ष अभियान, खेलकूद पदक विजेता, महत्वपूर्ण नियुक्तियां व वैश्विक सूचकांक।"
      },
      {
        titleEn: "Neighboring Countries & World Capitals (Static GK)",
        titleHi: "पड़ोसी देश, राजधानी एवं मुद्राएं",
        descEn: "Border nations: Bangladesh (4096 km longest), China, Pakistan, Nepal, Myanmar, Bhutan, Afghanistan. Memorize capitals & currencies of SAARC, ASEAN, G20, and Middle East nations.",
        descHi: "भारत से सटे देश (बांग्लादेश की सबसे लंबी सीमा 4096 किमी), सार्क व आसियान देशों की राजधानियां तथा मुद्राएं (टका, क्यात, येन, युआन, रियाल आदि)।"
      },
      {
        titleEn: "World Organizations & Indian Tourism",
        titleHi: "विश्व संगठन के मुख्यालय एवं भारतीय पर्यटन स्थल",
        descEn: "Headquarters: UN (New York), UNESCO (Paris), WHO & WTO & ILO (Geneva), IMF & World Bank (Washington DC), ICJ (The Hague). UNESCO Sites in UP: Taj Mahal, Agra Fort, Fatehpur Sikri.",
        descHi: "मुख्यालय: यूनेस्को (पेरिस), डब्ल्यूएचओ व डब्ल्यूटीओ (जिनेवा), विश्व बैंक (वाशिंगटन), अंतरराष्ट्रीय न्यायालय (द हेग)। यूपी के यूनेस्को स्थल: ताजमहल, आगरा किला, फतेहपुर सीकरी।"
      },
      {
        titleEn: "Art, Culture & UP Special Folk Dances",
        titleHi: "कला, संस्कृति एवं यूपी के लोकनृत्य",
        descEn: "Classical Dances: Kathak (UP), Bharatnatyam (TN), Kathakali & Mohiniyattam (Kerala), Kuchipudi (AP), Odissi, Sattriya (Assam). UP Folk: Charkula (Braj), Nautanki, Raslila, Kajri, Alha (Bundelkhand).",
        descHi: "शास्त्रीय नृत्य: कथक (उत्तर प्रदेश), भरतनाट्यम (तमिलनाडु), कथकली (केरल), कुचिपुड़ी (आंध्र प्रदेश)। यूपी के लोकनृत्य: चरकुला, नौटंकी, रासलीला, कजरी, आल्हा (बुंदेलखंड)।"
      }
    ],
    speakerNotesEn: "Remind students that Static GK questions are 100% predictable from standard lists. Current Affairs should be read from monthly magazines rather than watching 2-hour daily YouTube live streams.",
    speakerNotesHi: "छात्रों को सलाह दें: करेंट अफेयर्स के लिए रोज 2 घंटे यूट्यूब वीडियो देखने के बजाय मासिक पत्रिका (दृष्टि/स्पीडी) से व्यवस्थित रिवीजन करें।"
  },
  {
    id: 8,
    taglineEn: "Actionable 3-Phase Roadmap",
    taglineHi: "60 दिवसीय वैज्ञानिक अध्ययन योजना",
    titleEn: "60-Day Strategic Study Blueprint",
    titleHi: "60 दिनों का सुनियोजित तैयारी टाइमटेबल",
    subtitleEn: "Phase 1: Syllabus Foundation -> Phase 2: High-Yield DI Speed -> Phase 3: Full Mocks & Negative Error Elimination.",
    subtitleHi: "चरण 1: पाठ्यक्रम पूर्णता -> चरण 2: डीआई व स्पीड निर्माण -> चरण 3: मॉक टेस्ट एवं त्रुटि निवारण।",
    type: "study_plan",
    badge: "Day-by-Day Progression",
    bulletPoints: [
      {
        titleEn: "Days 1 to 25: Foundation & Syllabus Coverage",
        titleHi: "दिन 1 से 25: आधारशिला एवं पाठ्यक्रम पूर्णता",
        descEn: "Study 4-5 hours daily. Complete NCERT summary of History, Polity, Geography, and basic Science. Learn core formulas of Math (Percentages, Averages) and Hindi grammar rules. Maintain a personal 1-line formula notebook.",
        descHi: "प्रतिदिन 4-5 घंटे। इतिहास, संविधान, भूगोल व विज्ञान का संक्षिप्त अध्ययन। गणित के सूत्र व हिन्दी व्याकरण के नियम पूरे करें। अपनी 1-पेज शॉर्ट नोट्स डायरी बनाएं।"
      },
      {
        titleEn: "Days 26 to 45: High-Yield Section Mastery & Sectional Tests",
        titleHi: "दिन 26 से 45: डीआई गति निर्माण एवं विषयवार टेस्ट",
        descEn: "Solve 4 DI sets (2 graphs + 2 tables) and 2 Hindi passages every day without fail. Memorize last 6 months Current Affairs compilation. Practice 50 PYQs of Static GK daily. Take topic-wise sectional quizzes.",
        descHi: "रोजाना 4 डीआई (2 ग्राफ + 2 तालिकाएं) और 2 हिन्दी गद्यांश हल करें। पिछले 6 माह की करेंट अफेयर्स पत्रिका पूरी करें। स्टैटिक जीके के 50 प्रश्न रोजाना लगाएं।"
      },
      {
        titleEn: "Days 46 to 60: Full-Length Mocks & Negative Marking Elimination",
        titleHi: "दिन 46 से 60: पूर्ण मॉक टेस्ट एवं ओएमआर अभ्यास",
        descEn: "Attempt 1 full 100-question mock test every alternate day strictly from 10:00 AM to 12:00 PM with an actual printed OMR sheet. Spend 2 hours analyzing every wrong answer in an Error Logbook.",
        descHi: "एक दिन छोड़कर परीक्षा के वास्तविक समय (10 से 12 बजे) पर 100 प्रश्नों का मॉक टेस्ट ओएमआर शीट पर दें। अपनी गलतियों की डायरी (Error Log) बनाकर कमजोर टॉपिक दोहराएं।"
      }
    ],
    speakerNotesEn: "Guide aspirants to build an Error Logbook. In PET, eliminating 8 avoidable silly mistakes increases your score from 68 to 78, vaulting you from the 82nd percentile to the 99th percentile!",
    speakerNotesHi: "छात्रों को 'एरर लॉगबुक' बनाने की प्रेरणा दें। 8 सिली मिस्टेक रोकना आपके अंक 68 से 78 कर देता है और पर्सेंटाइल 82 से सीधे 99 पहुँचा देता है!"
  },
  {
    id: 9,
    taglineEn: "Curated Resource List",
    taglineHi: "प्रमाणित पुस्तक सूची एवं अध्ययन सामग्री",
    titleEn: "Recommended Booklist & Practice Resources",
    titleHi: "सर्वोत्तम पुस्तकें एवं अभ्यास सामग्री",
    subtitleEn: "Minimal resources, maximum revisions—avoiding the resource hoarders trap.",
    subtitleHi: "सीमित प्रामाणिक पुस्तकें, अधिकतम पुनरावृत्ति (रिवीजन)—किताबों के ढेर से बचें।",
    type: "booklist",
    badge: "Verified Topper Material",
    bulletPoints: [
      {
        titleEn: "General Studies & Static GK",
        titleHi: "सामान्य अध्ययन एवं स्टैटिक जीके",
        descEn: "1. Lucent Samanya Gyan (Yellow Book) - History, Polity, Geography & Science sections. 2. Ghatna Chakra Samanya Adhyayan Purvavlokan (selected PYQ questions).",
        descHi: "1. लूसेंट सामान्य ज्ञान (पीली किताब) - इतिहास, राजव्यवस्था, भूगोल व विज्ञान। 2. घटना चक्र पूर्वावलोकन (पिछले वर्षों के प्रश्न हल करने हेतु)।"
      },
      {
        titleEn: "Data Interpretation (20 Marks Special)",
        titleHi: "ग्राफ एवं तालिका (20 अंक स्पेशल)",
        descEn: "1. UPSSSC PET Graph & Table Special Book by Ankit Bhati Sir (Rojgar with Ankit) OR 2. Youth Competition Times PET DI Practice Workbook (contains 200+ authentic charts).",
        descHi: "1. रोजगार विद अंकित (RWA) डीआई स्पेशल बुक अथवा 2. यूथ कम्पटीशन टाइम्स ग्राफ एवं तालिका अभ्यास पुस्तिका (200+ हल सहित ग्राफ)।"
      },
      {
        titleEn: "General Hindi & Unseen Passages (15 Marks)",
        titleHi: "सामान्य हिन्दी एवं गद्यांश (15 अंक)",
        descEn: "1. Aditya Publication Samanya Hindi (White cover) - The undisputed bible for UP exams. 2. Ghatna Chakra Hindi solved papers.",
        descHi: "1. आदित्य पब्लिकेशन सामान्य हिन्दी (श्वेत कवर) - यूपी परीक्षाओं के लिए रामबाण। 2. घटना चक्र पिछले प्रश्न पत्र।"
      },
      {
        titleEn: "Current Affairs & Test Series",
        titleHi: "सामयिकी एवं टेस्ट सीरीज",
        descEn: "1. Drishti Current Affairs Yearly (दृष्टि वार्षिकी) OR Speedy Current Affairs. 2. Testbook / Rojgar with Ankit PET Mock Test Series (target 15-20 full tests).",
        descHi: "1. दृष्टि करेंट अफेयर्स वार्षिकी या स्पीडी वार्षिकी। 2. टेस्टबुक या आरडब्ल्यूए की 15-20 फुल मॉक टेस्ट सीरीज।"
      }
    ],
    speakerNotesEn: "Warn against buying too many books. 1 standard book per subject revised 3 times is 10x better than 3 different books read once half-heartedly.",
    speakerNotesHi: "छात्रों को आगाह करें: बहुत सारी किताबें न खरीदें। एक अच्छी किताब को 3 बार दोहराना 3 अलग-अलग किताबों को आधा-अधूरा पढ़ने से 10 गुना बेहतर है।"
  },
  {
    id: 10,
    taglineEn: "Execution Strategy & Safe Cutoff",
    taglineHi: "परीक्षा कक्ष रणनीति एवं सुरक्षित कटऑफ",
    titleEn: "Exam Day Execution & Safe Target Score",
    titleHi: "परीक्षा कक्ष रणनीति एवं सुरक्षित कटऑफ लक्ष्य",
    subtitleEn: "Historical score vs percentile analysis and psychological composure on exam day.",
    subtitleHi: "विगत वर्षों के स्कोर vs पर्सेंटाइल का वास्तविक विश्लेषण एवं परीक्षा कक्ष में मानसिक संतुलन।",
    type: "exam_day",
    badge: "Goal: 75+ Raw Marks",
    keyStats: [
      { labelEn: "Target Raw Score", labelHi: "सुरक्षित रॉ स्कोर", value: "75+", hintEn: "Guarantees 98.5+ Percentile", hintHi: "98.5+ पर्सेंटाइल सुनिश्चित" },
      { labelEn: "Ideal Attempts", labelHi: "आदर्श प्रश्न प्रयास", value: "88-92", hintEn: "Allowing max 5-7 wrong", hintHi: "अधिकतम 5-7 गलतियां ही स्वीकार्य" },
      { labelEn: "Lekhpal Safe Cutoff", labelHi: "लेखपाल सुरक्षित कटऑफ", value: "72-76", hintEn: "Based on 4000-8000 posts", hintHi: "4000-8000 रिक्तियों के आधार पर" },
      { labelEn: "VDO / Junior Asst", labelHi: "वी.डी.ओ. / कनिष्ठ सहायक", value: "70-74", hintEn: "For top group C calls", hintHi: "शीर्ष ग्रुप सी कॉल हेतु" }
    ],
    bulletPoints: [
      {
        titleEn: "Three-Round Exam Hall Strategy",
        titleHi: "परीक्षा कक्ष में 3-राउंड पद्धति",
        descEn: "Round 1 (0-45 min): Attempt only 100% certain questions (aim for 50-55 direct hits). Round 2 (45-95 min): Solve DI and calculation-heavy Math/Reasoning questions calmly. Round 3 (95-115 min): Smart elimination on 50-50 confusion questions.",
        descHi: "राउंड 1 (0-45 मि.): केवल 100% निश्चित प्रश्न हल करें। राउंड 2 (45-95 मि.): शांत मन से डीआई, गणित व रीजनिंग हल करें। राउंड 3 (95-115 मि.): 50-50 संशय वाले प्रश्नों पर विचार करें।"
      },
      {
        titleEn: "Handling Lengthy DI Without Panic",
        titleHi: "कठिन डीआई आने पर घबराएं नहीं",
        descEn: "If a specific graph looks extremely complex with 5-digit decimals, skip its sub-question #1 and move to sub-question #2 or another table first. Often 3 out of 5 questions in a hard DI set are surprisingly simple ratios.",
        descHi: "यदि कोई ग्राफ बहुत कठिन लगे तो उस पर अटकें नहीं। डीआई के 5 प्रश्नों में से प्रायः 2-3 प्रश्न बहुत आसान अनुपात या योग पर होते हैं, उन्हें पहले हल करें।"
      },
      {
        titleEn: "The Golden Rule of OMR Submissions",
        titleHi: "ओएमआर जमा करने का स्वर्णिम नियम",
        descEn: "Verify your Roll Number, Question Booklet Series, and Category bubbling twice before touching the questions. A single misplaced bubble on the cover block invalidates your entire year of hard work.",
        descHi: "प्रश्न हल करने से पहले अपना अनुक्रमांक, प्रश्न पुस्तिका सीरीज और श्रेणी कोड दो बार चेक करें। इन गोलों में गलती होने पर पूरी मेहनत व्यर्थ हो सकती है।"
      }
    ],
    speakerNotesEn: "Conclude with confidence building! Remind candidates that PET tests temperament and selective speed as much as knowledge. With 75+ raw score, every upcoming UP government vacancy is within their grasp.",
    speakerNotesHi: "छात्रों को आत्मविश्वास दें! 75+ रॉ स्कोर आने पर उत्तर प्रदेश की हर आने वाली भर्ती की मुख्य परीक्षा का द्वार उनके लिए खुला रहेगा।"
  }
];

export const DIAGNOSTIC_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    subjectEn: "Indian History",
    subjectHi: "भारतीय इतिहास",
    questionEn: "In which year did King Ashoka fight the famous Kalinga War according to his 13th Rock Edict?",
    questionHi: "अपने 13वें शिलालेख के अनुसार सम्राट अशोक ने प्रसिद्ध कलिंग युद्ध किस वर्ष लड़ा था?",
    optionsEn: [
      "261 BC (8th year of coronation)",
      "273 BC (Ascension to throne)",
      "250 BC (Third Buddhist Council)",
      "232 BC (End of reign)"
    ],
    optionsHi: [
      "261 ईसा पूर्व (राज्याभिषेक के 8वें वर्ष)",
      "273 ईसा पूर्व (सिंहासनारोहण)",
      "250 ईसा पूर्व (तृतीय बौद्ध संगीति)",
      "232 ईसा पूर्व (शासन का अंत)"
    ],
    correctIndex: 0,
    explanationEn: "Ashoka's 13th Major Rock Edict explicitly describes the horrors of the Kalinga War fought in 261 BC (eight years after his coronation in 269 BC), leading him to adopt Dhamma Vijaya.",
    explanationHi: "अशोक के 13वें शिलालेख में 261 ईसा पूर्व (राज्याभिषेक के 8वें वर्ष) में लड़े गए कलिंग युद्ध के नरसंहार का वर्णन है, जिसके बाद उन्होंने धम्म विजय का मार्ग अपनाया।"
  },
  {
    id: 2,
    subjectEn: "Indian National Movement",
    subjectHi: "भारतीय राष्ट्रीय आन्दोलन",
    questionEn: "Who founded the 'Azad Hind Fauj' (Indian National Army - INA) initially before Subhash Chandra Bose took command in Singapore?",
    questionHi: "सिंगापुर में सुभाष चन्द्र बोस द्वारा कमान संभालने से पूर्व 'आज़ाद हिन्द फौज' की स्थापना मूलतः किसने की थी?",
    optionsEn: [
      "Ras Behari Bose and Mohan Singh",
      "Bhagat Singh and Chandrashekhar Azad",
      "Lala Har Dayal and Sohan Singh Bhakna",
      "Sardar Vallabhbhai Patel"
    ],
    optionsHi: [
      "रास बिहारी बोस एवं जनरल मोहन सिंह",
      "भगत सिंह एवं चन्द्रशेखर आज़ाद",
      "लाला हरदयाल एवं सोहन सिंह भकना",
      "सरदार वल्लभभाई पटेल"
    ],
    correctIndex: 0,
    explanationEn: "The Indian National Army was initially conceived and formed by Captain Mohan Singh with the help of Ras Behari Bose and Major Fujiwara in 1942, before Netaji revitalized it in 1943.",
    explanationHi: "आज़ाद हिन्द फौज की स्थापना मूल रूप से 1942 में जनरल मोहन सिंह एवं रास बिहारी बोस ने की थी। बाद में 1943 में नेताजी सुभाष चन्द्र बोस ने इसका सर्वोच्च नेतृत्व संभाला।"
  },
  {
    id: 3,
    subjectEn: "Indian Constitution",
    subjectHi: "भारतीय संविधान",
    questionEn: "Under which Article of the Indian Constitution is the provision for the 'Organization of Village Panchayats' made?",
    questionHi: "भारतीय संविधान के किस अनुच्छेद के अंतर्गत 'ग्राम पंचायतों के गठन' का प्रावधान किया गया है?",
    optionsEn: [
      "Article 40 (DPSP)",
      "Article 44 (Uniform Civil Code)",
      "Article 32 (Constitutional Remedies)",
      "Article 21A (Right to Education)"
    ],
    optionsHi: [
      "अनुच्छेद 40 (नीति निर्देशक तत्व)",
      "अनुच्छेद 44 (समान नागरिक संहिता)",
      "अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार)",
      "अनुच्छेद 21A (शिक्षा का अधिकार)"
    ],
    correctIndex: 0,
    explanationEn: "Article 40 of Directive Principles of State Policy directs the State to organize village panchayats and endow them with necessary powers to function as units of self-government.",
    explanationHi: "राज्य के नीति निर्देशक सिद्धांतों के अनुच्छेद 40 में राज्य को ग्राम पंचायतों के गठन और उन्हें स्वशासन की इकाइयों के रूप में कार्य करने का अधिकार देने का निर्देश है।"
  },
  {
    id: 4,
    subjectEn: "Geography",
    subjectHi: "भूगोल",
    questionEn: "The Tropic of Cancer (23.5° N) passes through how many states in India?",
    questionHi: "कर्क रेखा (23.5° उत्तरी अक्षांश) भारत के कुल कितने राज्यों से होकर गुजरती है?",
    optionsEn: [
      "8 States (Gujarat, RJ, MP, CG, JH, WB, TR, MZ)",
      "7 States",
      "9 States",
      "6 States"
    ],
    optionsHi: [
      "8 राज्य (गुजरात, राजस्थान, मप्र, छत्तीसगढ़, झारखंड, प. बंगाल, त्रिपुरा, मिजोरम)",
      "7 राज्य",
      "9 राज्य",
      "6 राज्य"
    ],
    correctIndex: 0,
    explanationEn: "The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.",
    explanationHi: "कर्क रेखा भारत के 8 राज्यों से गुजरती है: गुजरात, राजस्थान, मध्य प्रदेश, छत्तीसगढ़, झारखंड, पश्चिम बंगाल, त्रिपुरा तथा मिजोरम।"
  },
  {
    id: 5,
    subjectEn: "General Hindi",
    subjectHi: "सामान्य हिन्दी",
    questionEn: "'सूर्योदय' (Suryodaya) शब्द में कौन-सी संधि है?",
    questionHi: "'सूर्योदय' शब्द का सही संधि विच्छेद एवं संधि का प्रकार क्या है?",
    optionsEn: [
      "सूर्य + उदय = गुण स्वर संधि",
      "सूर्य + उदय = दीर्घ स्वर संधि",
      "सूर्य + दय = वृद्धि स्वर संधि",
      "सूर्यो + दय = अयादि स्वर संधि"
    ],
    optionsHi: [
      "सूर्य + उदय = गुण स्वर संधि (अ + उ = ओ)",
      "सूर्य + उदय = दीर्घ स्वर संधि",
      "सूर्य + दय = वृद्धि स्वर संधि",
      "सूर्यो + दय = अयादि स्वर संधि"
    ],
    correctIndex: 0,
    explanationEn: "सूर्य + उदय: Here 'अ' combining with 'उ' produces 'ओ' according to Guna Sandhi rule (गुण स्वर संधि).",
    explanationHi: "सूर्य + उदय: यहाँ 'अ' तथा 'उ' मिलकर 'ओ' बनाते हैं, जो गुण स्वर संधि का नियम है।"
  },
  {
    id: 6,
    subjectEn: "General Science",
    subjectHi: "सामान्य विज्ञान",
    questionEn: "What is the chemical name of Vitamin C?",
    questionHi: "विटामिन सी (Vitamin C) का रासायनिक नाम क्या है?",
    optionsEn: [
      "Ascorbic Acid (एस्कॉर्बिक अम्ल)",
      "Retinol (रेटिनॉल)",
      "Thiamine (थायमिन)",
      "Calciferol (कैल्सीफेरॉल)"
    ],
    optionsHi: [
      "एस्कॉर्बिक अम्ल (Ascorbic Acid)",
      "रेटिनॉल (विटामिन A)",
      "थायमिन (विटामिन B1)",
      "कैल्सीफेरॉल (विटामिन D)"
    ],
    correctIndex: 0,
    explanationEn: "Ascorbic acid is Vitamin C, deficiency of which causes Scurvy. Retinol is Vitamin A, Thiamine is Vitamin B1, Calciferol is Vitamin D.",
    explanationHi: "विटामिन C का रासायनिक नाम एस्कॉर्बिक अम्ल है, जिसकी कमी से स्कर्वी रोग होता है।"
  },
  {
    id: 7,
    subjectEn: "Elementary Arithmetic",
    subjectHi: "प्रारम्भिक अंकगणित",
    questionEn: "If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that expenditure remains unchanged?",
    questionHi: "यदि चीनी के मूल्य में 25% की वृद्धि हो जाए, तो एक परिवार को अपनी खपत में कितने प्रतिशत की कमी करनी होगी ताकि कुल खर्च न बढ़े?",
    optionsEn: [
      "20% (Formula: [R / (100 + R)] * 100)",
      "25%",
      "16.66%",
      "15%"
    ],
    optionsHi: [
      "20% (सूत्र: [R / (100 + R)] * 100)",
      "25%",
      "16.66%",
      "15%"
    ],
    correctIndex: 0,
    explanationEn: "Reduction % = [25 / (100 + 25)] * 100 = (25 / 125) * 100 = 1/5 * 100 = 20%.",
    explanationHi: "कमी % = [25 / (100 + 25)] * 100 = (25 / 125) * 100 = 20%।"
  },
  {
    id: 8,
    subjectEn: "General Awareness",
    subjectHi: "सामान्य जागरूकता",
    questionEn: "Where is the headquarters of UNESCO (United Nations Educational, Scientific and Cultural Organization) located?",
    questionHi: "यूनेस्को (UNESCO) का मुख्यालय कहाँ स्थित है?",
    optionsEn: [
      "Paris, France",
      "Geneva, Switzerland",
      "New York, USA",
      "Vienna, Austria"
    ],
    optionsHi: [
      "पेरिस, फ्रांस (Paris)",
      "जिनेवा, स्विट्जरलैंड",
      "न्यूयॉर्क, यूएसए",
      "वियना, ऑस्ट्रिया"
    ],
    correctIndex: 0,
    explanationEn: "UNESCO headquarters is located in Paris, France. WHO and WTO are in Geneva; UN Secretariat is in New York; IAEA is in Vienna.",
    explanationHi: "यूनेस्को का मुख्यालय पेरिस (फ्रांस) में स्थित है। जिनेवा में WHO व WTO हैं; न्यूयॉर्क में संयुक्त राष्ट्र है।"
  },
  {
    id: 9,
    subjectEn: "Reasoning",
    subjectHi: "तर्कशक्ति",
    questionEn: "If 15th August 2023 was a Tuesday, what day was 15th August 2024 (a leap year)?",
    questionHi: "यदि 15 अगस्त 2023 को मंगलवार था, तो 15 अगस्त 2024 को कौन-सा दिन था?",
    optionsEn: [
      "Thursday (गुरुवार - 2 odd days due to Feb 2024 in leap year)",
      "Wednesday",
      "Friday",
      "Tuesday"
    ],
    optionsHi: [
      "गुरुवार (2024 लीप वर्ष में फरवरी 29 दिन होने से +2 विषम दिन)",
      "बुधवार",
      "शुक्रवार",
      "मंगलवार"
    ],
    correctIndex: 0,
    explanationEn: "2024 is a leap year and February 2024 (with 29 days) falls between 15 Aug 2023 and 15 Aug 2024. Therefore, total odd days = 2. Tuesday + 2 days = Thursday.",
    explanationHi: "2024 एक लीप वर्ष है और इसकी 29 दिनों वाली फरवरी इस समयावधि के बीच आती है। अतः 2 विषम दिन जुड़ेंगे: मंगलवार + 2 = गुरुवार।"
  },
  {
    id: 10,
    subjectEn: "Data Interpretation (DI)",
    subjectHi: "ग्राफ एवं तालिका (DI)",
    questionEn: "In a company table, Sales in 2021 was 400 Crore and Sales in 2022 was 520 Crore. What was the percentage increase in sales?",
    questionHi: "एक तालिका में 2021 में कंपनी की बिक्री 400 करोड़ और 2022 में 520 करोड़ थी। बिक्री में प्रतिशत वृद्धि क्या थी?",
    optionsEn: [
      "30% (Increase = 120; (120/400) * 100)",
      "25%",
      "35%",
      "23%"
    ],
    optionsHi: [
      "30% (वृद्धि = 120; (120/400) * 100)",
      "25%",
      "35%",
      "23%"
    ],
    correctIndex: 0,
    explanationEn: "Percentage increase = ((520 - 400) / 400) * 100 = (120 / 400) * 100 = 30%.",
    explanationHi: "प्रतिशत वृद्धि = ((520 - 400) / 400) * 100 = (120 / 400) * 100 = 30%।"
  }
];

export const POST_CUTOFFS: PostCutoffInfo[] = [
  {
    postEn: "Revenue Lekhpal (राजस्व लेखपाल)",
    postHi: "राजस्व लेखपाल (UP Revenue Board)",
    approxVacancies: "4,500 - 8,000",
    targetPercentile: "96.50% - 98.20%",
    safeRawScore: "73.50 - 77.00",
    department: "Board of Revenue, Uttar Pradesh"
  },
  {
    postEn: "Gram Vikas Adhikari - VDO (ग्राम विकास अधिकारी)",
    postHi: "ग्राम विकास अधिकारी (VDO)",
    approxVacancies: "1,500 - 2,500",
    targetPercentile: "97.80% - 99.10%",
    safeRawScore: "76.00 - 80.00",
    department: "Rural Development Department"
  },
  {
    postEn: "Junior Assistant / Clerk (कनिष्ठ सहायक)",
    postHi: "कनिष्ठ सहायक (विभिन्न विभाग)",
    approxVacancies: "3,800 - 5,500",
    targetPercentile: "92.00% - 95.50%",
    safeRawScore: "68.00 - 72.50",
    department: "Civil Secretariat & State Directorates"
  },
  {
    postEn: "Forest Guard & Wildlife (वन रक्षक)",
    postHi: "वन रक्षक एवं वन्य जीव रक्षक",
    approxVacancies: "700 - 1,200",
    targetPercentile: "88.00% - 93.00%",
    safeRawScore: "65.00 - 70.00",
    department: "Forest & Climate Change Department"
  },
  {
    postEn: "Cane Supervisor (गन्ना पर्यवेक्षक)",
    postHi: "गन्ना पर्यवेक्षक",
    approxVacancies: "900 - 1,500",
    targetPercentile: "85.00% - 90.00%",
    safeRawScore: "62.00 - 67.50",
    department: "Cane Development & Sugar Industry"
  },
  {
    postEn: "Mandi Parishad Inspector / Secretary",
    postHi: "मंडी परिषद निरीक्षक / सचिव",
    approxVacancies: "250 - 500",
    targetPercentile: "99.20% - 99.80%",
    safeRawScore: "81.00 - 85.00",
    department: "State Agricultural Produce Markets Board"
  }
];
