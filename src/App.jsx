import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  AlertTriangle,
  LineChart,
  Compass,
  TrendingUp,
  Bell,
  Search,
  ArrowRight,
  CheckCircle2,
  Activity,
  Info,
  Globe,
  Sliders,
  Database,
  Calendar,
  ChevronRight,
  Plus,
  X,
  Moon,
  Sun,
  Layers,
  Thermometer,
  Eye,
  RefreshCw,
  Send,
  HelpCircle,
  Settings
} from 'lucide-react'
import { argoService } from './argoService'

export default function App() {
  // Theme Management (Light / Dark) with local storage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Navigation states: 'home', 'explore', 'about', 'loading'
  const [currentView, setCurrentView] = useState('home')
  
  // Search query inputs
  const [searchQuery, setSearchQuery] = useState('')
  const [queryType, setQueryType] = useState('temperature') // temperature, salinity, map, comparison
  
  // Interactive result states
  const [activeParameter, setActiveParameter] = useState('temperature')
  const [activeTab, setActiveTab] = useState('Depth Profile') // Depth Profile, Time Series, Spatial Map
  const [selectedFloat, setSelectedFloat] = useState(null)
  const [showFloatPopup, setShowFloatPopup] = useState(false)
  const [explainSimply, setExplainSimply] = useState(false)
  const [highlightAnomalyOnGraph, setHighlightAnomalyOnGraph] = useState(true)

  // Follow-up chat thread
  const [followupInput, setFollowupInput] = useState('')
  const [conversations, setConversations] = useState([])

  // AI loading process step text
  const [loadingText, setLoadingText] = useState('Understanding your ocean query…')
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Apply Dark Mode class
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Handle example query clicks from home screen
  const handleExampleClick = (queryText) => {
    setSearchQuery(queryText)
    
    // Classify query type for visualization selection
    if (queryText.includes('salinity') || queryText.includes('compare')) {
      setQueryType('comparison')
      setActiveParameter('salinity')
      setActiveTab('Depth Profile')
    } else if (queryText.includes('active') || queryText.includes('floats') || queryText.includes('Where')) {
      setQueryType('map')
      setActiveTab('Spatial Map')
    } else if (queryText.includes('trends')) {
      setQueryType('temperature')
      setActiveParameter('temperature')
      setActiveTab('Time Series')
    } else {
      setQueryType('temperature')
      setActiveParameter('temperature')
      setActiveTab('Depth Profile')
    }
  }

  // Handle main search query submit
  const handleQuerySubmit = (e) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return

    // Trigger loading view
    setCurrentView('loading')
    setLoadingProgress(0)
    setLoadingText('Understanding your ocean query…')

    // Simulate transition
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + 5
        if (next === 30) {
          setLoadingText('Finding relevant ARGO observations…')
        } else if (next === 70) {
          setLoadingText('Generating visualization…')
        } else if (next >= 100) {
          clearInterval(interval)
          // Add default conversation log
          setConversations([
            { sender: 'user', text: searchQuery },
            { sender: 'ai', text: getAIAnswerText(searchQuery) }
          ])
          setCurrentView('explore')
          return 100
        }
        return next
      })
    }, 45)
  }

  // Handle follow up chat submit
  const handleFollowupSubmit = (e) => {
    if (e) e.preventDefault()
    if (!followupInput.trim()) return

    const userText = followupInput
    setConversations(prev => [...prev, { sender: 'user', text: userText }])
    setFollowupInput('')

    // Simulate short typing delay
    setTimeout(() => {
      setConversations(prev => [
        ...prev,
        { sender: 'ai', text: getAIAnswerText(userText) }
      ])
      
      // Dynamic tab focus based on query terms
      if (userText.toLowerCase().includes('depth') || userText.toLowerCase().includes('1000m')) {
        setActiveTab('Depth Profile')
      } else if (userText.toLowerCase().includes('trend') || userText.toLowerCase().includes('years')) {
        setActiveTab('Time Series')
      } else if (userText.toLowerCase().includes('compare') || userText.toLowerCase().includes('pacific') || userText.toLowerCase().includes('bengal')) {
        setQueryType('comparison')
      }
    }, 500)
  }

  // Helper mapping query texts to simple answers
  const getAIAnswerText = (text) => {
    const query = text.toLowerCase()
    if (query.includes('salinity') && query.includes('compare')) {
      return "Comparing salinity structures across selected basins. The Arabian Sea intermediate layers display higher salt concentrations (36.2 PSU) due to dry winter winds and evaporation, whereas the Bay of Bengal maintains lower levels (33.2 PSU) due to heavy river delta discharge."
    } else if (query.includes('salinity') || query.includes('salt')) {
      return "ARGO salinity logs show a stable halocline layer in the upper 200m. A localized freshening trend is observed below 500m depth, dropping salinity by approximately 0.4 PSU against decadal baselines."
    } else if (query.includes('active') || query.includes('floats') || query.includes('where')) {
      return "Active ARGO floats are widely distributed across the Indian Ocean basin. Real-time telemetry confirms optimal reporting density with 126 floats currently reporting in the target quadrant."
    } else if (query.includes('trend')) {
      return "Decadal temperature trends show a gradual warming trajectory in the upper layer over the past 5 years. Anomalous warming of +1.2°C is stabilized at intermediate levels."
    } else {
      return "ARGO observations indicate warmer surface waters across the selected Indian Ocean region. Temperature decreases progressively with depth, with the strongest gradient observed in the upper 500m."
    }
  }

  // Data fetching from service
  const activeFloats = argoService.getFloatObservations(
    queryType === 'comparison' ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )
  const profilePoints = argoService.getDepthProfileData(
    queryType === 'comparison' ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )

  return (
    <div className="min-h-screen bg-navy-50 text-navy-950 dark:bg-navy-950 dark:text-navy-50 flex flex-col font-sans transition-colors duration-300">
      
      {/* ----------------- TOP NAVBAR ----------------- */}
      <nav className="h-16 border-b border-navy-150 dark:border-navy-800/80 bg-white dark:bg-navy-900 px-6 flex justify-between items-center shrink-0 z-40 transition-colors duration-300">
        <div 
          onClick={() => { setCurrentView('home'); setSearchQuery(''); }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-sm">
            FC
          </div>
          <span className="font-extrabold text-sm tracking-tight text-navy-900 dark:text-slate-100">
            🌊 FloatChat
          </span>
        </div>

        {/* Minimal Navigation */}
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <button 
            onClick={() => { setCurrentView('home'); setSearchQuery(''); }} 
            className={`transition ${currentView === 'home' ? 'text-cyan-500' : 'text-navy-500 dark:text-navy-450 hover:text-navy-800'}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setCurrentView('explore'); }} 
            className={`transition ${currentView === 'explore' ? 'text-cyan-500' : 'text-navy-500 dark:text-navy-450 hover:text-navy-800'}`}
          >
            Explore
          </button>
          <button 
            onClick={() => { setCurrentView('about'); }} 
            className={`transition ${currentView === 'about' ? 'text-cyan-500' : 'text-navy-500 dark:text-navy-450 hover:text-navy-800'}`}
          >
            About
          </button>
          
          <span className="w-px h-4 bg-navy-200 dark:bg-navy-800"></span>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-md bg-navy-50 hover:bg-navy-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-600 dark:text-cyan-400 transition"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </nav>

      {/* ----------------- VIEW STATE ROUTER ----------------- */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">

          {/* VIEW: HOME / LANDING SCREEN */}
          {currentView === 'home' && (
            <div className="max-w-3xl mx-auto space-y-8 py-10 md:py-16 text-center animate-fadeIn">
              
              {/* Hero Title */}
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-navy-900 dark:text-slate-100">
                  Ask the Ocean. Get the Data.
                </h2>
                <p className="text-sm md:text-base text-navy-550 dark:text-navy-400 max-w-xl mx-auto leading-relaxed">
                  Explore complex ARGO ocean data using natural language.
                </p>
              </div>

              {/* Conversational input box */}
              <div className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-150 dark:border-navy-800/80 p-5 shadow-lg max-w-2xl mx-auto">
                <form onSubmit={handleQuerySubmit} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 text-cyan-500" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask anything about ocean data…"
                      className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs md:text-sm rounded-xl pl-12 pr-28 py-3.5 text-navy-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-400 hover:to-ocean-500 text-navy-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1"
                    >
                      <span>Ask FloatChat</span>
                    </button>
                  </div>

                  {/* 4 Example Queries */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {[
                      "Show temperature in the Indian Ocean",
                      "Compare salinity at 500m and 1000m",
                      "Where are active ARGO floats?",
                      "Show temperature trends"
                    ].map((example, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleExampleClick(example)}
                        className={`bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                          searchQuery === example ? 'border-cyan-500 text-cyan-500' : 'text-navy-600 dark:text-cyan-400'
                        }`}
                      >
                        • {example}
                      </button>
                    ))}
                  </div>
                </form>
              </div>

              {/* Minimal How It Works Pipeline */}
              <div className="pt-6 border-t border-navy-100 dark:border-navy-900 max-w-xl mx-auto space-y-4">
                <p className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest">Innovation Pipeline</p>
                <div className="grid grid-cols-5 gap-2 items-center text-center">
                  {[
                    { label: "User Question", icon: MessageSquare },
                    { label: "AI Query Parser", icon: Sliders },
                    { label: "ARGO Data", icon: Database },
                    { label: "Map / Graph", icon: LineChart },
                    { label: "AI Insight", icon: CheckCircle2 }
                  ].map((step, idx) => {
                    const Icon = step.icon
                    return (
                      <div key={idx} className="flex items-center">
                        <div className="flex flex-col items-center gap-1 mx-auto">
                          <Icon size={16} className="text-cyan-500" />
                          <span className="text-[9px] font-semibold text-navy-500 dark:text-navy-400">{step.label}</span>
                        </div>
                        {idx < 4 && <span className="text-navy-200 dark:text-navy-850 text-xs hidden md:inline">➔</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )}

          {/* VIEW: LIGHTWEIGHT LOADING STATE */}
          {currentView === 'loading' && (
            <div className="max-w-md mx-auto bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-8 rounded-2xl shadow text-center space-y-6 animate-fadeIn py-12 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto text-cyan-500 animate-spin">
                <RefreshCw size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-navy-900 dark:text-white">{loadingText}</h3>
                <p className="text-[11px] text-navy-400">FloatChat AI is querying standard coordinates...</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-navy-50 dark:bg-navy-950 h-1.5 rounded-full overflow-hidden border border-navy-100 dark:border-navy-800">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-100" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* VIEW: MAIN RESULTS PAGE */}
          {currentView === 'explore' && (
            <div className="space-y-6 animate-fadeIn">

              {/* A. AI ANSWER */}
              <div className="bg-gradient-to-br from-navy-900 to-purple-950 border border-purple-500/20 text-white rounded-2xl p-5 md:p-6 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] bg-cyan-500/15 text-cyan-400 font-extrabold px-2 py-0.5 rounded tracking-wider uppercase border border-cyan-400/20">
                    AI-generated insight • Based on ARGO observations
                  </span>
                  <button 
                    onClick={() => setExplainSimply(!explainSimply)}
                    className="text-[10px] font-bold text-slate-300 hover:text-white underline"
                  >
                    {explainSimply ? "View scientific formulation" : "Explain in simpler terms"}
                  </button>
                </div>
                
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-cyan-300">Here's what I found</h3>
                <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-semibold">
                  {explainSimply 
                    ? "In simple terms, the ocean is warmer near the surface and becomes cooler as depth increases. Salinity concentrations are stable in upper channels but drop slightly in intermediate layers."
                    : conversations[conversations.length - 1]?.text || "No query loaded."
                  }
                </p>
              </div>

              {/* B. MAIN VISUALIZATION */}
              <div className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-5 rounded-2xl shadow-sm transition duration-300 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-navy-850 dark:text-slate-100">
                      {activeTab === 'Spatial Map' ? "Geospatial Float Positions" : activeParameter === 'temperature' ? "Temperature Profile Curve" : "Salinity Profile Curve"}
                    </h4>
                    <p className="text-[10px] text-navy-450">Demo visualization • Sample ARGO observations</p>
                  </div>

                  {/* Toggle between parameters */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 bg-navy-50 dark:bg-navy-950 p-0.5 rounded border border-navy-100 dark:border-navy-800 text-[10px] font-bold">
                      <button 
                        onClick={() => { setActiveParameter('temperature'); setQueryType('temperature'); }}
                        className={`px-2.5 py-1 rounded transition ${activeParameter === 'temperature' ? 'bg-cyan-500 text-navy-950' : 'text-navy-400'}`}
                      >
                        Temperature
                      </button>
                      <button 
                        onClick={() => { setActiveParameter('salinity'); setQueryType('comparison'); }}
                        className={`px-2.5 py-1 rounded transition ${activeParameter === 'salinity' ? 'bg-cyan-500 text-navy-950' : 'text-navy-400'}`}
                      >
                        Salinity
                      </button>
                    </div>

                    {/* Tab switches */}
                    <div className="flex gap-1 bg-navy-50 dark:bg-navy-950 p-0.5 rounded border border-navy-100 dark:border-navy-800 text-[10px] font-bold">
                      {["Depth Profile", "Time Series", "Spatial Map"].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-2 py-1 rounded transition ${activeTab === tab ? 'bg-cyan-500 text-navy-950' : 'text-navy-400'}`}
                        >
                          {tab.replace(" Spatial", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Plot Display Area */}
                <div className="h-72 bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl relative flex items-center justify-center p-4">
                  {activeTab === 'Spatial Map' ? (
                    <svg width="100%" height="100%" viewBox="20 40 280 160">
                      <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="3,3" />
                      <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="3,3" />
                      <path d="M 180 40 L 195 80 L 225 110 L 245 150 L 260 170" fill="none" stroke="currentColor" className="text-navy-450 dark:text-navy-600" strokeWidth="1.2" />
                      
                      {activeFloats.map((float, idx) => (
                        <circle
                          key={idx}
                          cx={80 + (float.lng - 60) * 8}
                          cy={250 - (float.lat - 10) * 10}
                          r="3"
                          fill={float.lat === 18.42 || float.lat === 15.45 ? "#f97316" : "#06b6d4"}
                          className="cursor-pointer"
                          onClick={() => { setSelectedFloat(float); setShowFloatPopup(true); }}
                        />
                      ))}
                    </svg>
                  ) : activeTab === 'Depth Profile' ? (
                    <svg width="100%" height="100%" viewBox="0 0 250 140">
                      <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-250 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="30" y1="60" x2="230" y2="60" stroke="currentColor" className="text-navy-250 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="30" y1="100" x2="230" y2="100" stroke="currentColor" className="text-navy-250 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                      
                      {/* Highlight anomaly */}
                      {highlightAnomalyOnGraph && (
                        <rect x="150" y="60" width="80" height="40" fill="rgba(249, 115, 22, 0.15)" />
                      )}

                      {/* Curves */}
                      {activeParameter === 'temperature' ? (
                        <>
                          <path d="M 30 30 Q 110 50, 150 90 T 230 115" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2,2" />
                          <path d="M 30 30 Q 110 50, 150 80 T 230 100" fill="none" stroke="#f97316" strokeWidth="2" />
                        </>
                      ) : (
                        <>
                          <path d="M 30 30 Q 110 38, 150 48 T 230 55" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2,2" />
                          <path d="M 30 30 Q 110 38, 150 58 T 230 68" fill="none" stroke="#f97316" strokeWidth="2" />
                        </>
                      )}

                      {/* Labels */}
                      <text x="30" y="132" textAnchor="middle" fill="currentColor" className="text-navy-450" fontSize="6">0m</text>
                      <text x="110" y="132" textAnchor="middle" fill="currentColor" className="text-navy-450" fontSize="6">200m</text>
                      <text x="230" y="132" textAnchor="middle" fill="currentColor" className="text-navy-450" fontSize="6">500m</text>
                    </svg>
                  ) : (
                    // Time Series Forecast
                    <svg width="100%" height="100%" viewBox="0 0 250 140">
                      <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                      <line x1="30" y1="80" x2="230" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                      <path d="M 30 80 Q 110 60, 150 40" fill="none" stroke="#a855f7" strokeWidth="2" />
                      <path d="M 150 40 Q 190 35, 230 30" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="3,3" />
                      <text x="150" y="130" textAnchor="middle" fill="currentColor" className="text-navy-450" fontSize="6">TODAY</text>
                    </svg>
                  )}

                  {/* Tooltip Popup */}
                  {showFloatPopup && selectedFloat && (
                    <div className="absolute bottom-2 left-2 bg-white dark:bg-navy-900 border border-navy-150 p-3 rounded-lg shadow text-[10px] flex justify-between gap-4 animate-scaleUp">
                      <div>
                        <p className="font-bold text-navy-800 dark:text-slate-100">Float: {selectedFloat.id}</p>
                        <p className="text-navy-400">{selectedFloat.lat}°N, {selectedFloat.lng}°E</p>
                        <p className="text-[8px] bg-orange-500/10 text-orange-500 px-1 rounded uppercase tracking-wider font-bold mt-1">SIMULATED DATA</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-500 font-bold">Depth: {selectedFloat.depth}m</p>
                        <p className="text-orange-500 font-mono">Temp: {selectedFloat.temp}°C</p>
                      </div>
                      <button onClick={() => setShowFloatPopup(false)} className="text-navy-400 hover:text-navy-600"><X size={12} /></button>
                    </div>
                  )}
                </div>

                {/* Legends */}
                <div className="flex justify-between items-center text-[10px] text-navy-400">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-cyan-500 border-dashed border-t"></span> Climatological baseline
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-orange-500"></span> Active observations
                  </span>
                </div>
              </div>

              {/* C. KEY INSIGHTS (3-4 COMPACT CARDS) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Temperature", val: activeParameter === 'temperature' ? "28.4°C" : "14.2°C", desc: "Mean surface layer" },
                  { label: "Salinity", val: activeParameter === 'temperature' ? "35.2 PSU" : "36.2 PSU", desc: "Upper halocline index" },
                  { label: "Depth", val: activeParameter === 'temperature' ? "500m" : "1000m", desc: "Selected target columns" },
                  { label: "Active Floats", val: activeFloats.length.toString(), desc: "Quad observations count" }
                ].map((card, idx) => (
                  <div key={idx} className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800/80 p-4 rounded-xl shadow-sm text-center">
                    <p className="text-[10px] text-navy-400 font-bold uppercase tracking-wider">{card.label}</p>
                    <h4 className="text-lg font-black text-navy-850 dark:text-slate-100 mt-1">{card.val}</h4>
                    <p className="text-[9px] text-navy-450">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* D. FOLLOW-UP QUESTIONS & CHAT */}
              <div className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-5 rounded-2xl shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-navy-850 dark:text-slate-100">
                  Ask a follow-up question
                </h4>

                {/* Suggested follow-up prompts */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold text-navy-450 uppercase mr-1">Try asking next:</span>
                  {[
                    "Show this at 1000m depth",
                    "Compare it with the Pacific Ocean",
                    "Show the trend over the last 5 years"
                  ].map((followPrompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => triggerFollowup(followPrompt)}
                      className="bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-850 text-navy-600 dark:text-cyan-500 px-3 py-1.5 rounded-lg font-semibold transition"
                    >
                      {followPrompt}
                    </button>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleFollowupSubmit} className="relative">
                  <input
                    type="text"
                    value={followupInput}
                    onChange={(e) => setFollowupInput(e.target.value)}
                    placeholder="Compare this with the Bay of Bengal..."
                    className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs rounded-xl pl-4 pr-24 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-navy-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-navy-150 hover:bg-navy-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-850 dark:text-cyan-400 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition"
                  >
                    Send
                  </button>
                </form>

                {/* Reset button */}
                <div className="text-right">
                  <button 
                    onClick={() => { setCurrentView('home'); setSearchQuery(''); }}
                    className="text-[10px] text-navy-450 hover:text-cyan-500 underline font-semibold"
                  >
                    Ask another question
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* VIEW: ABOUT PAGE */}
          {currentView === 'about' && (
            <div className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-850 p-6 md:p-8 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-navy-100 dark:border-navy-800 pb-3">
                <h3 className="text-xl font-black text-navy-900 dark:text-slate-100">About FloatChat</h3>
                <p className="text-xs text-navy-450">AI-Powered Conversational Interface for ARGO Ocean Data Discovery</p>
              </div>

              <div className="space-y-4 text-xs md:text-sm leading-relaxed text-navy-600 dark:text-slate-350">
                <p>
                  FloatChat is a competition-ready AI prototype designed to streamline ocean research. By converting natural language inputs into structured geospatial data parameters, FloatChat queries active global ARGO floats, calculates climatological baselines, and generates clean scientific depth profile, time-series, and coordinate maps.
                </p>
                <p>
                  Our primary differentiator is turning complex NetCDF/ARGO observations directly into conversational scientific insights, enabling researchers to explore ocean trends and changes in real-time.
                </p>
              </div>

              <button 
                onClick={() => setCurrentView('home')}
                className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                Get Started
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="mt-auto border-t border-navy-150 dark:border-navy-800/80 p-5 bg-white dark:bg-navy-900 text-center text-xs text-navy-400 transition duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 FloatChat AI. National-Level Hackathon Prototype. All rights reserved.</p>
          <div className="flex items-center gap-4 font-semibold">
            <a href="#about" onClick={(e) => { e.preventDefault(); setCurrentView('about'); }} className="hover:text-cyan-500 transition">How it Works</a>
            <span className="text-navy-300 dark:text-navy-800">|</span>
            <span className="text-emerald-500">Live Simulation Active</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
