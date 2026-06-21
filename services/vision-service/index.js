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

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Data
        }
      },
      'Lista los ingredientes de comida que ves en esta imagen. Responde solo con una lista de nombres en español, separados por comas.'
    ]);

    const text = result.response.text();
    const ingredients = text
      .split(',')
      .map((s) => s.replace(/\n/g, '').trim())
      .filter(Boolean);

    res.json({ ingredients });
  } catch (err) {
    console.error('Error al llamar a Gemini Vision:', err.message);
    res.status(502).json({ message: 'Error al procesar la imagen con Gemini.' });
  }
});

app.listen(PORT, () => {
  console.log(`vision-service escuchando en puerto ${PORT}`);
});
