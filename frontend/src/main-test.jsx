import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Minimal test component
function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0b1020', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>
        ✅ React is Working!
      </h1>
      <p style={{ fontSize: '20px', color: '#94a3b8' }}>
        If you can see this, React is rendering correctly.
      </p>
      <div className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Tailwind Test Button
      </div>
    </div>
  )
}

console.log('🚀 main.jsx is executing');

const root = document.getElementById('root');
if (root) {
  console.log('✅ Root element found');
  ReactDOM.createRoot(root).render(<TestApp />);
  console.log('✅ React app rendered');
} else {
  console.error('❌ Root element not found!');
}
