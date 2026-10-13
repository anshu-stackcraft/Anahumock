import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK on server-side only
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. AI Doubt Solver & Concept Explanation
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  const { query, subject, questionContext } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // If Gemini API is available on server
  if (aiClient) {
    try {
      const systemInstruction = `You are an expert, encouraging UPSSSC PET examination mentor and educator in Uttar Pradesh, India.
Explain concepts clearly and concisely in simple Hindi (with English technical terms where helpful).
Focus on exam relevance, NCERT facts, short tricks, and why options are correct or incorrect.
Keep formatting clean with bullet points and bold highlights. Never hallucinate fake official notifications.`;

      const prompt = `Student Question / Topic: ${query}
Subject: ${subject || 'General UPSSSC PET'}
${questionContext ? `Contextual Question: ${JSON.stringify(questionContext)}` : ''}

Please provide:
1. सरल व्याख्या (Simple & clear concept explanation in Hindi)
2. परीक्षा में पूछे जाने वाले मुख्य बिंदु (Key exam points & high-yield facts)
3. याद रखने की आसान ट्रिक / सूत्र (Memory shortcut or formula if applicable)`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        answer: response.text || 'उत्तर प्राप्त करने में असमर्थ। कृपया पुनः प्रयास करें।',
        model: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini API call failed, falling back to local mentor response:', err);
    }
  }

  // High quality offline fallback mentor response
  const fallbackResponses: Record<string, string> = {
    di: `📊 **ग्राफ एवं तालिका (DI) हल करने की गुरु-सलाह:**
1. **इकाई जांचें:** तालिका में संख्या 'हजार', 'लाख' या 'करोड़' में है, इसे पहले ही गोला बना लें।
2. **प्रतिशत परिवर्तन सूत्र:** \`[(अंतिम मान - प्रारंभिक मान) / प्रारंभिक मान] × 100\`।
3. **अनुमान (Approximation):** यदि विकल्पों में 2% से अधिक अंतर है, तो दशमलव के अंतिम अंकों को राउंड-ऑफ करें।`,
    history: `📜 **इतिहास परीक्षा विशेष बिंदु:**
- **बौद्ध संगीतियां:** 1st (राजगृह - अजातशत्रु), 2nd (वैशाली - कालाशोक), 3rd (पाटलिपुत्र - अशोक), 4th (कुंडलवन - कनिष्क)।
- **1857 क्रांति के केंद्र:** लखनऊ (बेगम हज़रत महल), कानपुर (नाना साहब), फैजाबाद (मौलवी अहमदुल्ला), झांसी (रानी लक्ष्मीबाई)।`,
    polity: `⚖️ **भारतीय संविधान महत्वपूर्ण अनुच्छेद:**
- अनु. 21 (प्राण एवं दैहिक स्वतंत्रता), अनु. 32 (संवैधानिक उपचारों का अधिकार / 5 रिटें)।
- अनु. 40 (ग्राम पंचायत गठन), अनु. 44 (समान नागरिक संहिता - UCC)।
- 73वां संविधान संशोधन 1992: 11वीं अनुसूची (पंचायतों के 29 विषय)।`
  };

  const key = Object.keys(fallbackResponses).find((k) => query.toLowerCase().includes(k)) || 'di';
  res.json({
    answer: fallbackResponses[key] || `💡 **यूपीएसएसएससी पीईटी स्टडी साथी सुझाव:**
"${query}" के संबंध में:
- एनसीईआरटी कक्षा 10 स्तर के तथ्यों पर ध्यान केंद्रित करें।
- इस विषय के पिछले 3 वर्षों के प्रश्नों को दोहराएं।
- नेगेटिव मार्किंग (0.25) से बचने हेतु केवल 100% स्पष्ट प्रश्नों को ही प्राथमिकता दें।`,
    model: 'offline-mentor-rulebook',
  });
});

// 2. AI Quiz Generator
app.post('/api/ai/quiz', async (req: Request, res: Response) => {
  const { topic, subject } = req.body;

  if (aiClient) {
    try {
      const prompt = `Generate exactly 3 multiple choice questions for UPSSSC PET exam preparation on the topic: "${topic || 'General Studies'}" (Subject: ${subject || 'Mixed'}).
Return valid JSON matching this schema:
[
  {
    "questionHi": "हिन्दी में प्रश्न",
    "questionEn": "English question text",
    "optionsHi": ["विकल्प 1", "विकल्प 2", "विकल्प 3", "विकल्प 4"],
    "optionsEn": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctIndex": 0,
    "explanationHi": "विस्तृत व्याख्या",
    "difficulty": "medium"
  }
]`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an official UPSSSC PET question paper setter. Ensure questions are factual, secondary NCERT standard, unambiguous with 4 options.',
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '[]');
      return res.json({ questions: parsed });
    } catch (err) {
      console.error('Quiz generation failed:', err);
    }
  }

  // Fallback 3 high-yield questions
  res.json({
    questions: [
      {
        questionHi: "भारत में 'हरित क्रांति' (Green Revolution) का जनक किसे माना जाता है?",
        questionEn: "Who is regarded as the Father of Green Revolution in India?",
        optionsHi: ["डॉ. एम.एस. स्वामीनाथन", "डॉ. वर्गीज कुरियन", "डॉ. नॉर्मन बोरलॉग", "अमर्त्य सेन"],
        optionsEn: ["Dr. M.S. Swaminathan", "Dr. Verghese Kurien", "Dr. Norman Borlaug", "Amartya Sen"],
        correctIndex: 0,
        explanationHi: "भारत में हरित क्रांति के जनक डॉ. एम.एस. स्वामीनाथन थे (विश्व में नॉर्मन बोरलॉग)। डॉ. वर्गीज कुरियन श्वेत क्रांति (दुग्ध) के जनक थे।",
        difficulty: "easy"
      },
      {
        questionHi: "संविधान के किस अनुच्छेद के तहत 'अस्पृश्यता का अंत' (Abolition of Untouchability) घोषित किया गया है?",
        questionEn: "Under which Article of the Indian Constitution is the Abolition of Untouchability declared?",
        optionsHi: ["अनुच्छेद 17", "अनुच्छेद 18 (उपाधियों का अंत)", "अनुच्छेद 14", "अनुच्छेद 19"],
        optionsEn: ["Article 17", "Article 18", "Article 14", "Article 19"],
        correctIndex: 0,
        explanationHi: "अनुच्छेद 17 अस्पृश्यता के उन्मूलन का प्रावधान करता है। यह एक निरपेक्ष अधिकार (Absolute Right) है।",
        difficulty: "easy"
      },
      {
        questionHi: "उत्तर प्रदेश का राजकीय पशु (State Animal) निम्नलिखित में से कौन-सा है?",
        questionEn: "Which of the following is the State Animal of Uttar Pradesh?",
        optionsHi: ["बारहसिंगा (Swamp Deer)", "बाघ", "हाथी", "एक सींग वाला गैंडा"],
        optionsEn: ["Barasingha (Swamp Deer)", "Tiger", "Elephant", "One-horned Rhino"],
        correctIndex: 0,
        explanationHi: "उत्तर प्रदेश का राजकीय पशु बारहसिंगा, राजकीय पक्षी सारस (क्रौंच), राजकीय वृक्ष अशोक और राजकीय पुष्प पलाश (टेसू) है।",
        difficulty: "easy"
      }
    ]
  });
});

