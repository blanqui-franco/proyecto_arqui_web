const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

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
  res.json({ service: 'recipes-service', status: 'ok' });
});

app.get('/recipes', async (req, res) => {
  const { category, difficulty, maxTime, q } = req.query;
  const maxMinutes = Number(maxTime || 0);
  const text = (q || '').trim().toLowerCase();

  const conditions = [];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`r.category = $${params.length}`);
  }
  if (difficulty) {
    params.push(difficulty);
    conditions.push(`r.difficulty = $${params.length}`);
  }
  if (maxMinutes) {
    params.push(maxMinutes);
    conditions.push(`r.time_minutes <= $${params.length}`);
  }
  if (text) {
    params.push(`%${text}%`);
    const p = `$${params.length}`;
    conditions.push(`(
      lower(r.name) LIKE ${p} OR
      lower(r.description) LIKE ${p} OR
      lower(r.category) LIKE ${p} OR
      EXISTS (
        SELECT 1 FROM recipe_ingredients ri2
        JOIN ingredients i2 ON i2.id = ri2.ingredient_id
        WHERE ri2.recipe_id = r.id AND lower(i2.name) LIKE ${p}
      )
    )`);
  }

  const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const result = await pool.query(`
      SELECT
        r.id, r.name, r.description, r.category, r.difficulty,
        r.time_minutes AS time, r.match_default AS match,
        COALESCE(
          (SELECT ARRAY_AGG(i.name ORDER BY i.name)
           FROM recipe_ingredients ri
           JOIN ingredients i ON i.id = ri.ingredient_id
           WHERE ri.recipe_id = r.id),
          '{}'::text[]
        ) AS ingredients
      FROM recipes r
      ${whereClause}
      ORDER BY r.name
    `, params);

    res.json(result.rows);
  } catch (err) {
    console.error('Error en GET /recipes:', err.message);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.get('/recipes/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'ID inválido.' });
    return;
  }

  try {
    const result = await pool.query(`
      SELECT
        r.id, r.name, r.description, r.category, r.difficulty,
        r.time_minutes AS time, r.match_default AS match,
        COALESCE(
          (SELECT ARRAY_AGG(i.name ORDER BY i.name)
           FROM recipe_ingredients ri
           JOIN ingredients i ON i.id = ri.ingredient_id
           WHERE ri.recipe_id = r.id),
          '{}'::text[]
        ) AS ingredients,
        COALESCE(
          (SELECT ARRAY_AGG(rs.description ORDER BY rs.step_order)
           FROM recipe_steps rs
           WHERE rs.recipe_id = r.id),
          '{}'::text[]
        ) AS steps
      FROM recipes r
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Receta no encontrada.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error en GET /recipes/:id:', err.message);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`recipes-service escuchando en puerto ${PORT}`);
});
