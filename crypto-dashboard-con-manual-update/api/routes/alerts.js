const express = require('express');
const router = express.Router();
const Alert = require('../models/alert');

// Obtener todas las alertas
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: 'default-user' });
    res.json(alerts);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

// Crear una nueva alerta
router.post('/', async (req, res) => {
  try {
    const { coinId, targetPrice, condition } = req.body;
    
    if (!coinId || !targetPrice || !condition) {
      return res.status(400).json({ 
        error: 'Se requieren coinId, targetPrice y condition' 
      });
    }
    
    if (condition !== 'above' && condition !== 'below') {
      return res.status(400).json({ 
        error: 'condition debe ser "above" o "below"' 
      });
    }
    
    const alert = new Alert({
      userId: 'default-user',
      coinId,
      targetPrice,
      condition
    });
    
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({ error: 'Error al crear alerta' });
  }
});

// Eliminar una alerta
router.delete('/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    
    const result = await Alert.deleteOne({
      _id: alertId,
      userId: 'default-user'
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({ error: 'Error al eliminar alerta' });
  }
});

// Actualizar estado de una alerta
router.patch('/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { active } = req.body;
    
    if (active === undefined) {
      return res.status(400).json({ error: 'Se requiere el campo active' });
    }
    
    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId: 'default-user' },
      { active },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({ error: 'Alerta no encontrada' });
    }
    
    res.json(alert);
  } catch (error) {
    console.error('Error al actualizar alerta:', error);
    res.status(500).json({ error: 'Error al actualizar alerta' });
  }
});

module.exports = router; 