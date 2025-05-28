const express = require('express');
const axios = require('axios');
const router = express.Router();

const PRICE_SERVICE_URL = process.env.PRICE_SERVICE_URL || 'http://localhost:4001';

// Obtener la lista de todas las criptomonedas
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${PRICE_SERVICE_URL}/api/coins`);
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener lista de monedas:', error);
    res.status(500).json({ error: 'Error al obtener lista de monedas' });
  }
});

// Obtener datos de precios para todas las monedas
router.get('/prices', async (req, res) => {
  try {
    const response = await axios.get(`${PRICE_SERVICE_URL}/api/prices`);
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener precios:', error);
    res.status(500).json({ error: 'Error al obtener precios' });
  }
});

// Obtener datos de precio para una moneda específica
router.get('/:coinId/price', async (req, res) => {
  try {
    const { coinId } = req.params;
    const response = await axios.get(`${PRICE_SERVICE_URL}/api/prices/${coinId}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error al obtener precio de ${req.params.coinId}:`, error);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Criptomoneda no encontrada' });
    }
    
    res.status(500).json({ error: 'Error al obtener precio' });
  }
});

module.exports = router; 