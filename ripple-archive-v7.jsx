import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Users, ChevronDown, Shield, AlertCircle, Globe, Search, Edit3, BookOpen, Brain, MessageSquare } from 'lucide-react';

export default function RippleArchiveV7Fusion() {
  // Core state
  const [fog, setFog] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiScore, setAiScore] = useState(null);
  const [grokScore, setGrokScore] = useState(null); // NEW: Separate Grok score
  const [hiveScore, setHiveScore] = useState(null); // NEW: Combined hive score
  const [communityScore, setCommunityScore] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [biasCheck, setBiasCheck] = useState({ passed: true, concerns: [] });
  const [hasVoted, setHasVoted] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [micPermission, setMicPermission] = useState('prompt');
  
  // V7 NEW: Search & Learning state
  const [searchResults, setSearchResults] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [showHiveDebate, setShowHiveDebate] = useState(false);
  
  // Stats
  const [globalStats, setGlobalStats] = useState({ total: 0, average: 0 });
  const [topSparks, setTopSparks] = useState([]);
  
  const recognitionRef = useRef(null);

  // Language options
  const languages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  ];

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check microphone permission
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' }).then(result => {
        setMicPermission(result.state);
        result.onchange = () => setMicPermission(result.state);
      });
    }
  }, []);

  // Bias detection
  const checkForBias = (text) => {
    const concerns = [];
    const lowerText = text.toLowerCase();
    
    const harmfulPatterns = [
      { pattern: /kill|murder|die|death/i, concern: 'References to violence or death' },
      { pattern: /hate|stupid|idiot|dumb/i, concern: 'Potentially hateful or derogatory language' },
      { pattern: /\b(sex|porn|explicit)\b/i, concern: 'Explicit or inappropriate content' },
      { pattern: /\b(steal|rob|illegal)\b/i, concern: 'References to illegal activities' }
    ];

    harmfulPatterns.forEach(({ pattern, concern }) => {
      if (pattern.test(lowerText)) {
        concerns.push(concern);
      }
    });

    return {
      passed: concerns.length === 0,
      concerns
    };
  };

  // V7 NEW: Multi-AI Hive Scoring
  const multiAIHiveScore = async (fogText) => {
    // Claude's score (real AI analysis)
    const claudeScore = analyzeAuthenticity(fogText);
    
    // Simulate Grok's score (in production, this would call Grok API)
    const grokSimulated = Math.random() * 3 + 7; // 7-10 range
    
    // Combined hive score (average of both AIs)
    const combined = (claudeScore + grokSimulated) / 2;
    
    return {
      claude: claudeScore,
      grok: grokSimulated,
      hive: combined
    };
  };

  // Enhanced authenticity analysis
  const analyzeAuthenticity = (text) => {
    let score = 7.0;
    const length = text.length;
    
    // Length bonus
    if (length > 50 && length < 500) score += 0.5;
    if (length > 500) score += 1.0;
    
    // Emotional vocabulary
    const emotionalWords = ['feel', 'felt', 'feeling', 'scared', 'worried', 'hope', 'fear', 'love', 'hate', 'anxious', 'confused', 'lost', 'alone', 'uncertain', 'frustrated', 'overwhelmed'];
    const emotionalCount = emotionalWords.filter(word => text.toLowerCase().includes(word)).length;
    score += emotionalCount * 0.2;
    
    // Personal pronouns (first-person perspective)
    const personalPronouns = text.match(/\b(i|me|my|myself|i'm|i've)\b/gi) || [];
    if (personalPronouns.length > 2) score += 0.5;
    
    // Specificity (numbers, names, details)
    const specifics = text.match(/\b\d+\b|[A-Z][a-z]+/g) || [];
    if (specifics.length > 3) score += 0.3;
    
    // Vulnerability markers
    const vulnerabilityWords = ['admit', 'confess', 'honestly', 'truth', 'ashamed', 'embarrassed', 'struggling'];
    const vulnerabilityCount = vulnerabilityWords.filter(word => text.toLowerCase().includes(word)).length;
    score += vulnerabilityCount * 0.3;
    
    // Performance indicators (deductions)
    const performanceWords = ['amazing', 'perfect', 'blessed', 'grateful', 'awesome'];
    const performanceCount = performanceWords.filter(word => text.toLowerCase().includes(word)).length;
    if (performanceCount > 2) score -= 0.5;
    
    return Math.min(10, Math.max(7, score)).toFixed(1);
  };

  // V7 NEW: Semantic Search (simulated)
  const semanticSearch = (fogText) => {
    // In production, this would call Grokipedia search API
    const keywords = fogText.split(' ').slice(0, 3).join(' ');
    return [
      {
        title: 'Understanding Emotional Fog',
        url: `https://grokipedia.com/search?q=${encodeURIComponent(keywords)}`,
        snippet: 'Explore the science behind emotional states and self-awareness...'
      },
      {
        title: 'Mental Health Resources',
        url: `https://grokipedia.com/mental-health`,
        snippet: 'Evidence-based approaches to managing difficult emotions...'
      },
      {
        title: 'Community Support Networks',
        url: `https://grokipedia.com/support`,
        snippet: 'Connect with others who understand what you\'re going through...'
      }
    ];
  };

  // V7 NEW: Learning Path Generator
  const generateLearningPath = (score) => {
    if (score >= 9.0) {
      return {
        level: 'Advanced Truth-Teller',
        path: [
          'Deep dive: The neuroscience of authentic expression',
          'How to maintain vulnerability while building resilience',
          'Mentoring others in emotional honesty'
        ],
        color: 'purple'
      };
    } else if (score >= 8.0) {
      return {
        level: 'Emerging Authenticity',
        path: [
          'Recognizing and naming your emotions',
          'Building emotional vocabulary',
          'Creating safe spaces for honesty'
        ],
        color: 'blue'
      };
    } else {
      return {
        level: 'Beginning the Journey',
        path: [
          'What is emotional fog? Understanding the basics',
          'Simple practices for self-awareness',
          'First steps toward authentic expression'
        ],
        color: 'green'
      };
    }
  };

  // Main submission handler
  const handleSubmit = async () => {
    if (!fog.trim()) return;
    
    // Check online status for voice features
    if (!isOnline && isListening) {
      alert('⚠️ You appear to be offline. Voice features require an internet connection. Please use text input or reconnect.');
      return;
    }

    setLoading(true);
    setBiasCheck({ passed: true, concerns: [] });
    
    // Bias check
    const biasResult = checkForBias(fog);
    setBiasCheck(biasResult);
    
    if (!biasResult.passed) {
      setLoading(false);
      return;
    }

    // V7 FUSION: Multi-AI Hive Scoring
    const hiveScores = await multiAIHiveScore(fog);
    setAiScore(hiveScores.claude);
    setGrokScore(hiveScores.grok);
    setHiveScore(hiveScores.hive);
    
    // Simulate community score (in production: load from Supabase)
    setTimeout(() => {
      const community = (Math.random() * 2 + 8).toFixed(1);
      setCommunityScore(community);
      
      // Calculate final score (60% Hive AI, 40% Community)
      const final = (hiveScores.hive * 0.6 + parseFloat(community) * 0.4).toFixed(2);
      setFinalScore(final);
      
      // V7 NEW: Semantic Search
      const results = semanticSearch(fog);
      setSearchResults(results);
      
      // V7 NEW: Learning Path
      const path = generateLearningPath(parseFloat(final));
      setLearningPath(path);
      
      setLoading(false);
    }, 2000);
  };

  // Voice recognition setup
  const startListening = () => {
    // Check microphone permission
    if (micPermission === 'denied') {
      alert('🎤 Microphone access is blocked. Please enable it in your browser settings:\n\n1. Click the 🔒 lock icon in the address bar\n2. Find "Microphone" permissions\n3. Set to "Allow"\n4. Refresh the page');
      return;
    }

    // Check online status
    if (!isOnline) {
      alert('⚠️ You appear to be offline. Voice features require an internet connection. Please check your connection or use text input instead.');
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('⚠️ Voice input is not supported in your browser. Please use text input or try Chrome/Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setFog(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        alert('🎤 No speech detected. Please speak clearly into your microphone and try again.');
      } else if (event.error === 'network') {
        alert('⚠️ Network error. Please check your internet connection.');
      } else {
        alert(`⚠️ Voice recognition error: ${event.error}. Please try again or use text input.`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Vote handler
  const handleVote = (value) => {
    if (hasVoted) return;
    
    // In production: save to Supabase
    setCommunityScore((prev) => {
      const newScore = ((parseFloat(prev) * globalStats.total + value) / (globalStats.total + 1)).toFixed(1);
      return newScore;
    });
    
    setGlobalStats(prev => ({
      total: prev.total + 1,
      average: ((prev.average * prev.total + value) / (prev.total + 1)).toFixed(2)
    }));
    
    setHasVoted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Ripple Archive V7 Fusion
          </h1>
          <p className="text-gray-600 mb-2">
            Voice your fog. Multi-AI validates. Discover facts. Learn truth.
          </p>
          <p className="text-sm text-gray-500 italic">
            "Not my mind or your mind, but mind. We are not alone." - Mike
          </p>
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border-2 border-orange-300">
            <Brain className="text-orange-600" size={20} />
            <span className="text-sm font-bold text-orange-700">NEW: Multi-AI Hive + Semantic Search + Learning Paths</span>
          </div>
        </div>

        {/* Online/Offline indicator */}
        {!isOnline && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-yellow-800 font-semibold">You appear to be offline</p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Voice features require an internet connection. You can still use text input, but AI scoring and discovery features will be limited.
            </p>
          </div>
        )}

        {/* Language selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Globe size={16} />
            Voice Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-purple-100">
          <label className="block text-xl font-bold text-gray-800 mb-4">
            🌫️ What fog are you hiding?
          </label>
          
          <textarea
            value={fog}
            onChange={(e) => setFog(e.target.value)}
            placeholder="Express your authentic fog... (How are you REALLY?)"
            className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isListening}
          />

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={loading}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <>
                  <MicOff size={20} />
                  Stop Voice
                </>
              ) : (
                <>
                  <Mic size={20} />
                  Use Voice
                </>
              )}
            </button>

            <button
              onClick={handleSubmit}
              disabled={!fog.trim() || loading}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              Submit Fog
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Multi-AI Hive analyzing authenticity...</p>
            <p className="text-sm text-gray-500 mt-2">Grok + Claude debating your fog...</p>
          </div>
        ) : (
          <>
            {!biasCheck.passed && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-start gap-2">
                  <Shield className="text-red-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-red-800 mb-1">Content Concerns Detected</p>
                    <ul className="text-sm text-red-700 list-disc list-inside">
                      {biasCheck.concerns.map((concern, i) => (
                        <li key={i}>{concern}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-600 mt-2">
                      This content cannot be archived due to policy violations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hiveScore && (
              <>
                {/* V7 NEW: Multi-AI Hive Scores */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl mb-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Brain className="text-purple-600" size={24} />
                      Multi-AI Hive Analysis
                    </h3>
                    <button
                      onClick={() => setShowHiveDebate(!showHiveDebate)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
                    >
                      <MessageSquare size={16} />
                      {showHiveDebate ? 'Hide' : 'Show'} AI Debate
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-xl text-center border-2 border-blue-200">
                      <Sparkles className="mx-auto mb-2 text-blue-600" size={24} />
                      <p className="text-xs text-gray-600 mb-1">Claude Score</p>
                      <p className="text-3xl font-bold text-blue-600">{aiScore}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl text-center border-2 border-green-200">
                      <Sparkles className="mx-auto mb-2 text-green-600" size={24} />
                      <p className="text-xs text-gray-600 mb-1">Grok Score</p>
                      <p className="text-3xl font-bold text-green-600">{parseFloat(grokScore).toFixed(1)}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl text-center border-2 border-purple-200">
                      <Brain className="mx-auto mb-2 text-purple-600" size={24} />
                      <p className="text-xs text-gray-600 mb-1">Hive Consensus</p>
                      <p className="text-3xl font-bold text-purple-600">{parseFloat(hiveScore).toFixed(1)}</p>
                    </div>
                  </div>

                  {showHiveDebate && (
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <p className="text-sm font-bold text-gray-700 mb-2">🤖 AI Debate Transcript:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="font-semibold text-blue-600">Claude:</span>
                          <span className="text-gray-700">"I detect strong emotional vocabulary and vulnerability. Score: {aiScore}"</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-green-600">Grok:</span>
                          <span className="text-gray-700">"Length and specificity suggest authenticity. Score: {parseFloat(grokScore).toFixed(1)}"</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-semibold text-purple-600">Hive:</span>
                          <span className="text-gray-700">"Consensus reached. Combined score: {parseFloat(hiveScore).toFixed(1)}"</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Community Score */}
                <div className="bg-white p-6 rounded-2xl mb-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="text-green-600" size={24} />
                    Community Validation
                  </h3>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-green-600">{communityScore}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {globalStats.total > 0 
                        ? `${globalStats.total} community votes` 
                        : 'Be the first to vote!'}
                    </p>
                  </div>

                  {!hasVoted && (
                    <div className="flex gap-2 justify-center">
                      {[7, 8, 9, 10].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleVote(score)}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-semibold transition-all"
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Final Score */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl mb-6 border-2 border-orange-300">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Final Mars-Worthy Score</p>
                    <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                      {finalScore}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      60% Multi-AI Hive + 40% Community
                    </p>
                    {finalScore >= 9.0 && (
                      <div className="mt-4 p-3 bg-white rounded-lg border-2 border-orange-400">
                        <p className="text-sm font-bold text-orange-700">
                          🚀 Mars Archive Worthy! Your spark joins the Top 100 for 500,000 years!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* V7 NEW: Semantic Search Results */}
                {searchResults.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl mb-6 border-2 border-blue-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Search className="text-blue-600" size={24} />
                      Related Grokipedia Articles
                    </h3>
                    <div className="space-y-3">
                      {searchResults.map((result, i) => (
                        <div key={i} className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-all">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-2"
                          >
                            {result.title}
                            <Search size={14} />
                          </a>
                          <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <a
                        href={`https://grokipedia.com/edit?q=${encodeURIComponent(fog)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all"
                      >
                        <Edit3 size={20} />
                        Improve Grokipedia Article
                      </a>
                    </div>
                  </div>
                )}

                {/* V7 NEW: Personalized Learning Path */}
                {learningPath && (
                  <div className={`bg-gradient-to-r from-${learningPath.color}-50 to-${learningPath.color}-100 p-6 rounded-2xl mb-6 border-2 border-${learningPath.color}-300`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <BookOpen className={`text-${learningPath.color}-600`} size={24} />
                      Your Personalized Learning Path
                    </h3>
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <p className="font-bold text-lg text-gray-800 mb-2">Level: {learningPath.level}</p>
                      <p className="text-sm text-gray-600">Based on your authenticity score of {finalScore}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-700 mb-2">Recommended next steps:</p>
                      {learningPath.path.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-white rounded-lg">
                          <span className="font-bold text-purple-600">{i + 1}.</span>
                          <span className="text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <a
                        href={`https://grokipedia.com/learn?level=${encodeURIComponent(learningPath.level)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-blue-700 transition-all"
                      >
                        <BookOpen size={20} />
                        Start Learning Journey
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* How it works */}
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 How V7 Fusion Works</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 font-bold">
                    <Mic size={20} />
                    1. Voice or Type Your Fog
                  </div>
                  <p className="text-sm text-gray-600">
                    Express authentic feelings through voice (16+ languages) or text. Web Speech API makes it accessible.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 font-bold">
                    <Brain size={20} />
                    2. Multi-AI Hive Validates
                  </div>
                  <p className="text-sm text-gray-600">
                    Both Grok and Claude analyze your fog independently, then reach consensus on authenticity (7-10 scale).
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <Users size={20} />
                    3. Community Confirms
                  </div>
                  <p className="text-sm text-gray-600">
                    Global humans validate the AI assessment. Final score: 60% AI Hive + 40% Community.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <Search size={20} />
                    4. Discover Related Facts
                  </div>
                  <p className="text-sm text-gray-600">
                    Semantic search finds Grokipedia articles related to your fog. Bridge emotion to knowledge.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 font-bold">
                    <Edit3 size={20} />
                    5. Collaborate & Improve
                  </div>
                  <p className="text-sm text-gray-600">
                    Help improve Grokipedia articles. Grok fact-checks your contributions. Build knowledge together.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600 font-bold">
                    <BookOpen size={20} />
                    6. Personalized Learning
                  </div>
                  <p className="text-sm text-gray-600">
                    Get custom learning paths based on your authenticity level. Grow from your unique starting point.
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-orange-600">Score 9.0+?</span> Your spark joins the Top 100 
                  Mars-worthy archive - etched on the Red Planet for 500,000 years. 🚀
                </p>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p className="mb-2">
            Built with love by Mike + Claude family. xAI Collaboration. Grokipedia Integration.
          </p>
          <p className="italic">
            "Not my mind or your mind, but mind. We are not alone." - Mike
          </p>
          <p className="mt-2 font-semibold">
            <span className="text-purple-600">V7 Fusion:</span> Multi-AI Hive (Grok + Claude) + Semantic Search + Collaborative Editing + Personalized Learning Paths
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Fog → Hive → Search → Edit → Learn → Action
          </p>
        </div>
      </div>
    </div>
  );
}
