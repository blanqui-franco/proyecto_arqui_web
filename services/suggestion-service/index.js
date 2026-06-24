const express = require('express');
const cors = require('cors');
const db = require('./db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === 'null' || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origen no permitido por CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ service: 'suggestion-service', status: 'ok' }));

/* ── Insertar receta nueva en la BD ──────────────────────── */
async function insertRecipe(recipe) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { rows: [newRecipe] } = await client.query(
      `INSERT INTO recipes (name, description, category, difficulty, time_minutes, match_default)
       VALUES ($1, $2, $3, $4, $5, 0) RETURNING id`,
      [
        recipe.name,
        recipe.description,
        recipe.category   || 'Tradicional',
        recipe.difficulty || 'Media',
        recipe.timeMinutes || 30
      ]
    );
    const recipeId = newRecipe.id;

    for (const ingName of (recipe.ingredients || [])) {
      const normalized = ingName.trim().toLowerCase();
      if (!normalized) continue;

      await client.query(
        `INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [normalized]
      );
      const { rows: [ing] } = await client.query(
        `SELECT id FROM ingredients WHERE name = $1`,
        [normalized]
      );
      await client.query(
        `INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [recipeId, ing.id]
      );
    }

    for (let i = 0; i < (recipe.steps || []).length; i++) {
      await client.query(
        `INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES ($1, $2, $3)`,
        [recipeId, i + 1, recipe.steps[i]]
      );
    }

    await client.query('COMMIT');
    return recipeId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/* ── POST /suggest ───────────────────────────────────────── */
app.post('/suggest', async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400).json({ message: 'Body debe incluir ingredients: string[] no vacío' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ message: 'GEMINI_API_KEY no configurada en el servidor.' });
    return;
  }

  try {
    const { rows: existingRecipes } = await db.query(
      `SELECT id, name, category, description FROM recipes ORDER BY name`
    );

    const recipeList = existingRecipes
      .map(r => `[ID:${r.id}] ${r.name} (${r.category}): ${r.description}`)
      .join('\n');

    const prompt = `Sos un asistente culinario experto en gastronomía tradicional paraguaya.
El usuario tiene estos ingredientes: ${ingredients.join(', ')}.

Recetas ya registradas en el sistema:
${recipeList}

Tu tarea:
- Si alguna receta existente se puede preparar (o casi) con esos ingredientes, usala.
- Si ninguna encaja bien, CREÁ 1 o 2 recetas nuevas de cocina tradicional paraguaya que sí encajen.
- Priorizá siempre platos tradicionales paraguayos (sopa paraguaya, mbeju, chipa, bori bori, etc).

Respondé ÚNICAMENTE con JSON válido, sin texto extra ni bloques de código markdown:
{
  "suggestion": "explicación breve de las sugerencias",
  "recipes": [
    {
      "existingId": 3
    },
    {
      "existingId": null,
      "name": "Nombre de la receta nueva",
      "description": "Descripción breve",
      "category": "Tradicional",
      "difficulty": "Fácil",
      "timeMinutes": 30,
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "steps": ["Paso 1 detallado", "Paso 2 detallado", "Paso 3 detallado"]
    }
  ]
}

Categorías válidas: Tradicional, Rápida, Económica, Postre.
Dificultades válidas: Fácil, Media.
Para recetas existentes usá solo { "existingId": N }. Para recetas nuevas usá existingId: null y completá todos los campos.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      return res.json({ suggestion: raw, recipeIds: [], newCount: 0 });
    }

    const recipeIds = [];
    let newCount = 0;

    for (const entry of (parsed.recipes || [])) {
      if (entry.existingId) {
        recipeIds.push(Number(entry.existingId));
      } else if (entry.name) {
        try {
          const newId = await insertRecipe(entry);
          recipeIds.push(newId);
          newCount++;
          console.log(`Nueva receta insertada: "${entry.name}" (ID ${newId})`);
        } catch (insertErr) {
          console.error(`Error insertando "${entry.name}":`, insertErr.message);
        }
      }
    }

    res.json({
      suggestion: parsed.suggestion || raw,
      recipeIds,
      newCount
    });

  } catch (err) {
    console.error('Error /suggest:', err.message);
    res.status(502).json({ message: 'Error al generar sugerencia con Gemini.' });
  }
});

app.listen(PORT, () => {
  console.log(`suggestion-service escuchando en puerto ${PORT}`);
});
