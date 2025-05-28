const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Rutas
const coinsRoutes = require('./routes/coins');
const predictionsRoutes = require('./routes/predictions');
const favoritesRoutes = require('./routes/favorites');
const alertsRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-dashboard';

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
    // Podemos continuar sin BD en caso de error, algunas funciones no estarán disponibles
  });

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/coins', coinsRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/alerts', alertsRoutes);

// Ruta de estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
}); 