const express = require('express');
const cors = require('cors');
const recipes = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

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

app.get('/health', (req, res) => {
  res.json({ service: 'recipes-service', status: 'ok' });
});

app.get('/recipes', (req, res) => {
  const { category, difficulty, maxTime, q } = req.query;
  const text = normalize(q);
  const maxMinutes = Number(maxTime || 0);

  const filtered = recipes.filter((recipe) => {
    const searchable = normalize([
      recipe.name,
      recipe.description,
      recipe.category,
      recipe.difficulty,
      recipe.ingredients.join(' ')
    ].join(' '));

    const matchesCategory = !category || normalize(recipe.category) === normalize(category);
    const matchesDifficulty = !difficulty || normalize(recipe.difficulty) === normalize(difficulty);
    const matchesTime = !maxMinutes || recipe.time <= maxMinutes;
    const matchesText = !text || searchable.includes(text);

    return matchesCategory && matchesDifficulty && matchesTime && matchesText;
  });

  res.json(filtered);
});

app.get('/recipes/:id', (req, res) => {
  const id = Number(req.params.id);
  const recipe = recipes.find((item) => item.id === id);

  if (!recipe) {
    res.status(404).json({ message: 'Receta no encontrada' });
    return;
  }

  res.json(recipe);
});

app.listen(PORT, () => {
  console.log(`recipes-service escuchando en puerto ${PORT}`);
});
