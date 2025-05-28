const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default-user', // En una app real tendríamos usuarios
    required: true
  },
  coinId: {
    type: String,
    required: true
  },
  targetPrice: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['above', 'below'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema); 