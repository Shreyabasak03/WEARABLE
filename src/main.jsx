import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
        <ClerkProvider>
    <App />
           </ClerkProvider>
  </BrowserRouter>
)
