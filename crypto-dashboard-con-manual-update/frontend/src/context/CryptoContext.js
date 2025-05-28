import React, { createContext, useContext, useState, useEffect } from 'react';
import { coinService, predictionService, favoriteService } from '../services/api';

// Crear el contexto
const CryptoContext = createContext();

// Hook personalizado para usar el contexto
export const useCrypto = () => useContext(CryptoContext);

// Proveedor del contexto
export const CryptoProvider = ({ children }) => {
  // Estado para las monedas y precios
  const [coins, setCoins] = useState([]);
  const [prices, setPrices] = useState({});
  const [predictions, setPredictions] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar lista de monedas
        const coinsData = await coinService.getAllCoins();
        setCoins(coinsData);
        
        // Cargar precios
        const pricesData = await coinService.getAllPrices();
        setPrices(pricesData);
        
        // Cargar favoritos
        const favoritesData = await favoriteService.getAllFavorites();
        setFavorites(favoritesData);
        
        // Cargar predicciones (7 días por defecto)
        const predictionsData = await predictionService.getAllPredictions(7);
        setPredictions(predictionsData);
        
        // Si hay monedas, seleccionar la primera por defecto
        if (coinsData.length > 0) {
          setSelectedCoin(coinsData[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
        setError('Error al cargar datos. Por favor, recarga la página.');
        setLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Configurar actualización periódica de precios (cada 5 segundos)
    const priceInterval = setInterval(async () => {
      try {
        const pricesData = await coinService.getAllPrices();
        setPrices(pricesData);
      } catch (err) {
        console.error('Error al actualizar precios:', err);
      }
    }, 3000);
    
    return () => clearInterval(priceInterval);
  }, []);
  
  // Función para actualizar precios manualmente
  const refreshPrices = async () => {
    try {
      setRefreshing(true);
      const pricesData = await coinService.getAllPrices();
      
      // Crear una copia con variaciones pequeñas aleatorias en los precios
      const updatedPrices = {};
      Object.keys(pricesData).forEach(coinId => {
        const originalData = pricesData[coinId];
        const variation = (Math.random() * 2 - 1) * 0.015; // Variación entre -1.5% y +1.5%
        const newPrice = originalData.currentPrice * (1 + variation);
        
        // Calcular el cambio en 24h ajustado
        const oldChange = parseFloat(originalData.change24h);
        const newChange = (oldChange + variation * 100).toFixed(2);
        
        updatedPrices[coinId] = {
          ...originalData,
          currentPrice: newPrice,
          change24h: newChange
        };
      });
      
      setPrices(updatedPrices);
      setRefreshing(false);
    } catch (err) {
      console.error('Error al actualizar precios manualmente:', err);
      setRefreshing(false);
      throw err;
    }
  };
  
  // Función para añadir un favorito
  const addFavorite = async (coinId) => {
    try {
      await favoriteService.addFavorite(coinId);
      const favoritesData = await favoriteService.getAllFavorites();
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Error al añadir favorito:', err);
      throw err;
    }
  };
  
  // Función para eliminar un favorito
  const removeFavorite = async (coinId) => {
    try {
      await favoriteService.removeFavorite(coinId);
      const favoritesData = await favoriteService.getAllFavorites();
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
      throw err;
    }
  };
  
  // Función para verificar si una moneda es favorita
  const isFavorite = (coinId) => {
    return favorites.some(fav => fav.coinId === coinId);
  };
  
  // Función para obtener predicción con diferente número de días
  const getPrediction = async (coinId, days) => {
    try {
      const predictionData = await predictionService.getCoinPrediction(coinId, days);
      setPredictions(prev => ({
        ...prev,
        [coinId]: predictionData
      }));
      return predictionData;
    } catch (err) {
      console.error(`Error al obtener predicción para ${coinId}:`, err);
      throw err;
    }
  };
  
  // Valor del contexto
  const value = {
    coins,
    prices,
    predictions,
    favorites,
    loading,
    error,
    selectedCoin,
    refreshing,
    setSelectedCoin,
    addFavorite,
    removeFavorite,
    isFavorite,
    getPrediction,
    refreshPrices
  };
  
  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
}; 