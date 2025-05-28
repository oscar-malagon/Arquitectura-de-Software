import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import PriceChart from './PriceChart';
import PredictionChart from './PredictionChart';
import AlertManager from './AlertManager';

const CoinDashboard = () => {
  const { selectedCoin, prices, loading, refreshing, refreshPrices } = useCrypto();
  const [predictionDays, setPredictionDays] = useState(7);
  
  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }
  
  if (!selectedCoin) {
    return <div className="no-selection">Por favor, selecciona una criptomoneda</div>;
  }
  
  const coinData = prices[selectedCoin];
  
  if (!coinData) {
    return <div className="loading">Cargando datos de {selectedCoin}...</div>;
  }
  
  // Calcular el precio en diferentes formatos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };
  
  const handleDaysChange = (e) => {
    setPredictionDays(parseInt(e.target.value));
  };
  
  const handleRefresh = () => {
    refreshPrices();
  };
  
  return (
    <div className="coin-dashboard">
      <div className="dashboard-header">
        <h1>
          {selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)}
          <span className="coin-price-header">
            {formatPrice(coinData.currentPrice)}
            <span className={`change-indicator ${parseFloat(coinData.change24h) >= 0 ? 'positive' : 'negative'}`}>
              {coinData.change24h}%
            </span>
          </span>
        </h1>
        <button 
          className="refresh-button" 
          onClick={handleRefresh} 
          disabled={refreshing}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar con variación'}
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="chart-section">
          <div className="chart-container price-chart-container">
            <h2>Precio (últimas 24h)</h2>
            <PriceChart coinId={selectedCoin} />
          </div>
          
          <div className="chart-container prediction-chart-container">
            <div className="prediction-header">
              <h2>Predicción de Precio</h2>
              <div className="days-selector">
                <label htmlFor="prediction-days">Días:</label>
                <select 
                  id="prediction-days" 
                  value={predictionDays} 
                  onChange={handleDaysChange}
                >
                  <option value="3">3 días</option>
                  <option value="7">7 días</option>
                  <option value="14">14 días</option>
                  <option value="30">30 días</option>
                </select>
              </div>
            </div>
            <PredictionChart coinId={selectedCoin} days={predictionDays} />
            <div className="prediction-disclaimer">
              <p>
                <small>
                  * Las predicciones son meramente ilustrativas y basadas en datos históricos.
                  No representan recomendaciones de inversión.
                </small>
              </p>
            </div>
          </div>
        </div>
        
        <div className="sidebar-section">
          <div className="info-cards">
            <div className="info-card">
              <h3>Precio actual</h3>
              <div className="card-value">{formatPrice(coinData.currentPrice)}</div>
            </div>
            
            <div className="info-card">
              <h3>Cambio 24h</h3>
              <div className={`card-value ${parseFloat(coinData.change24h) >= 0 ? 'positive' : 'negative'}`}>
                {coinData.change24h}%
              </div>
            </div>
          </div>
          
          <div className="alerts-section">
            <AlertManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDashboard; 