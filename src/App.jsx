import React, { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  AlertTriangle,
  LineChart,
  Compass,
  TrendingUp,
  Bell,
  Settings,
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
  ChevronLeft,
  X,
  Moon,
  Sun,
  Layers,
  Thermometer,
  Droplet,
  Compass as Wind,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  MapPin,
  ChevronDown
} from 'lucide-react'

// Realistic Mock Data for FloatChat
const activeFloatsList = [
  { id: 'Demo-290001', lat: 18.42, lng: 67.81, temp: 24.8, baseline: 23.6, salinity: 35.8, salinityBaseline: 36.2, depth: 420, isAnomaly: true },
  { id: 'Demo-290002', lat: 14.15, lng: 70.32, temp: 26.1, baseline: 26.0, salinity: 36.1, salinityBaseline: 36.1, depth: 380, isAnomaly: false },
  { id: 'Demo-290003', lat: 19.50, lng: 64.20, temp: 23.5, baseline: 23.4, salinity: 35.9, salinityBaseline: 35.9, depth: 450, isAnomaly: false },
  { id: 'Demo-290004', lat: 21.10, lng: 68.90, temp: 25.2, baseline: 25.0, salinity: 36.0, salinityBaseline: 36.0, depth: 320, isAnomaly: false },
  { id: 'Demo-290005', lat: 16.80, lng: 62.50, temp: 24.1, baseline: 24.0, salinity: 35.7, salinityBaseline: 35.8, depth: 410, isAnomaly: false },
  { id: 'Demo-290006', lat: 12.20, lng: 65.10, temp: 25.9, baseline: 25.8, salinity: 36.0, salinityBaseline: 36.0, depth: 350, isAnomaly: false },
  { id: 'Demo-290007', lat: 15.45, lng: 68.12, temp: 24.9, baseline: 23.7, salinity: 35.6, salinityBaseline: 36.1, depth: 430, isAnomaly: true }, // Anomaly 2
  // Bay of Bengal Floats
  { id: 'Demo-290101', lat: 17.50, lng: 88.20, temp: 27.2, baseline: 26.9, salinity: 33.1, salinityBaseline: 33.2, depth: 400, isAnomaly: false },
  { id: 'Demo-290102', lat: 15.10, lng: 85.40, temp: 26.8, baseline: 26.6, salinity: 33.4, salinityBaseline: 33.3, depth: 420, isAnomaly: false },
  { id: 'Demo-290103', lat: 19.20, lng: 89.90, temp: 25.9, baseline: 25.8, salinity: 32.8, salinityBaseline: 32.9, depth: 440, isAnomaly: false },
  { id: 'Demo-290104', lat: 12.30, lng: 82.10, temp: 27.5, baseline: 27.4, salinity: 33.8, salinityBaseline: 33.7, depth: 390, isAnomaly: false },
]

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, explorer, anomalies, predictions, insights, alerts
  
  // Guided Hackathon Tour state (1 to 11)
  const [walkthroughStep, setWalkthroughStep] = useState(1)
  
  // Anomaly parameters details
  const [activeParameter, setActiveParameter] = useState('temperature') // temperature, salinity
  const [selectedFloat, setSelectedFloat] = useState(activeFloatsList[0])
  const [showFloatPopup, setShowFloatPopup] = useState(true)
  
  // Map interactive states
  const [mapZoom, setMapZoom] = useState(1)
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 })
  const [hoveredFloat, setHoveredFloat] = useState(null)
  
  // Explanation Toggle
  const [explainSimply, setExplainSimply] = useState(false)
  const [highlightAnomalyOnGraph, setHighlightAnomalyOnGraph] = useState(true)
  
  // Alert builder modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [alertCreatedSuccess, setAlertCreatedSuccess] = useState(false)
  const [customAlerts, setCustomAlerts] = useState([
    {
      id: 1,
      parameter: 'Salinity',
      region: 'Arabian Sea',
      depth: '0-200m',
      condition: 'Anomaly < -0.4 PSU',
      frequency: 'Every new observation',
      status: 'Monitoring',
      created: 'Aug 15, 2026'
    }
  ])
  
  // Conversation Input & States
  const [chatInput, setChatInput] = useState('')
  const [chatConversation, setChatConversation] = useState([
    {
      sender: 'user',
      text: 'Is there anything unusual happening in the Arabian Sea right now?'
    }
  ])
  const [followupResponseActive, setFollowupResponseActive] = useState(false)
  const [followupQueryType, setFollowupQueryType] = useState('') // 'comparison' or 'salinity'
  
  // Processing Animation state (State 2)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingSteps, setProcessingSteps] = useState([
    { name: 'Understanding question', status: 'pending' },
    { name: 'Identifying region: Arabian Sea', status: 'pending' },
    { name: 'Finding relevant ARGO profiles', status: 'pending' },
    { name: 'Comparing historical baseline', status: 'pending' },
    { name: 'Detecting anomalies', status: 'pending' },
    { name: 'Preparing scientific explanation', status: 'pending' }
  ])

  // Synchronize tabs with walkthrough steps
  useEffect(() => {
    if (walkthroughStep === 1) {
      setActiveTab('dashboard')
    } else if (walkthroughStep === 2) {
      setActiveTab('dashboard')
      // Trigger processing progress
      setProcessingProgress(0)
      setProcessingSteps(steps => steps.map(s => ({ ...s, status: 'pending' })))
    } else if (walkthroughStep === 3) {
      setActiveTab('anomalies')
    } else if (walkthroughStep === 4) {
      setActiveTab('explorer')
      setShowFloatPopup(true)
    } else if (walkthroughStep === 5) {
      setActiveTab('visualizations')
    } else if (walkthroughStep === 6) {
      setActiveTab('insights')
    } else if (walkthroughStep === 7) {
      setActiveTab('predictions')
    } else if (walkthroughStep === 8) {
      setActiveTab('insights') // Marine impact is inside insights / explanation flow
    } else if (walkthroughStep === 9) {
      setActiveTab('alerts')
      setAlertModalOpen(true)
    } else if (walkthroughStep === 10) {
      setActiveTab('alerts')
      setAlertModalOpen(false)
    } else if (walkthroughStep === 11) {
      setActiveTab('dashboard')
    }
  }, [walkthroughStep])

  // Dark mode trigger & localStorage persistence
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Process simulation for State 2
  useEffect(() => {
    if (walkthroughStep === 2) {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          const next = prev + 1
          
          // Update steps statuses based on progress percentage
          setProcessingSteps(currentSteps => {
            return currentSteps.map((step, idx) => {
              const triggerPercent = (idx + 1) * 16.6
              if (next >= triggerPercent) {
                return { ...step, status: 'done' }
              } else if (next >= triggerPercent - 8) {
                return { ...step, status: 'processing' }
              }
              return step
            })
          })

          if (next >= 100) {
            clearInterval(interval)
            // Auto transition to findings if not paused
            return 100
          }
          return next
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [walkthroughStep])

  // Handle Quick Suggestions
  const handleQuerySuggestion = (query) => {
    setChatInput(query)
    if (query.includes('Arabian Sea') || query.includes('unusual')) {
      setWalkthroughStep(2)
    } else if (query.includes('Compare') || query.includes('Bengal')) {
      // Direct comparison
      setWalkthroughStep(11)
      setFollowupQueryType('comparison')
      setFollowupResponseActive(true)
    } else if (query.includes('salinity')) {
      setActiveParameter('salinity')
      setWalkthroughStep(5)
    } else if (query.includes('Predict')) {
      setWalkthroughStep(7)
    }
  }

  // Handle Chat Submit
  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    
    const newMsg = { sender: 'user', text: chatInput }
    setChatConversation(prev => [...prev, newMsg])
    const query = chatInput.toLowerCase()
    setChatInput('')

    if (query.includes('arabian sea') && (query.includes('unusual') || query.includes('anomaly'))) {
      setWalkthroughStep(2)
    } else if (query.includes('compare') || query.includes('bengal') || query.includes('bay of bengal')) {
      setFollowupQueryType('comparison')
      setFollowupResponseActive(true)
      setWalkthroughStep(11)
    } else if (query.includes('salinity')) {
      setActiveParameter('salinity')
      setWalkthroughStep(5)
    } else if (query.includes('predict') || query.includes('next') || query.includes('future')) {
      setWalkthroughStep(7)
    } else {
      // Default to comparison screen for demo follow-up
      setFollowupQueryType('comparison')
      setFollowupResponseActive(true)
      setWalkthroughStep(11)
    }
  }

  // Create alert callback
  const triggerCreateAlert = () => {
    setAlertCreatedSuccess(true)
    setTimeout(() => {
      // Add custom alert
      const newAlert = {
        id: customAlerts.length + 2,
        parameter: activeParameter === 'temperature' ? 'Temperature' : 'Salinity',
        region: 'Arabian Sea',
        depth: '300-500m',
        condition: activeParameter === 'temperature' ? 'Anomaly > 1.0 °C' : 'Anomaly < -0.3 PSU',
        frequency: 'Every new observation',
        status: 'Monitoring',
        created: 'Today'
      }
      setCustomAlerts(prev => [newAlert, ...prev])
      setAlertCreatedSuccess(false)
      setWalkthroughStep(10)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900 dark:bg-navy-950 dark:text-navy-100 flex flex-col font-sans transition-colors duration-300">
      


      {/* ----------------- JOURNEY PROGRESS TRACKER ----------------- */}
      <div className="bg-white dark:bg-navy-900 border-b border-navy-100 dark:border-navy-800/80 p-2.5 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 py-1 text-xs md:text-sm scrollbar-none">
          {[
            { label: 'ASK', step: 1 },
            { label: 'DISCOVER', step: 2 },
            { label: 'DETECT', step: 3 },
            { label: 'VISUALIZE', step: 4 },
            { label: 'EXPLAIN', step: 6 },
            { label: 'PREDICT', step: 7 },
            { label: 'ACT', step: 9 }
          ].map((item, index) => {
            const isCurrent = walkthroughStep === item.step || 
                              (item.step === 4 && (walkthroughStep === 4 || walkthroughStep === 5)) ||
                              (item.step === 6 && (walkthroughStep === 6 || walkthroughStep === 8)) ||
                              (item.step === 9 && (walkthroughStep === 9 || walkthroughStep === 10));
            const isPassed = walkthroughStep > item.step;
            
            return (
              <React.Fragment key={item.label}>
                <button
                  onClick={() => setWalkthroughStep(item.step)}
                  className={`flex items-center gap-2 font-semibold tracking-wide uppercase transition-all duration-200 focus:outline-none ${
                    isCurrent 
                      ? 'text-cyan-500 dark:text-cyan-400 scale-105' 
                      : isPassed 
                        ? 'text-navy-600 dark:text-cyan-600' 
                        : 'text-navy-300 dark:text-navy-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                    isCurrent 
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 dark:border-cyan-400 dark:text-cyan-400' 
                      : isPassed 
                        ? 'border-cyan-600 bg-cyan-600/10 text-cyan-600' 
                        : 'border-navy-300 dark:border-navy-700 text-navy-400 dark:text-navy-600'
                  }`}>
                    {isPassed ? '✓' : index + 1}
                  </span>
                  <span>{item.label}</span>
                </button>
                {index < 6 && (
                  <ChevronRight size={14} className="text-navy-200 dark:text-navy-800 shrink-0" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* ----------------- CORE WORKSPACE LAYOUT ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white dark:bg-navy-900 border-r border-navy-100 dark:border-navy-800/80 hidden md:flex flex-col justify-between shrink-0 p-4 transition-colors duration-300">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
                <Globe size={18} className="animate-spin-slow" />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-navy-900 dark:text-slate-100 flex items-center gap-1.5">
                  FloatChat
                </h1>
                <p className="text-[10px] text-navy-400 dark:text-navy-500 font-semibold tracking-wider uppercase">
                  ARGO AI Discovery
                </p>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest px-2.5">
                Research Desk
              </span>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: MessageSquare, step: 1 },
                { id: 'explorer', label: 'Ocean Explorer', icon: Compass, step: 4 },
                { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle, step: 3 },
                { id: 'predictions', label: 'Predictions', icon: TrendingUp, step: 7 },
                { id: 'insights', label: 'Insights', icon: Info, step: 6 },
                { id: 'alerts', label: 'Alert Room', icon: Bell, step: 10 }
              ].map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setWalkthroughStep(item.step)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition duration-200 ${
                      isActive 
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-l-2 border-cyan-500' 
                        : 'text-navy-500 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800/40 hover:text-navy-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Data sources status */}
            <div className="space-y-2 pt-4 border-t border-navy-100 dark:border-navy-800/80">
              <span className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest px-2.5">
                Data Feeds
              </span>
              <div className="bg-navy-50 dark:bg-navy-950/50 p-2.5 rounded-lg border border-navy-100 dark:border-navy-800/60 space-y-2 text-xs">
                <div className="flex justify-between items-center text-navy-500 dark:text-navy-400">
                  <span className="flex items-center gap-1.5">
                    <Database size={12} className="text-cyan-500" />
                    ARGO Profiles
                  </span>
                  <span className="font-mono text-navy-700 dark:text-navy-300">11.2M+</span>
                </div>
                <div className="flex justify-between items-center text-navy-500 dark:text-navy-400">
                  <span className="flex items-center gap-1.5">
                    <Activity size={12} className="text-emerald-500 animate-pulse" />
                    Active Floats
                  </span>
                  <span className="font-mono text-navy-700 dark:text-navy-300">3,812</span>
                </div>
                <div className="flex justify-between items-center text-navy-500 dark:text-navy-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-purple-500" />
                    Latest Update
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                    2 hrs ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings & Profile */}
          <div className="space-y-3 pt-4 border-t border-navy-100 dark:border-navy-800/80">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-navy-400 dark:text-navy-500 font-semibold">Theme</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-md hover:bg-navy-100 dark:hover:bg-navy-800 text-navy-500 dark:text-navy-400 transition"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 dark:border-cyan-500/5 p-3 rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-navy-800 dark:text-slate-200">How FloatChat Works</h4>
              <div className="space-y-1.5 text-navy-500 dark:text-navy-400 text-[10px] leading-relaxed">
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">1.</span>
                  <span>Ask natural questions in plain terms.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">2.</span>
                  <span>System queries active global ARGO float observations.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">3.</span>
                  <span>Anomaly detectors trigger matching historical baselines.</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">4.</span>
                  <span>Project patterns forward using predictive physics profiles.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-navy-50/50 dark:bg-navy-950/40 transition-colors duration-300">
          
          {/* TOP NAV BAR */}
          <header className="h-16 border-b border-navy-100 dark:border-navy-800/80 bg-white/75 dark:bg-navy-900/75 backdrop-blur px-6 flex justify-between items-center shrink-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="relative w-72 hidden md:block">
                <Search size={15} className="absolute left-3 top-2.5 text-navy-400" />
                <input
                  type="text"
                  placeholder="Search regions, float IDs, coordinates..."
                  className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:focus:border-cyan-500"
                />
              </div>
              <span className="bg-navy-100 dark:bg-navy-800 text-[10px] text-navy-400 dark:text-navy-500 px-2 py-0.5 rounded font-mono hidden md:inline">
                ⌘ K
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>DEMO MODE · Sample ARGO observations</span>
              </div>
              
              <div className="relative">
                <Bell size={18} className="text-navy-400 dark:text-navy-500 hover:text-navy-700 cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              </div>

              {/* Theme Toggle for small viewports */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1 rounded-md hover:bg-navy-100 dark:hover:bg-navy-800 text-navy-500 dark:text-navy-400 md:hidden transition"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <div className="flex items-center gap-2 border-l border-navy-100 dark:border-navy-800 pl-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  AR
                </div>
                <div className="hidden lg:block text-left">
                  <h4 className="text-xs font-bold text-navy-800 dark:text-slate-200">Dr. Ananya Rao</h4>
                  <p className="text-[10px] text-navy-400 dark:text-navy-500 font-semibold">Ocean Researcher</p>
                </div>
                <ChevronDown size={12} className="text-navy-400" />
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
            
            {/* ---------------------------------------------------- */}
            {/* STATE 1 & 11: HOME DASHBOARD / COMMAND CENTER */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'dashboard' && walkthroughStep !== 2 && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Hero text */}
                <div className="text-center md:text-left py-4 space-y-2">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-navy-900 dark:text-slate-100">
                    Ask the ocean.
                  </h2>
                  <p className="text-navy-500 dark:text-navy-400 text-base md:text-lg max-w-2xl">
                    Discover hidden patterns, understand critical anomalies, and explore physical predictions across 3,800 active profiling floats.
                  </p>
                </div>

                {/* Conversational input card */}
                <div className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800/80 p-5 md:p-6 shadow-glow-navy transition duration-300">
                  <form onSubmit={handleChatSubmit} className="space-y-4">
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-cyan-500" size={20} />
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask anything about ocean conditions (e.g. 'Is there anything unusual happening in the Arabian Sea right now?')..."
                        className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-sm rounded-xl pl-12 pr-28 py-3.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 dark:focus:border-cyan-500 text-navy-900 dark:text-white transition duration-200"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-400 hover:to-ocean-500 text-navy-950 font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition duration-200 flex items-center gap-1.5"
                      >
                        <span>Investigate</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    {/* Quick suggestions */}
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <span className="text-xs text-navy-400 dark:text-navy-500 font-semibold mr-1">Suggested questions:</span>
                      {[
                        "Is there anything unusual happening in the Arabian Sea right now?",
                        "Compare Arabian Sea with Bay of Bengal",
                        "Show salinity anomalies",
                        "Predict temperature changes"
                      ].map((suggestedQuery, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuerySuggestion(suggestedQuery)}
                          className="bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-navy-600 dark:text-cyan-400 text-xs px-3 py-1.5 rounded-lg transition duration-200"
                        >
                          {suggestedQuery.length > 55 ? suggestedQuery.substring(0, 52) + '...' : suggestedQuery}
                        </button>
                      ))}
                    </div>
                  </form>

                  {/* AI Response for Step 11: Conversational context preservation */}
                  {walkthroughStep === 11 && (
                    <div className="mt-6 border-t border-navy-100 dark:border-navy-800 pt-6 space-y-4 animate-fadeIn">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs shrink-0 shadow">
                          FC
                        </div>
                        <div className="space-y-4 flex-1">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-navy-800 dark:text-slate-100">FloatChat AI Response</span>
                              <span className="text-[10px] text-navy-400 dark:text-navy-500 font-medium">Just now</span>
                            </div>
                            <p className="text-xs md:text-sm text-navy-600 dark:text-slate-300 leading-relaxed bg-navy-50 dark:bg-navy-950 p-4 rounded-xl border border-navy-100 dark:border-navy-800">
                              {followupQueryType === 'comparison' ? (
                                <span>
                                  <strong>Arabian Sea vs Bay of Bengal Comparison:</strong> The Arabian Sea currently shows a much stronger positive temperature anomaly (+1.2°C) concentrated at the 300–500m depth range compared to the Bay of Bengal, which exhibits relatively normal temperature conditions (+0.3°C anomaly) at similar depths. However, the Bay of Bengal exhibits a significantly lower surface salinity (33.1 PSU) compared to the Arabian Sea (35.8 PSU) due to heavy river runoff.
                                </span>
                              ) : (
                                <span>
                                  <strong>Salinity Profile Update:</strong> Salinity in the same Arabian Sea region shows a negative salinity anomaly (decrease of ~0.4 PSU) between 300-500m depth compared to the historical baseline, which could suggest injection of lower-salinity intermediate water or changes in ocean circulation patterns.
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Render comparison visualization side-by-side */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 p-4 rounded-xl shadow-sm">
                              <h4 className="text-xs font-bold text-navy-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                                <LineChart size={13} className="text-cyan-500" />
                                {followupQueryType === 'comparison' ? "Temperature Anomaly comparison" : "Salinity vs Depth Profile"}
                              </h4>
                              
                              {/* Comparative Chart */}
                              <div className="h-48 w-full flex items-center justify-center bg-navy-50/50 dark:bg-navy-950/40 rounded-lg relative overflow-hidden">
                                <svg width="100%" height="100%" viewBox="0 0 300 180" className="p-2">
                                  {/* Grid Lines */}
                                  <line x1="40" y1="20" x2="280" y2="20" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                                  <line x1="40" y1="70" x2="280" y2="70" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                                  <line x1="40" y1="120" x2="280" y2="120" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                                  <line x1="40" y1="150" x2="280" y2="150" stroke="#334155" strokeWidth="0.5" />

                                  {followupQueryType === 'comparison' ? (
                                    <>
                                      {/* Bars comparing the two seas */}
                                      {/* Arabian Sea */}
                                      <rect x="70" y="40" width="40" height="110" fill="url(#orangeGrad)" rx="2" />
                                      <text x="90" y="30" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="bold">+1.2°C</text>
                                      
                                      {/* Bay of Bengal */}
                                      <rect x="180" y="120" width="40" height="30" fill="url(#cyanGrad)" rx="2" />
                                      <text x="200" y="110" textAnchor="middle" fill="#0ea5e9" fontSize="10" fontWeight="bold">+0.3°C</text>

                                      <text x="90" y="165" textAnchor="middle" fill="#94a3b8" fontSize="9">Arabian Sea</text>
                                      <text x="200" y="165" textAnchor="middle" fill="#94a3b8" fontSize="9">Bay of Bengal</text>
                                    </>
                                  ) : (
                                    <>
                                      {/* Salinity depth profile */}
                                      <path d="M 120 20 Q 150 70 190 120 T 210 150" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
                                      <path d="M 120 20 Q 140 70 160 120 T 180 150" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                                      {/* Highlight Anomaly */}
                                      <path d="M 140 70 L 165 70" stroke="#ef4444" strokeWidth="1" strokeDasharray="1,1" />
                                      <text x="175" y="73" fill="#ef4444" fontSize="9">-0.4 PSU</text>
                                      
                                      <text x="45" y="145" fill="#94a3b8" fontSize="8" transform="rotate(-90 45 145)">Depth (0-500m)</text>
                                      <text x="160" y="165" textAnchor="middle" fill="#94a3b8" fontSize="8">Salinity (PSU)</text>
                                    </>
                                  )}
                                  
                                  {/* Gradients */}
                                  <defs>
                                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                                    </linearGradient>
                                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-navy-700 dark:text-slate-300 mb-2">Context Preservation Indicators</h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between items-center py-1.5 border-b border-navy-50 dark:border-navy-800">
                                    <span className="text-navy-400">Current Region Context</span>
                                    <span className="font-semibold text-navy-800 dark:text-slate-200">Arabian Sea ➔ Bay of Bengal</span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5 border-b border-navy-50 dark:border-navy-800">
                                    <span className="text-navy-400">Active Depth Filter</span>
                                    <span className="font-semibold text-navy-800 dark:text-slate-200">300 – 500m</span>
                                  </div>
                                  <div className="flex justify-between items-center py-1.5">
                                    <span className="text-navy-400">Parameters Queried</span>
                                    <span className="text-cyan-500 font-semibold uppercase">{activeParameter}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-3">
                                <button
                                  onClick={() => {
                                    setFollowupQueryType(followupQueryType === 'comparison' ? 'salinity' : 'comparison');
                                  }}
                                  className="flex-1 bg-navy-50 dark:bg-navy-800 hover:bg-navy-100 text-xs py-2 rounded-lg font-medium transition text-center"
                                >
                                  {followupQueryType === 'comparison' ? "Toggle to Salinity Profile" : "Toggle to Temperature Comparison"}
                                </button>
                                <button
                                   onClick={() => {
                                     setWalkthroughStep(1);
                                     setChatConversation([{ sender: 'user', text: 'Is there anything unusual happening in the Arabian Sea right now?' }]);
                                   }}
                                   className="border border-navy-200 dark:border-navy-700 text-xs px-3 py-2 rounded-lg hover:bg-navy-50 dark:hover:bg-navy-800 transition"
                                 >
                                   Reset Conversation
                                 </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* KPI Metrics row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Active Floats", value: "3,812", change: "Live coverage", icon: Globe, color: "text-cyan-500", bg: "bg-cyan-500/10" },
                    { label: "Profiles Analyzed", value: "11,284,234", change: "+14,204 today", icon: Database, color: "text-purple-500", bg: "bg-purple-500/10" },
                    { label: "Regions Monitored", value: "12", change: "Global basins", icon: Sliders, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Anomalous Basins", value: "1 Detected", change: "Arabian Sea moderate", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" }
                  ].map((card, idx) => {
                    const Icon = card.icon
                    return (
                      <div key={idx} className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-4 rounded-xl shadow-sm flex items-center gap-4 transition duration-300">
                        <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                          <Icon size={20} className={card.color} />
                        </div>
                        <div>
                          <p className="text-[10px] text-navy-400 dark:text-navy-500 font-bold uppercase tracking-wider">{card.label}</p>
                          <h3 className="text-xl font-bold text-navy-900 dark:text-white mt-0.5">{card.value}</h3>
                          <p className="text-[10px] text-navy-500 font-medium">{card.change}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Dashboard bottom half split: Ocean status & Mini Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Status table */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-7 transition duration-300 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-navy-900 dark:text-slate-100 text-sm uppercase tracking-wider">Latest ARGO observations</h3>
                        <p className="text-xs text-navy-400">Recent profile logs from Indian Ocean quadrant</p>
                      </div>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded">Demo Data</span>
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
                          {activeFloatsList.slice(0, 5).map((float) => (
                            <tr key={float.id} className="hover:bg-navy-50 dark:hover:bg-navy-800/20 transition duration-150">
                              <td className="py-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{float.id}</td>
                              <td>{float.lat}°N, {float.lng}°E</td>
                              <td>{float.depth}m</td>
                              <td className="font-semibold">{float.temp}°C</td>
                              <td className="text-navy-400">{float.baseline}°C</td>
                              <td>
                                {float.isAnomaly ? (
                                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                    +1.2°C Anomaly
                                  </span>
                                ) : (
                                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                    Nominal
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Miniature Ocean map card */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-5 transition duration-300 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Globe size={15} className="text-cyan-500" />
                        Arabian Sea Basin Map
                      </h3>
                      <p className="text-xs text-navy-400">High-resolution spatial model of local observation coordinates</p>
                    </div>

                    {/* Miniature Map SVG */}
                    <div className="h-44 bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl my-3 relative overflow-hidden flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="50 40 250 160">
                        {/* Grids */}
                        <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="0" y1="140" x2="400" y2="140" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="150" y1="0" x2="150" y2="300" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="250" y1="0" x2="250" y2="300" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />

                        {/* Costline path (simplified Indian Coastline) */}
                        <path 
                          d="M 230 40 L 230 80 Q 235 110 260 130 Q 275 145 285 170 L 290 180" 
                          fill="none" 
                          stroke="#64748b" 
                          strokeWidth="1.5" 
                        />
                        {/* Sri Lanka */}
                        <ellipse cx="295" cy="190" rx="6" ry="9" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                        
                        {/* Region Labels */}
                        <text x="130" y="100" fill="#94a3b8" fontSize="8" fontWeight="bold" opacity="0.6">Arabian Sea</text>
                        <text x="225" y="70" fill="#64748b" fontSize="6">INDIA</text>
                        
                        {/* Float markers */}
                        {activeFloatsList.map((float, idx) => {
                          const px = 100 + (float.lng - 60) * 10
                          const py = 180 - (float.lat - 10) * 10
                          return (
                            <circle
                              key={idx}
                              cx={px}
                              cy={py}
                              r={float.isAnomaly ? "3" : "2"}
                              fill={float.isAnomaly ? "#ef4444" : "#06b6d4"}
                              className={float.isAnomaly ? "animate-pulse" : ""}
                            />
                          )
                        })}
                      </svg>
                    </div>

                    <button 
                      onClick={() => setWalkthroughStep(4)}
                      className="w-full bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-xs py-2 rounded-lg font-semibold text-navy-800 dark:text-cyan-400 transition"
                    >
                      Open Full Spatial Explorer
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 2: AI INVESTIGATION / DISCOVER (LOADING STATE) */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'dashboard' && walkthroughStep === 2 && (
              <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-lg space-y-8 animate-fadeIn transition-colors duration-300">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto text-cyan-500 animate-spin">
                    <RefreshCw size={24} />
                  </div>
                  <h3 className="text-xl font-extrabold text-navy-900 dark:text-slate-100">AI Investigation Active</h3>
                  <p className="text-xs text-navy-400">FloatChat is compiling observations for the Arabian Sea basin</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-navy-500">
                    <span>Searching profile registry...</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <div className="w-full bg-navy-50 dark:bg-navy-950 h-2 rounded-full overflow-hidden border border-navy-100 dark:border-navy-800">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-100" 
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Checklist steps */}
                <div className="space-y-3.5 pt-2">
                  {processingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs md:text-sm">
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          step.status === 'done' 
                            ? 'bg-emerald-500/20 text-emerald-500' 
                            : step.status === 'processing' 
                              ? 'bg-cyan-500/20 text-cyan-500 animate-pulse' 
                              : 'bg-navy-100 dark:bg-navy-800 text-navy-300'
                        }`}>
                          {step.status === 'done' ? '✓' : '•'}
                        </span>
                        <span className={
                          step.status === 'done' 
                            ? 'text-navy-800 dark:text-slate-200 font-medium' 
                            : step.status === 'processing' 
                              ? 'text-cyan-500 font-bold' 
                              : 'text-navy-400'
                        }>
                          {step.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-navy-400 uppercase tracking-wider font-semibold font-mono">
                        {step.status === 'done' && 'Completed' || step.status === 'processing' && 'Processing' || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Matched profile counts */}
                <div className="bg-navy-50 dark:bg-navy-950 p-4 rounded-xl border border-navy-100 dark:border-navy-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-navy-400 font-semibold">Region Filter:</span>
                    <span className="text-navy-800 dark:text-slate-200 font-bold">Arabian Sea (10°N-25°N, 60°E-75°E)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-navy-400 font-semibold">Matched Profiles (ARGO):</span>
                    <span className="text-cyan-500 font-bold font-mono">2,418 records matched</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-navy-400 font-semibold">Analyses depth window:</span>
                    <span className="text-navy-800 dark:text-slate-200 font-semibold font-mono">0 – 500 meters</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setWalkthroughStep(3)}
                  disabled={processingProgress < 100}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold py-3 rounded-xl shadow transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>View Findings</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 3: ANOMALY DETECTED CARD */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'anomalies' && (
              <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
                
                {/* Warning Card */}
                <div className="bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/15 dark:via-navy-900 dark:to-navy-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 shadow-lg transition duration-300 space-y-6">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-500">
                      <AlertTriangle size={24} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                        Active Alert Status: Moderate Severity Anomaly
                      </span>
                      <h3 className="text-2xl font-extrabold text-navy-900 dark:text-slate-100">
                        Thermocline Temperature Anomaly Detected
                      </h3>
                      <p className="text-xs text-navy-400">
                        Arabian Sea basin intermediate layer depth range
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-navy-100 dark:border-navy-800/80 pt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-navy-50 dark:bg-navy-950 p-3.5 rounded-xl border border-navy-100 dark:border-navy-800">
                      <p className="text-[10px] text-navy-400 uppercase font-semibold">Temperature Anomaly</p>
                      <h4 className="text-xl font-black text-amber-500 mt-1">+1.2°C</h4>
                      <p className="text-[9px] text-navy-400">At intermediate depth</p>
                    </div>
                    <div className="bg-navy-50 dark:bg-navy-950 p-3.5 rounded-xl border border-navy-100 dark:border-navy-800">
                      <p className="text-[10px] text-navy-400 uppercase font-semibold">Depth Range</p>
                      <h4 className="text-xl font-black text-navy-800 dark:text-slate-100 mt-1">300 – 500m</h4>
                      <p className="text-[9px] text-navy-400">Below surface mixing layer</p>
                    </div>
                    <div className="bg-navy-50 dark:bg-navy-950 p-3.5 rounded-xl border border-navy-100 dark:border-navy-800">
                      <p className="text-[10px] text-navy-400 uppercase font-semibold">Detection Confidence</p>
                      <h4 className="text-xl font-black text-cyan-500 mt-1">87%</h4>
                      <p className="text-[9px] text-navy-400">Compared to historical baseline</p>
                    </div>
                    <div className="bg-navy-50 dark:bg-navy-950 p-3.5 rounded-xl border border-navy-100 dark:border-navy-800">
                      <p className="text-[10px] text-navy-400 uppercase font-semibold">Analysis Baselines</p>
                      <h4 className="text-xl font-black text-purple-500 mt-1">20-yr mean</h4>
                      <p className="text-[9px] text-navy-400">ARGO decadal databases</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl text-xs md:text-sm text-navy-600 dark:text-slate-300 leading-relaxed">
                    <strong>Scientist Note:</strong> Recent observations collected from 2,418 profiling floats indicate that temperature between 300–500m depth is approximately <strong>1.2°C above</strong> the historical baseline for this region. This warming is statistically significant, exceeding 2.5 standard deviations from the seasonal norm.
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={() => setWalkthroughStep(1)}
                      className="border border-navy-200 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800 text-xs px-4 py-2.5 rounded-xl font-semibold transition"
                    >
                      Back to Query
                    </button>
                    <button
                      onClick={() => setWalkthroughStep(4)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <span>See Evidence</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Additional scientific context metadata card */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-xs transition duration-300">
                  <h4 className="font-bold uppercase tracking-wider text-navy-800 dark:text-slate-200">ARGO Profile Anomaly Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400">Monitored Parameter</span>
                        <span className="font-semibold text-navy-800 dark:text-slate-200">Ocean Temperature (T)</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400">Target Region coordinates</span>
                        <span className="font-semibold text-navy-800 dark:text-slate-200">18.42° N, 67.81° E (Arabian Sea)</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400">Historical Comparison dataset</span>
                        <span className="font-semibold text-navy-800 dark:text-slate-200">World Ocean Atlas (WOA) Baselines</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400">Anomaly significance</span>
                        <span className="font-semibold text-amber-500 font-mono">z-score: +2.8 σ</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 4: OCEAN EXPLORER / MAP */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'explorer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Full Map Canvas Card */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 shadow-lg lg:col-span-8 flex flex-col justify-between transition duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-slate-100 text-sm uppercase tracking-wider flex items-center gap-1.5">
                        <Globe size={16} className="text-cyan-500" />
                        ARGO Float Spatial Observations Model
                      </h3>
                      <p className="text-xs text-navy-400">Arabian Sea & Bay of Bengal Basin grid visualization</p>
                    </div>
                    
                    {/* Map Controls */}
                    <div className="flex items-center gap-1.5 bg-navy-50 dark:bg-navy-950 p-1 rounded-lg border border-navy-100 dark:border-navy-800">
                      <button 
                        onClick={() => setMapZoom(prev => Math.min(2.5, prev + 0.2))} 
                        className="w-7 h-7 text-xs font-bold bg-white dark:bg-navy-800 hover:bg-navy-100 rounded border border-navy-100 dark:border-navy-700 transition"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => setMapZoom(prev => Math.max(0.8, prev - 0.2))} 
                        className="w-7 h-7 text-xs font-bold bg-white dark:bg-navy-800 hover:bg-navy-100 rounded border border-navy-100 dark:border-navy-700 transition"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => { setMapZoom(1); setMapCenter({ x: 0, y: 0 }) }} 
                        className="w-12 h-7 text-[10px] bg-white dark:bg-navy-800 hover:bg-navy-100 rounded border border-navy-100 dark:border-navy-700 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Interactive SVG Map */}
                  <div className="h-[400px] bg-navy-900/10 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl relative overflow-hidden flex items-center justify-center cursor-grab">
                    <svg 
                      width="100%" 
                      height="100%" 
                      viewBox="0 0 500 350"
                      style={{
                        transform: `scale(${mapZoom}) translate(${mapCenter.x}px, ${mapCenter.y}px)`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease-out'
                      }}
                    >
                      {/* Grid overlay */}
                      <defs>
                        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                      </defs>
                      <rect width="500" height="350" fill="url(#gridPattern)" />

                      {/* Coordinates texts */}
                      <text x="10" y="80" fill="#64748b" fontSize="8" opacity="0.5">20° N</text>
                      <text x="10" y="180" fill="#64748b" fontSize="8" opacity="0.5">10° N</text>
                      <text x="120" y="340" fill="#64748b" fontSize="8" opacity="0.5">60° E</text>
                      <text x="260" y="340" fill="#64748b" fontSize="8" opacity="0.5">70° E</text>
                      <text x="400" y="340" fill="#64748b" fontSize="8" opacity="0.5">80° E</text>

                      {/* Coastlines coordinates drawing */}
                      {/* Indian Mainland */}
                      <path 
                        d="M 280 20 L 290 80 L 320 120 L 340 180 L 360 210 L 380 260 L 398 290 L 402 290 L 405 280 L 415 240 L 420 220 L 430 180 Q 450 150 480 120 L 500 110" 
                        fill="none" 
                        stroke="#475569" 
                        strokeWidth="2" 
                        className="transition-colors duration-300"
                      />
                      
                      {/* Sri Lanka */}
                      <path 
                        d="M 408 300 C 405 315, 420 315, 418 300 C 415 290, 410 290, 408 300 Z" 
                        fill="#1e293b" 
                        stroke="#475569" 
                        strokeWidth="1.5" 
                      />

                      {/* Geographic labels */}
                      <text x="170" y="160" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.7">Arabian Sea</text>
                      <text x="430" y="190" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.7">Bay of Bengal</text>
                      <text x="325" y="110" fill="#475569" fontSize="8" letterSpacing="2">INDIA</text>
                      
                      {/* Highlight anomaly region circle */}
                      <circle cx="210" cy="180" r="45" fill="rgba(249, 115, 22, 0.08)" stroke="rgba(249, 115, 22, 0.3)" strokeDasharray="3,3" strokeWidth="1" />
                      <text x="210" y="215" textAnchor="middle" fill="#f97316" fontSize="7" fontWeight="semibold">Anomaly Zone</text>

                      {/* ARGO float markers */}
                      {activeFloatsList.map((float) => {
                        // Map coordinates to SVG pixels
                        // Lng 60 -> 80 -> 70% width
                        // Lat 10 -> 25 -> 80% height
                        const px = 100 + (float.lng - 60) * 11
                        const py = 290 - (float.lat - 10) * 12
                        
                        return (
                          <g key={float.id}>
                            {float.isAnomaly ? (
                              <>
                                {/* Ring animation for anomaly */}
                                <circle 
                                  cx={px} 
                                  cy={py} 
                                  r="9" 
                                  fill="none" 
                                  stroke="#ef4444" 
                                  strokeWidth="1" 
                                  className="animate-ping" 
                                  style={{ transformOrigin: `${px}px ${py}px` }}
                                />
                                <circle 
                                  cx={px} 
                                  cy={py} 
                                  r="5" 
                                  fill="#f97316" 
                                  stroke="#ef4444" 
                                  strokeWidth="1"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedFloat(float)
                                    setShowFloatPopup(true)
                                  }}
                                  onMouseEnter={() => setHoveredFloat(float)}
                                  onMouseLeave={() => setHoveredFloat(null)}
                                />
                              </>
                            ) : (
                              <circle 
                                cx={px} 
                                cy={py} 
                                r="3.5" 
                                fill="#06b6d4" 
                                stroke="#0891b2" 
                                strokeWidth="0.5"
                                className="cursor-pointer opacity-75 hover:opacity-100 hover:scale-125 transition duration-150"
                                onClick={() => {
                                  setSelectedFloat(float)
                                  setShowFloatPopup(true)
                                }}
                                onMouseEnter={() => setHoveredFloat(float)}
                                onMouseLeave={() => setHoveredFloat(null)}
                              />
                            )}
                          </g>
                        )
                      })}
                    </svg>

                    {/* Interactive hover tooltip */}
                    {hoveredFloat && (
                      <div 
                        className="absolute bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 text-[10px] p-2 rounded-lg shadow-lg pointer-events-none z-40 transition-opacity"
                        style={{
                          left: `${100 + (hoveredFloat.lng - 60) * 11 + 10}px`,
                          top: `${290 - (hoveredFloat.lat - 10) * 12 - 20}px`
                        }}
                      >
                        <p className="font-bold text-navy-800 dark:text-slate-100">{hoveredFloat.id}</p>
                        <p className="text-navy-500">Temp: {hoveredFloat.temp}°C</p>
                        {hoveredFloat.isAnomaly && <p className="text-amber-500 font-bold">Anomaly: +1.2°C</p>}
                      </div>
                    )}
                  </div>

                  {/* Legend indicator */}
                  <div className="flex items-center gap-6 text-xs text-navy-500 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0"></span>
                      <span>Nominal observation</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
                      <span>Anomalous intermediate profile</span>
                    </div>
                  </div>
                </div>

                {/* Details Popup Card (Right Column) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {showFloatPopup && selectedFloat ? (
                    <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 shadow-lg space-y-4 animate-fadeIn transition duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            selectedFloat.isAnomaly 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {selectedFloat.isAnomaly ? 'Anomalous Profile' : 'Nominal Profile'}
                          </span>
                          <h4 className="text-lg font-black text-navy-900 dark:text-slate-100 mt-1">
                            Float ID: {selectedFloat.id}
                          </h4>
                        </div>
                        <button 
                          onClick={() => setShowFloatPopup(false)}
                          className="p-1 rounded hover:bg-navy-50 dark:hover:bg-navy-800 text-navy-400"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="border-t border-navy-100 dark:border-navy-800 pt-4 space-y-3 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                          <span className="text-navy-400">Location coordinates</span>
                          <span className="font-semibold text-navy-800 dark:text-slate-200">
                            {selectedFloat.lat.toFixed(2)}° N, {selectedFloat.lng.toFixed(2)}° E
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                          <span className="text-navy-400">Peak Anomaly Depth</span>
                          <span className="font-semibold text-navy-800 dark:text-slate-200">{selectedFloat.depth}m</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                          <span className="text-navy-400">Observed Temperature</span>
                          <span className="font-semibold text-amber-500 font-mono">{selectedFloat.temp}°C</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                          <span className="text-navy-400">Historical Baseline</span>
                          <span className="font-semibold text-navy-500 font-mono">{selectedFloat.baseline}°C</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-navy-400">Temperature Difference</span>
                          <span className="font-black text-amber-500 font-mono">
                            {selectedFloat.isAnomaly ? `+${(selectedFloat.temp - selectedFloat.baseline).toFixed(1)}°C` : '0.0°C'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-navy-50 dark:bg-navy-950 p-3 rounded-lg border border-navy-100 dark:border-navy-800 text-[11px] text-navy-500 leading-relaxed">
                        This ARGO float profile captures vertical heat distribution. Deep measurements (+1.2°C at 420m) indicates downwelling thermal anomalies.
                      </div>

                      <button
                        onClick={() => setWalkthroughStep(5)}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                      >
                        <span>View Profile Visualizations</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 shadow-sm text-center text-xs text-navy-400 py-12 transition duration-300">
                      <Compass size={32} className="mx-auto text-navy-300 mb-2" />
                      <p>Click on any marker on the map to inspect individual profiling float data</p>
                    </div>
                  )}
                  
                  {/* Alert summary card */}
                  <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 p-4 rounded-2xl text-xs space-y-2">
                    <span className="font-bold text-amber-600 dark:text-amber-400">Regional Overview:</span>
                    <p className="text-navy-500">2 anomalies identified in the Arabian Sea. Normal conditions persist in the Bay of Bengal basin.</p>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 5: SCIENTIFIC VISUALIZATION (THE HERO GRAPH) */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'visualizations' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Main Graph Card (X: Temperature, Y: Depth) */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 md:p-6 shadow-lg lg:col-span-8 flex flex-col justify-between transition duration-300">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-navy-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                        TEMPERATURE vs DEPTH PROFILE (ARGO)
                      </h3>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded font-mono">
                        Basin: Arabian Sea
                      </span>
                    </div>
                    <p className="text-xs text-navy-400">X Axis: Temp (°C) | Y Axis: Depth (m) [0m at Top, 500m at Bottom]</p>
                  </div>

                  {/* SVG Chart: Depth profile */}
                  <div className="h-[420px] bg-navy-50/50 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-800/80 rounded-xl my-4 relative overflow-hidden flex items-center justify-center p-4">
                    <svg width="100%" height="100%" viewBox="0 0 450 380" className="p-2">
                      {/* Grid Lines */}
                      <line x1="50" y1="40" x2="420" y2="40" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="50" y1="100" x2="420" y2="100" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="50" y1="160" x2="420" y2="160" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="50" y1="220" x2="420" y2="220" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="50" y1="280" x2="420" y2="280" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="50" y1="340" x2="420" y2="340" stroke="#334155" strokeWidth="0.5" />

                      <line x1="120" y1="30" x2="120" y2="340" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="220" y1="30" x2="220" y2="340" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="320" y1="30" x2="320" y2="340" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />
                      <line x1="420" y1="30" x2="420" y2="340" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.5" />

                      {/* Highlight Shaded region for Anomaly (300m - 500m) */}
                      {/* Depth 300m is Y=220, 500m is Y=340 */}
                      {highlightAnomalyOnGraph && (
                        <>
                          <path 
                            d="M 125 220 C 145 250, 165 290, 175 340 L 125 340 Z" 
                            fill="rgba(239, 68, 68, 0.15)" 
                            className="animate-pulse"
                          />
                          <text x="140" y="270" fill="#ef4444" fontSize="8" fontWeight="bold" transform="rotate(75 140 270)">
                            +1.2°C Anomaly Zone
                          </text>
                        </>
                      )}

                      {/* X Axis labels (Temperature) */}
                      <text x="50" y="355" textAnchor="middle" fill="#64748b" fontSize="8">15°C</text>
                      <text x="120" y="355" textAnchor="middle" fill="#64748b" fontSize="8">18°C</text>
                      <text x="220" y="355" textAnchor="middle" fill="#64748b" fontSize="8">22°C</text>
                      <text x="320" y="355" textAnchor="middle" fill="#64748b" fontSize="8">26°C</text>
                      <text x="420" y="355" textAnchor="middle" fill="#64748b" fontSize="8">30°C</text>

                      {/* Y Axis labels (Depth) */}
                      <text x="45" y="42" textAnchor="end" fill="#64748b" fontSize="8">0m</text>
                      <text x="45" y="102" textAnchor="end" fill="#64748b" fontSize="8">100m</text>
                      <text x="45" y="162" textAnchor="end" fill="#64748b" fontSize="8">200m</text>
                      <text x="45" y="222" textAnchor="end" fill="#64748b" fontSize="8">300m</text>
                      <text x="45" y="282" textAnchor="end" fill="#64748b" fontSize="8">400m</text>
                      <text x="45" y="342" textAnchor="end" fill="#64748b" fontSize="8">500m</text>

                      {/* Curves drawing */}
                      {/* Historical Baseline Curve */}
                      <path 
                        d="M 380 40 C 370 100, 320 160, 220 220 Q 150 280, 125 340" 
                        fill="none" 
                        stroke="#0ea5e9" 
                        strokeWidth="2" 
                        strokeDasharray="2,2" 
                      />
                      
                      {/* Current Observation Curve */}
                      <path 
                        d="M 380 40 C 370 100, 320 160, 240 220 Q 200 280, 175 340" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="2.5" 
                      />

                      {/* Dots on Current Curve */}
                      <circle cx="380" cy="40" r="3" fill="#ef4444" />
                      <circle cx="345" cy="100" r="3" fill="#ef4444" />
                      <circle cx="280" cy="160" r="3" fill="#ef4444" />
                      <circle cx="240" cy="220" r="3.5" fill="#ef4444" />
                      <circle cx="200" cy="280" r="3.5" fill="#ef4444" />
                      <circle cx="175" cy="340" r="3.5" fill="#ef4444" />

                      {/* Annotation Callout */}
                      <g transform="translate(260, 270)">
                        <line x1="0" y1="0" x2="-45" y2="0" stroke="#94a3b8" strokeWidth="1" />
                        <polygon points="-45,0 -40,-2 -40,2" fill="#94a3b8" />
                        <rect x="5" y="-12" width="130" height="24" fill="#0f172a" rx="4" stroke="#ef4444" strokeWidth="0.5" />
                        <text x="70" y="4" textAnchor="middle" fill="#f97316" fontSize="8" fontWeight="bold">
                          +1.2°C at 300-500m depth
                        </text>
                      </g>
                    </svg>

                    {/* Shaded 300-500m floating badge */}
                    <div className="absolute right-4 top-4 bg-navy-950/80 p-2.5 rounded-lg border border-navy-800 text-[10px] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 border-t-2 border-dashed border-cyan-500"></span>
                        <span className="text-navy-400">Historical Baseline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-0.5 bg-red-500"></span>
                        <span className="text-navy-400">Current Observation</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-navy-400">
                    <span>* Decadal baselines computed from ARGO database.</span>
                    <button 
                      onClick={() => setHighlightAnomalyOnGraph(!highlightAnomalyOnGraph)}
                      className="text-cyan-500 hover:text-cyan-400 font-bold underline"
                    >
                      {highlightAnomalyOnGraph ? "Hide Highlight overlay" : "Highlight Anomaly Region"}
                    </button>
                  </div>
                </div>

                {/* Right Column: Historical Trend & Settings */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Historical Trend Card */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 shadow-lg transition duration-300 space-y-4">
                    <div>
                      <h4 className="font-bold text-navy-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                        Historical Temperature Trend
                      </h4>
                      <p className="text-[10px] text-navy-400">Mean 300m temp in Arabian Sea (2019 - 2025)</p>
                    </div>

                    {/* Historical trend SVG */}
                    <div className="h-44 bg-navy-50/50 dark:bg-navy-950/40 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <svg width="100%" height="100%" viewBox="0 0 250 140" className="p-2">
                        <line x1="30" y1="20" x2="230" y2="20" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                        <line x1="30" y1="60" x2="230" y2="60" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                        <line x1="30" y1="100" x2="230" y2="100" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                        <line x1="30" y1="120" x2="230" y2="120" stroke="#334155" strokeWidth="0.5" />

                        {/* Smooth Line Curve */}
                        <path 
                          d="M 30 110 Q 70 100, 110 90 T 190 70 T 230 40" 
                          fill="none" 
                          stroke="#a855f7" 
                          strokeWidth="2" 
                        />
                        <circle cx="30" cy="110" r="2" fill="#a855f7" />
                        <circle cx="70" cy="100" r="2" fill="#a855f7" />
                        <circle cx="110" cy="90" r="2" fill="#a855f7" />
                        <circle cx="150" cy="80" r="2" fill="#a855f7" />
                        <circle cx="190" cy="70" r="2" fill="#a855f7" />
                        <circle cx="230" cy="40" r="3" fill="#ef4444" />

                        {/* Labels */}
                        <text x="30" y="132" textAnchor="middle" fill="#64748b" fontSize="7">2019</text>
                        <text x="96" y="132" textAnchor="middle" fill="#64748b" fontSize="7">2021</text>
                        <text x="162" y="132" textAnchor="middle" fill="#64748b" fontSize="7">2023</text>
                        <text x="230" y="132" textAnchor="middle" fill="#64748b" fontSize="7">2025</text>

                        <text x="25" y="112" textAnchor="end" fill="#64748b" fontSize="6">23.5°</text>
                        <text x="25" y="62" textAnchor="end" fill="#64748b" fontSize="6">24.2°</text>
                        <text x="25" y="22" textAnchor="end" fill="#64748b" fontSize="6">24.8°</text>
                      </svg>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg text-[10px] text-purple-600 dark:text-purple-400">
                      <strong>Long-term Analysis:</strong> Intermediate waters demonstrate a steady +0.22°C/year rise since 2019, culminating in this month's anomaly.
                    </div>
                  </div>

                  {/* CTA Card */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-xs transition duration-300">
                    <h4 className="font-bold text-navy-900 dark:text-slate-100">Next Action</h4>
                    <p className="text-navy-500">Examine the chemical and physical root causes of this anomaly.</p>
                    <button
                      onClick={() => setWalkthroughStep(6)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <span>Explain Findings</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 6 & 8: EXPLAIN / MARINE ECOLOGICAL IMPACT */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'insights' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
                
                {/* Explanation Block */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 shadow-lg transition duration-300 space-y-6">
                  <div className="flex justify-between items-center border-b border-navy-100 dark:border-navy-800 pb-4">
                    <div>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                        AI Scientific Explanation Room
                      </span>
                      <h3 className="text-2xl font-extrabold text-navy-900 dark:text-slate-100 mt-1">
                        Why does this warming matter?
                      </h3>
                    </div>
                    
                    {/* Plain English Toggle */}
                    <div className="flex items-center gap-1 bg-navy-50 dark:bg-navy-950 p-1 rounded-lg border border-navy-100 dark:border-navy-800">
                      <button
                        onClick={() => setExplainSimply(false)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${
                          !explainSimply 
                            ? 'bg-cyan-500 text-navy-950 shadow' 
                            : 'text-navy-400 hover:text-navy-600'
                        }`}
                      >
                        Scientific
                      </button>
                      <button
                        onClick={() => setExplainSimply(true)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${
                          explainSimply 
                            ? 'bg-cyan-500 text-navy-950 shadow' 
                            : 'text-navy-400 hover:text-navy-600'
                        }`}
                      >
                        Simple Terms
                      </button>
                    </div>
                  </div>

                  {/* Body Text depending on Explain Simply */}
                  {explainSimply ? (
                    <div className="space-y-4 text-xs md:text-sm text-navy-600 dark:text-slate-300 leading-relaxed">
                      <p className="text-base font-bold text-navy-800 dark:text-slate-200">
                        "The deeper part of the Arabian Sea is currently warmer than what is normally observed."
                      </p>
                      <p>
                        FloatChat detected this change by comparing recent observations from ocean floats with patterns collected over the past 20 years. 
                        Usually, water at this depth (between 300 and 500 meters) remains relatively cool. An increase of 1.2°C at this depth means a huge amount of heat has been trapped in the middle layer of the ocean.
                      </p>
                      <p>
                        This warming can act like a lid, trapping nutrients at the bottom and preventing them from rising to the surface where small organisms need them. It can also force fish and other marine creatures to move to different areas to find their preferred temperatures.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-xs md:text-sm text-navy-600 dark:text-slate-300 leading-relaxed">
                      <p className="text-base font-bold text-navy-800 dark:text-slate-200">
                        "Thermal anomaly in intermediate water mass matches downwelling circulation patterns."
                      </p>
                      <p>
                        The positive anomaly of +1.2°C is concentrated in the intermediate thermocline depth layer (300–500m). FloatChat's comparison against WOA climotological databases indicates this anomaly exceeds seasonal variance limits (z-score = +2.8σ).
                      </p>
                      <p>
                        This intermediate warming shifts the local density stratification gradient. An increase in density gradient reduces vertical turbulent mixing coefficients, leading to nutrient containment in the lower layers and thinning the euphotic zone's trophic chain.
                      </p>
                    </div>
                  )}

                  {/* Evidence Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "WHERE", value: "Arabian Sea" },
                      { label: "DEPTH", value: "300 - 500m" },
                      { label: "CHANGE", value: "+1.2°C" },
                      { label: "CONFIDENCE", value: "87%" }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-navy-50 dark:bg-navy-950 p-4 rounded-xl border border-navy-100 dark:border-navy-800 text-center">
                        <p className="text-[10px] text-navy-400 font-bold uppercase tracking-wider">{card.label}</p>
                        <h4 className="text-sm md:text-base font-black text-navy-800 dark:text-slate-100 mt-1">{card.value}</h4>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setWalkthroughStep(5)}
                      className="text-xs text-cyan-500 font-bold underline flex items-center gap-1"
                    >
                      <Eye size={12} />
                      Show Evidence on Graph
                    </button>
                  </div>
                </div>

                {/* State 8: Marine Impact Flowchart */}
                {walkthroughStep === 8 && (
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6 transition duration-300 animate-fadeIn">
                    <div>
                      <h4 className="font-bold text-navy-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                        ECOLOGICAL CAUSE-AND-EFFECT CHAIN
                      </h4>
                      <p className="text-xs text-navy-400">Potential marine impact pathways resulting from the intermediate anomaly</p>
                    </div>

                    {/* Flow Diagram */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center space-y-2">
                        <Thermometer className="mx-auto text-amber-500" size={24} />
                        <h5 className="font-bold text-xs">Temperature Anomaly</h5>
                        <p className="text-[10px] text-navy-500">Thermocline temperatures increase by 1.2°C</p>
                      </div>
                      
                      <div className="text-center text-navy-300 hidden md:block">➔</div>
                      
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center space-y-2">
                        <Layers className="mx-auto text-blue-500" size={24} />
                        <h5 className="font-bold text-xs">Stratification Rise</h5>
                        <p className="text-[10px] text-navy-500">Density layering traps nutrients below photic zone</p>
                      </div>
                      
                      <div className="text-center text-navy-300 hidden md:block">➔</div>
                      
                      <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-center space-y-2">
                        <Activity className="mx-auto text-purple-500" size={24} />
                        <h5 className="font-bold text-xs">Ecosystem Shifts</h5>
                        <p className="text-[10px] text-navy-500">Sensitive species shift habitat ranges horizontally</p>
                      </div>

                      <div className="text-center text-navy-300 hidden md:block">➔</div>

                      <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-center space-y-2">
                        <Search className="mx-auto text-cyan-500" size={24} />
                        <h5 className="font-bold text-xs">Active Research</h5>
                        <p className="text-[10px] text-navy-500">ARGO floats and cruises target the basin anomaly</p>
                      </div>
                    </div>

                    <div className="bg-navy-50 dark:bg-navy-950 p-4 rounded-xl border border-navy-100 dark:border-navy-800 text-xs text-navy-500 leading-relaxed">
                      💡 <strong>Note on Ecosystems:</strong> Changes in temperature, salinity, and circulation can influence marine ecosystems and the conditions experienced by sensitive species. This flowchart tracks hypothetical pathways based on current scientific literature.
                    </div>
                  </div>
                )}

                {/* CTA controls */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setWalkthroughStep(5)}
                    className="border border-navy-200 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800 text-xs px-4 py-2.5 rounded-xl font-semibold transition"
                  >
                    View Charts
                  </button>
                  <button
                    onClick={() => setWalkthroughStep(walkthroughStep === 6 ? 7 : 9)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <span>{walkthroughStep === 6 ? "Predict Trend" : "Set Up Monitor"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 7: PREDICTION */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'predictions' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Prediction Chart Card */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 md:p-6 shadow-lg lg:col-span-8 flex flex-col justify-between transition duration-300">
                  <div>
                    <h3 className="font-bold text-navy-900 dark:text-slate-100 text-sm uppercase tracking-wider">
                      PREDICTIVE TREND ESTIMATE (NEXT 30 DAYS)
                    </h3>
                    <p className="text-xs text-navy-400">X Axis: Timeline | Y Axis: Temp Anomaly (°C) with Confidence Band</p>
                  </div>

                  {/* SVG Prediction Chart */}
                  <div className="h-72 bg-navy-50/50 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-800/80 rounded-xl my-4 relative overflow-hidden flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 350 200" className="p-2">
                      <line x1="30" y1="30" x2="320" y2="30" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                      <line x1="30" y1="80" x2="320" y2="80" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                      <line x1="30" y1="130" x2="320" y2="130" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.5" />
                      <line x1="30" y1="170" x2="320" y2="170" stroke="#334155" strokeWidth="0.5" />

                      {/* Vertial Line for 'Today' */}
                      <line x1="160" y1="20" x2="160" y2="170" stroke="#0ea5e9" strokeDasharray="2,2" strokeWidth="1" />
                      <text x="165" y="28" fill="#0ea5e9" fontSize="6" fontWeight="bold">TODAY</text>

                      {/* Confidence Band shading (Future) */}
                      {/* Starts at (160, 80) and widens as it goes to the right */}
                      <path 
                        d="M 160 80 Q 240 50, 320 30 L 320 150 Q 240 110, 160 80 Z" 
                        fill="rgba(168, 85, 247, 0.12)" 
                      />

                      {/* Lines */}
                      {/* Observed (Solid purple) */}
                      <path d="M 30 140 Q 90 110, 160 80" fill="none" stroke="#a855f7" strokeWidth="2" />
                      {/* Projected mean (Dashed purple) */}
                      <path d="M 160 80 Q 240 70, 320 60" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />

                      {/* Labels */}
                      <text x="30" y="182" textAnchor="middle" fill="#64748b" fontSize="7">30 Days Ago</text>
                      <text x="160" y="182" textAnchor="middle" fill="#64748b" fontSize="7">Today</text>
                      <text x="240" y="182" textAnchor="middle" fill="#64748b" fontSize="7">+7 Days</text>
                      <text x="320" y="182" textAnchor="middle" fill="#64748b" fontSize="7">+30 Days</text>

                      <text x="25" y="132" textAnchor="end" fill="#64748b" fontSize="6">0.0°C</text>
                      <text x="25" y="82" textAnchor="end" fill="#64748b" fontSize="6">+1.0°C</text>
                      <text x="25" y="32" textAnchor="end" fill="#64748b" fontSize="6">+2.0°C</text>
                      
                      <text x="280" y="50" fill="#a855f7" fontSize="6" fontWeight="bold">Forecast Range</text>
                    </svg>
                  </div>

                  <div className="bg-navy-50 dark:bg-navy-950 p-3 rounded-lg border border-navy-100 dark:border-navy-800 text-[10px] text-navy-500">
                    ⚠️ <strong>Prototype Warning:</strong> Prototype prediction based on historical/demo trends. Not a verified scientific forecast.
                  </div>
                </div>

                {/* Left Column: Forecast Statistics */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 shadow-lg space-y-4 transition duration-300 text-xs">
                    <h4 className="font-bold text-navy-900 dark:text-slate-100 uppercase tracking-wider">
                      Forecast Confidence Metrics
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400">Next 7 Days Trend</span>
                        <span className="font-bold text-amber-500">Likely to Persist</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400">Next 30 Days Trend</span>
                        <span className="font-bold text-navy-800 dark:text-slate-200">Moderate Persistence</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400">Model Confidence</span>
                        <span className="font-bold text-cyan-500">72%</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-navy-400 leading-relaxed pt-2">
                      Intermediate warming is estimated to persist over the next fortnight due to low local wind shear and high upper layer density stratification.
                    </p>

                    <button
                      onClick={() => setWalkthroughStep(8)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <span>Assess Ecological Impact</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STATE 9 & 10: ALERT CENTER & ALERTS DASHBOARD */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'alerts' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
                
                {/* Active Monitor alerts summary */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-navy-900 dark:text-slate-100">Ocean alerts dashboard</h3>
                    <p className="text-xs text-navy-400">Manage real-time threshold notifications for anomalies</p>
                  </div>
                  
                  <button 
                    onClick={() => { setAlertModalOpen(true); setAlertCreatedSuccess(false); }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Create Alert</span>
                  </button>
                </div>

                {/* Alerts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => setWalkthroughStep(3)} // Return to investigation on click
                      className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 hover:border-cyan-500/50 p-5 rounded-2xl shadow-sm transition duration-200 cursor-pointer space-y-3 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                            {alert.status}
                          </span>
                        </div>
                        <span className="text-[9px] text-navy-400 font-semibold">{alert.created}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-navy-900 dark:text-slate-100 text-base group-hover:text-cyan-500 transition">
                          {alert.parameter} Anomaly
                        </h4>
                        <p className="text-xs text-navy-500">
                          Region: <strong>{alert.region}</strong> | Depth: <strong>{alert.depth}</strong>
                        </p>
                      </div>

                      <div className="bg-navy-50 dark:bg-navy-950 p-2.5 rounded-lg border border-navy-100 dark:border-navy-800 text-xs flex justify-between items-center">
                        <span className="text-navy-400 font-semibold">Condition threshold:</span>
                        <span className="font-bold text-amber-500 font-mono">{alert.condition}</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-navy-400 pt-1">
                        <span>Frequency: {alert.frequency}</span>
                        <span className="text-cyan-500 font-bold group-hover:underline">View Investigation ➔</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ---------------- ALERT CREATION MODAL ---------------- */}
                {alertModalOpen && (
                  <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800 shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
                      
                      {/* Close button */}
                      <button 
                        onClick={() => setAlertModalOpen(false)}
                        className="absolute top-4 right-4 text-navy-400 hover:text-navy-600 dark:hover:text-slate-200"
                      >
                        <X size={18} />
                      </button>

                      {/* Header */}
                      <div className="mb-6 space-y-1.5">
                        <h3 className="text-lg font-black text-navy-900 dark:text-slate-100 flex items-center gap-2">
                          <Bell className="text-cyan-500" size={18} />
                          Create Ocean Alert
                        </h3>
                        <p className="text-xs text-navy-400">Configure trigger parameters for ARGO live demo feeds</p>
                      </div>

                      {/* Form Details */}
                      {alertCreatedSuccess ? (
                        <div className="text-center py-8 space-y-4 animate-scaleUp">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                            <CheckCircle2 size={32} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-navy-900 dark:text-slate-100 text-sm">Alert Registered!</h4>
                            <p className="text-[11px] text-navy-400">
                              FloatChat will monitor new observations matching your conditions.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Parameter field */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                              Parameter
                            </label>
                            <select 
                              value={activeParameter}
                              onChange={(e) => setActiveParameter(e.target.value)}
                              className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            >
                              <option value="temperature">Temperature (°C)</option>
                              <option value="salinity">Salinity (PSU)</option>
                            </select>
                          </div>

                          {/* Region field */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                              Region Basin
                            </label>
                            <input 
                              type="text" 
                              disabled
                              value="Arabian Sea"
                              className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 focus:outline-none opacity-80"
                            />
                          </div>

                          {/* Depth range field */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                              Depth range
                            </label>
                            <input 
                              type="text" 
                              disabled
                              value="300 - 500m"
                              className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 focus:outline-none opacity-80"
                            />
                          </div>

                          {/* Condition threshold */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                              Trigger condition
                            </label>
                            <div className="flex gap-2">
                              <select className="bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 focus:outline-none">
                                <option>Anomaly &gt;</option>
                                <option>Anomaly &lt;</option>
                              </select>
                              <input 
                                type="text"
                                defaultValue="1.0°C"
                                className="flex-1 bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg p-2.5 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* CTAs */}
                          <div className="flex gap-2 pt-4">
                            <button
                              onClick={() => setAlertModalOpen(false)}
                              className="flex-1 border border-navy-200 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800 text-xs py-2.5 rounded-lg font-semibold transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={triggerCreateAlert}
                              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-2.5 rounded-lg shadow-sm transition"
                            >
                              Create Alert
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* FOOTER */}
          <footer className="mt-auto border-t border-navy-100 dark:border-navy-800/80 p-5 bg-white dark:bg-navy-900 text-center text-xs text-navy-400 transition duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
              <p>© 2026 FloatChat AI. National-Level Hackathon Prototype. All rights reserved.</p>
              <div className="flex items-center gap-4 font-semibold">
                <a href="#about" onClick={(e) => { e.preventDefault(); alert("FloatChat leverages simulated ARGO profiling float telemetry to identify middle ocean heat anomalies.") }} className="hover:text-cyan-500 transition">About ARGO</a>
                <span className="text-navy-300 dark:text-navy-800">|</span>
                <span className="text-emerald-500">Live Simulation Running</span>
              </div>
            </div>
          </footer>

        </main>
      </div>

    </div>
  )
}
