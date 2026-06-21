-- ═══════════════════════════════════════════════════════════
-- SEED — Che rembi'u
-- Carga las 7 recetas del prototipo con sus ingredientes
-- y pasos de preparación.
-- ═══════════════════════════════════════════════════════════

-- ── Recetas ───────────────────────────────────────────────
INSERT INTO recipes (id, name, description, category, difficulty, time_minutes, match_default) VALUES
  (1, 'Tortilla paraguaya',     'Una opción rápida y rendidora usando ingredientes básicos.',           'Tradicional', 'Fácil', 25, 90),
  (2, 'Omelette de queso',      'Receta sencilla para resolver una comida en pocos minutos.',           'Rápida',      'Fácil', 10, 85),
  (3, 'Sopa paraguaya simple',  'Versión práctica de una comida tradicional paraguaya.',                'Tradicional', 'Media', 55, 75),
  (4, 'Chipa guasu',            'Plato tradicional a base de choclo y queso.',                          'Tradicional', 'Media', 60, 70),
  (5, 'Arroz salteado económico','Ideal para reutilizar arroz cocido y verduras disponibles.',          'Económica',   'Fácil', 20, 65),
  (6, 'Mbeju rápido',           'Preparación típica con almidón y queso.',                             'Tradicional', 'Fácil', 18, 80),
  (7, 'Panqueques dulces',      'Opción dulce con pocos ingredientes.',                                 'Postre',      'Fácil', 22, 68);

-- Resetear la secuencia para que el próximo SERIAL empiece desde 8
SELECT setval('recipes_id_seq', 7);

-- ── Ingredientes (catálogo normalizado) ───────────────────
INSERT INTO ingredients (name) VALUES
  ('huevo'),
  ('queso paraguay'),
  ('harina'),
  ('leche'),
  ('sal'),
  ('queso'),
  ('oregano'),
  ('harina de maiz'),
  ('cebolla'),
  ('choclo'),
  ('arroz'),
  ('zanahoria'),
  ('aceite'),
  ('almidon'),
  ('manteca'),
  ('azucar');

-- ── Relaciones receta ↔ ingrediente ───────────────────────
-- Receta 1: Tortilla paraguaya
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 1, id FROM ingredients WHERE name IN ('huevo','queso paraguay','harina','leche','sal');

-- Receta 2: Omelette de queso
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 2, id FROM ingredients WHERE name IN ('huevo','queso','sal','oregano');

-- Receta 3: Sopa paraguaya simple
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 3, id FROM ingredients WHERE name IN ('harina de maiz','queso paraguay','cebolla','huevo','leche');

-- Receta 4: Chipa guasu
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 4, id FROM ingredients WHERE name IN ('choclo','queso paraguay','huevo','leche','cebolla');

-- Receta 5: Arroz salteado económico
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 5, id FROM ingredients WHERE name IN ('arroz','zanahoria','cebolla','huevo','aceite');

-- Receta 6: Mbeju rápido
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 6, id FROM ingredients WHERE name IN ('almidon','queso paraguay','manteca','sal','leche');

-- Receta 7: Panqueques dulces
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 7, id FROM ingredients WHERE name IN ('harina','huevo','leche','azucar','manteca');

-- ── Pasos de preparación ──────────────────────────────────
-- Receta 1: Tortilla paraguaya
INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES
  (1, 1, 'Batir los huevos con una pizca de sal.'),
  (1, 2, 'Agregar la harina, la leche y mezclar hasta formar una preparación uniforme.'),
  (1, 3, 'Incorporar el queso desmenuzado.'),
  (1, 4, 'Cocinar en sartén caliente hasta dorar ambos lados.');

-- Receta 2: Omelette de queso
INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES
  (2, 1, 'Batir los huevos con sal y orégano.'),
  (2, 2, 'Verter la mezcla en una sartén caliente.'),
  (2, 3, 'Agregar queso en el centro.'),
  (2, 4, 'Doblar el omelette y cocinar hasta que el queso se derrita.');

-- Receta 3: Sopa paraguaya simple
INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES
  (3, 1, 'Rehogar la cebolla hasta que quede transparente.'),
  (3, 2, 'Mezclar la harina de maíz con leche, huevo y queso.'),
  (3, 3, 'Agregar la cebolla rehogada.'),
  (3, 4, 'Hornear hasta que la superficie quede dorada.');

-- Receta 4: Chipa guasu
INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES
  (4, 1, 'Procesar o moler el choclo.'),
  (4, 2, 'Mezclar con huevo, leche, queso y cebolla rehogada.'),
  (4, 3, 'Colocar la preparación en una fuente.'),
  (4, 4, 'Hornear hasta que tenga consistencia firme.');

-- Receta 5: Arroz salteado económico
INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES
  (5, 1, 'Picar la cebolla y la zanahoria.'),
  (5, 2, 'Saltear las verduras en una sartén.'),
  (5, 3, 'Agregar el arroz cocido.'),
  (5, 4, 'Incorporar huevo revuelto y mezclar.');

-- Receta 6: Mbeju rápido
INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES
  (6, 1, 'Mezclar almidón, sal y manteca hasta obtener una textura arenosa.'),
  (6, 2, 'Agregar queso desmenuzado.'),
  (6, 3, 'Humedecer levemente con leche si es necesario.'),
  (6, 4, 'Cocinar en sartén presionando hasta dorar ambos lados.');

-- Receta 7: Panqueques dulces
INSERT INTO recipe_steps (recipe_id, step_order, description) VALUES
  (7, 1, 'Mezclar harina, huevo, leche y azúcar.'),
  (7, 2, 'Dejar reposar la mezcla unos minutos.'),
  (7, 3, 'Cocinar porciones finas en una sartén.'),
  (7, 4, 'Servir con dulce, miel o frutas.');
