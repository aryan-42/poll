import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css' // or './index.css' if that’s your file
import App from './App'
import Survey from './pages/Survey' // or './pages/Survey'
import Roster from './pages/Roster' // or './pages/Roster'
import Admin from './pages/Admin'   // or './pages/Admin'

function DebugPanel() {
  // Show whether Vite env vars are present (true/false) — no secrets leaked
  const env = import.meta.env
  const checks = {
    API_KEY: !!env.VITE_FIREBASE_API_KEY,
    AUTH_DOMAIN: !!env.VITE_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: !!env.VITE_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: !!env.VITE_FIREBASE_STORAGE_BUCKET,
    SENDER_ID: !!env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: !!env.VITE_FIREBASE_APP_ID,
  }
  return (
    <div style={{
      position:'fixed',bottom:0,left:0,right:0,
      fontFamily:'system-ui',fontSize:12,background:'#111',color:'#0f0',
      padding:'6px 8px',opacity:0.9,zIndex:9999
    }}>
      <strong>Env check:</strong> {Object.entries(checks).map(([k,v]) => `${k}=${v?'OK':'MISSING'}`).join(' | ')}
    </div>
  )
}

class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={err:null} }
  static getDerivedStateFromError(err){ return {err} }
  componentDidCatch(err, info){ console.error('App crash:', err, info) }
  render(){
    if(this.state.err){
      return <div style={{padding:16,fontFamily:'system-ui'}}>
        <h1>App error</h1>
        <pre style={{whiteSpace:'pre-wrap',background:'#f7f7f7',padding:8,borderRadius:6}}>
{String(this.state.err?.message || this.state.err)}
        </pre>
        <p>Open the browser console for the full stack trace.</p>
      </div>
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/survey/:taskId" element={<Survey />} />
          <Route path="/roster/:taskId" element={<Roster />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <DebugPanel />
    </ErrorBoundary>
  </React.StrictMode>
)
