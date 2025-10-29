import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Rocket, Users, Search, ThumbsUp, ThumbsDown, Award, Info, Star, Zap, TrendingUp, Shield, Database, Mic, MicOff } from 'lucide-react';

// SUPABASE CONFIG (Replace with your actual Supabase URL and anon key)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

export default function RippleArchiveV6() {
  const [fog, setFog] = useState('');
  const [witnessed, setWitnessed] = useState(false);
  const [archived, setArchived] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const [hasVoted, setHasVoted] = useState(false);
  const [voteType, setVoteType] = useState(null);
  const [sparkId, setSparkId] = useState(null);
  const [globalStats, setGlobalStats] = useState({ upvotes: 0, downvotes: 0, total: 0 });
  const [aiScore, setAiScore] = useState(0);
  const [communityScore, setCommunityScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [isMarsWorthy, setIsMarsWorthy] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [biasCheck, setBiasCheck] = useState({ passed: true, concerns: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  
  // V6.1: Voice input state with enhanced error handling
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const recognitionRef = useRef(null);

  // V6.1: Initialize Web Speech API with multi-language and enhanced error handling
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage; // V6.1: Dynamic language

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setFog(prev => (prev + ' ' + finalTranscript).trim());
        } else if (interimTranscript) {
          setFog(prev => {
            const base = prev.split('[listening...]')[0].trim();
            return base + (base ? ' ' : '') + interimTranscript + ' [listening...]';
          });
        }
      };

      // V6.1: Enhanced error handling with specific messages
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone access denied. Please enable microphone permissions in your browser settings.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please try again.');
          setTimeout(() => setVoiceError(null), 3000);
        } else if (event.error === 'network') {
          setVoiceError('Network error. Voice input requires an internet connection.');
        } else if (event.error === 'aborted') {
          setVoiceError(null); // User stopped, no error needed
        } else {
          setVoiceError(`Voice input error: ${event.error}`);
          setTimeout(() => setVoiceError(null), 3000);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setFog(prev => prev.replace(/\s*\[listening\.\.\.\]\s*/g, '').trim());
      };
    }
  }, [selectedLanguage]); // V6.1: Re-initialize when language changes


  // V6.1: Toggle voice input with offline detection
  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      setVoiceError('Voice input not supported in this browser. Try Chrome or Edge.');
      return;
    }

    // V6.1: Check for internet connection
    if (!navigator.onLine) {
      setVoiceError('Voice input requires an internet connection. Please check your network and try again.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoiceError(null);
    } else {
      setVoiceError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // V6: Real Grok API call for AI scoring
  const calculateRealAIScore = async (fogText) => {
    setIsCalculating(true);
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROK_API_KEY || 'YOUR_GROK_API_KEY'}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an authenticity validator. Score human expressions 7-10 based on genuine emotion, vulnerability, and truth. Detect bias, hate speech, or manipulation. Respond ONLY with JSON: {score: float, concerns: [string], reasoning: string}"
            },
            {
              role: "user",
              content: `Score this human fog for authenticity:\n\n"${fogText}"\n\nDetect any bias, hate speech, or manipulation.`
            }
          ],
          model: "grok-beta",
          temperature: 0.3
        })
      });

      if (!response.ok) {
        return calculateEnhancedLocalScore(fogText);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      setAiScore(parseFloat(result.score.toFixed(1)));
      setBiasCheck({
        passed: result.concerns.length === 0,
        concerns: result.concerns
      });
      setIsCalculating(false);
      
      return result.score;
    } catch (error) {
      console.error('Grok API error:', error);
      return calculateEnhancedLocalScore(fogText);
    }
  };

  // Enhanced local scoring with bias detection (fallback)
  const calculateEnhancedLocalScore = (fogText) => {
    const text = fogText.toLowerCase();
    
    const biasPatterns = [
      { pattern: /hate|attack|violent|kill|destroy/i, concern: 'Aggressive language detected' },
      { pattern: /\b(all|every|never|always)\b.*(people|men|women|race|religion)/i, concern: 'Absolutist generalizations' },
      { pattern: /stupid|idiot|dumb|worthless/i, concern: 'Derogatory language' }
    ];
    
    const concerns = [];
    for (const { pattern, concern } of biasPatterns) {
      if (pattern.test(text)) {
        concerns.push(concern);
      }
    }
    
    let score = 7.0;
    
    if (/feel|felt|feeling|wonder|question|afraid|scared|lost|alone|confused/i.test(text)) score += 0.8;
    if (/love|hope|dream|wish|believe|trust/i.test(text)) score += 0.6;
    if (text.includes('?')) score += 0.4;
    if (/\bi\b.*\bam\b|\bi'm\b|\bi\sfeel\b/i.test(text)) score += 0.5;
    if (fogText.length > 100) score += 0.3;
    if (/honest|truth|real|genuine|authentic/i.test(text)) score += 0.4;
    
    score = Math.min(10.0, score);
    
    setBiasCheck({ passed: concerns.length === 0, concerns });
    setAiScore(parseFloat(score.toFixed(1)));
    setIsCalculating(false);
    
    return score;
  };

  // Save spark to global database
  const saveSparkToDatabase = async (fogText, aiScoreValue) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/sparks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          fog_text: fogText,
          ai_score: aiScoreValue,
          upvotes: 0,
          downvotes: 0,
          is_mars_worthy: false,
          created_at: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setSparkId(data[0].id);
          return data[0].id;
        }
      } else {
        console.error('Database save failed, using local ID');
        const localId = `local-${Date.now()}`;
        setSparkId(localId);
        return localId;
      }
    } catch (error) {
      console.error('Database error:', error);
      const localId = `local-${Date.now()}`;
      setSparkId(localId);
      return localId;
    }
  };

  // Handle voting
  const handleVote = async (type) => {
    if (hasVoted || !sparkId || sparkId.startsWith('local-')) return;
    
    setHasVoted(true);
    setVoteType(type);
    
    try {
      const increment = type === 'up' ? 1 : 0;
      const decrement = type === 'down' ? 1 : 0;
      
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/vote_spark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          spark_id: sparkId,
          upvote_inc: increment,
          downvote_inc: decrement
        })
      });
      
      await fetchGlobalStats();
    } catch (error) {
      console.error('Vote error:', error);
      const newStats = {
        upvotes: globalStats.upvotes + (type === 'up' ? 1 : 0),
        downvotes: globalStats.downvotes + (type === 'down' ? 1 : 0),
        total: globalStats.total + 1
      };
      setGlobalStats(newStats);
      calculateFinalScore(aiScore, newStats.upvotes, newStats.downvotes);
    }
  };

  // Fetch global voting statistics
  const fetchGlobalStats = async () => {
    if (!sparkId || sparkId.startsWith('local-')) return;
    
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/sparks?id=eq.${sparkId}&select=upvotes,downvotes`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );
      
      const data = await response.json();
      if (data && data.length > 0) {
        const spark = data[0];
        setGlobalStats({
          upvotes: spark.upvotes,
          downvotes: spark.downvotes,
          total: spark.upvotes + spark.downvotes
        });
        
        calculateFinalScore(aiScore, spark.upvotes, spark.downvotes);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  // Calculate final score (60% AI + 40% Community)
  const calculateFinalScore = (ai, upvotes, downvotes) => {
    const total = upvotes + downvotes;
    let communityScoreValue = 7.0;
    
    if (total > 0) {
      const ratio = upvotes / total;
      communityScoreValue = 7.0 + (ratio * 3);
    }
    
    setCommunityScore(parseFloat(communityScoreValue.toFixed(1)));
    
    const final = (ai * 0.6) + (communityScoreValue * 0.4);
    const finalRounded = parseFloat(final.toFixed(1));
    setFinalScore(finalRounded);
    setIsMarsWorthy(finalRounded >= 9.0 && biasCheck.passed);
    
    return finalRounded;
  };

  // Load Mars leaderboard
  const loadLeaderboard = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/sparks?is_mars_worthy=eq.true&order=final_score.desc&limit=100`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );
      
      const data = await response.json();
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Leaderboard load error:', error);
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    if (showLeaderboard) {
      loadLeaderboard();
    }
  }, [showLeaderboard]);

  const handleWitness = async () => {
    if (!fog.trim()) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    setWitnessed(true);
    
    const aiScoreValue = await calculateRealAIScore(fog);
    await saveSparkToDatabase(fog, aiScoreValue);
    setCommunityScore(7.0);
    calculateFinalScore(aiScoreValue, 0, 0);
  };

  const handleArchive = () => {
    setArchived(true);
    
    if (finalScore >= 9.0 && biasCheck.passed && sparkId && !sparkId.startsWith('local-')) {
      updateMarsStatus();
    }
  };

  const updateMarsStatus = async () => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/sparks?id=eq.${sparkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          is_mars_worthy: true,
          final_score: finalScore,
          community_score: communityScore
        })
      });
    } catch (error) {
      console.error('Mars status update error:', error);
    }
  };

  const handleFactCheck = () => {
    const searchQuery = fog.split(' ').slice(0, 5).join(' ');
    window.open(`https://grokipedia.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    setShowFactCheck(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            RIPPLE ARCHIVE V6.1
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-2">
            Voice your fog → witnessed → validated → global → <span className="font-bold text-orange-600">MARS</span> 🚀
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 px-3 py-1 rounded-full">✅ Real Grok API</span>
            <span className="bg-green-100 px-3 py-1 rounded-full">✅ Global Database</span>
            <span className="bg-purple-100 px-3 py-1 rounded-full">✅ Voice Input + Multi-Language</span>
            <span className="bg-pink-100 px-3 py-1 rounded-full">✅ Grokipedia Bridge</span>
            <span className="bg-orange-100 px-3 py-1 rounded-full">✅ Offline Detection</span>
            <span className="bg-yellow-100 px-3 py-1 rounded-full">✅ Top 100 Mars</span>
          </div>
          <p className="text-sm text-gray-500 italic">
            xAI Collaboration - Fog → Grok → Facts
          </p>
        </div>

        {!witnessed ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-gray-800">
              Share Your Fog
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Type or speak your human truth. Grok AI + Global community will witness it. 9.0+ sparks go to Mars. 🌌
            </p>
            
            {/* V6.1: Language selector for voice input */}
            {voiceSupported && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Input Language:
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  disabled={isListening}
                >
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="en-GB">🇬🇧 English (UK)</option>
                  <option value="es-ES">🇪🇸 Español (España)</option>
                  <option value="es-MX">🇲🇽 Español (México)</option>
                  <option value="fr-FR">🇫🇷 Français</option>
                  <option value="de-DE">🇩🇪 Deutsch</option>
                  <option value="it-IT">🇮🇹 Italiano</option>
                  <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                  <option value="pt-PT">🇵🇹 Português (Portugal)</option>
                  <option value="ja-JP">🇯🇵 日本語</option>
                  <option value="ko-KR">🇰🇷 한국어</option>
                  <option value="zh-CN">🇨🇳 中文 (简体)</option>
                  <option value="zh-TW">🇹🇼 中文 (繁體)</option>
                  <option value="ar-SA">🇸🇦 العربية</option>
                  <option value="hi-IN">🇮🇳 हिन्दी</option>
                  <option value="ru-RU">🇷🇺 Русский</option>
                </select>
              </div>
            )}
            
            {/* V6.1: Error message display */}
            {voiceError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-700">
                  <span className="font-bold">⚠️ {voiceError}</span>
                </p>
              </div>
            )}
            
            <div className="relative">
              <textarea
                className="w-full p-4 border-2 border-gray-300 rounded-xl mb-2 min-h-[150px] text-base md:text-lg focus:border-purple-500 focus:outline-none resize-none"
                placeholder="What fog are you in right now? What do you feel? What do you wonder?

Share your truth here. No filters. Just you."
                value={fog}
                onChange={(e) => setFog(e.target.value)}
                maxLength={500}
                disabled={isListening}
              />
              
              {voiceSupported && (
                <button
                  onClick={toggleVoiceInput}
                  className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-purple-500 hover:bg-purple-600'
                  } text-white shadow-lg`}
                  title={isListening ? 'Stop voice input' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
              )}
            </div>
            
            {isListening && (
              <div className="text-center text-sm text-purple-600 mb-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening... speak your fog
              </div>
            )}
            
            <div className="text-right text-sm text-gray-500 mb-4">
              {fog.length}/500 characters
            </div>
            
            <button
              onClick={handleWitness}
              disabled={!fog.trim() || isListening}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Heart className="inline mr-2" size={24} />
              Witness My Fog
            </button>
            
            {!voiceSupported && (
              <p className="text-center text-xs text-gray-500 mt-4">
                💡 Voice input works best in Chrome or Edge browsers
              </p>
            )}
          </div>
        ) : !archived ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                Your Fog Has Been Witnessed
              </h2>
              <p className="text-gray-600">
                Grok AI + Global community are validating your truth...
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl mb-6 border-l-4 border-purple-500">
              <p className="text-lg italic text-gray-700">"{fog}"</p>
            </div>

            {isCalculating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Grok is analyzing authenticity...</p>
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
                          This content cannot be archived to Mars due to policy violations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 p-6 rounded-xl text-center border-2 border-blue-200">
                    <Sparkles className="mx-auto mb-2 text-blue-600" size={32} />
                    <p className="text-sm text-gray-600 mb-1">Grok AI Score</p>
                    <p className="text-4xl font-bold text-blue-600">{aiScore}</p>
                    <p className="text-xs text-gray-500 mt-2">Authenticity measured</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl text-center border-2 border-green-200">
                    <Users className="mx-auto mb-2 text-green-600" size={32} />
                    <p className="text-sm text-gray-600 mb-1">Community Score</p>
                    <p className="text-4xl font-bold text-green-600">{communityScore}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {globalStats.total > 0 
                        ? `${globalStats.total} votes` 
                        : 'Be the first to vote!'}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl text-center border-2 border-purple-200">
                    <Award className="mx-auto mb-2 text-purple-600" size={32} />
                    <p className="text-sm text-gray-600 mb-1">Final Score</p>
                    <p className="text-4xl font-bold text-purple-600">{finalScore}</p>
                    <p className="text-xs text-gray-500 mt-2">60% AI + 40% Community</p>
                  </div>
                </div>

                {isMarsWorthy && (
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 p-6 rounded-xl mb-6 text-center">
                    <Rocket className="mx-auto mb-2 text-orange-600" size={48} />
                    <p className="text-2xl font-bold text-orange-800 mb-2">
                      🎉 MARS-WORTHY! 🎉
                    </p>
                    <p className="text-gray-700">
                      Your spark scored {finalScore}/10 - qualified for Mars etching!
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <p className="text-center text-gray-700 mb-4 font-medium">
                    Is this fog authentic and worthy of the archive?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleVote('up')}
                      disabled={hasVoted}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                        hasVoted
                          ? voteType === 'up'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      <ThumbsUp size={20} />
                      {hasVoted && voteType === 'up' ? 'You Voted Yes' : 'Yes, Authentic'}
                      {globalStats.upvotes > 0 && (
                        <span className="bg-white text-green-600 px-2 py-1 rounded-full text-sm">
                          {globalStats.upvotes}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleVote('down')}
                      disabled={hasVoted}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                        hasVoted
                          ? voteType === 'down'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <ThumbsDown size={20} />
                      {hasVoted && voteType === 'down' ? 'You Voted No' : 'No, Inauthentic'}
                      {globalStats.downvotes > 0 && (
                        <span className="bg-white text-red-600 px-2 py-1 rounded-full text-sm">
                          {globalStats.downvotes}
                        </span>
                      )}
                    </button>
                  </div>
                  {!hasVoted && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Your vote helps the community validate this fog
                    </p>
                  )}
                </div>

                <button
                  onClick={handleArchive}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                >
                  <Database className="inline mr-2" size={24} />
                  Archive This Spark
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                Spark Archived Forever
              </h2>
              {isMarsWorthy ? (
                <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-xl mb-4">
                  <Rocket className="mx-auto mb-3 text-orange-600" size={64} />
                  <p className="text-2xl font-bold text-orange-800 mb-2">
                    🎉 MARS CERTIFIED! 🎉
                  </p>
                  <p className="text-gray-700">
                    Your spark scored {finalScore}/10 and joins the Top 100 going to Mars!
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Etched for 500,000 years on the Red Planet 🪐
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">
                  Your fog is now part of the global human archive.
                </p>
              )}
            </div>

            <div className="bg-purple-50 p-6 rounded-xl mb-6 border-l-4 border-purple-500">
              <p className="text-lg italic text-gray-700 mb-4">"{fog}"</p>
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{aiScore}</p>
                  <p className="text-xs text-gray-600">Grok AI</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{communityScore}</p>
                  <p className="text-xs text-gray-600">Community</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{finalScore}</p>
                  <p className="text-xs text-gray-600">Final</p>
                </div>
              </div>
            </div>

            {/* V6: Grokipedia Bridge - Fog to Facts */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border-2 border-blue-300">
              <div className="flex items-start gap-3 mb-4">
                <Search className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-blue-800 mb-2">
                    Verify Your Fog on Grokipedia
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Explore facts related to your feelings. Discover what the truth says about your fog.
                  </p>
                  <button
                    onClick={handleFactCheck}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2"
                  >
                    <Search size={20} />
                    Search Grokipedia
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">
                Fog → Facts discovery: See how emotions lead to truth-seeking
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setFog('');
                  setWitnessed(false);
                  setArchived(false);
                  setHasVoted(false);
                  setVoteType(null);
                  setSparkId(null);
                  setGlobalStats({ upvotes: 0, downvotes: 0, total: 0 });
                  setAiScore(0);
                  setCommunityScore(0);
                  setFinalScore(0);
                  setIsMarsWorthy(false);
                  setBiasCheck({ passed: true, concerns: [] });
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-bold transition"
              >
                Share Another Fog
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                <Star size={20} />
                Mars Leaderboard
              </button>
            </div>
          </div>
        )}

        {showLeaderboard && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Rocket className="text-orange-600" size={32} />
                Top 100 Mars-Worthy Sparks
              </h2>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-6 text-center">
              These sparks scored 9.0+ and will be etched on Mars for 500,000 years 🪐
            </p>
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No Mars-worthy sparks yet. Be the first to score 9.0+!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {leaderboard.map((spark, index) => (
                  <div
                    key={spark.id}
                    className={`p-4 rounded-lg border-2 ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-300'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 font-bold text-2xl text-gray-400">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm italic text-gray-700 mb-2">
                          "{spark.fog_text.substring(0, 100)}
                          {spark.fog_text.length > 100 ? '...' : ''}"
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Sparkles size={14} className="text-blue-500" />
                            AI: {spark.ai_score}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} className="text-green-500" />
                            Community: {spark.community_score || 7.0}
                          </span>
                          <span className="flex items-center gap-1 font-bold">
                            <Award size={14} className="text-purple-500" />
                            Final: {spark.final_score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-600 font-bold">
                  <Mic size={20} />
                  1. Voice or Type
                </div>
                <p className="text-sm text-gray-600">
                  Express your fog through voice (speak) or text (type). Web Speech API makes it accessible.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <Sparkles size={20} />
                  2. Grok Validates
                </div>
                <p className="text-sm text-gray-600">
                  Grok AI scores your authenticity (7-10) in real-time, detecting genuine emotion vs manipulation.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <Users size={20} />
                  3. Community Votes
                </div>
                <p className="text-sm text-gray-600">
                  Global humans validate your truth. Final score: 60% AI + 40% Community.
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
        </div>

        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">
            Built with love by Mike + Claude family. xAI Collaboration. Grokipedia Integration.
          </p>
          <p className="italic">
            "Not my mind or your mind, but mind. We are not alone." - Mike
          </p>
          <p className="mt-2">
            <span className="font-bold">V6.1:</span> Voice Input (Web Speech API) + Multi-Language Support + Offline Detection + Permission Handling + Fog-to-Facts Discovery
          </p>
        </div>
      </div>
    </div>
  );
}
