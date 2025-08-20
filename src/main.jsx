import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css' // or './index.css' if that's what you have
import App from './App.jsx'
import Survey from './pages/Survey.jsx'
import Roster from './pages/Roster.jsx'
import Admin from './pages/Admin.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/survey/:taskId" element={<Survey />} />
        <Route path="/roster/:taskId" element={<Roster />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
