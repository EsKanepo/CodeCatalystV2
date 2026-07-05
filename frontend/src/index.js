import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

// Suppress harmless extension messaging errors
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('A listener indicated an asynchronous response')) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

