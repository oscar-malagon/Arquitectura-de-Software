import React from 'react';
import { CryptoProvider } from './context/CryptoContext';
import CoinSelector from './components/CoinSelector';
import CoinDashboard from './components/CoinDashboard';
import './App.css';

function App() {
  return (
    <CryptoProvider>
      <div className="App">
        <header className="App-header">
          <h1>Dashboard de Criptomonedas</h1>
          <p className="subtitle">Demo de contenedores Docker en comunicación</p>
        </header>
        
        <div className="app-container">
          <aside className="sidebar">
            <CoinSelector />
          </aside>
          
          <main className="main-content">
            <CoinDashboard />
          </main>
        </div>
        
        <footer className="App-footer">
          <p>Dashboard de criptomonedas - Demostración de microservicios con Docker</p>
          <div className="container-info">
            <p>Contenedores en este demo:</p>
            <ul>
              <li>Frontend (React/Chart.js) - Puerto 3000</li>
              <li>API Gateway - Puerto 4000</li>
              <li>Servicio de precios - Puerto 4001</li>
              <li>Servicio de predicción - Puerto 4002</li>
              <li>Base de datos MongoDB - Puerto 27017</li>
            </ul>
          </div>
        </footer>
      </div>
    </CryptoProvider>
  );
}

export default App; 