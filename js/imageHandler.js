/* ═══════════════════════════════════════════════════════════
   IMAGE HANDLER — Che rembi'u
   FileReader para vista previa de imagen +
   detección real de ingredientes via Gemini Vision API.
═══════════════════════════════════════════════════════════ */

var _currentImageBase64 = null;

var _ingredientAliases = {
  'tofu':              'queso paraguay',
  'queso blanco':      'queso paraguay',
  'queso fresco':      'queso paraguay',
  'feta':              'queso paraguay',
  'ricotta':           'queso paraguay',
  'mozzarella':        'queso paraguay',
  'soja':              'poroto',
  'soya':              'poroto',
  'edamame':           'poroto',
  'papa':              'mandioca',
  'patata':            'mandioca',
  'potato':            'mandioca',
  'cilantro':          'perejil',
  'coriander':         'perejil',
  'spring onion':      'cebolla de verdeo',
  'scallion':          'cebolla de verdeo',
  'green onion':       'cebolla de verdeo',
  'corn':              'maíz',
  'choclo':            'maíz',
};

function _normalizeIngredient(name) {
  var key = name.toLowerCase().trim();
  return _ingredientAliases[key] || key;
}

function initImageHandler() {
  const imageInput = document.getElementById('imageInput');
  if (!imageInput) return;

  imageInput.addEventListener('change', function (event) {
    _currentImageBase64 = null;

    var file = event.target.files && event.target.files[0];
    var preview = document.getElementById('imagePreview');

    if (!file) {
      if (preview) preview.innerHTML = '<p>Subí una imagen para verla aquí.</p>';
      return;
    }

    if (preview) {
      preview.innerHTML = '<p style="color:#555">Cargando imagen…</p>';
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      _currentImageBase64 = e.target.result;
      var p = document.getElementById('imagePreview');
      if (p) {
        p.innerHTML = '';
        var img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Imagen cargada';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '280px';
        img.style.borderRadius = '8px';
        p.appendChild(img);
      }
    };

    reader.onerror = function () {
      showToast('Error al leer la imagen. Probá con otro archivo.');
      _currentImageBase64 = null;
    };

    reader.readAsDataURL(file);
  });

  const detectBtn = document.getElementById('detectBtn');
  if (detectBtn) {
    detectBtn.addEventListener('click', detectIngredientsFromImage);
  }

  const clearImageBtn = document.getElementById('clearImageBtn');
  if (clearImageBtn) {
    clearImageBtn.addEventListener('click', clearImage);
  }
}

function clearImage() {
  _currentImageBase64 = null;

  const imageInput = document.getElementById('imageInput');
  if (imageInput) imageInput.value = '';

  const preview = document.getElementById('imagePreview');
  if (preview) preview.innerHTML = '<p>Subí una imagen para verla aquí.</p>';

  const detectedEl = document.getElementById('detectedIngredients');
  if (detectedEl) detectedEl.innerHTML = '';

  showToast('Imagen eliminada.');
}

async function detectIngredientsFromImage() {
  if (!_currentImageBase64) {
    showToast('Primero cargá una imagen.');
    return;
  }

  const detectBtn = document.getElementById('detectBtn');
  if (detectBtn) {
    detectBtn.disabled = true;
    detectBtn.textContent = 'Detectando…';
  }

  try {
    const { ingredients } = await API.detectIngredients(_currentImageBase64);

    const normalized = ingredients.map(_normalizeIngredient);

    normalized.forEach(function (ing) {
      addIngredientChip(ing);
    });

    const detectedEl = document.getElementById('detectedIngredients');
    if (detectedEl) {
      detectedEl.innerHTML = normalized
        .map(i => `<span class="badge">${i}</span>`)
        .join('');
    }

    showToast('Ingredientes detectados por IA: ' + normalized.join(', '));
  } catch (err) {
    console.error('Error al detectar ingredientes:', err.message);
    showToast('No se pudo detectar ingredientes. Verificá que vision-service esté activo en el puerto 3004.');
  } finally {
    if (detectBtn) {
      detectBtn.disabled = false;
      detectBtn.textContent = 'Detectar ingredientes';
    }
  }
}
