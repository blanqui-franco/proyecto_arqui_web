export function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function catClass(category) {
  const map = { Tradicional: 'cat-Tradicional', 'Rápida': 'cat-Rápida', 'Económica': 'cat-Económica', Postre: 'cat-Postre' };
  return map[category] || 'cat-default';
}

export function catEmoji(category) {
  const map = { Tradicional: '🍲', 'Rápida': '⚡', 'Económica': '💚', Postre: '🍮' };
  return map[category] || '🍽️';
}
