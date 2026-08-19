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
  Settings,
  Share2,
  FileText
} from 'lucide-react'
import { argoService } from './argoService'

export default function App() {
  // Theme Management (Light / Dark) with local storage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Prototype Screen Routing:
  // 'home': Landing Command Center
  // 'loading': AI Parsing Transition
  // 'interpretation': Structured Query Interpretation Card
  // 'explorer': Main ARGO Ocean Explorer (Map, Curves, AI insight, predictions, anomalies)
  // 'comparison': Dual Basin Comparison View
  // 'report': Final Ocean Intelligence Report
  const [currentScreen, setCurrentScreen] = useState('home')

  // Search input query
  const [searchQuery, setSearchQuery] = useState('')
  const [queryType, setQueryType] = useState('temperature') // temperature, salinity, map, comparison

  // Interactive controls
  const [activeParameter, setActiveParameter] = useState('temperature') // temperature, salinity
  const [activeTab, setActiveTab] = useState('Depth Profile') // Depth Profile, Time Series, Spatial Map
  const [selectedFloat, setSelectedFloat] = useState(null)
  const [showFloatPopup, setShowFloatPopup] = useState(false)
  const [explainSimply, setExplainSimply] = useState(false)
  const [highlightAnomalyOnGraph, setHighlightAnomalyOnGraph] = useState(true)

  // Follow-up chat log
  const [followupInput, setFollowupInput] = useState('')
  const [conversations, setConversations] = useState([])

  // AI loading process step text
  const [loadingText, setLoadingText] = useState('Understanding query…')
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

  // Handle suggested query cards click
  const handleSuggestionClick = (queryText) => {
    setSearchQuery(queryText)
    
    // Automatically classify query type for visualization selection
    if (queryText.includes('salinity') || queryText.includes('compare')) {
      setQueryType('comparison')
      setActiveParameter('salinity')
    } else if (queryText.includes('active') || queryText.includes('floats') || queryText.includes('observed')) {
      setQueryType('map')
      setActiveTab('Spatial Map')
    } else {
      setQueryType('temperature')
      setActiveParameter('temperature')
      setActiveTab('Depth Profile')
    }

    // Auto-transition to loader
    setCurrentScreen('loading')
    setLoadingProgress(0)
    setLoadingText('Understanding query…')

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + 5
        if (next === 25) {
          setLoadingText('Finding ARGO observations…')
        } else if (next === 65) {
          setLoadingText('Generating visualization…')
        } else if (next >= 100) {
          clearInterval(interval)
          // Advance to interpretation screen
          setCurrentScreen('interpretation')
          return 100
        }
        return next
      })
    }, 35)
  }

  // Submit main query
  const handleQuerySubmit = (e) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return

    setCurrentScreen('loading')
    setLoadingProgress(0)
    setLoadingText('Understanding query…')

    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + 5
        if (next === 25) {
          setLoadingText('Finding ARGO observations…')
        } else if (next === 65) {
          setLoadingText('Generating visualization…')
        } else if (next >= 100) {
          clearInterval(interval)
          setCurrentScreen('interpretation')
          return 100
        }
        return next
      })
    }, 35)
  }

  // Handle follow up chat submit
  const handleFollowupSubmit = (e) => {
    if (e) e.preventDefault()
    if (!followupInput.trim()) return

    const userText = followupInput
    setConversations(prev => [...prev, { sender: 'user', text: userText }])
    setFollowupInput('')

    setTimeout(() => {
      let aiText = "ARGO observations indicate stable profiles within standard deviations."
      if (userText.toLowerCase().includes('compare') || userText.toLowerCase().includes('bengal')) {
        aiText = "Comparison metrics loaded. Select 'Generate Report' to export comparison profiles."
        setCurrentScreen('comparison')
      } else if (userText.toLowerCase().includes('1000m') || userText.toLowerCase().includes('depth')) {
        aiText = "Adjusting profiles to deep columns (0-1000m). Climatological baseline loaded."
        setActiveTab('Depth Profile')
      } else if (userText.toLowerCase().includes('trend') || userText.toLowerCase().includes('years')) {
        aiText = "Decadal temperature trends loaded. Time series shows gradual warming in upper thermocline."
        setActiveTab('Time Series')
      }
      setConversations(prev => [...prev, { sender: 'ai', text: aiText }])
    }, 500)
  }

  // Trigger click suggestions inside follow-up
  const triggerFollowup = (text) => {
    setConversations(prev => [...prev, { sender: 'user', text: text }])
    setTimeout(() => {
      if (text.toLowerCase().includes('compare') || text.toLowerCase().includes('bengal')) {
        setCurrentScreen('comparison')
      } else if (text.toLowerCase().includes('1000m')) {
        setActiveTab('Depth Profile')
      } else if (text.toLowerCase().includes('years')) {
        setActiveTab('Time Series')
      }
      setConversations(prev => [...prev, { sender: 'ai', text: "Context updated based on your question." }])
    }, 400)
  }

  // Fetch observational values
  const activeFloats = argoService.getFloatObservations(
    currentScreen === 'comparison' ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )
  const profilePoints = argoService.getDepthProfileData(
    currentScreen === 'comparison' ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )
  const forecastPoints = argoService.getForecastData(
    currentScreen === 'comparison' ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )
  const aiInsight = argoService.getAIInsight(
    currentScreen === 'comparison' ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter,
    explainSimply
  )

  return (
    <div className="min-h-screen bg-navy-50 text-navy-950 dark:bg-navy-950 dark:text-navy-50 flex flex-col font-sans transition-colors duration-300">
      
      {/* ----------------- CORE CONTAINER ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white dark:bg-navy-900 border-r border-navy-150 dark:border-navy-800/80 hidden md:flex flex-col justify-between shrink-0 p-4 transition-colors duration-300">
          <div className="space-y-6">
            
            {/* Logo */}
            <div 
              onClick={() => { setCurrentScreen('home'); setSearchQuery(''); }}
              className="flex items-center gap-2.5 px-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
                <Globe size={18} className="animate-spin-slow" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-navy-900 dark:text-slate-100 flex items-center gap-1">
                  🌊 FloatChat
                </h1>
                <p className="text-[10px] text-navy-450 dark:text-navy-500 font-bold uppercase tracking-wider">
                  ARGO Ocean Discovery
                </p>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest px-2.5">
                Research Desk
              </span>
              {[
                { id: 'new', label: 'New Exploration', icon: MessageSquare, action: () => { setCurrentScreen('home'); setSearchQuery(''); } },
                { id: 'explore', label: 'Explore Ocean', icon: Compass, action: () => setCurrentScreen('explorer') },
                { id: 'analysis', label: 'AI Analysis', icon: Sliders, action: () => setCurrentScreen('interpretation') },
                { id: 'predict', label: 'Predictions', icon: TrendingUp, action: () => { setCurrentScreen('explorer'); setActiveTab('Time Series'); } },
                { id: 'saved', label: 'Saved Queries', icon: Database, action: () => setCurrentScreen('explorer') },
                { id: 'recent', label: 'Recent Searches', icon: Calendar, action: () => setCurrentScreen('home') },
                { id: 'coverage', label: 'ARGO Coverage', icon: Globe, action: () => { setCurrentScreen('explorer'); setActiveTab('Spatial Map'); } },
                { id: 'about', label: 'About FloatChat', icon: Info, action: () => setCurrentScreen('home') }
              ].map(item => {
                const Icon = item.icon
                const isActive = (item.id === 'new' && currentScreen === 'home') || 
                                 (item.id === 'explore' && currentScreen === 'explorer') ||
                                 (item.id === 'analysis' && currentScreen === 'interpretation')
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition duration-200 ${
                      isActive 
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-l-2 border-cyan-500' 
                        : 'text-navy-500 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800/40 hover:text-navy-850 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sidebar bottom */}
          <div className="space-y-4 pt-4 border-t border-navy-100 dark:border-navy-800/80">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-navy-400 dark:text-navy-500 font-bold uppercase tracking-wider">Theme Mode</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-md bg-navy-50 hover:bg-navy-100 dark:bg-navy-805 dark:hover:bg-navy-700 text-navy-600 dark:text-cyan-400 transition"
              >
                {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2.5 border-l-2 border-cyan-500 pl-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                AR
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-navy-850 dark:text-slate-200">Dr. Ananya Rao</h4>
                <p className="text-[10px] text-navy-450 dark:text-navy-555 font-semibold">Ocean Researcher</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY REGION */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-navy-50/20 dark:bg-navy-950/20 transition-colors duration-300">
          
          {/* HEADER NAV */}
          <header className="h-16 border-b border-navy-100 dark:border-navy-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur px-6 flex justify-between items-center shrink-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-navy-400 dark:text-navy-600">
              <span className={currentScreen === 'home' ? "text-cyan-500" : ""}>Ask</span>
              <ChevronRight size={10} />
              <span className={currentScreen === 'loading' || currentScreen === 'interpretation' ? "text-cyan-500" : ""}>Understand</span>
              <ChevronRight size={10} />
              <span className={currentScreen === 'explorer' ? "text-cyan-500" : ""}>Explore</span>
              <ChevronRight size={10} />
              <span className={currentScreen === 'comparison' ? "text-cyan-500" : ""}>Compare</span>
              <ChevronRight size={10} />
              <span className={currentScreen === 'report' ? "text-cyan-500" : ""}>Report</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>DEMO MODE · Simulated Observations</span>
              </div>
            </div>
          </header>

          {/* DYNAMIC SCENARIO ROUTER */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

            {/* SCREEN 1: HOME / COMMAND CENTER */}
            {currentScreen === 'home' && (
              <div className="space-y-6 py-6 animate-fadeIn">
                <div className="text-center md:text-left space-y-2">
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-cyan-500/20 shadow-sm">
                    Smart India Hackathon Prototype
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-navy-900 dark:text-slate-100">
                    Explore the ocean. Just ask.
                  </h2>
                  <p className="text-sm md:text-base text-navy-550 dark:text-navy-450 max-w-xl leading-relaxed">
                    Discover, analyze and understand ocean data using natural language.
                  </p>
                </div>

                {/* Main Query input */}
                <div className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-150 dark:border-navy-800/80 p-5 shadow-lg max-w-3xl">
                  <form onSubmit={handleQuerySubmit} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-4 text-cyan-500 animate-pulse" size={20} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ask anything about the ocean..."
                        className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs md:text-sm rounded-xl pl-12 pr-32 py-3.5 text-navy-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-400 hover:to-ocean-500 text-navy-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1"
                      >
                        <span>Ask FloatChat</span>
                      </button>
                    </div>

                    {/* suggested query cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                      {[
                        { label: "Temperature", query: "Show temperature variation from 0 to 500 meters in the Arabian Sea.", desc: "Warming profile columns" },
                        { label: "Salinity", query: "Compare salinity between Arabian Sea and Bay of Bengal.", desc: "Basin comparison curves" },
                        { label: "Depth Profile", query: "Show temperature from surface to 1000m.", desc: "Deep thermocline logs" },
                        { label: "Float Coverage", query: "Where are ARGO floats currently observing?", desc: "Spatial coordinates map" }
                      ].map((card, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleSuggestionClick(card.query)}
                          className="bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 p-3.5 rounded-xl text-left transition group"
                        >
                          <h5 className="font-extrabold text-[10px] text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{card.label}</h5>
                          <p className="text-[11px] text-navy-700 dark:text-slate-200 mt-1 font-bold leading-snug group-hover:text-cyan-500 transition">“{card.query}”</p>
                          <span className="text-[9px] text-navy-450 block mt-2">{card.desc}</span>
                        </button>
                      ))}
                    </div>
                  </form>
                </div>

                {/* Ocean Intelligence Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {[
                    { label: "Active ARGO Floats", val: "3,812", desc: "Live global array" },
                    { label: "Ocean Profiles", val: "11.2M+", desc: "Decadal registry" },
                    { label: "Regions Covered", val: "12", desc: "Basin grid units" },
                    { label: "Parameters Monitored", val: "4", desc: "Physical variables" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-4 rounded-xl shadow-sm">
                      <span className="text-[9px] text-navy-400 font-bold uppercase tracking-wider">{stat.label}</span>
                      <h4 className="text-xl font-black text-navy-850 dark:text-slate-100 mt-0.5">{stat.val}</h4>
                      <p className="text-[9px] text-navy-450">{stat.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Pipeline visual diagram */}
                <div className="pt-6 border-t border-navy-100 dark:border-navy-850 max-w-4xl space-y-4">
                  <h4 className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest">How FloatChat Works</h4>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center text-center text-xs">
                    {[
                      "Natural Language",
                      "AI Query Parser",
                      "Structured Query",
                      "ARGO Data Retrieval",
                      "Visualization",
                      "AI Insight",
                      "Prediction"
                    ].map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="bg-navy-50 dark:bg-navy-950 p-2.5 rounded-lg border border-navy-100 dark:border-navy-800/80">
                          <span className="text-[8px] text-cyan-500 font-bold">Step 0{idx+1}</span>
                          <p className="font-extrabold text-[10px] text-navy-800 dark:text-slate-200 mt-0.5">{step}</p>
                        </div>
                        {idx < 6 && <span className="text-navy-300 dark:text-navy-850 hidden md:block">➔</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 2: AI CONVERSATIONAL ANALYSIS (LOADING) */}
            {currentScreen === 'loading' && (
              <div className="max-w-md mx-auto bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-8 rounded-2xl shadow-md text-center space-y-6 animate-fadeIn py-12 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto text-cyan-500 animate-spin">
                  <RefreshCw size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-navy-900 dark:text-white">Understanding query…</h3>
                  <p className="text-[11px] text-navy-450">{loadingText}</p>
                </div>

                <div className="w-full bg-navy-50 dark:bg-navy-950 h-1.5 rounded-full overflow-hidden border border-navy-100 dark:border-navy-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-100" style={{ width: `${loadingProgress}%` }}></div>
                </div>

                <div className="space-y-2.5 pt-2 text-left max-w-xs mx-auto text-xs">
                  <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span><span>Region identified (Arabian Sea)</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span><span>Parameter identified (Temperature)</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span><span>Depth range identified (0–500m)</span></div>
                  <div className="flex items-center gap-2"><span className="text-emerald-500">✓</span><span>Time period identified (January 2025)</span></div>
                </div>
              </div>
            )}

            {/* SCREEN 3: SMART QUERY INTERPRETATION */}
            {currentScreen === 'interpretation' && (
              <div className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-md space-y-6 animate-fadeIn transition-colors duration-300">
                <div className="flex items-center gap-3 border-b border-navy-100 dark:border-navy-800 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-sm">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white">AI Query Understanding</h3>
                    <p className="text-[10px] text-navy-450">Structured request parsed from your question</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    { label: "Region", val: "Arabian Sea" },
                    { label: "Parameter", val: "Temperature" },
                    { label: "Depth Range", val: "0–500 m" },
                    { label: "Time Period", val: "January 2025" },
                    { label: "Analysis Mode", val: "Depth Profile" },
                    { label: "Confidence Score", val: "High (96%)" }
                  ].map((field, idx) => (
                    <div key={idx} className="bg-navy-50 dark:bg-navy-950 p-3 rounded-lg border border-navy-100 dark:border-navy-800/80">
                      <p className="text-[9px] text-navy-400 uppercase font-bold tracking-wider">{field.label}</p>
                      <p className="font-extrabold text-navy-850 dark:text-slate-200 mt-1">{field.val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="flex-1 border border-navy-200 dark:border-navy-800 text-navy-700 dark:text-slate-300 font-bold text-xs py-3 rounded-lg hover:bg-navy-50 transition"
                  >
                    Modify Query
                  </button>
                  <button
                    onClick={() => setCurrentScreen('explorer')}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-3 rounded-lg shadow transition flex items-center justify-center gap-1.5"
                  >
                    <span>Analyze ARGO Data</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 4 & 5: ARGO OCEAN EXPLORER WORKSPACE */}
            {currentScreen === 'explorer' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* User Query bubble & status indicator */}
                <div className="flex justify-between items-center">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 p-3 rounded-2xl rounded-tr-sm text-xs font-semibold max-w-lg shadow-sm">
                    <span className="text-[9px] text-navy-400 block font-bold uppercase tracking-wider mb-1">You Asked</span>
                    “{searchQuery || "Show temperature variation from 0 to 500 meters in the Arabian Sea during January 2025."}”
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle2 size={12} />
                    <span>Based on ARGO observations</span>
                  </div>
                </div>

                {/* AI PROCESSING TRAIL */}
                <div className="flex items-center justify-center gap-4 text-[10px] text-navy-450 dark:text-navy-500 font-bold uppercase tracking-wider select-none">
                  <span className="flex items-center gap-1.5 text-emerald-500"><CheckCircle2 size={12} /> Query understood</span>
                  <span className="text-navy-200 dark:text-navy-800">➔</span>
                  <span className="flex items-center gap-1.5 text-emerald-500"><CheckCircle2 size={12} /> ARGO data retrieved</span>
                  <span className="text-navy-200 dark:text-navy-800">➔</span>
                  <span className="flex items-center gap-1.5 text-emerald-500"><CheckCircle2 size={12} /> Visualization generated</span>
                </div>

                {/* A. AI ANSWER */}
                <div className="bg-gradient-to-br from-navy-900 to-purple-950 border border-purple-500/20 text-white rounded-2xl p-4 md:p-4.5 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-wider text-cyan-300">AI Insight</h3>
                    <button 
                      onClick={() => setExplainSimply(!explainSimply)}
                      className="text-[10px] font-bold text-slate-350 hover:text-white underline"
                    >
                      {explainSimply ? "View scientific formulation" : "Explain in simpler terms"}
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-semibold">
                    {explainSimply 
                      ? "In simple terms, the ocean is warmer near the surface and becomes cooler as depth increases. Salinity concentrations are stable in upper channels but drop slightly in intermediate layers."
                      : conversations[conversations.length - 1]?.text || "ARGO observations indicate warmer surface waters across the selected Indian Ocean region. Temperature decreases progressively with depth, with the strongest gradient observed in the upper 500m."
                    }
                  </p>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] text-slate-400">
                    <span>AI-generated insight • Based on available ARGO profiles</span>
                    <span className="font-bold text-cyan-400 uppercase tracking-widest">ARGO Observations</span>
                  </div>
                </div>

                {/* MAP & CURVE SPLIT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Geospatial Map */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-5 rounded-2xl shadow-sm lg:col-span-6 flex flex-col justify-between transition duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-navy-850 dark:text-slate-100">
                          Geospatial Float Locations — Indian Ocean
                        </h4>
                        <p className="text-[10px] text-navy-455 font-medium">Based on ARGO observations • ARGO Float Data</p>
                      </div>
                      
                      <div className="flex gap-1 bg-navy-50 dark:bg-navy-950 p-1 rounded-lg border border-navy-100 dark:border-navy-800 text-[9px] font-bold">
                        <button className="px-1.5 py-0.5 hover:bg-navy-200 rounded">Zoom +</button>
                        <button className="px-1.5 py-0.5 hover:bg-navy-200 rounded">Zoom –</button>
                        <button className="px-1.5 py-0.5 hover:bg-navy-200 rounded">Reset</button>
                      </div>
                    </div>

                    <div className="h-96 bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl my-4 relative overflow-hidden flex items-center justify-center p-4">
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

                      {showFloatPopup && selectedFloat && (
                        <div className="absolute bottom-2 left-2 bg-white dark:bg-navy-900 border border-navy-150 p-3 rounded-lg shadow text-[10px] flex justify-between gap-4 animate-scaleUp">
                          <div>
                            <p className="font-bold text-navy-800 dark:text-slate-100">Float: {selectedFloat.id}</p>
                            <p className="text-navy-400">{selectedFloat.lat}°N, {selectedFloat.lng}°E</p>
                            <p className="text-[8px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold mt-1">SIMULATED DATA</p>
                          </div>
                          <div className="text-right">
                            <p className="text-cyan-500 font-bold">Depth: {selectedFloat.depth}m</p>
                            <p className="text-orange-500 font-mono">Temp: {selectedFloat.temp}°C</p>
                          </div>
                          <button onClick={() => setShowFloatPopup(false)} className="text-navy-400 hover:text-navy-600"><X size={12} /></button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Scientific Curves */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-155 dark:border-navy-800 p-5 rounded-2xl shadow-sm lg:col-span-6 flex flex-col justify-between transition duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-navy-850 dark:text-slate-100">
                          {activeParameter === 'temperature' ? "Temperature Profile — Indian Ocean" : "Salinity Profile — Indian Ocean"}
                        </h4>
                        <p className="text-[10px] text-navy-455">ARGO Float Data • Based on available ARGO profiles</p>
                      </div>

                      {/* Controls tabs */}
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

                    {/* Parameter toggles */}
                    <div className="flex gap-2 justify-end my-1">
                      <button 
                        onClick={() => setActiveParameter('temperature')}
                        className={`text-[9px] font-bold px-3 py-1 rounded border ${activeParameter === 'temperature' ? 'bg-cyan-500 text-navy-950 border-cyan-500' : 'border-navy-205 dark:border-navy-800 text-navy-450'}`}
                      >
                        Temperature
                      </button>
                      <button 
                        onClick={() => setActiveParameter('salinity')}
                        className={`text-[9px] font-bold px-3 py-1 rounded border ${activeParameter === 'salinity' ? 'bg-cyan-500 text-navy-950 border-cyan-500' : 'border-navy-205 dark:border-navy-800 text-navy-450'}`}
                      >
                        Salinity
                      </button>
                    </div>

                    <div className="h-96 bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl relative flex items-center justify-center p-4">
                      {activeTab === 'Depth Profile' ? (
                        <svg width="100%" height="100%" viewBox="-15 5 270 145">
                          <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-250 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="30" y1="60" x2="230" y2="60" stroke="currentColor" className="text-navy-250 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="30" y1="100" x2="230" y2="100" stroke="currentColor" className="text-navy-250 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                          
                          {highlightAnomalyOnGraph && (
                            <rect x="150" y="60" width="80" height="40" fill="rgba(249, 115, 22, 0.15)" />
                          )}

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

                          <text x="30" y="132" textAnchor="middle" fill="currentColor" className="text-navy-500 dark:text-navy-400 font-bold" fontSize="7">0m</text>
                          <text x="110" y="132" textAnchor="middle" fill="currentColor" className="text-navy-500 dark:text-navy-400 font-bold" fontSize="7">200m</text>
                          <text x="230" y="132" textAnchor="middle" fill="currentColor" className="text-navy-500 dark:text-navy-400 font-bold" fontSize="7">500m</text>
                          <text x="130" y="145" textAnchor="middle" fill="currentColor" className="text-navy-500 dark:text-navy-450 font-bold" fontSize="7.5">Depth (m)</text>
                          <text x="5" y="70" textAnchor="middle" fill="currentColor" className="text-navy-500 dark:text-navy-450 font-bold" fontSize="7.5" transform="rotate(-90 5 70)">{activeParameter === 'temperature' ? "Temperature (°C)" : "Salinity (PSU)"}</text>
                        </svg>
                      ) : (
                        // Forecast prediction curve
                        <svg width="100%" height="100%" viewBox="0 0 250 140">
                          <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                          <line x1="30" y1="80" x2="230" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                          
                          {/* Dotted forecast and confidence zone */}
                          <path d="M 30 80 Q 110 60, 150 40 L 230 30 L 230 90 L 150 60 Z" fill="rgba(168, 85, 247, 0.12)" />
                          <path d="M 30 80 Q 110 60, 150 40" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                          <path d="M 150 40 Q 190 35, 230 30" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />
                          
                          <line x1="150" y1="10" x2="150" y2="120" stroke="#0ea5e9" strokeDasharray="2,2" strokeWidth="1" />
                          <text x="150" y="130" textAnchor="middle" fill="currentColor" className="text-navy-450 font-bold" fontSize="6.5">TODAY</text>
                        </svg>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-navy-400">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-0.5 bg-cyan-500 border-dashed border-t"></span> Climatological baseline
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-0.5 bg-orange-500"></span> Active observations
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Compact Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Temperature", val: activeParameter === 'temperature' ? "28.4°C" : "14.2°C" },
                    { label: "Salinity", val: activeParameter === 'temperature' ? "35.2 PSU" : "36.2 PSU" },
                    { label: "Depth", val: activeParameter === 'temperature' ? "500m" : "1000m" },
                    { label: "Active Floats", val: "7" }
                  ].map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800/80 p-2.5 rounded-lg shadow-sm text-center">
                      <p className="text-[9px] text-navy-400 font-bold uppercase tracking-wider">{card.label}</p>
                      <h4 className="text-sm font-black text-navy-850 dark:text-slate-100 mt-0.5">{card.val}</h4>
                    </div>
                  ))}
                </div>

                {/* AI Prediction & Anomaly alerts row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Predictions panel */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-150 p-5 rounded-2xl shadow-sm space-y-3.5">
                    <span className="text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">
                      AI Prediction — prototype simulation
                    </span>
                    <h4 className="font-extrabold text-sm text-navy-900 dark:text-slate-100">Predict Ocean Conditions</h4>
                    <p className="text-xs text-navy-500 leading-relaxed">
                      Based on historical ARGO observations and observed trends, the model projects a gradual change in the selected temperature profile over the forecast period (Next 30 Days).
                    </p>
                    <div className="flex justify-between items-center text-xs py-2 border-t border-b border-navy-50 dark:border-navy-800/40">
                      <span className="text-navy-400 font-bold">Prediction confidence:</span>
                      <span className="font-extrabold text-purple-500 font-mono">72%</span>
                    </div>
                  </div>

                  {/* Anomaly detection panel */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-150 p-5 rounded-2xl shadow-sm space-y-3.5">
                    <span className="text-[9px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">
                      Potential Temperature Anomaly Detected
                    </span>
                    <h4 className="font-extrabold text-sm text-navy-900 dark:text-slate-100">Arabian Sea intermediate column anomaly</h4>
                    <p className="text-xs text-navy-550 dark:text-navy-450 leading-relaxed">
                      Observed values differ from the expected pattern for the selected region and period. Temperatures between 300-500m are roughly 1.2°C warmer than climatology.
                    </p>
                    <div className="flex justify-between items-center text-xs py-2 border-t border-b border-navy-50 dark:border-navy-800/40">
                      <span className="text-navy-400 font-bold">Status:</span>
                      <span className="font-extrabold text-orange-500 uppercase">Needs Attention</span>
                    </div>
                  </div>

                </div>

                {/* CONTINUE EXPLORING & FOLLOW-UP CHAT */}
                <div className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-5 rounded-2xl shadow-sm space-y-4">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-navy-850 dark:text-slate-100">
                    CONTINUE EXPLORING
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold text-navy-455 uppercase mr-1">Try asking next:</span>
                    {[
                      "Show this at 1000m depth",
                      "Compare it with the Pacific Ocean",
                      "Compare this with the Bay of Bengal."
                    ].map((followPrompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerFollowup(followPrompt)}
                        className="bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/60 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-3 py-1.5 rounded-lg font-semibold transition"
                      >
                        {followPrompt}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleFollowupSubmit} className="relative">
                    <input
                      type="text"
                      value={followupInput}
                      onChange={(e) => setFollowupInput(e.target.value)}
                      placeholder="Ask FloatChat another question…"
                      className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs rounded-xl pl-4 pr-24 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-navy-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-navy-150 hover:bg-navy-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-850 dark:text-cyan-400 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition"
                    >
                      Send
                    </button>
                  </form>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setCurrentScreen('report')}
                      className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <FileText size={14} />
                      <span>Generate Ocean Intelligence Report</span>
                    </button>

                    <button 
                      onClick={() => { setCurrentScreen('home'); setSearchQuery(''); }}
                      className="text-[10px] text-navy-450 hover:text-cyan-500 underline font-semibold"
                    >
                      Ask another question
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 6: DUAL BASIN COMPARISON WORKSPACE */}
            {currentScreen === 'comparison' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-navy-100 dark:border-navy-800 pb-3">
                  <div>
                    <h3 className="text-xl font-black text-navy-900 dark:text-white">Arabian Sea vs Bay of Bengal</h3>
                    <p className="text-xs text-navy-400">Comparing thermocline vertical variations across regional boundaries</p>
                  </div>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded uppercase">
                    Comparative Workspace
                  </span>
                </div>

                {/* Side-by-side or dual comparison chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Arabian Sea Chart */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-150 p-5 rounded-2xl shadow-sm space-y-4">
                    <h4 className="font-extrabold text-xs text-navy-800 dark:text-slate-200">Arabian Sea Temperature Profile</h4>
                    <div className="h-56 bg-navy-50 dark:bg-navy-950/70 rounded-xl relative flex items-center justify-center p-4">
                      <svg width="100%" height="100%" viewBox="0 0 250 140">
                        <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="30" y1="100" x2="230" y2="100" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                        <path d="M 30 30 Q 110 50, 150 80 T 230 100" fill="none" stroke="#f97316" strokeWidth="2" />
                        <path d="M 30 30 Q 110 50, 150 90 T 230 115" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2,2" />
                      </svg>
                    </div>
                  </div>

                  {/* Bay of Bengal Chart */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-150 p-5 rounded-2xl shadow-sm space-y-4">
                    <h4 className="font-extrabold text-xs text-navy-800 dark:text-slate-200">Bay of Bengal Temperature Profile</h4>
                    <div className="h-56 bg-navy-50 dark:bg-navy-950/70 rounded-xl relative flex items-center justify-center p-4">
                      <svg width="100%" height="100%" viewBox="0 0 250 140">
                        <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="30" y1="100" x2="230" y2="100" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                        <path d="M 30 25 Q 110 40, 150 70 T 230 90" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                </div>

                {/* AI Comparison Insight */}
                <div className="bg-gradient-to-br from-navy-900 to-purple-950 border border-purple-500/20 text-white rounded-2xl p-5 shadow-sm space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300">AI Comparison Insight</h4>
                  <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-semibold">
                    The selected observations show different temperature and salinity profiles between the two regions. The Arabian Sea has a more pronounced thermocline warming deviation (+1.2°C) while the Bay of Bengal shows highly stable temperature stratification but pronounced halocline variations.
                  </p>
                </div>

                {/* Action CTA */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setCurrentScreen('report')}
                    className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-5 py-3 rounded-lg shadow transition flex items-center gap-1.5"
                  >
                    <FileText size={16} />
                    <span>Generate Ocean Intelligence Report ➔</span>
                  </button>

                  <button 
                    onClick={() => setCurrentScreen('explorer')}
                    className="text-xs text-navy-450 hover:text-cyan-500 underline font-semibold"
                  >
                    Back to Single Explorer
                  </button>
                </div>

              </div>
            )}

            {/* SCREEN 7: FINAL OCEAN INTELLIGENCE REPORT */}
            {currentScreen === 'report' && (
              <div className="bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-md space-y-6 animate-fadeIn transition-colors duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-navy-100 dark:border-navy-800 pb-4">
                  <div>
                    <span className="text-[9px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded uppercase">
                      Final Report
                    </span>
                    <h3 className="text-xl font-black text-navy-900 dark:text-white mt-1">Ocean Intelligence Report</h3>
                    <p className="text-[10px] text-navy-450">FloatChat AI Summary for ARGO observations</p>
                  </div>
                  
                  <div className="text-right text-[10px] text-navy-400">
                    <p>Report Ref: FC-2026-ASB</p>
                    <p>Date: August 19, 2026</p>
                  </div>
                </div>

                {/* Parameters section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {[
                    { label: "Target Query", val: "Show temperature profiles in the Indian Ocean" },
                    { label: "Selected Basin", val: "Arabian Sea Quadrant" },
                    { label: "Observation window", val: "January 2025" },
                    { label: "Confidence Value", val: "High (96%)" }
                  ].map((field, idx) => (
                    <div key={idx} className="bg-navy-50 dark:bg-navy-950 p-3 rounded-lg border border-navy-100 dark:border-navy-800/80">
                      <span className="text-[9px] text-navy-400 uppercase font-bold tracking-wider">{field.label}</span>
                      <p className="font-extrabold text-navy-850 dark:text-slate-200 mt-1">{field.val}</p>
                    </div>
                  ))}
                </div>

                {/* AI Summary and Predictions */}
                <div className="space-y-4 text-xs md:text-sm text-navy-650 dark:text-slate-350 leading-relaxed border-t border-b border-navy-100 dark:border-navy-800 py-4">
                  <div className="space-y-1">
                    <h5 className="font-bold text-navy-900 dark:text-slate-100">1. AI Scientific Insight</h5>
                    <p>Temperature decreases progressively with depth, with the strongest variation occurring in the upper ocean layer. Climatological deviation matches historical warming anomalies of +1.2°C at intermediate depths (300-500m).</p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-navy-900 dark:text-slate-100">2. Predict Trend Summary</h5>
                    <p>AI models project intermediate warmth to persist over the next 7-14 days with 72% confidence, stabilizing back to seasonal decadal baselines after 30 days.</p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-navy-900 dark:text-slate-100">3. Anomaly Alerts</h5>
                    <p>Potential Temperature Anomaly detected between 50-150m. Status: Needs Attention.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Report saved successfully in Saved Queries.")}
                      className="bg-navy-50 hover:bg-navy-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-800 dark:text-cyan-400 text-xs px-4 py-2.5 rounded-lg font-bold transition"
                    >
                      Save Analysis
                    </button>
                    <button 
                      onClick={() => alert("Downloading PDF summary report...")}
                      className="bg-navy-50 hover:bg-navy-100 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-800 dark:text-cyan-400 text-xs px-4 py-2.5 rounded-lg font-bold transition flex items-center gap-1.5"
                    >
                      <Share2 size={12} />
                      <span>Export Report</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => { setCurrentScreen('home'); setSearchQuery(''); }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition"
                  >
                    Ask Another Question
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* FOOTER */}
          <footer className="mt-auto border-t border-navy-150 dark:border-navy-800/80 p-5 bg-white dark:bg-navy-900 text-center text-xs text-navy-400 transition duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
              <p>© 2026 FloatChat AI. National-Level Hackathon Finalist Prototype. All rights reserved.</p>
              <div className="flex items-center gap-4 font-semibold">
                <a href="#about" onClick={(e) => { e.preventDefault(); setCurrentScreen('home'); }} className="hover:text-cyan-500 transition">How it Works</a>
                <span className="text-navy-300 dark:text-navy-800">|</span>
                <span className="text-emerald-500">Live Simulation Engine</span>
              </div>
            </div>
          </footer>

        </main>
      </div>

    </div>
  )
}
