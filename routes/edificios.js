const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/:nombre', async (req, res) => {
  const nombre = req.params.nombre;
  const db = mongoose.connection.useDb('Edificios'); // ✅ E mayúscula exacta


  try {
    const coleccion = db.collection(nombre);
    const auditorios = await coleccion.find({}).toArray();
    console.log("📦 Consultando colección:", nombre);
    console.log("📋 Resultados:", auditorios.length);
    res.json(auditorios);
  } catch (err) {
    console.error('❌ Error al obtener auditorios:', err.message);
    res.status(500).json({ error: 'No se pudo obtener la colección.' });
  }
});

module.exports = router;
