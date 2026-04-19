import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import './styles/global.css';
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)