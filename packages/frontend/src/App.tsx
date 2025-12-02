import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎴 Truco4AR</h1>
        <p>Multi-device Argentine Truco</p>
      </header>
      <main className="app-main">
        <div className="welcome">
          <h2>Bienvenido al Truco Argentino</h2>
          <p>Aplicación en desarrollo - Fase 4: Frontend</p>
          <div className="info">
            <p>
              <strong>Ver componentes:</strong>{' '}
              <a href="/showcase.html" target="_blank" rel="noopener noreferrer">
                Component Showcase
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
