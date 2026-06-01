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
    ],
    history: 'Su origen es mestizo: la tradici\u00f3n guaran\u00ed aport\u00f3 los sabores locales mientras que los colonizadores espa\u00f1oles introdujeron el trigo, el queso y la t\u00e9cnica de fre\u00edr en grasa. Era un alimento humilde y nutritivo, perfecto para el desayuno junto al cocido quemado o para la merienda con terer\u00e9. Con el tiempo se convirti\u00f3 en uno de los platos m\u00e1s cotidianos e identitarios de la mesa paraguaya.'
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
    ],
    history: 'Sus ra\u00edces se remontan a tiempos prehist\u00f3ricos, cuando los huevos se cocinaban sobre piedras calientes. La palabra "omelette" apareci\u00f3 por primera vez en publicaciones culinarias francesas del siglo XVII, y fue en Francia donde se perfeccion\u00f3 la t\u00e9cnica de batir y doblar los huevos en sart\u00e9n. Hoy es uno de los platos m\u00e1s vers\u00e1tiles del mundo, presente en pr\u00e1cticamente todas las tradiciones culinarias.'
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
    ],
    history: 'Cuenta la leyenda que nació en el siglo XIX durante el gobierno del presidente Carlos Antonio López, cuando su cocinera cometió un error y la preparación quedó sólida en lugar de líquida. También se cree que su nombre deriva del guaraní "So\'o opa" ("se acabó la carne"), frase que los españoles habrían interpretado como "sopa". En 2017 fue declarada Patrimonio Cultural Inmaterial del Paraguay por la Secretaría Nacional de Cultura.'
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
    ],
    history: 'Sus raíces prehispánicas se encuentran en el mbujape, un pan guaraní elaborado con maíz cocinado sobre cenizas. Con la llegada de los españoles se incorporaron el huevo, la leche y el queso a la preparación original. Su nombre en guaraní significa "la gran chipa" y es uno de los setenta tipos de chipa identificados dentro de la rica gastronomía paraguaya.'
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
    ],
    history: 'El arroz salteado naci\u00f3 en China durante la dinast\u00eda Sui (siglos VI-VII d.C.) como soluci\u00f3n ingeniosa para aprovechar el arroz sobrante del d\u00eda anterior. La t\u00e9cnica de saltearlo a fuego alto con huevo y verduras se extendi\u00f3 por toda Asia y el mundo con la di\u00e1spora china. Hoy es una de las preparaciones m\u00e1s populares y adaptables del planeta, presente en casi todas las cocinas con ingredientes locales.'
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
    ],
    history: 'Es una de las recetas m\u00e1s antiguas de la cultura guaran\u00ed, anterior a la llegada de los colonizadores europeos. Su nombre significa "pastel" en guaran\u00ed, y ya aparec\u00eda en documentos de las misiones jesu\u00edticas como tortas de almid\u00f3n de mandioca cocinadas sobre piedra. Con la conquista se incorporaron queso y leche a la receta original. Junto con la chipa y la sopa paraguaya, forma parte del grupo de alimentos sagrado llamado tyr\u00e1.'
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
    ],
    history: 'Sus or\u00edgenes se remontan al siglo XIII en la regi\u00f3n de Breta\u00f1a, Francia, donde los campesinos extend\u00edan papilla de trigo sobre piedras calientes formando tortas finas. Francia los institucionaliz\u00f3 con La Chandeleur (2 de febrero), d\u00eda en que cocinar cr\u00eapes trae buena fortuna. Desde entonces se exportaron al mundo entero adoptando distintos nombres: cr\u00eapes en Francia, pancakes en Estados Unidos y panqueques en el R\u00edo de la Plata.'
  }
];

module.exports = recipes;
