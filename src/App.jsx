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
  ChevronDown,
  Send,
  HelpCircle,
  Settings,
  Share2
} from 'lucide-react'
import { argoService } from './argoService'

export default function App() {
  // Theme Management (Light / Dark) with local storage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Navigation state: 'dashboard' (holds the query flow), 'about' (How FloatChat works), 'saved' (Saved Queries)
  const [currentView, setCurrentView] = useState('dashboard')

  // Hackathon Demo Step state:
  // 1: Home screen (empty input, suggested cards)
  // 2: Suggestion clicked (input populated with Arabian Sea query)
  // 3: Query Submitted (transition "Understanding your query...")
  // 4: AI Query Understanding Card (Region, Variable, Depth, Time)
  // 5: Main ARGO Analysis Dashboard (Map, curves, AI insight, data summary)
  // 6: Comparison Dashboard (Arabian Sea vs Bay of Bengal)
  const [demoStep, setDemoStep] = useState(1)

  // Input value in search box
  const [searchQuery, setSearchQuery] = useState('')

  // Interactive controls
  const [activeParameter, setActiveParameter] = useState('temperature') // temperature, salinity
  const [activeTab, setActiveTab] = useState('Depth Profile') // Depth Profile, Time Series, Spatial Distribution
  const [selectedFloat, setSelectedFloat] = useState(null)
  const [showFloatPopup, setShowFloatPopup] = useState(false)
  const [explainSimply, setExplainSimply] = useState(false)
  const [highlightAnomalyOnGraph, setHighlightAnomalyOnGraph] = useState(true)
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [alertCreatedSuccess, setAlertCreatedSuccess] = useState(false)

  // Follow-up chat input
  const [followupInput, setFollowupInput] = useState('')
  const [conversations, setConversations] = useState([
    { sender: 'user', text: 'Show temperature variation from 0 to 500 meters in the Arabian Sea during January 2025.' },
    { sender: 'ai', text: 'I found the relevant ARGO observations. Here is the vertical depth profile and spatial distribution.' }
  ])

  // Processing checklist animation state
  const [parserProgress, setParserProgress] = useState(0)
  const [parserChecklist, setParserChecklist] = useState([
    { name: 'Location identified (Arabian Sea)', status: 'pending' },
    { name: 'Parameter identified (Temperature)', status: 'pending' },
    { name: 'Depth range identified (0–500 meters)', status: 'pending' },
    { name: 'Time period identified (January 2025)', status: 'pending' },
    { name: 'Analysis type identified (Depth Profile)', status: 'pending' }
  ])

  // Apply Dark Mode class
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Run progress checklist when moving to step 3
  useEffect(() => {
    if (demoStep === 3) {
      setParserProgress(0)
      setParserChecklist(items => items.map(it => ({ ...it, status: 'pending' })))
      
      const interval = setInterval(() => {
        setParserProgress(prev => {
          const next = prev + 4
          
          setParserChecklist(current => {
            return current.map((item, idx) => {
              const trigger = (idx + 1) * 20
              if (next >= trigger) {
                return { ...item, status: 'done' }
              } else if (next >= trigger - 10) {
                return { ...item, status: 'processing' }
              }
              return item
            })
          })

          if (next >= 100) {
            clearInterval(interval)
            // Auto advance to step 4 (AI Query Understanding Card) after short delay
            setTimeout(() => {
              setDemoStep(4)
            }, 800)
            return 100
          }
          return next
        })
      }, 40)
      return () => clearInterval(interval)
    }
  }, [demoStep])

  // Handle suggested query card clicks
  const handleSuggestionClick = (queryText) => {
    setSearchQuery(queryText)
    setDemoStep(2)
  }

  // Handle main search query submit
  const handleQuerySubmit = (e) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return
    setDemoStep(3)
  }

  // Handle follow-up queries
  const handleFollowupSubmit = (e) => {
    if (e) e.preventDefault()
    if (!followupInput.trim()) return

    const userText = followupInput
    setConversations(prev => [...prev, { sender: 'user', text: userText }])
    setFollowupInput('')

    if (userText.toLowerCase().includes('compare') || userText.toLowerCase().includes('bengal')) {
      setConversations(prev => [
        ...prev,
        { sender: 'ai', text: 'Comparing vertical structures of the Arabian Sea and Bay of Bengal. Visualizations and comparison metrics generated.' }
      ])
      setDemoStep(6)
    }
  }

  // Handle suggested click inside follow-up
  const triggerFollowup = (text) => {
    setConversations(prev => [...prev, { sender: 'user', text: text }])
    if (text.toLowerCase().includes('compare') || text.toLowerCase().includes('bengal')) {
      setConversations(prev => [
        ...prev,
        { sender: 'ai', text: 'Comparing vertical structures of the Arabian Sea and Bay of Bengal. Visualizations and comparison metrics generated.' }
      ])
      setDemoStep(6)
    }
  }

  // Saved query click handler
  const loadSavedQuery = (stepNum, param = 'temperature') => {
    setCurrentView('dashboard')
    setActiveParameter(param)
    setDemoStep(stepNum)
  }

  // Mock data fetching from argoService
  const activeFloats = argoService.getFloatObservations(
    demoStep === 6 ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )
  const profilePoints = argoService.getDepthProfileData(
    demoStep === 6 ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )
  const forecastPoints = argoService.getForecastData(
    demoStep === 6 ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter
  )
  const aiInsight = argoService.getAIInsight(
    demoStep === 6 ? 'Bay of Bengal' : 'Arabian Sea',
    activeParameter,
    explainSimply
  )

  return (
    <div className="min-h-screen bg-navy-50 text-navy-950 dark:bg-navy-950 dark:text-navy-50 flex flex-col font-sans transition-colors duration-300">
      
      {/* ----------------- CORE CONTAINER ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-white dark:bg-navy-900 border-r border-navy-100 dark:border-navy-800/85 hidden md:flex flex-col justify-between shrink-0 p-4 transition-colors duration-300">
          <div className="space-y-6">
            
            {/* Logo branding */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
                <Globe size={18} className="animate-spin-slow" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-navy-900 dark:text-slate-100 flex items-center gap-1">
                  🌊 FloatChat
                </h1>
                <p className="text-[10px] text-navy-400 dark:text-navy-500 font-bold uppercase tracking-wider">
                  ARGO Ocean Intelligence
                </p>
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest px-2.5">
                Research Desk
              </span>
              {[
                { id: 'dashboard', label: 'New Chat', icon: MessageSquare, view: 'dashboard', action: () => { setDemoStep(1); setSearchQuery(''); setCurrentView('dashboard'); } },
                { id: 'explorer', label: 'Explore Data', icon: Compass, view: 'dashboard', action: () => { setDemoStep(5); setCurrentView('dashboard'); } },
                { id: 'saved', label: 'Saved Queries', icon: Sliders, view: 'saved', action: () => setCurrentView('saved') },
                { id: 'about', label: 'About ARGO', icon: Info, view: 'about', action: () => setCurrentView('about') }
              ].map(item => {
                const Icon = item.icon
                const isActive = currentView === item.view && (item.id !== 'dashboard' || demoStep === 1)
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

            {/* How FloatChat Works - Shortened architecture summary */}
            <div className="space-y-2 pt-4 border-t border-navy-100 dark:border-navy-800/80">
              <span className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest px-2.5">
                Pipeline
              </span>
              <div className="bg-navy-50 dark:bg-navy-950/50 p-3.5 rounded-xl border border-navy-100 dark:border-navy-800/60 text-[10px] leading-relaxed space-y-2">
                <h4 className="font-bold text-navy-800 dark:text-slate-350">How it works</h4>
                <div className="space-y-1 text-navy-500">
                  <div className="flex items-center gap-1.5"><span className="text-cyan-500 font-bold">1.</span><span>Ask a question</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-cyan-500 font-bold">2.</span><span>Find ARGO data</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-cyan-500 font-bold">3.</span><span>Detect patterns</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-cyan-500 font-bold">4.</span><span>Explain evidence</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-cyan-500 font-bold">5.</span><span>Predict next steps</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-cyan-500 font-bold">6.</span><span>Take action</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Settings & Profile details */}
          <div className="space-y-4 pt-4 border-t border-navy-100 dark:border-navy-800/80">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-navy-400 dark:text-navy-500 font-bold uppercase tracking-wider">Theme Mode</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-md bg-navy-100 hover:bg-navy-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-600 dark:text-cyan-400 transition"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            <div className="flex items-center gap-2.5 border-l-2 border-cyan-500 pl-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                AR
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-navy-850 dark:text-slate-200">Dr. Ananya Rao</h4>
                <p className="text-[10px] text-navy-400 dark:text-navy-500 font-semibold">Ocean Researcher</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY REGION */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-navy-50/20 dark:bg-navy-950/20 transition-colors duration-300">
          
          {/* HEADER BAR */}
          <header className="h-16 border-b border-navy-100 dark:border-navy-800/80 bg-white/80 dark:bg-navy-900/80 backdrop-blur px-6 flex justify-between items-center shrink-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-3">
              {/* Pipeline Tracker: Visible core story progression */}
              <div className="flex items-center gap-3 text-xs font-bold uppercase text-navy-400 dark:text-navy-600">
                <span className={demoStep === 1 || demoStep === 2 ? "text-cyan-500 dark:text-cyan-400" : ""}>Ask</span>
                <ChevronRight size={10} />
                <span className={demoStep === 3 || demoStep === 4 ? "text-cyan-500 dark:text-cyan-400" : ""}>Understand</span>
                <ChevronRight size={10} />
                <span className={demoStep === 5 ? "text-cyan-500 dark:text-cyan-400" : ""}>Analyze</span>
                <ChevronRight size={10} />
                <span className={demoStep === 6 ? "text-cyan-500 dark:text-cyan-400" : ""}>Explore</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-950/45 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>DEMO MODE · Simulated Observations</span>
              </div>
            </div>
          </header>

          {/* DYNAMIC SCENARIO PANEL */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
            
            {/* VIEW 1: ABOUT PAGE */}
            {currentView === 'about' && (
              <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 animate-fadeIn">
                <div className="space-y-2 border-b border-navy-100 dark:border-navy-800 pb-4">
                  <h2 className="text-2xl font-black text-navy-900 dark:text-white">How FloatChat Works</h2>
                  <p className="text-xs text-navy-400">An architecture pipeline mapping natural language into oceanographic insights.</p>
                </div>

                {/* Pipeline visual diagram */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center text-center">
                  {[
                    { label: "Natural Language", desc: "User inputs unstructured research query" },
                    { label: "AI Query Parser", desc: "Extracts coordinates, bounds, and parameters" },
                    { label: "ARGO Data Retrieval", desc: "Queries profiling floats within spatial window" },
                    { label: "Data Processing", desc: "Computes profiles vs climatological baselines" },
                    { label: "Visualization Engine", desc: "Generates interactive curves and maps" },
                    { label: "AI Scientific Insight", desc: "Translates data variations into scientific reasoning" }
                  ].map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="bg-navy-50 dark:bg-navy-950 p-4 rounded-xl border border-navy-100 dark:border-navy-800 flex flex-col justify-between min-h-[120px] shadow-sm">
                        <span className="text-[10px] text-cyan-500 font-extrabold uppercase">Step 0{idx+1}</span>
                        <h4 className="font-extrabold text-xs text-navy-850 dark:text-slate-200 mt-1">{step.label}</h4>
                        <p className="text-[9px] text-navy-400 mt-1 leading-snug">{step.desc}</p>
                      </div>
                      {idx < 5 && <span className="text-navy-300 dark:text-navy-750 hidden md:block">➔</span>}
                    </React.Fragment>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-navy-100 dark:border-navy-800">
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-navy-900 dark:text-slate-200">01 — Ask Naturally</h5>
                    <p className="text-xs text-navy-550 dark:text-navy-450 leading-relaxed">Skip complex SQL or NetCDF formatting filters. Ask FloatChat naturally about regional temperature, salinity, or float profiles.</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-navy-900 dark:text-slate-200">02 — Visualize Instantly</h5>
                    <p className="text-xs text-navy-550 dark:text-navy-450 leading-relaxed">The system matches observation registries and draws custom interactive depth profiles, anomaly shading, and spatial coordinates.</p>
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-navy-900 dark:text-slate-200">03 — Understand the Data</h5>
                    <p className="text-xs text-navy-550 dark:text-navy-450 leading-relaxed">Our AI summarizes thermal stratification shifts and generates plain-English and scientific explanations for ecological decision support.</p>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

            {/* VIEW 2: SAVED QUERIES */}
            {currentView === 'saved' && (
              <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-navy-900 dark:text-white">Saved Queries</h2>
                  <p className="text-xs text-navy-400">Reopen saved ARGO analysis states instantly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Arabian Sea Temperature Profile", desc: "January 2025 depth profiles", step: 5, param: 'temperature' },
                    { title: "Arabian Sea vs Bay of Bengal", desc: "Temperature comparison curve", step: 6, param: 'temperature' },
                    { title: "Indian Ocean Float Locations", desc: "Active spatial observation model", step: 5, param: 'temperature' }
                  ].map((saved, idx) => (
                    <div 
                      key={idx}
                      onClick={() => loadSavedQuery(saved.step, saved.param)}
                      className="bg-navy-50 dark:bg-navy-950/60 border border-navy-100 dark:border-navy-800 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition duration-150 group"
                    >
                      <span className="text-[9px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold px-1.5 py-0.5 rounded uppercase">Saved Query</span>
                      <h4 className="font-extrabold text-sm text-navy-850 dark:text-slate-100 mt-2 group-hover:text-cyan-500 transition">{saved.title}</h4>
                      <p className="text-xs text-navy-450 dark:text-navy-500 mt-1">{saved.desc}</p>
                      <span className="text-[10px] text-cyan-500 font-bold block mt-3 group-hover:underline">Load Query State ➔</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: DASHBOARD WORKSPACE (STEPS 1 - 6) */}
            {currentView === 'dashboard' && (
              <div className="space-y-6">

                {/* ----------------- STEP 1 & 2: DASHBOARD LANDING ----------------- */}
                {(demoStep === 1 || demoStep === 2) && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Hero titles */}
                    <div className="text-center md:text-left py-4 space-y-2">
                      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-navy-900 dark:text-slate-100">
                        Explore the ocean. Just ask.
                      </h2>
                      <p className="text-navy-500 dark:text-navy-400 text-sm md:text-base max-w-2xl leading-relaxed">
                        Ask questions about temperature, salinity, depth, regions and ARGO float observations in natural language.
                      </p>
                    </div>

                    {/* How It Works Pipeline on Home screen */}
                    <div className="grid grid-cols-5 gap-2 max-w-3xl bg-navy-500/5 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-800/80 p-3.5 rounded-xl text-center items-center">
                      {[
                        { label: "Natural Language", icon: MessageSquare },
                        { label: "AI Query Parser", icon: Sliders },
                        { label: "ARGO Data", icon: Database },
                        { label: "Visualization", icon: LineChart },
                        { label: "AI Insight", icon: CheckCircle2 }
                      ].map((pipe, idx) => {
                        const Icon = pipe.icon
                        return (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex flex-col items-center gap-1 mx-auto">
                              <Icon size={14} className="text-cyan-500" />
                              <span className="text-[9px] font-bold text-navy-500 dark:text-navy-400">{pipe.label}</span>
                            </div>
                            {idx < 4 && <span className="text-navy-300 dark:text-navy-800 text-[10px] hidden md:inline shrink-0">➔</span>}
                          </div>
                        )
                      })}
                    </div>

                    {/* Search box input */}
                    <div className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800/85 p-5 md:p-6 shadow-sm transition duration-300">
                      <form onSubmit={handleQuerySubmit} className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-4 top-4 text-cyan-500 animate-pulse" size={20} />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ask anything about ocean data..."
                            className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs md:text-sm rounded-xl pl-12 pr-32 py-3.5 text-navy-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-400 hover:to-ocean-500 text-navy-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1"
                          >
                            <span>Ask FloatChat</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>

                        {/* Suggested query cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                          {[
                            { label: "🌡 Temperature", query: "Show temperature variation from 0 to 500 meters in the Arabian Sea.", value: "Arabian Sea warming profile" },
                            { label: "🧂 Salinity", query: "Compare salinity between Arabian Sea and Bay of Bengal.", value: "Comparative salt profiles" },
                            { label: "🌊 Depth Profile", query: "Show temperature from surface to 1000 meters.", value: "Deep vertical columns" },
                            { label: "📍 Float Locations", query: "Where are ARGO floats located in the Indian Ocean?", value: "Spatial coordinate index" }
                          ].map((card, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => handleSuggestionClick(card.query)}
                              className="bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 p-3 rounded-xl text-left transition duration-150 group"
                            >
                              <h5 className="font-bold text-[10px] text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{card.label}</h5>
                              <p className="text-[11px] text-navy-600 dark:text-slate-300 mt-1 font-semibold leading-snug group-hover:text-cyan-500 transition">“{card.query}”</p>
                              <span className="text-[9px] text-navy-400 block mt-2">{card.value}</span>
                            </button>
                          ))}
                        </div>
                      </form>
                    </div>

                    {/* Standard 4 KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Active Floats", value: "3,812", change: "ARGO global array", icon: Globe, color: "text-cyan-500", bg: "bg-cyan-500/10" },
                        { label: "Profiles Analyzed", value: "11.2M+", change: "Decadal registry", icon: Database, color: "text-purple-500", bg: "bg-purple-500/10" },
                        { label: "Regions Monitored", value: "12", change: "Local basin grid", icon: Sliders, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Anomalies Detected", value: "1", change: "Arabian Sea moderate", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" }
                      ].map((card, idx) => {
                        const Icon = card.icon
                        return (
                          <div key={idx} className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-4 rounded-xl shadow-sm flex items-center gap-4 transition duration-300">
                            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                              <Icon size={20} className={card.color} />
                            </div>
                            <div>
                              <p className="text-[10px] text-navy-400 dark:text-navy-500 font-bold uppercase tracking-wider">{card.label}</p>
                              <h3 className="text-base font-black text-navy-900 dark:text-white mt-0.5">{card.value}</h3>
                              <p className="text-[10px] text-navy-500 font-medium">{card.change}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Bottom Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-7 transition duration-300 space-y-4">
                        <div>
                          <h3 className="font-bold text-navy-900 dark:text-slate-100 text-xs uppercase tracking-wider">Latest relevant ARGO observations</h3>
                          <p className="text-[11px] text-navy-450">Recent profile telemetry log indices</p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="border-b border-navy-100 dark:border-navy-800 text-navy-400 font-bold uppercase text-[9px] tracking-wider pb-2">
                                <th className="py-2">Float ID</th>
                                <th>Coordinates</th>
                                <th>Depth</th>
                                <th>Temp (°C)</th>
                                <th>Baseline</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-50 dark:divide-navy-800/40 text-navy-600 dark:text-navy-300">
                              {argoService.getFloatObservations('Arabian Sea', 'temperature').slice(0, 4).map((float) => (
                                <tr key={float.id} className="hover:bg-navy-50 dark:hover:bg-navy-800/20 transition duration-150">
                                  <td className="py-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{float.id}</td>
                                  <td>{float.lat}°N, {float.lng}°E</td>
                                  <td>{float.depth}m</td>
                                  <td className="font-semibold">{float.temp}°C</td>
                                  <td className="text-navy-400">{float.baseline}°C</td>
                                  <td>
                                    {float.isAnomaly ? (
                                      <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded">Anomaly</span>
                                    ) : (
                                      <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">Nominal</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-5 transition duration-300 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-navy-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-2">
                            <Globe size={14} className="text-cyan-500" />
                            Arabian Sea map
                          </h3>
                          <p className="text-[11px] text-navy-450">Active float registry positions</p>
                        </div>
                        <div className="h-40 bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl my-3 relative overflow-hidden flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="50 40 250 160">
                            <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="3,3" />
                            <line x1="0" y1="140" x2="400" y2="140" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="3,3" />
                            <path d="M 230 40 L 230 80 Q 235 110 260 130 Q 275 145 285 170 L 290 180" fill="none" stroke="currentColor" className="text-navy-400 dark:text-navy-600" strokeWidth="1.5" />
                            <ellipse cx="295" cy="190" rx="6" ry="9" fill="currentColor" className="text-navy-100 dark:text-navy-950" stroke="currentColor" strokeWidth="1" />
                            {argoService.getFloatObservations('Arabian Sea', 'temperature').map((float, idx) => (
                              <circle
                                key={idx}
                                cx={100 + (float.lng - 60) * 10}
                                cy={180 - (float.lat - 10) * 10}
                                r={float.lat === 18.42 || float.lat === 15.45 ? "3" : "2"}
                                fill={float.lat === 18.42 || float.lat === 15.45 ? "#f97316" : "#06b6d4"}
                              />
                            ))}
                          </svg>
                        </div>
                        <button 
                          onClick={() => setDemoStep(5)}
                          className="w-full bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-[10px] py-2 rounded-lg font-bold text-navy-800 dark:text-cyan-400 transition"
                        >
                          Open Spatial Explorer
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* ----------------- STEP 3: UNDERSTANDING QUERY TRANSITION ----------------- */}
                {demoStep === 3 && (
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-md space-y-6 animate-fadeIn transition-colors duration-300">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto text-cyan-500 animate-spin">
                        <RefreshCw size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 dark:text-slate-100">Understanding your query…</h3>
                      <p className="text-xs text-navy-450">FloatChat AI is parsing unstructured terms into telemetry parameters</p>
                    </div>

                    <div className="w-full bg-navy-50 dark:bg-navy-950 h-2 rounded-full overflow-hidden border border-navy-100 dark:border-navy-805">
                      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-100" style={{ width: `${parserProgress}%` }}></div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {parserChecklist.map((step, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs md:text-sm">
                          <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              step.status === 'done' 
                                ? 'bg-emerald-500/20 text-emerald-500' 
                                : step.status === 'processing' 
                                  ? 'bg-cyan-500/20 text-cyan-500 animate-pulse' 
                                  : 'bg-navy-100 dark:bg-navy-800 text-navy-300'
                            }`}>
                              {step.status === 'done' ? '✓' : '•'}
                            </span>
                            <span className={step.status === 'done' ? 'text-navy-850 dark:text-slate-200 font-semibold' : 'text-navy-400'}>
                              {step.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-navy-400 uppercase font-mono">{step.status === 'done' ? 'Ready' : step.status === 'processing' ? 'Parsing' : 'Waiting'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ----------------- STEP 4: AI QUERY UNDERSTANDING CARD ----------------- */}
                {demoStep === 4 && (
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-md space-y-6 animate-fadeIn transition-colors duration-300">
                    <div className="flex items-center gap-3 border-b border-navy-100 dark:border-navy-800 pb-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-sm">
                        <Activity size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-navy-900 dark:text-white">AI Query Understanding</h3>
                        <p className="text-[10px] text-navy-400">Structured parameters extracted from researcher input</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {[
                        { label: "Region", val: "Arabian Sea" },
                        { label: "Variable", val: "Temperature" },
                        { label: "Depth", val: "0–500 m" },
                        { label: "Time Period", val: "January 2025" },
                        { label: "Analysis", val: "Depth Profile" }
                      ].map((field, idx) => (
                        <div key={idx} className="bg-navy-50 dark:bg-navy-950 p-3 rounded-lg border border-navy-100 dark:border-navy-800/80">
                          <p className="text-[9px] text-navy-400 uppercase font-bold tracking-wider">{field.label}</p>
                          <p className="font-extrabold text-navy-850 dark:text-slate-200 mt-1">{field.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chips section */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-[10px] text-navy-400 font-bold uppercase tracking-widest mr-1">Chips:</span>
                      {["Arabian Sea", "Temperature", "0–500 m", "Jan 2025"].map((chip, idx) => (
                        <span key={idx} className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-cyan-500/20 uppercase tracking-wider">
                          {chip}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setDemoStep(5)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold py-3 rounded-xl shadow transition duration-200 flex items-center justify-center gap-2"
                    >
                      <span>Analyze ARGO Data</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* ----------------- STEP 5 & 6: MAIN ANALYSIS DASHBOARD & COMPARISON ----------------- */}
                {(demoStep === 5 || demoStep === 6) && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Header Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-navy-900 dark:text-white">
                          {demoStep === 6 ? "Arabian Sea vs Bay of Bengal" : "ARGO Ocean Analysis"}
                        </h2>
                        <p className="text-xs text-navy-400">
                          {demoStep === 6 ? "Comparative vertical profiles across local basins" : "Temperature profile across selected ARGO observations"}
                        </p>
                      </div>

                      {/* Active Filters */}
                      <div className="flex flex-wrap items-center gap-2">
                        {["Arabian Sea", activeParameter === 'temperature' ? 'Temperature' : 'Salinity', "0–500 m", "January 2025"].map((chip, idx) => (
                          <span key={idx} className="bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* MAIN SPLIT: Map & Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Scientific Map */}
                      <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-6 flex flex-col justify-between transition duration-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-extrabold text-xs text-navy-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                              <Globe size={14} className="text-cyan-500" />
                              Geospatial Observation Registry
                            </h4>
                            <p className="text-[10px] text-navy-400 font-medium">Select float node to display vertical columns</p>
                          </div>
                          
                          {/* Map Controls */}
                          <div className="flex items-center gap-1 bg-navy-50 dark:bg-navy-950 p-1 rounded-lg border border-navy-100 dark:border-navy-800 text-[10px]">
                            <button className="px-1.5 py-0.5 font-bold hover:bg-navy-200 rounded">Zoom +</button>
                            <button className="px-1.5 py-0.5 font-bold hover:bg-navy-200 rounded">Zoom –</button>
                            <button className="px-1.5 py-0.5 font-bold hover:bg-navy-200 rounded">Reset</button>
                          </div>
                        </div>

                        {/* Interactive SVG Geospatial Map */}
                        <div className="h-64 bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl my-4 relative overflow-hidden flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="20 40 280 160" className="p-1">
                            {/* Map grid lines */}
                            <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="3,3" />
                            <line x1="0" y1="140" x2="400" y2="140" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="3,3" />
                            <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="3,3" />

                            {/* Indian Coastline & Sri Lanka */}
                            <path 
                              d="M 180 40 L 195 80 L 225 110 L 245 150 L 260 170 L 285 220 L 290 230" 
                              fill="none" 
                              stroke="currentColor" 
                              className="text-navy-450 dark:text-navy-600"
                              strokeWidth="1.5" 
                            />
                            <ellipse cx="295" cy="240" rx="4" ry="7" fill="currentColor" className="text-navy-100 dark:text-navy-950" stroke="currentColor" strokeWidth="0.8" />

                            {/* Arabian Sea & Bay of Bengal highlighting */}
                            <circle cx="130" cy="120" r="30" fill={demoStep === 6 ? "rgba(6, 182, 212, 0.04)" : "rgba(249, 115, 22, 0.08)"} stroke={demoStep === 6 ? "rgba(6, 182, 212, 0.15)" : "rgba(249, 115, 22, 0.3)"} strokeDasharray="2,2" strokeWidth="0.8" />
                            <text x="130" y="105" textAnchor="middle" fill="currentColor" className="text-navy-400 dark:text-navy-500 font-bold" fontSize="7" opacity="0.6">Arabian Sea</text>

                            {demoStep === 6 && (
                              <>
                                <circle cx="230" cy="130" r="30" fill="rgba(249, 115, 22, 0.08)" stroke="rgba(249, 115, 22, 0.3)" strokeDasharray="2,2" strokeWidth="0.8" />
                                <text x="235" y="115" textAnchor="middle" fill="currentColor" className="text-navy-400 dark:text-navy-500 font-bold" fontSize="7" opacity="0.6">Bay of Bengal</text>
                              </>
                            )}

                            {/* Float markers */}
                            {activeFloats.map((float, idx) => {
                              // map coords
                              const px = 80 + (float.lng - 60) * 8
                              const py = 250 - (float.lat - 10) * 10
                              const isSel = selectedFloat && selectedFloat.id === float.id
                              return (
                                <circle 
                                  key={idx}
                                  cx={px}
                                  cy={py}
                                  r={float.isAnomaly ? "3.5" : "2.5"}
                                  fill={float.isAnomaly ? "#f97316" : "#06b6d4"}
                                  stroke={isSel ? "#ffffff" : "transparent"}
                                  strokeWidth="1"
                                  className="cursor-pointer hover:scale-125 transition"
                                  onClick={() => {
                                    setSelectedFloat(float)
                                    setShowFloatPopup(true)
                                  }}
                                />
                              )
                            })}
                          </svg>

                          {/* Float details card inside map */}
                          {showFloatPopup && selectedFloat && (
                            <div className="absolute bottom-2 left-2 right-2 bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-2.5 rounded-xl shadow-lg text-[10px] flex justify-between items-center animate-scaleUp">
                              <div>
                                <h5 className="font-extrabold text-navy-850 dark:text-slate-100">Float: {selectedFloat.id}</h5>
                                <p className="text-navy-450">{selectedFloat.lat.toFixed(2)}°N, {selectedFloat.lng.toFixed(2)}°E | Jan 2025</p>
                                <p className="text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-extrabold mt-1 uppercase w-max tracking-wider">SIMULATED DATA</p>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-cyan-500 text-xs">Depth: {selectedFloat.depth}m</p>
                                <p className="font-bold text-orange-500">{activeParameter === 'temperature' ? `${selectedFloat.temp}°C` : `${selectedFloat.salinity} PSU`}</p>
                              </div>
                              <button onClick={() => setShowFloatPopup(false)} className="text-navy-400 hover:text-navy-600"><X size={14} /></button>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-navy-400">
                          <span>Map Options: Parameter, Depth, Date</span>
                          <span className="font-bold text-cyan-500">Live coordinates model</span>
                        </div>
                      </div>

                      {/* Right: Scientific Graph */}
                      <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-6 flex flex-col justify-between transition duration-300">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-extrabold text-xs text-navy-900 dark:text-slate-100 uppercase tracking-wider">
                              {activeParameter === 'temperature' ? "Temperature vs Depth" : "Salinity vs Depth"}
                            </h4>
                            <p className="text-[10px] text-navy-400">X-axis: Depth (m) [0 → 500 m] | Y-axis: {activeParameter === 'temperature' ? "Temp (°C)" : "Salinity (PSU)"}</p>
                          </div>

                          {/* Tabs (Depth Profile, Time Series, Spatial Distribution) */}
                          <div className="flex gap-1 bg-navy-50 dark:bg-navy-950 p-0.5 rounded border border-navy-100 dark:border-navy-800 text-[10px]">
                            {["Depth Profile", "Time Series", "Spatial Distribution"].map(tab => (
                              <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-2 py-1 rounded transition font-bold ${
                                  activeTab === tab ? "bg-cyan-500 text-navy-950" : "text-navy-400"
                                }`}
                              >
                                {tab.replace(" Distribution", "")}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Parameter Toggle (Temperature | Salinity) */}
                        <div className="flex gap-2 justify-end my-2">
                          <button
                            onClick={() => setActiveParameter('temperature')}
                            className={`text-[10px] font-extrabold px-3 py-1 rounded-full border transition ${
                              activeParameter === 'temperature' 
                                ? "bg-cyan-500 text-navy-950 border-cyan-500" 
                                : "border-navy-200 dark:border-navy-800 text-navy-400"
                            }`}
                          >
                            Temperature
                          </button>
                          <button
                            onClick={() => setActiveParameter('salinity')}
                            className={`text-[10px] font-extrabold px-3 py-1 rounded-full border transition ${
                              activeParameter === 'salinity' 
                                ? "bg-cyan-500 text-navy-950 border-cyan-500" 
                                : "border-navy-200 dark:border-navy-800 text-navy-400"
                            }`}
                          >
                            Salinity
                          </button>
                        </div>

                        {/* Depth curve SVG graph */}
                        <div className="h-56 bg-navy-50/50 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-800/80 rounded-xl my-2 relative overflow-hidden flex items-center justify-center p-2">
                          {activeTab === 'Depth Profile' ? (
                            <svg width="100%" height="100%" viewBox="0 0 250 140" className="p-1">
                              {/* Grid lines */}
                              <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                              <line x1="30" y1="60" x2="230" y2="60" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                              <line x1="30" y1="100" x2="230" y2="100" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                              <line x1="30" y1="120" x2="230" y2="120" stroke="currentColor" className="text-navy-300 dark:text-navy-700" strokeWidth="0.5" />

                              {/* Highlight anomaly area inside 300m - 500m (maps to X=150 to X=230) */}
                              {highlightAnomalyOnGraph && (
                                <path 
                                  d="M 150 78 L 230 110 L 230 120 L 150 120 Z" 
                                  fill="rgba(249, 115, 22, 0.15)" 
                                  className="animate-pulse"
                                />
                              )}

                              {/* Baseline curve (decreases with depth, maps from X=30 to X=230) */}
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

                              {/* X Axis labels (Depth 0 - 500m) */}
                              <text x="30" y="132" textAnchor="middle" fill="currentColor" className="text-navy-450 dark:text-navy-500" fontSize="6">0m</text>
                              <text x="110" y="132" textAnchor="middle" fill="currentColor" className="text-navy-450 dark:text-navy-500" fontSize="6">200m</text>
                              <text x="230" y="132" textAnchor="middle" fill="currentColor" className="text-navy-450 dark:text-navy-500" fontSize="6">500m</text>

                              {/* Y Axis labels (Temperature/Salinity) */}
                              {activeParameter === 'temperature' ? (
                                <>
                                  <text x="25" y="32" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">28°C</text>
                                  <text x="25" y="72" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">22°C</text>
                                  <text x="25" y="112" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">16°C</text>
                                </>
                              ) : (
                                <>
                                  <text x="25" y="32" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">36.2</text>
                                  <text x="25" y="72" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">35.9</text>
                                  <text x="25" y="112" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">35.6</text>
                                </>
                              )}
                            </svg>
                          ) : (
                            // Simple mock for other tabs
                            <div className="text-center space-y-1 text-xs text-navy-400 p-8">
                              <LineChart className="mx-auto text-navy-300" size={24} />
                              <p>{activeTab} timeline visualization rendering</p>
                              <p className="text-[9px] bg-navy-100 dark:bg-navy-800 px-2 py-0.5 rounded font-mono w-max mx-auto">SIMULATED DATA</p>
                            </div>
                          )}
                        </div>

                        {/* Legends */}
                        <div className="flex justify-between items-center text-[9px] text-navy-400">
                          <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-cyan-500 border-dashed border-t"></span>Baseline climatology</span>
                          <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-orange-500"></span>Current observations</span>
                        </div>
                      </div>

                    </div>

                    {/* HERO ELEMENT: AI SCIENTIFIC INSIGHT CARD */}
                    <div className="bg-gradient-to-br from-navy-900 to-purple-950 border border-purple-500/20 text-white rounded-2xl p-6 shadow-glow-navy space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                            <span>🤖 AI Scientific Insight</span>
                          </h3>
                          <p className="text-xs md:text-sm font-semibold text-slate-100 leading-relaxed pt-1">
                            {aiInsight.main}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => setExplainSimply(!explainSimply)}
                          className="bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-white/10 shrink-0 transition"
                        >
                          {explainSimply ? "View Scientific reasoning" : "Explain in simpler terms"}
                        </button>
                      </div>

                      {/* Key Findings Checklist */}
                      <div className="border-t border-white/15 pt-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2">Key Findings:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                          {aiInsight.findings.map((f, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-0.5">✓</span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom row: Data Summary & Conversational Follow-up */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Data Summary */}
                      <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-4 flex flex-col justify-between transition duration-300">
                        <h4 className="font-extrabold text-xs text-navy-900 dark:text-slate-100 uppercase tracking-wider">
                          Data Summary
                        </h4>
                        
                        <div className="space-y-2 text-xs py-3 border-t border-b border-navy-50 dark:border-navy-850 my-2">
                          <div className="flex justify-between items-center py-1">
                            <span className="text-navy-400">Profiles analyzed:</span>
                            <span className="font-extrabold font-mono text-navy-850 dark:text-slate-200">128 profiles</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-navy-400">Depth range:</span>
                            <span className="font-extrabold font-mono text-navy-850 dark:text-slate-200">0 – 500 m</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-navy-400">Region Basin:</span>
                            <span className="font-extrabold text-navy-850 dark:text-slate-200">Arabian Sea</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-navy-400">Obs. Period:</span>
                            <span className="font-extrabold font-mono text-navy-850 dark:text-slate-200">January 2025</span>
                          </div>
                        </div>

                        <button
                          onClick={() => { setAlertModalOpen(true); setAlertCreatedSuccess(false); }}
                          className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-2 rounded-lg shadow-sm transition"
                        >
                          + Create Alert Monitor
                        </button>
                      </div>

                      {/* Right: Follow-up Chat Box */}
                      <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-8 flex flex-col justify-between transition duration-300 space-y-4">
                        <h4 className="font-extrabold text-xs text-navy-900 dark:text-slate-100 uppercase tracking-wider">
                          Follow-up Query (Conversational Context)
                        </h4>

                        {/* Conversational bubble log */}
                        <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                          {conversations.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              {msg.sender === 'ai' && (
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                  FC
                                </div>
                              )}
                              <div className={`p-2.5 rounded-xl text-xs max-w-lg leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-cyan-500 text-navy-950 font-semibold rounded-tr-sm'
                                  : 'bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850 text-navy-800 dark:text-slate-350 rounded-tl-sm'
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Chat input */}
                        <form onSubmit={handleFollowupSubmit} className="relative pt-1.5">
                          <input
                            type="text"
                            value={followupInput}
                            onChange={(e) => setFollowupInput(e.target.value)}
                            placeholder="Ask a follow-up question (e.g. 'Compare this with the Bay of Bengal')..."
                            className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs rounded-xl pl-4 pr-24 py-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-navy-900 dark:text-white"
                          />
                          <button
                            type="submit"
                            className="absolute right-1.5 top-3.5 bg-navy-150 hover:bg-navy-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-800 dark:text-cyan-400 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition"
                          >
                            Send
                          </button>
                        </form>

                        {/* Suggestions */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => triggerFollowup("Compare this with the Bay of Bengal.")}
                            className="bg-navy-50 dark:bg-navy-950 hover:bg-navy-100 text-[9px] px-2.5 py-1 rounded border border-navy-100 dark:border-navy-850 font-medium text-navy-600 dark:text-cyan-500"
                          >
                            Compare with Bay of Bengal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setDemoStep(1);
                              setConversations([
                                { sender: 'user', text: 'Show temperature variation from 0 to 500 meters in the Arabian Sea during January 2025.' },
                                { sender: 'ai', text: 'I found the relevant ARGO observations. Here is the vertical depth profile and spatial distribution.' }
                              ]);
                            }}
                            className="ml-auto text-[9px] text-navy-450 hover:text-cyan-500 underline font-semibold"
                          >
                            New Chat / Ask another question
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ---------------- ALERT CREATION MODAL ---------------- */}
            {alertModalOpen && (
              <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800 shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
                  
                  <button 
                    onClick={() => setAlertModalOpen(false)}
                    className="absolute top-4 right-4 text-navy-400 hover:text-navy-600 dark:hover:text-slate-200"
                  >
                    <X size={18} />
                  </button>

                  <div className="mb-5 space-y-1">
                    <h3 className="text-lg font-black text-navy-900 dark:text-slate-100">
                      Create Ocean Alert
                    </h3>
                    <p className="text-xs text-navy-400 font-medium">Monitor real-time simulated ARGO float telemetry</p>
                  </div>

                  {alertCreatedSuccess ? (
                    <div className="text-center py-8 space-y-3 animate-scaleUp">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 size={32} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-navy-900 dark:text-slate-100 text-sm">✓ Alert created</h4>
                        <p className="text-[11px] text-navy-400">
                          FloatChat will monitor new ARGO observations and notify you when this condition is detected.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Region</label>
                        <select disabled className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 opacity-80">
                          <option>Arabian Sea</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Parameter</label>
                        <select disabled className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 opacity-80">
                          <option>Temperature</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Depth range</label>
                        <select disabled className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 opacity-80">
                          <option>0–500m</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Trigger condition</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="Anomaly > +1.0°C"
                          className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 text-navy-700 dark:text-slate-350"
                        />
                      </div>

                      <button
                        onClick={handleCreateAlert}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-3 rounded-lg shadow transition"
                      >
                        Create Alert
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <footer className="mt-auto border-t border-navy-100 dark:border-navy-800/80 p-5 bg-white dark:bg-navy-900 text-center text-xs text-navy-400 transition duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
              <p>© 2026 FloatChat AI. National-Level Hackathon Prototype. All rights reserved.</p>
              <div className="flex items-center gap-4 font-semibold">
                <a href="#about" onClick={(e) => { e.preventDefault(); setCurrentView('about'); }} className="hover:text-cyan-500 transition">How it Works</a>
                <span className="text-navy-300 dark:text-navy-800">|</span>
                <span className="text-emerald-500 font-medium">Live Simulation Engine</span>
              </div>
            </div>
          </footer>

        </main>
      </div>

    </div>
  )
}
