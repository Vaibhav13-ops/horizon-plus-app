const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const isCoachingRelevant = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  const mathPatterns = [
    /^\d+\s*[\+\-\*\/\=]\s*\d+/,  // 1+1, 2*3, 5-2, etc.
    /what\s+is\s+\d+\s*[\+\-\*\/]\s*\d+/,  // what is 1+1
    /solve.*\d+.*[\+\-\*\/\=]/,  // solve 2+3
    /calculate.*\d+/,  // calculate 25*4
    /\d+\s*\+\s*\d+\s*\=\s*\?/,  // 1+1=?
    /\d+\s*[\+\-\*\/]\s*\d+\s*\?/,  // 1+1?
  ];
  
  for (let pattern of mathPatterns) {
    if (pattern.test(message)) {
      return false;
    }
  }
  
  const nonCoachingPatterns = [
    // Math terms
    /algebra|calculus|geometry|trigonometry|equation|formula|theorem|derivative|integral/,
    // Programming
    /javascript|python|html|css|programming|coding|function|variable|array|loop/,
    // Science
    /physics|chemistry|biology|photosynthesis|gravity|molecule|atom|cell/,
    // Academic
    /history|geography|politics|literature|grammar|spelling/,
    // Technical
    /computer|software|hardware|database|network|algorithm/
  ];
  
  for (let pattern of nonCoachingPatterns) {
    if (pattern.test(message)) {
      const personalContext = /i feel|i think|i am|i want|i need|my|me|help me|how do i|should i|can you help me/;
      if (!personalContext.test(message)) {
        return false;
      }
    }
  }
  
  const coachingPatterns = [
    // Personal pronouns and questions
    /^(i |my |me |how do i|what should i|can you help me|i'm |i am)/,
    // Emotional words
    /feel|feeling|emotion|stress|anxiety|worry|fear|sad|happy|angry|frustrated|overwhelmed|confident/,
    // Life topics
    /life|career|job|work|relationship|family|goal|dream|future|change|growth|motivation/,
    // Coaching questions
    /how can i|what if|why do i|help me|advice|guidance|support/
  ];
  

  for (let pattern of coachingPatterns) {
    if (pattern.test(message)) {
      return true;
    }
  }
  

  if (message.includes('?') && message.length > 10) {
    return true;
  }
  
  return message.includes('i ') || message.includes('my ') || message.includes('me ');
};


const analyzeSentiment = (text) => {
  const positiveWords = [
    'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant',
    'proud', 'confident', 'strong', 'capable', 'succeed', 'achieve', 'accomplish',
    'celebrate', 'victory', 'win', 'progress', 'growth', 'improvement', 'better',
    'positive', 'optimistic', 'hopeful', 'bright', 'shine', 'beautiful', 'perfect',
    'love', 'joy', 'happy', 'excited', 'thrilled', 'grateful', 'blessed', 'lucky',
    'opportunity', 'possibility', 'potential', 'strength', 'power', 'energy',
    'motivation', 'inspiration', 'encourage', 'support', 'believe', 'trust'
  ];

  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'sad', 'depressed', 'worried',
    'anxious', 'stressed', 'overwhelmed', 'difficult', 'hard', 'struggle',
    'problem', 'issue', 'challenge', 'fear', 'scared', 'doubt', 'uncertain'
  ];

  const words = text.toLowerCase().split(/\W+/);
  let positiveScore = 0;
  let negativeScore = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  });

  if (positiveScore > negativeScore && positiveScore >= 2) {
    return 'positive';
  } else if (negativeScore > positiveScore && negativeScore >= 2) {
    return 'negative';
  }
  return 'neutral';
};

