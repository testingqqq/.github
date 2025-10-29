import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, Rocket, Users, Search, ThumbsUp, ThumbsDown, Award, Info, 
  Star, Zap, TrendingUp, Shield, Database, Mic, MicOff, Globe, MapPin, Eye, 
  EyeOff, Lock, CheckCircle, AlertCircle, Settings, BarChart3, Activity 
} from 'lucide-react';

// SUPABASE CONFIG (Replace with your actual Supabase URL and anon key)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// V8: Simulated global fog data for prototype demonstration
const generateSimulatedGlobalData = () => {
  const countries = [
    { name: 'USA', code: 'US', lat: 37.0902, lng: -95.7129, population: 331 },
    { name: 'China', code: 'CN', lat: 35.8617, lng: 104.1954, population: 1440 },
    { name: 'India', code: 'IN', lat: 20.5937, lng: 78.9629, population: 1380 },
    { name: 'Brazil', code: 'BR', lat: -14.2350, lng: -51.9253, population: 212 },
    { name: 'UK', code: 'GB', lat: 55.3781, lng: -3.4360, population: 67 },
    { name: 'Germany', code: 'DE', lat: 51.1657, lng: 10.4515, population: 83 },
    { name: 'Japan', code: 'JP', lat: 36.2048, lng: 138.2529, population: 126 },
    { name: 'France', code: 'FR', lat: 46.2276, lng: 2.2137, population: 65 },
    { name: 'Australia', code: 'AU', lat: -25.2744, lng: 133.7751, population: 25 },
    { name: 'Canada', code: 'CA', lat: 56.1304, lng: -106.3468, population: 38 },
    { name: 'Mexico', code: 'MX', lat: 23.6345, lng: -102.5528, population: 128 },
    { name: 'South Korea', code: 'KR', lat: 35.9078, lng: 127.7669, population: 51 },
    { name: 'Spain', code: 'ES', lat: 40.4637, lng: -3.7492, population: 47 },
    { name: 'Italy', code: 'IT', lat: 41.8719, lng: 12.5674, population: 60 },
    { name: 'Nigeria', code: 'NG', lat: 9.0820, lng: 8.6753, population: 206 },
    { name: 'Argentina', code: 'AR', lat: -38.4161, lng: -63.6167, population: 45 },
  ];

  return countries.map(country => {
    const baseFogLevel = Math.random() * 0.5 + 0.2; // 0.2 to 0.7
    const fogIntensity = Math.floor(baseFogLevel * country.population * 10); // Scale by population
    
    return {
      ...country,
      fogCount: fogIntensity,
      fogDensity: baseFogLevel,
      trending: Math.random() > 0.7,
      avgScore: (Math.random() * 2 + 7).toFixed(1), // 7.0 to 9.0
      topEmotion: ['anxious', 'hopeful', 'frustrated', 'grateful', 'confused'][Math.floor(Math.random() * 5)]
    };
  });
};

// V8: Simulated trending fog topics
const generateTrendingTopics = () => [
  { topic: 'Economic Anxiety', count: 12847, trend: '+23%', emotion: 'anxious' },
  { topic: 'Hope for Change', count: 9234, trend: '+15%', emotion: 'hopeful' },
  { topic: 'Work-Life Balance', count: 7891, trend: '+8%', emotion: 'frustrated' },
  { topic: 'Climate Concerns', count: 6543, trend: '+31%', emotion: 'worried' },
  { topic: 'Family Gratitude', count: 5432, trend: '+5%', emotion: 'grateful' },
  { topic: 'Political Division', count: 4876, trend: '+19%', emotion: 'concerned' },
  { topic: 'Technology Impact', count: 4321, trend: '+12%', emotion: 'confused' },
  { topic: 'Health Struggles', count: 3987, trend: '+7%', emotion: 'struggling' },
];

