const express = require('express');
const axios = require('axios');
const router = express.Router();

const PREDICTION_SERVICE_URL = process.env.PREDICTION_SERVICE_URL || 'http://localhost:4002';

// Obtener predicciones para todas las monedas
router.get('/', async (req, res) => {
  try {
    const { days } = req.query;
    const url = `${PREDICTION_SERVICE_URL}/api/predictions${days ? `?days=${days}` : ''}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener predicciones:', error);
    res.status(500).json({ error: 'Error al obtener predicciones' });
  }
});

// Obtener predicción para una moneda específica
router.get('/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const { days } = req.query;
    
    const url = `${PREDICTION_SERVICE_URL}/api/predictions/${coinId}${days ? `?days=${days}` : ''}`;
    const response = await axios.get(url);
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error al obtener predicción para ${req.params.coinId}:`, error);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Predicción no disponible' });
    }
    
    res.status(500).json({ error: 'Error al obtener predicción' });
  }
});

module.exports = router; 