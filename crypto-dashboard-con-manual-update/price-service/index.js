const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4001;

// Caché para almacenar datos temporalmente (5 segundos)
const cache = new NodeCache({ stdTTL: 5 });

// Middleware
app.use(cors());
app.use(express.json());

// Lista de criptomonedas disponibles
const SUPPORTED_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' }
];

// Datos simulados para cada moneda
function generatePriceData(coinId) {
  const now = Date.now();
  const basePrice = {
    'bitcoin': 40000,
    'ethereum': 2500,
    'ripple': 0.75,
    'litecoin': 150,
    'cardano': 1.2
  }[coinId] || 100;

  // Generar datos históricos para las últimas 24 horas (cada hora)
  const historicalData = [];
  for (let i = 24; i >= 0; i--) {
    const timestamp = now - (i * 60 * 60 * 1000);
    const variance = Math.random() * 0.1 - 0.05; // -5% a +5%
    const price = basePrice * (1 + variance);
    
    historicalData.push({
      timestamp,
      price: price.toFixed(2)
    });
  }

  return {
    id: coinId,
    currentPrice: parseFloat(historicalData[historicalData.length - 1].price),
    change24h: (
      (historicalData[historicalData.length - 1].price / historicalData[0].price - 1) * 100
    ).toFixed(2),
    historicalData
  };
}

// Endpoint para obtener la lista de criptomonedas
app.get('/api/coins', (req, res) => {
  res.json(SUPPORTED_COINS);
});

// Endpoint para obtener datos de una moneda específica
app.get('/api/prices/:coinId', (req, res) => {
  const { coinId } = req.params;
  
  // Verificar si la moneda es válida
  const isValidCoin = SUPPORTED_COINS.some(coin => coin.id === coinId);
  if (!isValidCoin) {
    return res.status(404).json({ error: 'Criptomoneda no encontrada' });
  }
  
  // Verificar caché
  const cacheKey = `price_${coinId}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }
  
  // Generar nuevos datos
  const priceData = generatePriceData(coinId);
  
  // Guardar en caché
  cache.set(cacheKey, priceData);
  
  res.json(priceData);
});

// Endpoint para obtener datos de todas las monedas
app.get('/api/prices', async (req, res) => {
  try {
    const allPrices = {};
    
    for (const coin of SUPPORTED_COINS) {
      const cacheKey = `price_${coin.id}`;
      
      if (cache.has(cacheKey)) {
        allPrices[coin.id] = cache.get(cacheKey);
      } else {
        const priceData = generatePriceData(coin.id);
        cache.set(cacheKey, priceData);
        allPrices[coin.id] = priceData;
      }
    }
    
    res.json(allPrices);
  } catch (error) {
    console.error('Error al obtener precios:', error);
    res.status(500).json({ error: 'Error al obtener datos de precios' });
  }
});

app.listen(PORT, () => {
  console.log(`Servicio de precios ejecutándose en http://localhost:${PORT}`);
}); 