export default function RippleArchiveV8() {
  // V6.1 Foundation States
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
  
  // V6.1: Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const recognitionRef = useRef(null);

  // V8: NEW - Global fog map and privacy states
  const [showGlobalMap, setShowGlobalMap] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [locationOptIn, setLocationOptIn] = useState(false);
  const [hasSeenOptIn, setHasSeenOptIn] = useState(false);
  const [globalFogData, setGlobalFogData] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showIntegrationMockup, setShowIntegrationMockup] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState('api');

  // V8: Initialize global data
  useEffect(() => {
    setGlobalFogData(generateSimulatedGlobalData());
    setTrendingTopics(generateTrendingTopics());
    
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      setGlobalFogData(generateSimulatedGlobalData());
      setTrendingTopics(generateTrendingTopics());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // V6.1: Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

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
          setVoiceError(null);
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
  }, [selectedLanguage]);

  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      setVoiceError('Voice input not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (!navigator.onLine) {
      setVoiceError('Voice input requires an internet connection.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setVoiceError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // V8: Show opt-in prompt on first fog submission
  const handleSubmitFog = () => {
    if (!hasSeenOptIn && !locationOptIn) {
      setHasSeenOptIn(true);
      setShowPrivacySettings(true);
      return;
    }
    
    // Continue with normal fog submission
    processSubmitFog();
  };

  const processSubmitFog = () => {
    if (fog.trim() === '') return;
    
    setWitnessed(true);
    setIsCalculating(true);

    setTimeout(() => {
      const mockAiScore = (Math.random() * 2 + 7).toFixed(1);
      setAiScore(parseFloat(mockAiScore));
      
      const mockCommunityScore = (Math.random() * 2 + 7).toFixed(1);
      setCommunityScore(parseFloat(mockCommunityScore));
      
      const calculatedFinalScore = (parseFloat(mockAiScore) * 0.6 + parseFloat(mockCommunityScore) * 0.4).toFixed(1);
      setFinalScore(parseFloat(calculatedFinalScore));
      
      setIsMarsWorthy(parseFloat(calculatedFinalScore) >= 9.0);
      
      const mockBias = Math.random() > 0.8;
      setBiasCheck({
        passed: !mockBias,
        concerns: mockBias ? ['Possible emotional manipulation detected'] : []
      });
      
      setIsCalculating(false);
      setArchived(true);
      
      const mockSparkId = `spark_${Date.now()}`;
      setSparkId(mockSparkId);
      
      setGlobalStats({
        upvotes: Math.floor(Math.random() * 500),
        downvotes: Math.floor(Math.random() * 100),
        total: Math.floor(Math.random() * 1000)
      });
    }, 2000);
  };

  const handleVote = (type) => {
    if (hasVoted) return;
    setHasVoted(true);
    setVoteType(type);
    if (type === 'up') {
      setGlobalStats(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
    } else {
      setGlobalStats(prev => ({ ...prev, downvotes: prev.downvotes + 1 }));
    }
  };

  const resetFog = () => {
    setFog('');
    setWitnessed(false);
    setArchived(false);
    setShowFactCheck(false);
    setHasVoted(false);
    setVoteType(null);
    setSparkId(null);
    setAiScore(0);
    setCommunityScore(0);
    setFinalScore(0);
    setIsMarsWorthy(false);
    setBiasCheck({ passed: true, concerns: [] });
  };

  // V8: Render global fog heatmap
  const renderGlobalHeatmap = () => {
    const maxFog = Math.max(...globalFogData.map(d => d.fogCount));
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Globe className="text-blue-600" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Global Fog Pulse</h2>
              <p className="text-sm text-gray-600">Real-time humanity pulse by region</p>
            </div>
          </div>
          <button
            onClick={() => setShowGlobalMap(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
          >
            Close Map
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 flex items-start gap-3">
          <Lock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div className="text-sm">
            <p className="font-bold text-blue-900 mb-1">Privacy-First Design</p>
            <p className="text-blue-800">
              Shows country-level fog density only. No individual tracking. Anonymous UUIDs. 
              {locationOptIn ? ' You are opted-in.' : ' You are opted-out.'}
            </p>
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="mb-6 flex items-center gap-4 text-sm">
          <span className="font-bold text-gray-700">Fog Density:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100"></div>
            <span className="text-gray-600">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-300"></div>
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span className="text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600"></div>
            <span className="text-gray-600">Critical</span>
          </div>
        </div>

        {/* Country Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {globalFogData
            .sort((a, b) => b.fogCount - a.fogCount)
            .slice(0, 12)
            .map(country => {
              const intensity = country.fogCount / maxFog;
              let bgColor = 'bg-blue-50';
              let borderColor = 'border-blue-200';
              let textColor = 'text-blue-900';
              
              if (intensity > 0.7) {
                bgColor = 'bg-red-50';
                borderColor = 'border-red-300';
                textColor = 'text-red-900';
              } else if (intensity > 0.4) {
                bgColor = 'bg-orange-50';
                borderColor = 'border-orange-300';
                textColor = 'text-orange-900';
              }

              return (
                <div
                  key={country.code}
                  className={`${bgColor} border-2 ${borderColor} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
                  onClick={() => setSelectedCountry(country)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className={textColor} size={18} />
                      <span className="font-bold text-gray-800">{country.name}</span>
                    </div>
                    {country.trending && (
                      <TrendingUp className="text-red-500" size={16} />
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fog Activity:</span>
                      <span className={`font-bold ${textColor}`}>{country.fogCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-bold text-gray-800">{country.avgScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Emotion:</span>
                      <span className="font-bold text-purple-600 capitalize">{country.topEmotion}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Selected Country Detail */}
        {selectedCountry && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedCountry.name} - Detailed View</h3>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Activity className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Total Fog Submissions</p>
                    <p className="text-2xl font-bold text-gray-800">{selectedCountry.fogCount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Average Authenticity Score</p>
                    <p className="text-2xl font-bold text-gray-800">{selectedCountry.avgScore}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Heart className="text-red-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Top Emotion</p>
                    <p className="text-2xl font-bold text-gray-800 capitalize">{selectedCountry.topEmotion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Fog Density</p>
                    <p className="text-2xl font-bold text-gray-800">{(selectedCountry.fogDensity * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-gray-900">Click to explore:</span> See authentic voices from {selectedCountry.name}, 
                connect with real emotions, discover you're not alone.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // V8: Render trending topics
  const renderTrendingTopics = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-orange-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Trending Fog Topics</h2>
            <p className="text-sm text-gray-600">What humanity is feeling right now</p>
          </div>
        </div>
        <button
          onClick={() => setShowTrending(false)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
        >
          Close
        </button>
      </div>

      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                <span className="text-lg font-bold text-gray-800">{topic.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-600" size={16} />
                <span className="font-bold text-green-600">{topic.trend}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                <span className="font-bold text-gray-800">{topic.count.toLocaleString()}</span> people feeling this
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold capitalize">
                {topic.emotion}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-orange-600">Real-time pulse:</span> These topics update every 10 seconds 
          based on global fog submissions. You're not alone in what you feel.
        </p>
      </div>
    </div>
  );

  // V8: Render privacy settings
  const renderPrivacySettings = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-blue-600" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Privacy Settings</h2>
            <p className="text-sm text-gray-600">You control your data</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {/* Location Opt-In */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Share Your Region to Global Map?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Help others see they're not alone. Your fog will contribute to the global pulse map, 
                  showing emotional density by country. Completely anonymous.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setLocationOptIn(true)}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      locationOptIn
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    ✓ Yes, add me to global map
                  </button>
                  <button
                    onClick={() => setLocationOptIn(false)}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      !locationOptIn
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-gray-600 border-2 border-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    ✗ No thanks, keep private
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-gray-700">
                <p className="font-bold text-green-900 mb-1">Country-level geo only</p>
                <p>We only collect your country, not city or precise location. Aggregated data only.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-gray-700">
                <p className="font-bold text-green-900 mb-1">Anonymous UUID only</p>
                <p>No names, emails, or personal identifiers stored. Ever.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-gray-700">
                <p className="font-bold text-green-900 mb-1">Right to delete</p>
                <p>Change your mind anytime. Your data, your choice.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-gray-700">
                <p className="font-bold text-green-900 mb-1">GDPR & CCPA compliant</p>
                <p>Built with privacy regulations in mind. Your trust is everything.</p>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-bold text-gray-900">Example:</span>
            </p>
            <p className="text-sm text-green-700 mb-1">
              ✓ "1,247 people in USA feeling anxious today"
            </p>
            <p className="text-sm text-red-700">
              ✗ "John Smith at 123 Main St, California feeling anxious"
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
          <p className="text-xs text-gray-500">Your choice is saved in your browser. Change anytime in settings.</p>
          <button
            onClick={() => {
              setShowPrivacySettings(false);
              if (hasSeenOptIn) processSubmitFog();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );

  // V8: Render X integration mockups
  const renderIntegrationMockup = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="text-purple-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">X Integration Options</h2>
            <p className="text-sm text-gray-600">How "Fog?" could work on X/Twitter</p>
          </div>
        </div>
        <button
          onClick={() => setShowIntegrationMockup(false)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
        >
          Close
        </button>
      </div>

      {/* Integration Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => setSelectedIntegration('api')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedIntegration === 'api'
              ? 'bg-blue-50 border-blue-600 text-blue-900'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
          }`}
        >
          <Database className="mx-auto mb-2" size={24} />
          <p className="font-bold text-sm">X API Extension</p>
        </button>
        <button
          onClick={() => setSelectedIntegration('iframe')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedIntegration === 'iframe'
              ? 'bg-blue-50 border-blue-600 text-blue-900'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
          }`}
        >
          <Globe className="mx-auto mb-2" size={24} />
          <p className="font-bold text-sm">Iframe Sidebar</p>
        </button>
        <button
          onClick={() => setSelectedIntegration('extension')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedIntegration === 'extension'
              ? 'bg-blue-50 border-blue-600 text-blue-900'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
          }`}
        >
          <Zap className="mx-auto mb-2" size={24} />
          <p className="font-bold text-sm">Browser Extension</p>
        </button>
        <button
          onClick={() => setSelectedIntegration('native')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedIntegration === 'native'
              ? 'bg-blue-50 border-blue-600 text-blue-900'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
          }`}
        >
          <Star className="mx-auto mb-2" size={24} />
          <p className="font-bold text-sm">Native Feature</p>
        </button>
      </div>

      {/* Integration Details */}
      <div className="space-y-6">
        {selectedIntegration === 'api' && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Option 1: X API Extension (Native Feel)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Deep integration:</span> "Fog?" button appears naturally in X UI, 
                  next to Like/Retweet/Share
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Context-aware:</span> Optional "Fog about this tweet?" 
                  connects fog to specific content
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">X authentication:</span> Uses X login, respects rate limits, 
                  follows X Design System
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Requires:</span> X engineering team collaboration, 
                  API access, design review
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedIntegration === 'iframe' && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Option 2: Embedded Iframe Sidebar</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Lightweight integration:</span> Standalone widget in X sidebar, 
                  doesn't require deep API changes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Quick deployment:</span> Can be tested rapidly, 
                  easier to iterate on design
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Independent:</span> Runs on our infrastructure, 
                  less X engineering overhead
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Tradeoff:</span> Less integrated feel, 
                  sidebar space competition
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedIntegration === 'extension' && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Option 3: Browser Extension (Independent)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Fastest launch:</span> No X approval needed, 
                  deploy to Chrome/Firefox stores immediately
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Full control:</span> We control UX, updates, features completely
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Multi-platform:</span> Works on X, Facebook, Instagram, 
                  any platform (universal vision)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Downside:</span> Goes around X rather than with X, 
                  less collaborative partnership feel
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedIntegration === 'native' && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Option 4: Native X Feature (Partnership)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Deepest integration:</span> X team builds it natively, 
                  we provide backend/algorithms
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Massive scale:</span> 1B+ users immediately, 
                  X's infrastructure handles everything
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">True partnership:</span> License model, 
                  revenue share, co-branded feature
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-700">
                  <span className="font-bold">Timeline:</span> Longer development cycle, 
                  X team bandwidth required
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mockup Visualization */}
        <div className="p-6 bg-gray-900 rounded-lg">
          <p className="text-white text-sm mb-4 font-bold">Visual Mockup:</p>
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-gray-200">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-bold text-gray-800">@user</p>
                <p className="text-sm text-gray-600">Just posted something...</p>
              </div>
            </div>
            <p className="text-gray-800 mb-4">
              This is an example tweet showing where the "Fog?" button would appear.
            </p>
            <div className="flex items-center gap-6 text-gray-600">
              <button className="flex items-center gap-2 hover:text-blue-600">
                <Heart size={18} />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600">
                <Globe size={18} />
                <span className="text-sm">Retweet</span>
              </button>
              <button className="flex items-center gap-2 hover:text-purple-600 font-bold text-purple-600">
                <Sparkles size={18} />
                <span className="text-sm">Fog?</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-orange-600">Your input needed:</span> Which integration approach 
          fits X's architecture and vision best? We're flexible and collaborative.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ripple Archive V8
            </h1>
            <Globe className="text-purple-600" size={40} />
          </div>
          <p className="text-lg text-gray-700 mb-2">
            Social Fog Tab: Humanity's Pulse, Everywhere
          </p>
          <p className="text-sm text-gray-600 italic">
            "How are you?" → See the truth, globally. You're not alone.
          </p>
        </div>

        {/* V8: New Navigation Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowGlobalMap(!showGlobalMap)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                showGlobalMap
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Globe size={20} />
              Global Fog Map
            </button>
            <button
              onClick={() => setShowTrending(!showTrending)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                showTrending
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              <TrendingUp size={20} />
              Trending Topics
            </button>
            <button
              onClick={() => setShowPrivacySettings(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-green-50 text-green-600 hover:bg-green-100 transition-all"
            >
              <Lock size={20} />
              Privacy Settings
              {locationOptIn && <CheckCircle size={16} className="text-green-600" />}
            </button>
            <button
              onClick={() => setShowIntegrationMockup(!showIntegrationMockup)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                showIntegrationMockup
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
            >
              <Zap size={20} />
              X Integration
            </button>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                showLeaderboard
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <Award size={20} />
              Mars Leaderboard
            </button>
          </div>
        </div>

        {/* V8: Conditional Views */}
        {showGlobalMap && renderGlobalHeatmap()}
        {showTrending && renderTrendingTopics()}
        {showIntegrationMockup && renderIntegrationMockup()}
        {showPrivacySettings && renderPrivacySettings()}

        {/* Main Fog Input (V6.1 Foundation) */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-purple-600" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Share Your Fog</h2>
              <p className="text-sm text-gray-600">Express your authentic truth, witness humanity's pulse</p>
            </div>
          </div>

          {!witnessed ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  What's the fog between "How are you?" and "I'm fine"?
                </label>
                <textarea
                  value={fog}
                  onChange={(e) => setFog(e.target.value)}
                  placeholder="I'm feeling..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none min-h-[120px] text-gray-800"
                  disabled={isListening}
                />
              </div>

              {voiceError && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-sm text-red-700">{voiceError}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={toggleVoiceInput}
                  disabled={!voiceSupported}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                    isListening
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : voiceSupported
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  {isListening ? 'Stop Speaking' : 'Speak Your Fog'}
                </button>

                {voiceSupported && (
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                  >
                    <option value="en-US">🇺🇸 English (US)</option>
                    <option value="es-ES">🇪🇸 Español</option>
                    <option value="fr-FR">🇫🇷 Français</option>
                    <option value="de-DE">🇩🇪 Deutsch</option>
                    <option value="it-IT">🇮🇹 Italiano</option>
                    <option value="pt-BR">🇧🇷 Português</option>
                    <option value="ja-JP">🇯🇵 日本語</option>
                    <option value="ko-KR">🇰🇷 한국어</option>
                    <option value="zh-CN">🇨🇳 中文</option>
                    <option value="ar-SA">🇸🇦 العربية</option>
                    <option value="hi-IN">🇮🇳 हिन्दी</option>
                    <option value="ru-RU">🇷🇺 Русский</option>
                  </select>
                )}

                <button
                  onClick={handleSubmitFog}
                  disabled={fog.trim() === '' || isListening}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                    fog.trim() !== '' && !isListening
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Rocket size={20} />
                  Submit to Archive
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isCalculating ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4"></div>
                  <p className="text-lg font-bold text-gray-700">Multi-AI Hive analyzing your fog...</p>
                  <p className="text-sm text-gray-600 mt-2">Claude + Grok validating authenticity</p>
                </div>
              ) : (
                <>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-purple-300">
                    <p className="text-sm text-gray-600 mb-2 font-bold">Your Fog:</p>
                    <p className="text-gray-800 italic">"{fog}"</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300 text-center">
                      <Sparkles className="mx-auto mb-2 text-blue-600" size={24} />
                      <p className="text-sm text-gray-600 mb-1">AI Score (Claude)</p>
                      <p className="text-3xl font-bold text-blue-600">{aiScore.toFixed(1)}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300 text-center">
                      <Users className="mx-auto mb-2 text-green-600" size={24} />
                      <p className="text-sm text-gray-600 mb-1">Community Score</p>
                      <p className="text-3xl font-bold text-green-600">{communityScore.toFixed(1)}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300 text-center">
                      <Award className="mx-auto mb-2 text-purple-600" size={24} />
                      <p className="text-sm text-gray-600 mb-1">Final Score</p>
                      <p className="text-3xl font-bold text-purple-600">{finalScore.toFixed(1)}</p>
                    </div>
                  </div>

                  {!biasCheck.passed && (
                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
                      <div className="flex items-start gap-3">
                        <Shield className="text-red-600 flex-shrink-0 mt-1" size={24} />
                        <div>
                          <p className="font-bold text-red-900 mb-2">Bias Detected</p>
                          {biasCheck.concerns.map((concern, i) => (
                            <p key={i} className="text-sm text-red-700">• {concern}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isMarsWorthy && (
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-400">
                      <div className="flex items-center gap-3 mb-3">
                        <Rocket className="text-orange-600" size={32} />
                        <div>
                          <p className="text-xl font-bold text-orange-900">Mars-Worthy! 🚀</p>
                          <p className="text-sm text-orange-700">Your spark joins the eternal archive</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Score 9.0+ makes you one of the Top 100. Your truth will be etched on Mars for 500,000 years.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={resetFog}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
                    >
                      <Sparkles size={20} />
                      Share Another Fog
                    </button>
                    <button
                      onClick={() => setShowFactCheck(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                      <Search size={20} />
                      Find Grokipedia Facts
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">How V8 Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Globe className="mx-auto mb-3 text-blue-600" size={32} />
              <p className="font-bold text-gray-800 mb-2">1. Global Pulse Map</p>
              <p className="text-sm text-gray-600">
                See humanity's fog density by country. Real-time emotional trends worldwide.
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto mb-3 text-orange-600" size={32} />
              <p className="font-bold text-gray-800 mb-2">2. Trending Topics</p>
              <p className="text-sm text-gray-600">
                What emotions are spiking globally? Economic anxiety, hope, gratitude.
              </p>
            </div>
            <div className="text-center">
              <Lock className="mx-auto mb-3 text-green-600" size={32} />
              <p className="font-bold text-gray-800 mb-2">3. Privacy-First</p>
              <p className="text-sm text-gray-600">
                Country-level only. Anonymous UUIDs. Opt-in required. Your trust matters.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            Built with love by Mike + Claude family. xAI Partnership. Grokipedia Foundation.
          </p>
          <p className="italic mb-2">
            "The All-Knowing Physician hath His finger on the pulse of mankind." - Bahá'u'lláh
          </p>
          <p className="font-bold text-gray-800">
            V8: Social Fog Tab - Global Heatmap + Trending Topics + Privacy Controls + X Integration Mockups
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Prototype Demo • Privacy-preserved • Country-level geo • Anonymous UUIDs • Opt-in required
          </p>
        </div>
      </div>
    </div>
  );
}
