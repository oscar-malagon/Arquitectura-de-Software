const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default-user', // En una app real tendríamos usuarios
    required: true
  },
  coinId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para evitar duplicados
favoriteSchema.index({ userId: 1, coinId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema); 