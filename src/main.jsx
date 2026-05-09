import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Bar from './Bar.jsx'
import App from './pages/App.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Bar />
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>,
)