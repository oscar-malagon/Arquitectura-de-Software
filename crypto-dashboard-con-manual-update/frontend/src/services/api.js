import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Cliente axios configurado
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Servicios para criptomonedas
export const coinService = {
  getAllCoins: async () => {
    const response = await apiClient.get('/api/coins');
    return response.data;
  },
  
  getAllPrices: async () => {
    const response = await apiClient.get('/api/coins/prices');
    return response.data;
  },
  
  getCoinPrice: async (coinId) => {
    const response = await apiClient.get(`/api/coins/${coinId}/price`);
    return response.data;
  }
};

// Servicios para predicciones
export const predictionService = {
  getAllPredictions: async (days) => {
    const response = await apiClient.get('/api/predictions', {
      params: { days }
    });
    return response.data;
  },
  
  getCoinPrediction: async (coinId, days) => {
    const response = await apiClient.get(`/api/predictions/${coinId}`, {
      params: { days }
    });
    return response.data;
  }
};

// Servicios para favoritos
export const favoriteService = {
  getAllFavorites: async () => {
    const response = await apiClient.get('/api/favorites');
    return response.data;
  },
  
  addFavorite: async (coinId) => {
    const response = await apiClient.post('/api/favorites', { coinId });
    return response.data;
  },
  
  removeFavorite: async (coinId) => {
    await apiClient.delete(`/api/favorites/${coinId}`);
    return true;
  }
};

// Servicios para alertas
export const alertService = {
  getAllAlerts: async () => {
    const response = await apiClient.get('/api/alerts');
    return response.data;
  },
  
  createAlert: async (coinId, targetPrice, condition) => {
    const response = await apiClient.post('/api/alerts', {
      coinId,
      targetPrice,
      condition
    });
    return response.data;
  },
  
  deleteAlert: async (alertId) => {
    await apiClient.delete(`/api/alerts/${alertId}`);
    return true;
  },
  
  updateAlert: async (alertId, active) => {
    const response = await apiClient.patch(`/api/alerts/${alertId}`, { active });
    return response.data;
  }
}; 