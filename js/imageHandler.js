/* ═══════════════════════════════════════════════════════════
   IMAGE HANDLER — Che rembi'u
   FileReader para vista previa de imagen +
   detección real de ingredientes via Gemini Vision API.
═══════════════════════════════════════════════════════════ */

var _currentImageBase64 = null;

function initImageHandler() {
  const imageInput = document.getElementById('imageInput');
  if (!imageInput) return;

  imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    if (!preview) return;

    _currentImageBase64 = null;

    if (!file) {
      preview.innerHTML = '<p>Subí una imagen para verla aquí.</p>';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      _currentImageBase64 = e.target.result;
      preview.innerHTML = `<img src="${e.target.result}" alt="Imagen cargada por el usuario" />`;
    };
    reader.readAsDataURL(file);
  });

  const detectBtn = document.getElementById('detectBtn');
  if (detectBtn) {
    detectBtn.addEventListener('click', detectIngredientsFromImage);
  }
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

    const inputEl = document.getElementById('ingredientInput') || document.getElementById('ingredientsInput');
    if (inputEl) inputEl.value = ingredients.join(', ');

    const detectedEl = document.getElementById('detectedIngredients');
    if (detectedEl) {
      detectedEl.innerHTML = ingredients
        .map(i => `<span class="badge">${i}</span>`)
        .join('');
    }

    showToast('Ingredientes detectados por IA: ' + ingredients.join(', '));
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
