// 📁 routes/chatgpt.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { pregunta } = req.body;

  try {
    const db = mongoose.connection.useDb('Edificios');
    const colecciones = await db.listCollections().toArray();

    let auditorios = [];
    for (const col of colecciones) {
      const docs = await db.collection(col.name).find().toArray();
      auditorios.push(...docs.map(doc => ({ ...doc, edificio: col.name })));
    }

    const resumen = auditorios.map(a => {
      return [
        `nombre: ${a.nombre || 'N/A'}`,
        `capacidad: ${a.capacidad || 'N/A'}`,
        `edificio: ${a.edificio || 'N/A'}`,
        // Agrega otros campos aquí si los necesitas
      ].join(', ');
    }).join('\n');

    const prompt = `
Estos son los auditorios disponibles:

${resumen}

Responde usando solo esta información. No inventes.

Pregunta: ${pregunta}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Responde con base en los datos proporcionados. No inventes.' },
        { role: 'user', content: prompt }
      ]
    });

    res.json({ respuesta: response.choices[0].message.content });

  } catch (error) {
    console.error('❌ Error al consultar ChatGPT:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    res.status(500).json({ error: 'Error al consultar ChatGPT' });
  }
});

module.exports = router;
