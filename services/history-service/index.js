const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === 'null' || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origen no permitido por CORS'));
  }
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'history-service', status: 'ok' });
});

app.post('/history', async (req, res) => {
  const { ingredients, results } = req.body;

  if (!ingredients || (typeof ingredients !== 'string' && !Array.isArray(ingredients))) {
    res.status(400).json({ message: 'El body debe incluir ingredients (string o array).' });
    return;
  }

  const ingredients_text = Array.isArray(ingredients) ? ingredients.join(', ') : ingredients.trim();
  const results_count = Number(results || 0);

  try {
    const q = `INSERT INTO search_history (ingredients_text, results_count) VALUES ($1, $2) RETURNING id, ingredients_text, results_count, searched_at`;
    const { rows } = await db.query(q, [ingredients_text, results_count]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('DB INSERT /history error', err);
    res.status(500).json({ message: 'Error al guardar el historial' });
  }
});

app.get('/history', async (req, res) => {
  try {
    const q = `SELECT id, ingredients_text AS ingredients, results_count AS results, searched_at AS date FROM search_history ORDER BY searched_at DESC LIMIT 20`;
    const { rows } = await db.query(q);
    res.json(rows);
  } catch (err) {
    console.error('DB SELECT /history error', err);
    res.status(500).json({ message: 'Error al leer el historial' });
  }
});

app.delete('/history', async (req, res) => {
  try {
    await db.query('DELETE FROM search_history');
    res.json({ message: 'Historial limpiado' });
  } catch (err) {
    console.error('DB DELETE /history error', err);
    res.status(500).json({ message: 'Error al limpiar el historial' });
  }
});

app.listen(PORT, () => {
  console.log(`history-service escuchando en puerto ${PORT}`);
});
