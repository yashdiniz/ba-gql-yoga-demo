import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FeedPage from './Feed'
import GraphiQL from './utils/graphiql'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/feed' element={<FeedPage />} />
        <Route path='/playground' element={<GraphiQL />} />
      </Routes>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
