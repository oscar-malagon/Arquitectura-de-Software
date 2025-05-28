import React, { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { alertService } from '../services/api';

const AlertManager = () => {
  const { coins, selectedCoin, prices } = useCrypto();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para el formulario
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');
  const [showForm, setShowForm] = useState(false);
  
  // Cargar alertas existentes
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertService.getAllAlerts();
        setAlerts(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar alertas:', err);
        setError('No se pudieron cargar las alertas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);
  
  // Crear una nueva alerta
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    
    if (!selectedCoin || !targetPrice) {
      return;
    }
    
    try {
      setLoading(true);
      const newAlert = await alertService.createAlert(
        selectedCoin,
        parseFloat(targetPrice),
        condition
      );
      
      setAlerts(prevAlerts => [...prevAlerts, newAlert]);
      setTargetPrice('');
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error al crear alerta:', err);
      setError('No se pudo crear la alerta');
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar una alerta
  const handleDeleteAlert = async (alertId) => {
    try {
      setLoading(true);
      await alertService.deleteAlert(alertId);
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert._id !== alertId));
      setError(null);
    } catch (err) {
      console.error('Error al eliminar alerta:', err);
      setError('No se pudo eliminar la alerta');
    } finally {
      setLoading(false);
    }
  };
  
  // Actualizar estado de alerta (activar/desactivar)
  const handleToggleActive = async (alertId, currentActive) => {
    try {
      setLoading(true);
      const updatedAlert = await alertService.updateAlert(alertId, !currentActive);
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert._id === alertId ? updatedAlert : alert
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error al actualizar alerta:', err);
      setError('No se pudo actualizar la alerta');
    } finally {
      setLoading(false);
    }
  };
  
  // Encontrar nombre de moneda por ID
  const getCoinName = (coinId) => {
    const coin = coins.find(c => c.id === coinId);
    return coin ? coin.name : coinId;
  };
  
  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  // Verificar si una alerta está activa y cumple su condición
  const isAlertTriggered = (alert) => {
    if (!alert.active || !prices || !prices[alert.coinId]) {
      return false;
    }
    
    const currentPrice = prices[alert.coinId].currentPrice;
    
    if (alert.condition === 'above') {
      return currentPrice > alert.targetPrice;
    } else {
      return currentPrice < alert.targetPrice;
    }
  };
  
  return (
    <div className="alert-manager">
      <div className="alert-header">
        <h2>Alertas de Precio</h2>
        <button 
          className="add-alert-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Nueva Alerta'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm && (
        <form className="alert-form" onSubmit={handleCreateAlert}>
          <div className="form-group">
            <label>Moneda: </label>
            <span className="coin-name">{getCoinName(selectedCoin)}</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="targetPrice">Precio objetivo:</label>
            <input
              type="number"
              id="targetPrice"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="Ej: 40000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="condition">Condición:</label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="above">Por encima de</option>
              <option value="below">Por debajo de</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="create-alert-btn"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Alerta'}
          </button>
        </form>
      )}
      
      <div className="alerts-list">
        <h3>Mis Alertas</h3>
        
        {loading && <div className="loading-alerts">Cargando alertas...</div>}
        
        {alerts.length === 0 && !loading ? (
          <div className="no-alerts">No hay alertas configuradas</div>
        ) : (
          <ul>
            {alerts.map(alert => (
              <li 
                key={alert._id} 
                className={`alert-item ${!alert.active ? 'inactive' : ''} ${isAlertTriggered(alert) ? 'triggered' : ''}`}
              >
                <div className="alert-info">
                  <div className="alert-coin">{getCoinName(alert.coinId)}</div>
                  <div className="alert-condition">
                    {alert.condition === 'above' ? 'Por encima de' : 'Por debajo de'} {formatPrice(alert.targetPrice)}
                  </div>
                  {isAlertTriggered(alert) && (
                    <div className="alert-triggered">¡Alerta activada!</div>
                  )}
                </div>
                
                <div className="alert-actions">
                  <button 
                    className={`toggle-btn ${alert.active ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleActive(alert._id, alert.active)}
                    title={alert.active ? 'Desactivar alerta' : 'Activar alerta'}
                  >
                    {alert.active ? '✓' : '✗'}
                  </button>
                  
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteAlert(alert._id)}
                    title="Eliminar alerta"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertManager; 