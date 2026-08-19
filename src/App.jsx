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
  ChevronDown
} from 'lucide-react'

// Realistic Mock Data for the Arabian Sea Scenario
const activeFloatsList = [
  { id: 'Demo-290001', lat: 18.42, lng: 67.81, temp: 24.8, baseline: 23.6, salinity: 35.8, salinityBaseline: 36.2, depth: 420, isAnomaly: true },
  { id: 'Demo-290002', lat: 14.15, lng: 70.32, temp: 26.1, baseline: 26.0, salinity: 36.1, salinityBaseline: 36.1, depth: 380, isAnomaly: false },
  { id: 'Demo-290003', lat: 19.50, lng: 64.20, temp: 23.5, baseline: 23.4, salinity: 35.9, salinityBaseline: 35.9, depth: 450, isAnomaly: false },
  { id: 'Demo-290004', lat: 21.10, lng: 68.90, temp: 25.2, baseline: 25.0, salinity: 36.0, salinityBaseline: 36.0, depth: 320, isAnomaly: false },
  { id: 'Demo-290005', lat: 16.80, lng: 62.50, temp: 24.1, baseline: 24.0, salinity: 35.7, salinityBaseline: 35.8, depth: 410, isAnomaly: false },
  { id: 'Demo-290006', lat: 12.20, lng: 65.10, temp: 25.9, baseline: 25.8, salinity: 36.0, salinityBaseline: 36.0, depth: 350, isAnomaly: false },
  { id: 'Demo-290007', lat: 15.45, lng: 68.12, temp: 24.9, baseline: 23.7, salinity: 35.6, salinityBaseline: 36.1, depth: 430, isAnomaly: true },
]

