const express = require('express');
const cors = require('cors');
const db = require('./db');
const { TextGenerationClient } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ service: 'suggestion-service', status: 'ok' }));

app.post('/suggest', async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    res.status(400).json({ message: 'Body debe incluir ingredients: string[]' });
    return;
  }

  try {
    // Consultar recetas disponibles para contexto
    const q = `SELECT id, name, description, category FROM recipes`;
    const { rows: recipes } = await db.query(q);

    const contextRecipes = recipes.slice(0, 10).map(r => `- ${r.name} (${r.category}): ${r.description}`).join('\n');

    const prompt = `Eres un asistente culinario. El usuario tiene estos ingredientes: ${ingredients.join(', ')}.\n\nRecetas disponibles:\n${contextRecipes}\n\nSugiere 3 recetas que pueda preparar con esos ingredientes, explica por qué cada una es adecuada, y sugiere pequeñas modificaciones si faltan ingredientes.`;

    // Client init
    const client = new TextGenerationClient({ apiKey: process.env.GEMINI_API_KEY });
    const response = await client.generate({
      model: 'gemini-2.0-flash',
      prompt,
      maxOutputTokens: 512,
    });

    const suggestion = response.text || response.output?.[0]?.content || 'No se obtuvo sugerencia';
    res.json({ suggestion });
  } catch (err) {
    console.error('Error /suggest', err);
    res.status(500).json({ message: 'Error al generar sugerencia' });
  }
});

app.listen(PORT, () => {
  console.log(`suggestion-service escuchando en puerto ${PORT}`);
});
