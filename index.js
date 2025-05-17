const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err.message));

// Rutas
app.use('/api/auditorios', require('./routes/auditorios'));   // si aún usas una general
app.use('/api/chatgpt', require('./routes/chatgpt'));         // IA
app.use('/api/edificios', require('./routes/edificios'));     // 🆕 edificio -> colección

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
