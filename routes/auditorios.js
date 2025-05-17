const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de auditorios desactivada. Usa /api/edificios/:nombre' });
});

module.exports = router;
