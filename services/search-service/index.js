const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

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

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function calculateMatch(recipeIngredients, inputIngredients) {
  if (!recipeIngredients.length) return 0;
  const matched = inputIngredients.filter((input) =>
    recipeIngredients.some((ri) => ri.includes(input) || input.includes(ri))
  ).length;
  if (matched === 0) return 0;
  const coverage  = matched / recipeIngredients.length;          // ¿cuánto de la receta cubrís?
  const precision = matched / inputIngredients.length;           // ¿qué tan relevantes son tus ingredientes?
  return Math.round(((2 * coverage + precision) / 3) * 100);
}

app.get('/health', (req, res) => {
  res.json({ service: 'search-service', status: 'ok' });
});

app.post('/search', async (req, res) => {
  const inputIngredients = Array.isArray(req.body.ingredients)
    ? req.body.ingredients.map(normalize).filter(Boolean)
    : [];

  if (!inputIngredients.length) {
    res.status(400).json({ message: 'El body debe incluir ingredients como array no vacío.' });
    return;
  }

  try {
    const result = await pool.query(`
      SELECT
        r.id, r.name, r.description, r.category, r.difficulty,
        r.time_minutes AS time, r.match_default AS match,
        COALESCE(
          ARRAY_AGG(i.name ORDER BY i.name) FILTER (WHERE i.name IS NOT NULL),
          '{}'::text[]
        ) AS ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
      LEFT JOIN ingredients i ON i.id = ri.ingredient_id
      GROUP BY r.id
    `);

    const results = result.rows
      .map((recipe) => ({
        ...recipe,
        match: calculateMatch(recipe.ingredients.map(normalize), inputIngredients)
      }))
      .filter((recipe) => recipe.match > 0)
      .sort((a, b) => b.match - a.match);

    res.json(results);
  } catch (err) {
    console.error('Error en POST /search:', err.message);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`search-service escuchando en puerto ${PORT}`);
});