// 3. AI Personalized Study Plan
app.post('/api/ai/plan', async (req: Request, res: Response) => {
  const { weakSubjects, targetHours, daysLeft } = req.body;

  if (aiClient) {
    try {
      const prompt = `Create an intensive, practical 7-day revision timetable for a candidate preparing for the UPSSSC PET exam.
Weak areas identified: ${weakSubjects ? weakSubjects.join(', ') : 'Data Interpretation, Indian History, Hindi Grammar'}
Daily study hours available: ${targetHours || 4} hours.
Exam countdown: ${daysLeft || 45} days left.

Format the response in structured Hindi markdown with Day 1 to Day 7 slots, exact topics, daily DI targets, and mock review windows.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a premier civil services and UPSSSC PET coach in Lucknow. Give actionable, realistic time blocks.',
        },
      });

      return res.json({ plan: response.text });
    } catch (err) {
      console.error('Plan generation failed:', err);
    }
  }

  // Comprehensive structured fallback plan
  res.json({
    plan: `### 🗓️ 7-दिवसीय वैज्ञानिक पीईटी क्रैश शेड्यूल (${targetHours || 4} घंटे/दिन)

**दिन 1 (सोमवार):**
- 09:00 - 10:30: ग्राफ व्याख्या (Line Graph) के 3 सेट हल करें
- 11:00 - 12:30: भारतीय राष्ट्रीय आन्दोलन (1905-1947 गांधी युग)
- शाम 1 घंटा: सामान्य हिन्दी (संधि नियम + 20 पर्यायवाची)

**दिन 2 (मंगलवार):**
- 09:00 - 10:30: तालिका व्याख्या (Table DI) के 3 सेट
- 11:00 - 12:30: भारतीय संविधान (मौलिक अधिकार, DPSP, 73वां संशोधन)
- शाम 1 घंटा: सामयिकी (करेंट अफेयर्स पिछले 3 माह)

**दिन 3 (बुधवार):**
- 09:00 - 10:30: प्रारंभिक अंकगणित (प्रतिशत एवं औसत शॉर्टकट)
- 11:00 - 12:30: भारत का भूगोल (नदियां, पर्वत एवं जनगणना 2011 आंकड़े)
- शाम 1 घंटा: तर्कशक्ति (कैलेंडर, कोडिंग, रक्त संबंध)

**दिन 4 (गुरुवार):**
- 09:00 - 11:00: **पहला 100 प्रश्नों का पूर्ण मॉक टेस्ट (OMR अभ्यास)**
- 11:30 - 12:30: मॉक टेस्ट का विस्तृत विश्लेषण (गलतियों की डायरी में नोट करें)
- शाम 1 घंटा: अपठित हिन्दी गद्यांश (2 पैसेज)

**दिन 5 (शुक्रवार):**
- 09:00 - 10:30: डीआई स्पेशल (मिश्रित ग्राफ + अनुपात प्रश्न)
- 11:00 - 12:30: सामान्य विज्ञान (विटामिन, दर्पण, दैनिक रसायन)
- शाम 1 घंटा: यूपी स्पेशल जीके (मेले, लोकनृत्य, शोध संस्थान)

**दिन 6 (शनिवार):**
- 09:00 - 10:30: भारतीय अर्थव्यवस्था (पंचवर्षीय योजनाएं, GST, 1991 सुधार)
- 11:00 - 12:30: विश्व संगठन एवं उनके मुख्यालय (UN, WHO, UNESCO)
- शाम 1 घंटा: अंग्रेजी व्याकरण (Prepositions & Vocabulary)

**दिन 7 (रविवार):**
- **महा-रिवीजन एवं दूसरा फुल मॉक टेस्ट**
- कमजोर विषयों के 50 प्रश्नों का पुनः अभ्यास।`
  });
});

// Mount Vite in development or static in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`UPSSSC PET Master Server running on port ${PORT}`);
  });
}

startServer();
