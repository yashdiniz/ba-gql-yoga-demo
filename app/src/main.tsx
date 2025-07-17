import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import FeedPage from './Feed'
import GraphiQL from './utils/graphiql'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<App />} />
        <Route path='/feed' element={<FeedPage />} />
        <Route path='/playground' element={<GraphiQL />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
