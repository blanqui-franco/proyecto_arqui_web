const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;
const history = [];

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

app.get('/health', (req, res) => {
  res.json({ service: 'history-service', status: 'ok' });
});

app.post('/history', (req, res) => {
  const { ingredients, results, date } = req.body;

  if (!ingredients || typeof ingredients !== 'string') {
    res.status(400).json({ message: 'El body debe incluir ingredients como texto.' });
    return;
  }

  const entry = {
    id: history.length + 1,
    ingredients: ingredients.trim(),
    results: Number(results || 0),
    date: date || new Date().toLocaleString('es-PY')
  };

  history.unshift(entry);
  res.status(201).json(entry);
});

app.get('/history', (req, res) => {
  res.json(history);
});

app.delete('/history', (req, res) => {
  history.length = 0;
  res.json({ message: 'Historial limpiado', history });
});

app.listen(PORT, () => {
  console.log(`history-service escuchando en puerto ${PORT}`);
});
