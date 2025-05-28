const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4002;
const PRICE_SERVICE_URL = process.env.PRICE_SERVICE_URL || 'http://localhost:4001';

// Caché para almacenar predicciones (2 minutos)
const cache = new NodeCache({ stdTTL: 120 });

// Middleware
app.use(cors());
app.use(express.json());

// Función simple para predecir precios futuros
function predictPrice(historicalData, days = 7) {
  try {
    // Convertir los precios a números
    const prices = historicalData.map(item => parseFloat(item.price));
    
    // Calcular la media móvil exponencial (muy simplificada)
    const alpha = 0.2; // Factor de suavizado
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = alpha * prices[i] + (1 - alpha) * ema;
    }
    
    // Calcular la tendencia promedio de las últimas 24 horas
    const priceDiff = prices[prices.length - 1] - prices[0];
    const percentChange = priceDiff / prices[0];
    const dailyChange = percentChange / prices.length * 24;
    
    // Generar predicciones para los próximos días
    const predictions = [];
    const lastPrice = prices[prices.length - 1];
    const lastTimestamp = historicalData[historicalData.length - 1].timestamp;
    
    for (let i = 1; i <= days; i++) {
      // Simulamos algo de aleatoriedad en la predicción
      const randomFactor = 1 + (Math.random() * 0.06 - 0.03); // ±3%
      
      // Combinamos la EMA con la tendencia y el factor aleatorio
      const predictedPrice = lastPrice * (1 + dailyChange * i) * 0.7 + ema * 0.3;
      const finalPrediction = predictedPrice * randomFactor;
      
      predictions.push({
        timestamp: lastTimestamp + (i * 24 * 60 * 60 * 1000),
        price: finalPrediction.toFixed(2)
      });
    }
    
    return predictions;
  } catch (error) {
    console.error('Error en la predicción:', error);
    return [];
  }
}

// Endpoint para obtener predicciones para una moneda específica
app.get('/api/predictions/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const days = parseInt(req.query.days) || 7;
    
    if (days > 30) {
      return res.status(400).json({ error: 'No se permiten predicciones de más de 30 días' });
    }
    
    // Verificar caché
    const cacheKey = `prediction_${coinId}_${days}`;
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }
    
    // Obtener datos históricos del servicio de precios
    const priceResponse = await axios.get(`${PRICE_SERVICE_URL}/api/prices/${coinId}`);
    const { historicalData } = priceResponse.data;
    
    if (!historicalData || historicalData.length === 0) {
      return res.status(404).json({ error: 'No hay datos históricos disponibles' });
    }
    
    // Generar predicciones
    const predictions = predictPrice(historicalData, days);
    
    const result = {
      coinId,
      lastUpdated: Date.now(),
      predictions
    };
    
    // Guardar en caché
    cache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error('Error al obtener predicciones:', error);
    res.status(500).json({ error: 'Error al generar predicciones' });
  }
});

// Endpoint para obtener predicciones para todas las monedas
app.get('/api/predictions', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    
    if (days > 30) {
      return res.status(400).json({ error: 'No se permiten predicciones de más de 30 días' });
    }
    
    // Obtener lista de monedas del servicio de precios
    const coinsResponse = await axios.get(`${PRICE_SERVICE_URL}/api/coins`);
    const coins = coinsResponse.data;
    
    const allPredictions = {};
    
    for (const coin of coins) {
      const cacheKey = `prediction_${coin.id}_${days}`;
      
      if (cache.has(cacheKey)) {
        allPredictions[coin.id] = cache.get(cacheKey);
      } else {
        try {
          // Obtener datos históricos
          const priceResponse = await axios.get(`${PRICE_SERVICE_URL}/api/prices/${coin.id}`);
          const { historicalData } = priceResponse.data;
          
          // Generar predicciones
          const predictions = predictPrice(historicalData, days);
          
          const result = {
            coinId: coin.id,
            lastUpdated: Date.now(),
            predictions
          };
          
          cache.set(cacheKey, result);
          allPredictions[coin.id] = result;
        } catch (error) {
          console.error(`Error al predecir ${coin.id}:`, error);
          // Continuamos con la siguiente moneda
        }
      }
    }
    
    res.json(allPredictions);
  } catch (error) {
    console.error('Error al obtener todas las predicciones:', error);
    res.status(500).json({ error: 'Error al generar predicciones' });
  }
});

app.listen(PORT, () => {
  console.log(`Servicio de predicción ejecutándose en http://localhost:${PORT}`);
}); 