export default function App() {
  // Theme Management (Light / Dark) with local storage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Journey state mapping the 6 steps:
  // 1: ASK, 2: FIND, 3: DETECT, 4: EXPLAIN, 5: PREDICT, 6: ACT
  const [walkthroughStep, setWalkthroughStep] = useState(1)
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, explorer, anomalies, predictions, insights, alerts

  // Interactive controls
  const [activeParameter, setActiveParameter] = useState('temperature') // temperature, salinity
  const [selectedFloat, setSelectedFloat] = useState(activeFloatsList[0])
  const [showFloatPopup, setShowFloatPopup] = useState(true)
  const [explainSimply, setExplainSimply] = useState(false)
  const [highlightAnomalyOnGraph, setHighlightAnomalyOnGraph] = useState(true)
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [alertCreatedSuccess, setAlertCreatedSuccess] = useState(false)
  
  // Custom Alerts Dashboard list
  const [customAlerts, setCustomAlerts] = useState([
    {
      id: 1,
      parameter: 'Salinity',
      region: 'Arabian Sea',
      depth: '300-500m',
      condition: 'Anomaly < -0.3 PSU',
      frequency: 'Every new ARGO observation',
      status: 'Monitoring',
      created: 'Aug 15, 2026'
    }
  ])

  // Chat conversation
  const [chatInput, setChatInput] = useState('')
  const [chatConversation, setChatConversation] = useState([
    { sender: 'user', text: 'Is there anything unusual happening in the Arabian Sea right now?' },
    { sender: 'ai', text: 'FloatChat scanned 2,418 ARGO profiles in the Arabian Sea. It detected a moderate temperature anomaly (+1.2°C) concentrated at the 300–500m depth range compared to the 20-year historical baseline.' }
  ])
  const [followupActive, setFollowupActive] = useState(false)
  const [followupType, setFollowupType] = useState('comparison') // 'comparison' or 'salinity'

  // Processing animation state for Step 2 (FIND)
  const [findProgress, setFindProgress] = useState(0)
  const [findChecklist, setFindChecklist] = useState([
    { name: 'Identifying region: Arabian Sea', status: 'pending' },
    { name: 'Retrieving relevant ARGO observations', status: 'pending' },
    { name: 'Comparing 20-year decadal baselines', status: 'pending' },
    { name: 'Checking intermediate water column anomalies', status: 'pending' }
  ])

  // Sync activeTab with walkthroughStep
  useEffect(() => {
    if (walkthroughStep === 1 || walkthroughStep === 2) {
      setActiveTab('dashboard')
    } else if (walkthroughStep === 3) {
      setActiveTab('anomalies')
    } else if (walkthroughStep === 4) {
      setActiveTab('insights')
    } else if (walkthroughStep === 5) {
      setActiveTab('predictions')
    } else if (walkthroughStep === 6) {
      setActiveTab('alerts')
    }
  }, [walkthroughStep])

  // Apply Dark Mode class
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Simulate progress when moving to Step 2 (FIND)
  useEffect(() => {
    if (walkthroughStep === 2) {
      setFindProgress(0)
      setFindChecklist(items => items.map(it => ({ ...it, status: 'pending' })))
      
      const interval = setInterval(() => {
        setFindProgress(prev => {
          const next = prev + 2
          
          setFindChecklist(current => {
            return current.map((item, idx) => {
              const trigger = (idx + 1) * 25
              if (next >= trigger) {
                return { ...item, status: 'done' }
              } else if (next >= trigger - 12) {
                return { ...item, status: 'processing' }
              }
              return item
            })
          })

          if (next >= 100) {
            clearInterval(interval)
            return 100
          }
          return next
        })
      }, 30)
      return () => clearInterval(interval)
    }
  }, [walkthroughStep])

  // Handle suggested questions
  const handleQueryClick = (queryText) => {
    if (queryText.includes('Arabian Sea') || queryText.includes('unusual')) {
      setWalkthroughStep(2)
    } else if (queryText.includes('Compare')) {
      setWalkthroughStep(6)
      setFollowupType('comparison')
      setFollowupActive(true)
    } else if (queryText.includes('salinity')) {
      setActiveParameter('salinity')
      setWalkthroughStep(3)
    } else if (queryText.includes('Predict')) {
      setWalkthroughStep(5)
    }
  }

  // Handle follow up chat submit
  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg = { sender: 'user', text: chatInput }
    setChatConversation(prev => [...prev, userMsg])
    
    const query = chatInput.toLowerCase()
    setChatInput('')

    if (query.includes('compare') || query.includes('bengal')) {
      setFollowupType('comparison')
      setFollowupActive(true)
      setWalkthroughStep(6)
    } else if (query.includes('salinity')) {
      setActiveParameter('salinity')
      setFollowupType('salinity')
      setFollowupActive(true)
      setWalkthroughStep(6)
    } else {
      setFollowupType('comparison')
      setFollowupActive(true)
      setWalkthroughStep(6)
    }
  }

  // Create alert simulation
  const handleCreateAlert = () => {
    setAlertCreatedSuccess(true)
    setTimeout(() => {
      const newAlert = {
        id: customAlerts.length + 2,
        parameter: 'Temperature',
        region: 'Arabian Sea',
        depth: '300-500m',
        condition: 'Anomaly > +1.0°C',
        frequency: 'Every new ARGO observation',
        status: 'Monitoring',
        created: 'Just Now'
      }
      setCustomAlerts(prev => [newAlert, ...prev])
      setAlertCreatedSuccess(false)
      setAlertModalOpen(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-navy-50 text-navy-950 dark:bg-navy-950 dark:text-navy-50 flex flex-col font-sans transition-colors duration-300">
      
      {/* ----------------- PROGRESS JOURNEY TRACKER (6 STEPS) ----------------- */}
      <div className="bg-white dark:bg-navy-900 border-b border-navy-100 dark:border-navy-800/80 p-3 px-6 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 py-1 text-xs md:text-sm scrollbar-none">
          {[
            { label: 'ASK', step: 1 },
            { label: 'FIND', step: 2 },
            { label: 'DETECT', step: 3 },
            { label: 'EXPLAIN', step: 4 },
            { label: 'PREDICT', step: 5 },
            { label: 'ACT', step: 6 }
          ].map((item, index) => {
            const isCurrent = walkthroughStep === item.step;
            const isPassed = walkthroughStep > item.step;
            
            return (
              <React.Fragment key={item.label}>
                <button
                  onClick={() => setWalkthroughStep(item.step)}
                  className={`flex items-center gap-2 font-bold tracking-wide uppercase transition-all duration-200 focus:outline-none ${
                    isCurrent 
                      ? 'text-cyan-500 dark:text-cyan-400 scale-105' 
                      : isPassed 
                        ? 'text-navy-600 dark:text-cyan-600/70' 
                        : 'text-navy-300 dark:text-navy-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all ${
                    isCurrent 
                      ? 'border-cyan-500 bg-cyan-500 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-navy-950 shadow-glow' 
                      : isPassed 
                        ? 'border-cyan-600/50 bg-cyan-600/10 text-cyan-600 dark:text-cyan-400/80' 
                        : 'border-navy-200 dark:border-navy-800 text-navy-400 dark:text-navy-600'
                  }`}>
                    {isPassed ? '✓' : index + 1}
                  </span>
                  <span>{item.label}</span>
                </button>
                {index < 5 && (
                  <ChevronRight size={14} className="text-navy-200 dark:text-navy-800 shrink-0" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* ----------------- MAIN LAYOUT ----------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-white dark:bg-navy-900 border-r border-navy-100 dark:border-navy-800/80 hidden md:flex flex-col justify-between shrink-0 p-4 transition-colors duration-300">
          <div className="space-y-6">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
                <Globe size={18} />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-navy-900 dark:text-slate-100">
                  FloatChat
                </h1>
                <p className="text-[10px] text-navy-400 dark:text-navy-500 font-bold tracking-wider uppercase">
                  ARGO Ocean Discovery
                </p>
              </div>
            </div>

            {/* Navigation links (Sidebar consistent across screens) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest px-2.5">
                Research Desk
              </span>
              {[
                { id: 'dashboard', label: 'Dashboard', icon: MessageSquare, step: 1 },
                { id: 'explorer', label: 'Ocean Explorer', icon: Compass, step: 3 },
                { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle, step: 3 },
                { id: 'insights', label: 'Insights', icon: Info, step: 4 },
                { id: 'predictions', label: 'Predictions', icon: TrendingUp, step: 5 },
                { id: 'alerts', label: 'Alert Room', icon: Bell, step: 6 }
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

            {/* ARGO Data Source count */}
            <div className="space-y-2 pt-4 border-t border-navy-100 dark:border-navy-800/80">
              <span className="text-[10px] font-bold text-navy-300 dark:text-navy-600 uppercase tracking-widest px-2.5">
                Data Feed Status
              </span>
              <div className="bg-navy-50 dark:bg-navy-950/50 p-2.5 rounded-lg border border-navy-100 dark:border-navy-800/60 space-y-2 text-xs">
                <div className="flex justify-between items-center text-navy-500 dark:text-navy-400">
                  <span className="flex items-center gap-1.5">
                    <Database size={12} className="text-cyan-500" />
                    ARGO Profiles
                  </span>
                  <span className="font-mono text-navy-700 dark:text-navy-300 font-bold">11.2M+</span>
                </div>
                <div className="flex justify-between items-center text-navy-500 dark:text-navy-400">
                  <span className="flex items-center gap-1.5">
                    <Activity size={12} className="text-emerald-500" />
                    Active Floats
                  </span>
                  <span className="font-mono text-navy-700 dark:text-navy-300 font-bold">3,812</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar How FloatChat Works - Shortened for judges */}
          <div className="space-y-4 pt-4 border-t border-navy-100 dark:border-navy-800/80">
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 p-3.5 rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-navy-800 dark:text-slate-200">How FloatChat Works</h4>
              <div className="space-y-1.5 text-navy-500 dark:text-navy-400 text-[10px] leading-relaxed">
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">1.</span>
                  <span>Ask a question</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">2.</span>
                  <span>Find relevant ARGO data</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">3.</span>
                  <span>Detect unusual patterns</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">4.</span>
                  <span>Explain the evidence</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">5.</span>
                  <span>Predict what may happen next</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-cyan-500 font-bold">6.</span>
                  <span>Take action</span>
                </div>
              </div>
            </div>

            {/* Theme Toggle & persistence */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-navy-400 dark:text-navy-500 font-bold uppercase tracking-wider">Theme Mode</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-md bg-navy-100 hover:bg-navy-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-600 dark:text-cyan-400 transition"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTAINER */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-navy-50/30 dark:bg-navy-950/40 transition-colors duration-300">
          
          {/* HEADER NAV */}
          <header className="h-16 border-b border-navy-100 dark:border-navy-800/80 bg-white/75 dark:bg-navy-900/75 backdrop-blur px-6 flex justify-between items-center shrink-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="relative w-80 hidden md:block">
                <Search size={15} className="absolute left-3 top-2.5 text-navy-400" />
                <input
                  type="text"
                  disabled
                  placeholder="Is there anything unusual happening in the Arabian Sea..."
                  className="w-full bg-navy-50 dark:bg-navy-950 text-xs border border-navy-100 dark:border-navy-800/80 rounded-lg pl-9 pr-3 py-2 text-navy-400 opacity-70"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>DEMO MODE · Sample ARGO observations</span>
              </div>

              {/* Theme Toggle for small screens */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-md bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-cyan-400 md:hidden transition"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              
              {/* Profile Card updated to Dr. Ananya Rao */}
              <div className="flex items-center gap-2 border-l border-navy-100 dark:border-navy-800 pl-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                  AR
                </div>
                <div className="hidden lg:block text-left">
                  <h4 className="text-xs font-bold text-navy-800 dark:text-slate-200">Dr. Ananya Rao</h4>
                  <p className="text-[10px] text-navy-400 dark:text-navy-500 font-bold uppercase tracking-wider">Ocean Researcher</p>
                </div>
              </div>
            </div>
          </header>

          {/* ACTIVE STEP WORKSPACE */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
            
            {/* ---------------------------------------------------- */}
            {/* STEP 1: ASK (HOME DASHBOARD) */}
            {/* ---------------------------------------------------- */}
            {walkthroughStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Hero section */}
                <div className="text-center md:text-left py-4 space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-navy-900 dark:text-slate-100">
                    Ask the ocean.
                  </h2>
                  <p className="text-navy-500 dark:text-navy-400 text-sm md:text-base max-w-2xl leading-relaxed">
                    Discover hidden patterns, understand anomalies, and explore what may happen next using ARGO ocean data.
                  </p>
                </div>

                {/* Input box */}
                <div className="bg-white dark:bg-navy-900 rounded-2xl border border-navy-100 dark:border-navy-800/80 p-5 md:p-6 shadow-md transition duration-300">
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-cyan-500" size={20} />
                    <input
                      type="text"
                      readOnly
                      value="Is there anything unusual happening in the Arabian Sea right now?"
                      className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-sm rounded-xl pl-12 pr-28 py-3.5 text-navy-900 dark:text-white font-medium"
                    />
                    <button
                      onClick={() => setWalkthroughStep(2)}
                      className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-400 hover:to-ocean-500 text-navy-950 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition duration-200 flex items-center gap-1"
                    >
                      <span>Investigate</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Suggestion list */}
                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    <span className="text-xs text-navy-400 dark:text-navy-500 font-bold mr-1">Suggestions:</span>
                    {[
                      "Is anything unusual happening in the Arabian Sea?",
                      "Compare Arabian Sea vs Bay of Bengal",
                      "Show salinity anomalies",
                      "Predict temperature changes"
                    ].map((query, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQueryClick(query)}
                        className="bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-navy-600 dark:text-cyan-400 text-xs px-3 py-1.5 rounded-lg font-medium transition"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 KPI cards exactly */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Active Floats", value: "3,812", change: "Live global array", icon: Globe, color: "text-cyan-500", bg: "bg-cyan-500/10" },
                    { label: "Profiles Analyzed", value: "11.2M+", change: "Decadal registry", icon: Database, color: "text-purple-500", bg: "bg-purple-500/10" },
                    { label: "Regions Monitored", value: "12", change: "Global basins", icon: Sliders, color: "text-blue-500", bg: "bg-blue-500/10" },
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
                          <h3 className="text-lg font-extrabold text-navy-900 dark:text-white mt-0.5">{card.value}</h3>
                          <p className="text-[10px] text-navy-500 font-medium">{card.change}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Bottom split: Left Latest Obs, Right map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Status table */}
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm lg:col-span-7 transition duration-300 space-y-4">
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-slate-100 text-sm uppercase tracking-wider">Latest relevant ARGO observations</h3>
                      <p className="text-xs text-navy-400">Recent profile logs from Arabian Sea quadrant</p>
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
                          {activeFloatsList.slice(0, 4).map((float) => (
                            <tr key={float.id} className="hover:bg-navy-50 dark:hover:bg-navy-800/20 transition duration-150">
                              <td className="py-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{float.id}</td>
                              <td>{float.lat}°N, {float.lng}°E</td>
                              <td>{float.depth}m</td>
                              <td className="font-semibold">{float.temp}°C</td>
                              <td className="text-navy-400">{float.baseline}°C</td>
                              <td>
                                {float.isAnomaly ? (
                                  <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded">
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
                        Arabian Sea map
                      </h3>
                      <p className="text-xs text-navy-400 font-medium">Model coordinates for active float array</p>
                    </div>

                    <div className="h-44 bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-xl my-3 relative overflow-hidden flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="50 40 250 160">
                        <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="0" y1="140" x2="400" y2="140" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="3,3" />

                        {/* Simplified Coastline */}
                        <path 
                          d="M 230 40 L 230 80 Q 235 110 260 130 Q 275 145 285 170 L 290 180" 
                          fill="none" 
                          stroke="currentColor" 
                          className="text-navy-400 dark:text-navy-600"
                          strokeWidth="1.5" 
                        />
                        <ellipse cx="295" cy="190" rx="6" ry="9" fill="currentColor" className="text-navy-100 dark:text-navy-950" stroke="currentColor" strokeWidth="1" />
                        
                        <text x="130" y="100" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="8" fontWeight="bold" opacity="0.6">Arabian Sea</text>
                        <text x="225" y="70" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">INDIA</text>
                        
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
                              fill={float.isAnomaly ? "#f97316" : "#06b6d4"}
                              className={float.isAnomaly ? "animate-pulse" : ""}
                            />
                          )
                        })}
                      </svg>
                    </div>

                    <button 
                      onClick={() => setWalkthroughStep(3)}
                      className="w-full bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 border border-navy-100 dark:border-navy-800 text-xs py-2 rounded-lg font-semibold text-navy-850 dark:text-cyan-400 transition"
                    >
                      Open Full Spatial Explorer
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: FIND / DISCOVER RESULT */}
            {/* ---------------------------------------------------- */}
            {walkthroughStep === 2 && (
              <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-md space-y-6 animate-fadeIn transition-colors duration-300">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto text-cyan-500 animate-spin">
                    <RefreshCw size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 dark:text-slate-100">
                    {findProgress < 100 ? "Finding relevant ARGO observations..." : "ARGO observations matched"}
                  </h3>
                  <p className="text-xs text-navy-400">FloatChat is querying intermediate water registries</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-navy-50 dark:bg-navy-950 h-2 rounded-full overflow-hidden border border-navy-100 dark:border-navy-800">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-100" 
                      style={{ width: `${findProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status checklist */}
                <div className="space-y-3.5 pt-2">
                  {findChecklist.map((step, idx) => (
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
                            ? 'text-navy-800 dark:text-slate-200 font-semibold' 
                            : 'text-navy-400'
                        }>
                          {step.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-navy-400 uppercase tracking-wider font-semibold font-mono">
                        {step.status === 'done' ? 'Ready' : step.status === 'processing' ? 'Searching' : 'Waiting'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Findings summary card */}
                {findProgress === 100 && (
                  <div className="bg-navy-50 dark:bg-navy-950 p-4 rounded-xl border border-navy-100 dark:border-navy-800 text-xs space-y-2 animate-scaleUp">
                    <div className="flex justify-between items-center">
                      <span className="text-navy-400 font-bold uppercase tracking-wider">Profiles Found</span>
                      <span className="text-cyan-500 font-extrabold font-mono text-sm">2,418 relevant profiles</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-navy-100 dark:border-navy-850 pt-2">
                      <span className="text-navy-400 font-semibold">Basin:</span>
                      <span className="text-navy-850 dark:text-slate-200 font-bold">Arabian Sea</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-navy-400 font-semibold">Parameter:</span>
                      <span className="text-navy-850 dark:text-slate-200 font-semibold">Temperature</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-navy-400 font-semibold">Depth Range:</span>
                      <span className="text-navy-850 dark:text-slate-200 font-semibold font-mono">300 – 500m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-navy-400 font-semibold">Timeline window:</span>
                      <span className="text-navy-850 dark:text-slate-200 font-semibold font-mono">2019 – 2026</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setWalkthroughStep(3)}
                  disabled={findProgress < 100}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold py-3 rounded-xl shadow transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>View Findings</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 3: DETECT SCREEN (PROVES VISUAL EVIDENCE) */}
            {/* ---------------------------------------------------- */}
            {walkthroughStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Header widget */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-navy-900 dark:text-slate-100">
                      Temperature anomaly detected
                    </h2>
                    <p className="text-xs text-navy-400">Warming event identified in intermediate thermocline waters</p>
                  </div>
                  
                  <span className="bg-orange-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-sm tracking-wider uppercase">
                    MODERATE ANOMALY
                  </span>
                </div>

                {/* Main visual evidence container split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Summary card & text statement */}
                  <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                    <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm space-y-4 transition duration-300">
                      <h3 className="font-extrabold text-sm uppercase tracking-wider text-navy-800 dark:text-slate-200">Anomaly Metrics</h3>
                      
                      <div className="space-y-3.5 text-xs">
                        <div className="bg-navy-50 dark:bg-navy-950 p-3 rounded-xl border border-navy-100 dark:border-navy-800/60">
                          <p className="text-[10px] text-navy-400 uppercase font-bold">Warming anomaly</p>
                          <h4 className="text-2xl font-black text-orange-500 mt-0.5">+1.2°C</h4>
                        </div>
                        
                        <div className="bg-navy-50 dark:bg-navy-950 p-3 rounded-xl border border-navy-100 dark:border-navy-800/60">
                          <p className="text-[10px] text-navy-400 uppercase font-bold">Depth range</p>
                          <h4 className="text-lg font-black text-navy-850 dark:text-slate-200 mt-0.5">300 – 500m</h4>
                        </div>

                        <div className="bg-navy-50 dark:bg-navy-950 p-3 rounded-xl border border-navy-100 dark:border-navy-800/60">
                          <p className="text-[10px] text-navy-400 uppercase font-bold">Detection confidence</p>
                          <h4 className="text-lg font-black text-cyan-500 mt-0.5">87%</h4>
                        </div>

                        <div className="bg-navy-50 dark:bg-navy-950 p-3 rounded-xl border border-navy-100 dark:border-navy-800/60">
                          <p className="text-[10px] text-navy-400 uppercase font-bold">Baseline</p>
                          <h4 className="text-sm font-bold text-navy-800 dark:text-slate-300 mt-0.5">20-yr historical baseline</h4>
                        </div>
                      </div>

                      <div className="bg-orange-500/5 border border-orange-500/10 p-3.5 rounded-xl text-xs text-navy-500 leading-relaxed">
                        “Water between 300–500m is approximately 1.2°C warmer than the historical baseline.”
                      </div>

                      <button
                        onClick={() => setWalkthroughStep(4)}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold text-xs py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                      >
                        <span>See why this matters</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Visual Evidence Grid */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Visual 1: Arabian Sea map with highlighted anomaly zone */}
                    <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-navy-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Globe size={14} className="text-cyan-500" />
                          Spatial Anomaly Distribution
                        </h4>
                        <p className="text-[10px] text-navy-400">Click marker to load float telemetry</p>
                      </div>

                      <div className="h-56 bg-navy-50 dark:bg-navy-950/60 border border-navy-100 dark:border-navy-800/80 rounded-xl my-3 relative overflow-hidden flex items-center justify-center">
                        <svg width="100%" height="100%" viewBox="50 40 250 160">
                          {/* Grid */}
                          <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="2,2" />
                          <line x1="0" y1="140" x2="400" y2="140" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="2,2" />
                          <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.3" strokeDasharray="2,2" />

                          {/* Coastline */}
                          <path 
                            d="M 230 40 L 230 80 Q 235 110 260 130 Q 275 145 285 170 L 290 180" 
                            fill="none" 
                            stroke="currentColor" 
                            className="text-navy-400 dark:text-navy-600"
                            strokeWidth="1.5" 
                          />
                          <ellipse cx="295" cy="190" rx="6" ry="9" fill="currentColor" className="text-navy-100 dark:text-navy-950" stroke="currentColor" strokeWidth="1" />

                          <text x="130" y="100" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="8" fontWeight="bold" opacity="0.6">Arabian Sea</text>
                          <text x="225" y="70" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">INDIA</text>
                          
                          {/* Highlight anomaly zone */}
                          <circle cx="180" cy="120" r="35" fill="rgba(249, 115, 22, 0.08)" stroke="rgba(249, 115, 22, 0.3)" strokeDasharray="2,2" strokeWidth="0.8" />
                          
                          {/* Pulsing float marker */}
                          <circle cx="182" cy="122" r="8" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" style={{ transformOrigin: "182px 122px" }} />
                          <circle 
                            cx="182" 
                            cy="122" 
                            r="4.5" 
                            fill="#f97316" 
                            stroke="#ef4444" 
                            strokeWidth="1" 
                            className="cursor-pointer"
                            onClick={() => setShowFloatPopup(!showFloatPopup)}
                          />

                          {/* Other nominal floats */}
                          <circle cx="120" cy="140" r="2.5" fill="#06b6d4" />
                          <circle cx="150" cy="90" r="2.5" fill="#06b6d4" />
                          <circle cx="210" cy="80" r="2.5" fill="#06b6d4" />
                          <circle cx="160" cy="150" r="2.5" fill="#06b6d4" />
                        </svg>

                        {/* Interactive Float Popup */}
                        {showFloatPopup && (
                          <div className="absolute bottom-2 left-2 right-2 bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 p-2.5 rounded-lg shadow-lg flex justify-between items-center text-[10px] animate-scaleUp">
                            <div>
                              <p className="font-bold text-navy-800 dark:text-slate-100">Float: {selectedFloat.id}</p>
                              <p className="text-navy-400">18.42° N, 67.81° E | Depth: {selectedFloat.depth}m</p>
                            </div>
                            <div className="text-right">
                              <p className="text-orange-500 font-bold font-mono">Temp: {selectedFloat.temp}°C</p>
                              <p className="text-navy-400 font-mono">Baseline: {selectedFloat.baseline}°C (+1.2°C)</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-navy-400">
                        <span>Observed coordinates</span>
                        <span>Float Demo-290001</span>
                      </div>
                    </div>

                    {/* Visual 2: Temperature-vs-depth profile */}
                    <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-navy-900 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <LineChart size={14} className="text-cyan-500" />
                          Temperature vs Depth Profile
                        </h4>
                        <p className="text-[10px] text-navy-400">Comparing current observation with baseline</p>
                      </div>

                      <div className="h-56 bg-navy-50 dark:bg-navy-950/60 border border-navy-100 dark:border-navy-800/80 rounded-xl my-3 relative overflow-hidden flex items-center justify-center p-2">
                        <svg width="100%" height="100%" viewBox="0 0 200 160">
                          {/* Grid */}
                          <line x1="30" y1="20" x2="190" y2="20" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                          <line x1="30" y1="60" x2="190" y2="60" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                          <line x1="30" y1="100" x2="190" y2="100" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                          <line x1="30" y1="140" x2="190" y2="140" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" />

                          {/* Shaded anomaly area (300m - 500m) which maps to Y=100 to Y=140 */}
                          <path 
                            d="M 68 100 C 85 110, 105 125, 115 140 L 75 140 Z" 
                            fill="rgba(249, 115, 22, 0.18)" 
                            className={highlightAnomalyOnGraph ? "animate-pulse" : ""}
                          />

                          {/* Historical Baseline Curve */}
                          <path 
                            d="M 170 20 C 160 50, 130 85, 95 100 Q 80 120, 75 140" 
                            fill="none" 
                            stroke="#0ea5e9" 
                            strokeWidth="1.5" 
                            strokeDasharray="2,2" 
                          />
                          
                          {/* Current Observation Curve */}
                          <path 
                            d="M 170 20 C 160 50, 130 85, 98 100 Q 95 120, 115 140" 
                            fill="none" 
                            stroke="#f97316" 
                            strokeWidth="2" 
                          />

                          {/* Annotation label */}
                          {highlightAnomalyOnGraph && (
                            <text x="120" y="125" fill="#f97316" fontSize="7" fontWeight="bold">+1.2°C</text>
                          )}

                          {/* Y-axis Labels */}
                          <text x="25" y="23" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">0m</text>
                          <text x="25" y="63" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">150m</text>
                          <text x="25" y="103" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">300m</text>
                          <text x="25" y="143" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">500m</text>

                          {/* X-axis Labels */}
                          <text x="30" y="152" textAnchor="middle" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">15°</text>
                          <text x="110" y="152" textAnchor="middle" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">22°</text>
                          <text x="190" y="152" textAnchor="middle" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">30°</text>
                        </svg>
                      </div>

                      {/* Legends */}
                      <div className="flex justify-between items-center text-[9px] text-navy-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-0.5 bg-cyan-500 border-dashed border-t"></span>
                          Baseline
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-0.5 bg-orange-500"></span>
                          Current
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 4: EXPLAIN SCREEN */}
            {/* ---------------------------------------------------- */}
            {walkthroughStep === 4 && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
                
                {/* Main Explanation container */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 shadow-lg transition duration-300 space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-navy-100 dark:border-navy-800 pb-4">
                    <div>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                        AI EXPLANATION
                      </span>
                      <h3 className="text-2xl font-black text-navy-900 dark:text-slate-100 mt-1">
                        Why does this warming matter?
                      </h3>
                    </div>

                    {/* Scientific vs Simple toggle */}
                    <div className="flex items-center gap-1 bg-navy-50 dark:bg-navy-950 p-1 rounded-lg border border-navy-100 dark:border-navy-800">
                      <button
                        onClick={() => setExplainSimply(false)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${
                          !explainSimply 
                            ? 'bg-cyan-500 text-navy-950 shadow' 
                            : 'text-navy-400 hover:text-navy-600 dark:hover:text-slate-200'
                        }`}
                      >
                        Scientific
                      </button>
                      <button
                        onClick={() => setExplainSimply(true)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded transition ${
                          explainSimply 
                            ? 'bg-cyan-500 text-navy-950 shadow' 
                            : 'text-navy-400 hover:text-navy-600 dark:hover:text-slate-200'
                        }`}
                      >
                        Simple Terms
                      </button>
                    </div>
                  </div>

                  {/* Narrative terms block */}
                  <div className="space-y-4 text-xs md:text-sm text-navy-600 dark:text-slate-300 leading-relaxed min-h-[80px]">
                    {explainSimply ? (
                      <p className="text-base text-navy-800 dark:text-slate-100 font-medium">
                        “The water layer between 300–500m is warmer than what is normally expected in this region. This unusual warming may affect ocean conditions and marine ecosystems.”
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-base text-navy-800 dark:text-slate-100 font-semibold">
                          “Thermal downwelling anomaly shifts intermediate stratification gradients.”
                        </p>
                        <p className="text-xs">
                          Decadal ARGO baseline comparisons identify a statistically significant anomaly exceeding 2.8 standard deviations. The increased temperature reduces vertical mixing coefficients, potentially trapping deep nutrients and thinning primary euphotic food webs.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 4 Clean evidence cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "WHERE", value: "Arabian Sea" },
                      { label: "DEPTH", value: "300–500m" },
                      { label: "CHANGE", value: "+1.2°C" },
                      { label: "CONFIDENCE", value: "87%" }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-navy-50 dark:bg-navy-950 p-4 rounded-xl border border-navy-100 dark:border-navy-800 text-center">
                        <p className="text-[10px] text-navy-400 font-bold uppercase tracking-wider">{card.label}</p>
                        <h4 className="text-sm md:text-base font-black text-navy-800 dark:text-slate-100 mt-1">{card.value}</h4>
                      </div>
                    ))}
                  </div>

                  {/* Show evidence on graph trigger splits */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-t border-navy-100 dark:border-navy-850 pt-5">
                    
                    <div className="md:col-span-7 space-y-2.5">
                      <button
                        onClick={() => setHighlightAnomalyOnGraph(!highlightAnomalyOnGraph)}
                        className="text-xs text-cyan-500 font-bold underline flex items-center gap-1.5 hover:text-cyan-400"
                      >
                        <Eye size={14} />
                        <span>{highlightAnomalyOnGraph ? "Hide highlighted anomaly overlay" : "Show evidence on graph"}</span>
                      </button>
                      <p className="text-xs text-navy-400 leading-relaxed">
                        Clicking the link toggles a high-contrast warm glow overlay covering the anomalous thermocline layer (300-500m) in the profile data.
                      </p>
                    </div>

                    <div className="md:col-span-5 h-36 bg-navy-50/50 dark:bg-navy-950/40 rounded-xl border border-navy-100 dark:border-navy-800/80 p-2 relative flex items-center justify-center overflow-hidden">
                      <svg width="120" height="120" viewBox="0 0 100 100">
                        {/* Shaded region */}
                        {highlightAnomalyOnGraph && (
                          <rect x="25" y="60" width="50" height="30" fill="rgba(249, 115, 22, 0.25)" className="animate-pulse" />
                        )}
                        <line x1="20" y1="10" x2="20" y2="90" stroke="currentColor" className="text-navy-300 dark:text-navy-700" strokeWidth="1" />
                        <line x1="20" y1="90" x2="90" y2="90" stroke="currentColor" className="text-navy-300 dark:text-navy-700" strokeWidth="1" />
                        {/* Curve */}
                        <path d="M 80 15 C 70 40, 50 60, 30 70 Q 25 80, 25 90" fill="none" stroke="#f97316" strokeWidth="1.5" />
                        {highlightAnomalyOnGraph && (
                          <text x="35" y="78" fill="#f97316" fontSize="8" fontWeight="bold">WARM GLOW</text>
                        )}
                      </svg>
                    </div>

                  </div>

                  {/* CTAs */}
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      onClick={() => setWalkthroughStep(3)}
                      className="border border-navy-200 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800 text-xs px-4 py-2.5 rounded-xl font-semibold transition"
                    >
                      Back to Evidence
                    </button>
                    <button
                      onClick={() => setWalkthroughStep(5)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Predict Trend</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 5: PREDICT SCREEN */}
            {/* ---------------------------------------------------- */}
            {walkthroughStep === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                
                {/* Left Column: Forecast details & stats */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 rounded-2xl shadow-lg transition duration-300 space-y-6">
                    <div>
                      <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                        Trend Projection
                      </span>
                      <h3 className="text-xl font-black text-navy-900 dark:text-slate-100 mt-1">
                        Is the anomaly likely to persist?
                      </h3>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-center">
                      <h4 className="text-sm font-bold text-navy-800 dark:text-slate-200">Forecast Answer</h4>
                      <p className="text-base font-black text-purple-600 dark:text-purple-400 mt-1 leading-snug">
                        “Likely to persist over the next 7–14 days.”
                      </p>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                        <span className="text-navy-400 font-semibold">Forecast Confidence:</span>
                        <span className="font-extrabold text-purple-600 dark:text-purple-400 font-mono text-sm">72%</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-[10px] text-navy-450 font-bold uppercase tracking-wider text-cyan-500">Why?</p>
                        <ul className="space-y-1.5 list-disc list-inside text-navy-500 leading-relaxed text-[11px]">
                          <li>Recent warming trend acceleration</li>
                          <li>Historical persistence pattern matches</li>
                          <li>Current thermal anomaly strength</li>
                        </ul>
                      </div>
                    </div>

                    <div className="text-[10px] text-navy-400 border-t border-navy-100 dark:border-navy-850 pt-4 leading-relaxed font-medium">
                      ⚠️ <strong>Disclaimer:</strong> Prototype prediction based on historical/demo trends; not a verified scientific forecast.
                    </div>

                    <button
                      onClick={() => setWalkthroughStep(6)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <span>Take Action</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Forecast visual chart */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 p-5 md:p-6 rounded-2xl shadow-lg transition duration-300 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-navy-900 dark:text-slate-100 text-xs uppercase tracking-wider">
                        Predictive Anomaly Forecast Model
                      </h4>
                      <p className="text-[10px] text-navy-400">Y-axis: Temp Anomaly (°C) | X-axis: Timeline</p>
                    </div>

                    {/* SVG Forecast Graph */}
                    <div className="h-64 bg-navy-50/50 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-800/80 rounded-xl my-4 relative overflow-hidden flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 350 180" className="p-2">
                        <line x1="30" y1="30" x2="320" y2="30" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1="30" y1="80" x2="320" y2="80" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1="30" y1="130" x2="320" y2="130" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1="30" y1="150" x2="320" y2="150" stroke="currentColor" className="text-navy-300 dark:text-navy-700" strokeWidth="0.5" />

                        {/* Today Marker */}
                        <line x1="160" y1="20" x2="160" y2="150" stroke="#0ea5e9" strokeDasharray="2,2" strokeWidth="1" />
                        <circle cx="160" cy="80" r="3.5" fill="#0ea5e9" />
                        <text x="165" y="26" fill="#0ea5e9" fontSize="6" fontWeight="bold">TODAY</text>

                        {/* Translucent confidence band */}
                        <path 
                          d="M 160 80 Q 240 55, 320 35 L 320 120 Q 240 100, 160 80 Z" 
                          fill="rgba(168, 85, 247, 0.12)" 
                        />

                        {/* Historical observations solid line */}
                        <path d="M 30 130 Q 90 105, 160 80" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                        {/* Forecast dotted line */}
                        <path d="M 160 80 Q 240 68, 320 58" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" />

                        {/* Labels */}
                        <text x="30" y="162" textAnchor="middle" fill="currentColor" className="text-navy-450 dark:text-navy-500" fontSize="7">30 Days Ago</text>
                        <text x="160" y="162" textAnchor="middle" fill="currentColor" className="text-navy-450 dark:text-navy-500" fontSize="7">Today</text>
                        <text x="240" y="162" textAnchor="middle" fill="currentColor" className="text-navy-450 dark:text-navy-500" fontSize="7">Next 7 Days</text>
                        <text x="320" y="162" textAnchor="middle" fill="currentColor" className="text-navy-450 dark:text-navy-500" fontSize="7">Next 30 Days</text>

                        <text x="25" y="132" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">0.0°</text>
                        <text x="25" y="82" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">+1.0°</text>
                        <text x="25" y="32" textAnchor="end" fill="currentColor" className="text-navy-400 dark:text-navy-500" fontSize="6">+2.0°</text>
                      </svg>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-navy-450">
                      <span>Observed Anomaly Curve</span>
                      <span>Confidence range (72% probability)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 6: ACT / ALERT SCREEN & CONVERSATIONAL FOLLOW-UP */}
            {/* ---------------------------------------------------- */}
            {walkthroughStep === 6 && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                
                {/* Alert dashboard panel */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-6 md:p-8 shadow-lg transition duration-300 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-navy-900 dark:text-slate-100">Ocean alerts</h3>
                      <p className="text-xs text-navy-400">Monitor future ARGO observations for conditions that matter to your research.</p>
                    </div>

                    <button
                      onClick={() => { setAlertModalOpen(true); setAlertCreatedSuccess(false); }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs px-4.5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <Plus size={15} />
                      <span>+ Create Alert</span>
                    </button>
                  </div>

                  {/* Active Alert card list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {customAlerts.map(alert => (
                      <div 
                        key={alert.id}
                        onClick={() => setWalkthroughStep(3)} // Link back to findings
                        className="bg-navy-50 dark:bg-navy-950/60 hover:border-cyan-500/40 border border-navy-100 dark:border-navy-800 p-4 rounded-xl space-y-3 cursor-pointer transition duration-200 group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            {alert.status}
                          </span>
                          <span className="text-[10px] text-navy-400">{alert.created}</span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-navy-850 dark:text-slate-200 group-hover:text-cyan-500 transition">
                            {alert.parameter} Anomaly threshold
                          </h4>
                          <p className="text-[11px] text-navy-500 mt-0.5">
                            Basin: <strong>{alert.region}</strong> | Depth: <strong>{alert.depth}</strong>
                          </p>
                        </div>

                        <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-850 p-2 rounded-lg text-xs flex justify-between items-center">
                          <span className="text-navy-450 font-medium">Trigger if:</span>
                          <span className="font-bold text-orange-500 font-mono">{alert.condition}</span>
                        </div>

                        <p className="text-[10px] text-navy-400 text-right group-hover:underline">
                          View details ➔
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

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
                              <option>300–500m</option>
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

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">Check frequency</label>
                            <input 
                              type="text" 
                              readOnly 
                              value="Every new ARGO observation"
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

                {/* ---------------- CONVERSATIONAL FOLLOW-UP ---------------- */}
                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800/80 rounded-2xl p-5 md:p-6 shadow-sm space-y-5 transition duration-300">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-navy-800 dark:text-slate-200">
                    Follow-up investigation
                  </h4>

                  <div className="space-y-4">
                    {/* Chat log */}
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {chatConversation.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
                              FC
                            </div>
                          )}
                          <div className={`p-3.5 rounded-2xl text-xs max-w-xl leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-cyan-500 text-navy-950 font-semibold rounded-tr-sm' 
                              : 'bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850 text-navy-800 dark:text-slate-200 rounded-tl-sm'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {/* Render comparison output */}
                      {followupActive && (
                        <div className="space-y-4 pt-2 animate-fadeIn">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow">
                              FC
                            </div>
                            <div className="space-y-4 flex-1">
                              <div className="p-3.5 bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-850 text-navy-800 dark:text-slate-200 text-xs rounded-2xl rounded-tl-sm leading-relaxed">
                                {followupType === 'comparison' ? (
                                  <span>
                                    <strong>Comparison (Arabian Sea vs Bay of Bengal):</strong> While the Arabian Sea intermediate layers display a +1.2°C anomaly, the Bay of Bengal quadrant reports nominal conditions (+0.3°C deviation) at corresponding depths. However, Bay of Bengal surface salinity is significantly lower (33.1 PSU) due to heavy river delta discharge.
                                  </span>
                                ) : (
                                  <span>
                                    <strong>Salinity Profile context:</strong> Salinity observations show a negative anomaly (-0.4 PSU) within the same 300–500m depth slice of the Arabian Sea. This salinity drop correlates with the warm temperature anomaly, suggesting a change in regional water mass transport.
                                  </span>
                                )}
                              </div>

                              {/* Graph component */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 p-4 rounded-xl shadow-sm">
                                  <h5 className="text-[10px] font-bold text-navy-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                                    {followupType === 'comparison' ? "Anomaly Comparison (°C)" : "Salinity vs Depth Curve"}
                                  </h5>
                                  <div className="h-44 w-full bg-navy-50 dark:bg-navy-950/70 border border-navy-100 dark:border-navy-800/80 rounded-lg flex items-center justify-center">
                                    <svg width="100%" height="100%" viewBox="0 0 250 140" className="p-2">
                                      <line x1="30" y1="20" x2="230" y2="20" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                                      <line x1="30" y1="70" x2="230" y2="70" stroke="currentColor" className="text-navy-200 dark:text-navy-800" strokeWidth="0.5" strokeDasharray="2,2" />
                                      <line x1="30" y1="110" x2="230" y2="110" stroke="currentColor" className="text-navy-300 dark:text-navy-750" strokeWidth="0.5" />

                                      {followupType === 'comparison' ? (
                                        <>
                                          {/* Arabian Sea Bar */}
                                          <rect x="60" y="30" width="30" height="80" fill="#f97316" rx="2" />
                                          <text x="75" y="24" textAnchor="middle" fill="#f97316" fontSize="8" fontWeight="bold">+1.2°</text>
                                          
                                          {/* Bay of Bengal Bar */}
                                          <rect x="150" y="90" width="30" height="20" fill="#0ea5e9" rx="2" />
                                          <text x="165" y="84" textAnchor="middle" fill="#0ea5e9" fontSize="8" fontWeight="bold">+0.3°</text>

                                          <text x="75" y="122" textAnchor="middle" fill="currentColor" className="text-navy-450" fontSize="7">Arabian Sea</text>
                                          <text x="165" y="122" textAnchor="middle" fill="currentColor" className="text-navy-450" fontSize="7">Bay of Bengal</text>
                                        </>
                                      ) : (
                                        <>
                                          {/* Salinity profile curves */}
                                          <path d="M 90 20 C 110 50, 140 80, 160 110" fill="none" stroke="currentColor" className="text-navy-300 dark:text-navy-700" strokeWidth="1" strokeDasharray="2,2" />
                                          <path d="M 90 20 C 100 50, 115 80, 130 110" fill="none" stroke="#0ea5e9" strokeWidth="1.8" />
                                          <text x="145" y="75" fill="#ef4444" fontSize="7" fontWeight="bold">-0.4 PSU</text>

                                          <text x="125" y="122" textAnchor="middle" fill="currentColor" className="text-navy-450" fontSize="7">Salinity (PSU)</text>
                                          <text x="20" y="65" fill="currentColor" className="text-navy-450" fontSize="6" transform="rotate(-90 20 65)">Depth</text>
                                        </>
                                      )}
                                    </svg>
                                  </div>
                                </div>

                                <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                                  <div className="space-y-2">
                                    <h5 className="text-[10px] font-bold text-navy-700 dark:text-slate-300 uppercase tracking-wider">Preserved Context</h5>
                                    <div className="space-y-1.5 text-xs">
                                      <div className="flex justify-between items-center py-1 border-b border-navy-50 dark:border-navy-800/40">
                                        <span className="text-navy-400">Active depth window</span>
                                        <span className="font-semibold text-navy-850 dark:text-slate-200">300 – 500m</span>
                                      </div>
                                      <div className="flex justify-between items-center py-1">
                                        <span className="text-navy-400">Active parameter</span>
                                        <span className="font-bold text-cyan-500 uppercase">{activeParameter}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => setFollowupType(followupType === 'comparison' ? 'salinity' : 'comparison')}
                                    className="w-full bg-navy-50 hover:bg-navy-100 dark:bg-navy-950 dark:hover:bg-navy-800 text-[11px] py-2 rounded-lg font-bold text-cyan-600 dark:text-cyan-400 transition text-center mt-3"
                                  >
                                    {followupType === 'comparison' ? "Switch to Salinity context" : "Switch to Basin comparison"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleChatSubmit} className="relative pt-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask a follow-up (e.g. 'Compare this with the Bay of Bengal')..."
                        className="w-full bg-navy-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs rounded-xl pl-4 pr-24 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-navy-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-4 bg-navy-150 hover:bg-navy-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-800 dark:text-cyan-400 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition"
                      >
                        Ask
                      </button>
                    </form>

                    {/* Chat follow-up suggestions */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQueryClick("Compare this with the Bay of Bengal")}
                        className="bg-navy-50 dark:bg-navy-950 hover:bg-navy-100 text-[10px] px-2.5 py-1.5 rounded-lg border border-navy-100 dark:border-navy-850 font-medium text-navy-600 dark:text-cyan-500"
                      >
                        Compare with Bay of Bengal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQueryClick("Show salinity in the same region")}
                        className="bg-navy-50 dark:bg-navy-950 hover:bg-navy-100 text-[10px] px-2.5 py-1.5 rounded-lg border border-navy-100 dark:border-navy-850 font-medium text-navy-600 dark:text-cyan-500"
                      >
                        Show salinity trends
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setWalkthroughStep(1);
                          setFollowupActive(false);
                          setChatConversation([
                            { sender: 'user', text: 'Is there anything unusual happening in the Arabian Sea right now?' },
                            { sender: 'ai', text: 'FloatChat scanned 2,418 ARGO profiles in the Arabian Sea. It detected a moderate temperature anomaly (+1.2°C) concentrated at the 300–500m depth range compared to the 20-year historical baseline.' }
                          ]);
                        }}
                        className="ml-auto text-[10px] text-navy-450 hover:text-cyan-500 underline font-semibold"
                      >
                        Reset Conversation
                      </button>
                    </div>

                  </div>
                </div>

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
                <span className="text-emerald-500">Live Simulation Active</span>
              </div>
            </div>
          </footer>

        </main>
      </div>

    </div>
  )
}
