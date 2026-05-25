const express = require('express');
const cors = require('cors');
const recipes = require('./data');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin(origin, callback) {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
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
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function calculateMatch(recipe, inputIngredients) {
  if (!inputIngredients.length) return recipe.match;

  const recipeIngredients = recipe.ingredients.map(normalize);
  const matches = inputIngredients.filter((ingredient) =>
    recipeIngredients.some((recipeIngredient) =>
      recipeIngredient.includes(ingredient) || ingredient.includes(recipeIngredient)
    )
  );

  return Math.round((matches.length / recipeIngredients.length) * 100);
}

app.get('/health', (req, res) => {
  res.json({ service: 'search-service', status: 'ok' });
});

app.post('/search', (req, res) => {
  const ingredients = Array.isArray(req.body.ingredients)
    ? req.body.ingredients.map(normalize).filter(Boolean)
    : [];

  if (!ingredients.length) {
    res.status(400).json({ message: 'El body debe incluir ingredients como array no vacio.' });
    return;
  }

  const results = recipes
    .map((recipe) => ({ ...recipe, match: calculateMatch(recipe, ingredients) }))
    .filter((recipe) => recipe.match > 0)
    .sort((a, b) => b.match - a.match);

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`search-service escuchando en puerto ${PORT}`);
});
