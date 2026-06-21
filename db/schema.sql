-- ═══════════════════════════════════════════════════════════
-- SCHEMA — Che rembi'u
-- Se ejecuta automáticamente al levantar el contenedor
-- postgres por primera vez (docker-entrypoint-initdb.d).
-- ═══════════════════════════════════════════════════════════

-- ── Recetas ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recipes (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(120)  NOT NULL,
  description    TEXT          NOT NULL,
  category       VARCHAR(50)   NOT NULL,
  difficulty     VARCHAR(20)   NOT NULL,
  time_minutes   INT           NOT NULL,
  match_default  INT           NOT NULL DEFAULT 0,
  created_at     TIMESTAMP     NOT NULL DEFAULT now()
);

-- ── Catálogo de ingredientes ───────────────────────────────
CREATE TABLE IF NOT EXISTS ingredients (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

-- ── Relación receta ↔ ingredientes (N:N) ──────────────────
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id     INT NOT NULL REFERENCES recipes(id)     ON DELETE CASCADE,
  ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, ingredient_id)
);

-- ── Pasos de preparación ───────────────────────────────────
CREATE TABLE IF NOT EXISTS recipe_steps (
  id          SERIAL PRIMARY KEY,
  recipe_id   INT  NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_order  INT  NOT NULL,
  description TEXT NOT NULL
);

-- ── Historial de búsquedas ─────────────────────────────────
CREATE TABLE IF NOT EXISTS search_history (
  id               SERIAL PRIMARY KEY,
  ingredients_text TEXT      NOT NULL,
  results_count    INT       NOT NULL DEFAULT 0,
  searched_at      TIMESTAMP NOT NULL DEFAULT now()
);
