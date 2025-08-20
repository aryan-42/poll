import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Survey from './pages/Survey'
import Roster from './pages/Roster'
import Admin from './pages/Admin'
import LoginGate from './pages/LoginGate'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className='p-4'>Welcome to MBA HRM 25-27</div>} />
        <Route path="/survey/:taskId" element={<Survey />} />
        <Route path="/roster/:taskId" element={<Roster />} />
        <Route path="/admin" element={<LoginGate><Admin /></LoginGate>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
