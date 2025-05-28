const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');

// Obtener todos los favoritos
router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: 'default-user' });
    res.json(favorites);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Añadir un favorito
router.post('/', async (req, res) => {
  try {
    const { coinId } = req.body;
    
    if (!coinId) {
      return res.status(400).json({ error: 'Se requiere coinId' });
    }
    
    const favorite = new Favorite({
      userId: 'default-user',
      coinId
    });
    
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) { // Error de duplicado
      return res.status(409).json({ error: 'Esta moneda ya está en favoritos' });
    }
    
    console.error('Error al añadir favorito:', error);
    res.status(500).json({ error: 'Error al añadir favorito' });
  }
});

// Eliminar un favorito
router.delete('/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    
    const result = await Favorite.deleteOne({
      userId: 'default-user',
      coinId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});

module.exports = router; 