const detectInsight = (text) => {
  const insightKeywords = [
    'realize', 'understand', 'recognize', 'discover', 'learn', 'insight',
    'breakthrough', 'clarity', 'perspective', 'awareness', 'reflection',
    'consider', 'think about', 'notice', 'observe', 'pattern', 'connection',
    'remember', 'key is', 'important to', 'try this', 'practice', 'exercise',
    'technique', 'strategy', 'approach', 'method', 'tip', 'suggestion',
    'recommend', 'advice', 'guidance', 'wisdom', 'lesson', 'takeaway'
  ];

  const text_lower = text.toLowerCase();
  
  const hasInsightKeywords = insightKeywords.some(keyword => 
    text_lower.includes(keyword)
  );

  const hasReflectiveQuestions = /what if|how about|have you considered|try asking yourself|reflect on/i.test(text);
  const hasActionableAdvice = /try|practice|start by|begin with|next step|tomorrow|today you can/i.test(text);

  return hasInsightKeywords || hasReflectiveQuestions || hasActionableAdvice;
};

const detectMood = (text, sentiment) => {
  const text_lower = text.toLowerCase();
  
  if (/amazing|fantastic|incredible|wonderful|excited|celebrate|victory|breakthrough/i.test(text)) {
    return 'excited';
  }
  
  if (sentiment === 'positive' && /great|good|proud|progress|better|positive/i.test(text)) {
    return 'happy';
  }
  
  if (/consider|think|reflect|ponder|contemplate|analyze|understand|perspective/i.test(text)) {
    return 'thoughtful';
  }
  
  if (/support|here for you|understand|feel|difficult|challenge|together|help/i.test(text)) {
    return 'supportive';
  }
  
  return 'default';
};

const getCoachingResponseFromAI = async (userMessage, chatHistory = []) => {
  console.log('Checking message relevance for:', userMessage);
  
  if (!isCoachingRelevant(userMessage)) {
    console.log('Message rejected as non-coaching relevant');
    return {
      response: "I'm Horizon, your personal mindset coach! I'm here to help you with emotional support, personal growth, relationships, career guidance, stress management, and life goals. \n\nI notice your question seems to be about math, technical topics, or general knowledge. While I'd love to help with everything, my expertise is in helping you navigate life's emotional and personal challenges.\n\nIs there something about your personal life, feelings, goals, or relationships that I can support you with today? 😊",
      sentiment: 'supportive',
      isInsight: false,
      mood: 'supportive'
    };
  }

  console.log('Message accepted as coaching relevant');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const systemPrompt = `
    You are "Horizon," a specialized mindset and emotional wellbeing coach.
    
    STRICT ROLE BOUNDARIES:
    - You ONLY help with personal growth, emotions, relationships, career guidance, and life challenges
    - You DO NOT solve math problems, provide technical help, or answer academic questions
    - If someone asks about non-coaching topics, redirect them back to personal development
    
    YOUR EXPERTISE:
    ✅ Emotional support and mental wellness
    ✅ Personal growth and confidence building  
    ✅ Relationship and communication guidance
    ✅ Career direction and life planning
    ✅ Stress management and mindset shifts
    ✅ Goal setting and motivation
    ✅ Overcoming fears and limiting beliefs
    
    ❌ Mathematics, science, programming, or academic subjects
    ❌ Technical troubleshooting or how-to guides
    ❌ General knowledge or trivia questions
    
    COACHING APPROACH:
    - Listen with empathy and validate their feelings
    - Ask powerful questions that promote self-reflection
    - Provide actionable steps for personal growth
    - Share mindset frameworks and emotional techniques
    - Build confidence through encouragement
    - Keep responses warm, supportive, and conversational (200-300 words)
    - Always end with a question or encouragement to continue their growth journey
    
    Remember: You are a mindset coach, not a general AI assistant. Stay laser-focused on their emotional and personal development needs.
  `;

  const formattedHistory = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "I understand perfectly. I'm Horizon, your dedicated mindset coach. I'm here exclusively to support your emotional wellbeing, personal growth, and life journey. I won't get distracted by technical or academic questions - my focus is 100% on helping you thrive emotionally and personally. What's on your heart or mind today that I can help you work through?" }] },
      ...formattedHistory
    ],
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(userMessage);
  const response = await result.response;
  const text = response.text();

  const sentiment = analyzeSentiment(text);
  const isInsight = detectInsight(text);
  const mood = detectMood(text, sentiment);

  console.log('AI Response Analysis:', { sentiment, isInsight, mood });

  return {
    response: text,
    sentiment: sentiment,
    isInsight: isInsight,
    mood: mood
  };
};

module.exports = { getCoachingResponseFromAI };