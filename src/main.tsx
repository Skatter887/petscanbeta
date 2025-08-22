import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Debug: verifica che l'elemento root esista
const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
  console.log("React app mounted successfully");
} catch (error) {
  console.error("Error mounting React app:", error);
  // Fallback: mostra un messaggio di errore
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Errore nel caricamento dell'app</h1>
      <p>Controlla la console per i dettagli</p>
      <p>Error: ${error}</p>
    </div>
  `;
}
