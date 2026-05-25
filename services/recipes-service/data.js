const recipes = [
  {
    id: 1,
    name: 'Tortilla paraguaya',
    category: 'Tradicional',
    time: 25,
    difficulty: 'F\u00e1cil',
    match: 90,
    description: 'Una opcion rapida y rendidora usando ingredientes basicos.',
    ingredients: ['huevo', 'queso Paraguay', 'harina', 'leche', 'sal'],
    steps: [
      'Batir los huevos con una pizca de sal.',
      'Agregar la harina, la leche y mezclar hasta formar una preparacion uniforme.',
      'Incorporar el queso desmenuzado.',
      'Cocinar en sarten caliente hasta dorar ambos lados.'
    ]
  },
  {
    id: 2,
    name: 'Omelette de queso',
    category: 'R\u00e1pida',
    time: 10,
    difficulty: 'F\u00e1cil',
    match: 85,
    description: 'Receta sencilla para resolver una comida en pocos minutos.',
    ingredients: ['huevo', 'queso', 'sal', 'oregano'],
    steps: [
      'Batir los huevos con sal y oregano.',
      'Verter la mezcla en una sarten caliente.',
      'Agregar queso en el centro.',
      'Doblar el omelette y cocinar hasta que el queso se derrita.'
    ]
  },
  {
    id: 3,
    name: 'Sopa paraguaya simple',
    category: 'Tradicional',
    time: 55,
    difficulty: 'Media',
    match: 75,
    description: 'Version practica de una comida tradicional paraguaya.',
    ingredients: ['harina de maiz', 'queso Paraguay', 'cebolla', 'huevo', 'leche'],
    steps: [
      'Rehogar la cebolla hasta que quede transparente.',
      'Mezclar la harina de maiz con leche, huevo y queso.',
      'Agregar la cebolla rehogada.',
      'Hornear hasta que la superficie quede dorada.'
    ]
  },
  {
    id: 4,
    name: 'Chipa guasu',
    category: 'Tradicional',
    time: 60,
    difficulty: 'Media',
    match: 70,
    description: 'Plato tradicional a base de choclo y queso.',
    ingredients: ['choclo', 'queso Paraguay', 'huevo', 'leche', 'cebolla'],
    steps: [
      'Procesar o moler el choclo.',
      'Mezclar con huevo, leche, queso y cebolla rehogada.',
      'Colocar la preparacion en una fuente.',
      'Hornear hasta que tenga consistencia firme.'
    ]
  },
  {
    id: 5,
    name: 'Arroz salteado economico',
    category: 'Econ\u00f3mica',
    time: 20,
    difficulty: 'F\u00e1cil',
    match: 65,
    description: 'Ideal para reutilizar arroz cocido y verduras disponibles.',
    ingredients: ['arroz', 'zanahoria', 'cebolla', 'huevo', 'aceite'],
    steps: [
      'Picar la cebolla y la zanahoria.',
      'Saltear las verduras en una sarten.',
      'Agregar el arroz cocido.',
      'Incorporar huevo revuelto y mezclar.'
    ]
  },
  {
    id: 6,
    name: 'Mbeju rapido',
    category: 'Tradicional',
    time: 18,
    difficulty: 'F\u00e1cil',
    match: 80,
    description: 'Preparacion tipica con almidon y queso.',
    ingredients: ['almidon', 'queso Paraguay', 'manteca', 'sal', 'leche'],
    steps: [
      'Mezclar almidon, sal y manteca hasta obtener una textura arenosa.',
      'Agregar queso desmenuzado.',
      'Humedecer levemente con leche si es necesario.',
      'Cocinar en sarten presionando hasta dorar ambos lados.'
    ]
  },
  {
    id: 7,
    name: 'Panqueques dulces',
    category: 'Postre',
    time: 22,
    difficulty: 'F\u00e1cil',
    match: 68,
    description: 'Opcion dulce con pocos ingredientes.',
    ingredients: ['harina', 'huevo', 'leche', 'azucar', 'manteca'],
    steps: [
      'Mezclar harina, huevo, leche y azucar.',
      'Dejar reposar la mezcla unos minutos.',
      'Cocinar porciones finas en una sarten.',
      'Servir con dulce, miel o frutas.'
    ]
  }
];

module.exports = recipes;
