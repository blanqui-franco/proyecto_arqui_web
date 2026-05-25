/* ═══════════════════════════════════════════════════════════
   FILTERS — Che rembi'u
   Normalización de texto para búsqueda y comparación local.
═══════════════════════════════════════════════════════════ */

function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}
