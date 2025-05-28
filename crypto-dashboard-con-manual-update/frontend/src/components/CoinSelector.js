import React from 'react';
import { useCrypto } from '../context/CryptoContext';

const CoinSelector = () => {
  const { coins, selectedCoin, setSelectedCoin, prices, isFavorite, addFavorite, removeFavorite } = useCrypto();
  
  const handleCoinChange = (e) => {
    setSelectedCoin(e.target.value);
  };
  
  const handleToggleFavorite = async (coinId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorite(coinId)) {
        await removeFavorite(coinId);
      } else {
        await addFavorite(coinId);
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
    }
  };
  
  // Obtener el precio y cambio para mostrar junto al nombre de la moneda
  const getCoinPriceInfo = (coinId) => {
    if (!prices || !prices[coinId]) {
      return { price: '...', change: '...' };
    }
    
    const coinData = prices[coinId];
    return {
      price: coinData.currentPrice.toLocaleString('es-ES', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2
      }),
      change: coinData.change24h,
      isPositive: parseFloat(coinData.change24h) >= 0
    };
  };
  
  return (
    <div className="coin-selector">
      <h2>Selecciona una criptomoneda</h2>
      
      <div className="coin-list">
        {coins.map(coin => {
          const { price, change, isPositive } = getCoinPriceInfo(coin.id);
          const isSelected = selectedCoin === coin.id;
          const isFav = isFavorite(coin.id);
          
          return (
            <div 
              key={coin.id} 
              className={`coin-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedCoin(coin.id)}
            >
              <div className="coin-info">
                <span className="coin-symbol">{coin.symbol}</span>
                <span className="coin-name">{coin.name}</span>
              </div>
              
              <div className="coin-price-info">
                <span className="coin-price">{price}</span>
                <span className={`coin-change ${isPositive ? 'positive' : 'negative'}`}>
                  {change}%
                </span>
              </div>
              
              <button 
                className={`favorite-btn ${isFav ? 'favorited' : ''}`}
                onClick={(e) => handleToggleFavorite(coin.id, e)}
                title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                {isFav ? '★' : '☆'}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="coin-select">
        <select value={selectedCoin || ''} onChange={handleCoinChange}>
          <option value="" disabled>Selecciona una moneda</option>
          {coins.map(coin => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CoinSelector; 