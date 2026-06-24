const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === 'null' || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origen no permitido por CORS'));
  }
}));
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/health', (req, res) => {
  res.json({ service: 'vision-service', status: 'ok' });
});

app.post('/vision', async (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.status(400).json({ message: 'Se requiere el campo image en base64.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ message: 'GEMINI_API_KEY no configurada en el servidor.' });
    return;
  }

  let mimeType = 'image/jpeg';
  let base64Data = image;

  const dataUrlMatch = image.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
  if (dataUrlMatch) {
    mimeType = dataUrlMatch[1];
    base64Data = dataUrlMatch[2];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt =
      'Analizá esta imagen e identificá todos los ingredientes de comida visibles. ' +
      'Respondé ÚNICAMENTE con un objeto JSON válido con este formato exacto, sin texto adicional:\n' +
      '{"ingredients":["ingrediente1","ingrediente2","ingrediente3"]}\n' +
      'Reglas: nombres en español, un solo nombre por ingrediente (sin paréntesis ni variantes), ' +
      'sin cantidades ni adjetivos de color/tamaño, sin punto final.';

    const result = await model.generateContent([
      { inlineData: { mimeType, data: base64Data } },
      prompt
    ]);

    const text = result.response.text().trim();

    let ingredients = [];
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      ingredients = (parsed.ingredients || [])
        .map((s) => String(s).trim().toLowerCase())
        .filter(Boolean);
    } catch (parseErr) {
      /* fallback: split por coma o salto de línea */
      ingredients = text
        .replace(/[\{\}\[\]"]/g, '')
        .split(/[,\n]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    }

    res.json({ ingredients });
  } catch (err) {
    console.error('Error al llamar a Gemini Vision:', err.message);
    res.status(502).json({ message: 'Error al procesar la imagen con Gemini.' });
  }
});

app.listen(PORT, () => {
  console.log(`vision-service escuchando en puerto ${PORT}`);
});
