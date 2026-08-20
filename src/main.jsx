import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/cartContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <BrowserRouter>

              <CartProvider>
    <App />
    </CartProvider>

  </BrowserRouter>
  </AuthProvider>
)
