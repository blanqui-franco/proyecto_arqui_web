/* ═══════════════════════════════════════════════════════════
   IMAGE HANDLER — Che rembi'u
   FileReader para vista previa de imagen +
   simulación de detección de ingredientes por IA.
═══════════════════════════════════════════════════════════ */

function initImageHandler() {
  const imageInput = document.getElementById('imageInput');
  if (!imageInput) return;

  imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    if (!preview) return;

    if (!file) {
      preview.innerHTML = '<p>Subí una imagen para verla aquí.</p>';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Imagen cargada por el usuario" />`;
    };
    reader.readAsDataURL(file);
  });
}

function simulateImageDetection() {
  const detected = ['huevo', 'queso Paraguay', 'harina', 'cebolla'];

  const inputEl = document.getElementById('ingredientsInput');
  if (inputEl) inputEl.value = detected.join(', ');

  const detectedEl = document.getElementById('detectedIngredients');
  if (detectedEl) {
    detectedEl.innerHTML = detected
      .map(i => `<span class="badge">${i}</span>`)
      .join('');
  }

  showToast('Detección simulada: ingredientes cargados.');
}
