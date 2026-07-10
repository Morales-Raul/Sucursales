const express = require('express');
const router = express.Router();
const Sucursal = require('../models/Sucursal');


router.get('/', async (req, res) => {
  try {
    console.log('🔍 Buscando sucursales activas...');
    const sucursales = await Sucursal.findAll({
      where: { activa: true }
    });
    console.log(`✅ Encontradas ${sucursales.length} sucursales activas`);
    res.json(sucursales);
  } catch (error) {
    console.error('❌ Error en GET /:', error);
    res.status(500).json({ error: 'Error al obtener sucursales', details: error.message });
  }
});


router.get('/todas', async (req, res) => {
  try {
    console.log('🔍 Buscando todas las sucursales...');
    const sucursales = await Sucursal.findAll();
    console.log(`✅ Encontradas ${sucursales.length} sucursales totales`);
    res.json(sucursales);
  } catch (error) {
    console.error('❌ Error en GET /todas:', error);
    res.status(500).json({ error: 'Error al obtener todas las sucursales', details: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { nombre, direccion, telefono } = req.body;
    console.log('📝 Creando nueva sucursal:', { nombre, direccion, telefono });
    
    const nuevaSucursal = await Sucursal.create({ 
      nombre, 
      direccion, 
      telefono,
      activa: true 
    });
    
    console.log('✅ Sucursal creada:', nuevaSucursal.id);
    res.status(201).json(nuevaSucursal);
  } catch (error) {
    console.error('❌ Error en POST /:', error);
    res.status(500).json({ error: 'Error al crear sucursal', details: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;
    console.log('✏️ Actualizando sucursal:', id);
    
    await Sucursal.update({ nombre, direccion, telefono }, { 
      where: { id } 
    });
    
    console.log('✅ Sucursal actualizada:', id);
    res.json({ mensaje: 'Sucursal actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error en PUT /:id:', error);
    res.status(500).json({ error: 'Error al actualizar sucursal', details: error.message });
  }
});


router.put('/baja/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('⏸️ Dando de baja sucursal:', id);
    
    await Sucursal.update({ activa: false }, { 
      where: { id } 
    });
    
    console.log('✅ Sucursal dada de baja:', id);
    res.json({ mensaje: 'Sucursal dada de baja correctamente' });
  } catch (error) {
    console.error('❌ Error en PUT /baja/:id:', error);
    res.status(500).json({ error: 'Error al dar de baja la sucursal', details: error.message });
  }
});


router.put('/alta/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('▶️ Dando de alta sucursal:', id);
    
    await Sucursal.update({ activa: true }, { 
      where: { id } 
    });
    
    console.log('✅ Sucursal dada de alta:', id);
    res.json({ mensaje: 'Sucursal dada de alta correctamente' });
  } catch (error) {
    console.error('❌ Error en PUT /alta/:id:', error);
    res.status(500).json({ error: 'Error al dar de alta la sucursal', details: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Eliminando permanentemente sucursal:', id);
    
    await Sucursal.destroy({ 
      where: { id } 
    });
    
    console.log('✅ Sucursal eliminada permanentemente:', id);
    res.json({ mensaje: 'Sucursal eliminada permanentemente' });
  } catch (error) {
    console.error('❌ Error en DELETE /:id:', error);
    res.status(500).json({ error: 'Error al eliminar la sucursal', details: error.message });
  }
});

module.exports = router;