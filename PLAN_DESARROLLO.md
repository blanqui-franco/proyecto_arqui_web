# Plan de Desarrollo — Che rembi'u 🍲

> Aplicación web para sugerir recetas según los ingredientes disponibles en casa.  
> Proyecto académico de la materia **Arquitectura Web**.

---

## Estado actual

El prototipo entregado (`che_rembiu_prototipo_html.html`) es una SPA de un solo archivo con:

- Navegación entre 5 vistas: Inicio, Ingredientes, Recetas, Favoritos, Historial.
- 7 recetas paraguayas con datos hardcodeados en memoria.
- Búsqueda y filtrado 100 % en el navegador.
- Persistencia con `localStorage`.
- Sin backend, sin base de datos, sin autenticación.

Este plan describe cómo escalar ese prototipo en tres etapas académicas.

---

## Etapas del proyecto

| Etapa | Entrega | Objetivo |
|---|---|---|
| **Etapa 1** | Segundo Parcial | Front-End estructurado con datos mock |
| **Etapa 2** | Primer Final | Back-End con API REST y base de datos |
| **Etapa 3** | Segundo Final | Integración funcional Front ↔ Back |

---

## Etapa 1 — Front-End estructurado + Micro-Servicios

### Objetivo
Refactorizar el prototipo monolítico en una estructura de archivos limpia e incorporar tres micro-servicios en contenedores Docker que atiendan las operaciones principales de la aplicación.

---

### Micro-Servicios

La lógica que en el prototipo vivía solo en el navegador se delega a tres servicios independientes, cada uno en su propio contenedor.

| Servicio | Tipo | Puerto | Responsabilidad |
|---|---|---|---|
| `recipes-service` | **Consulta** | `3001` | Devuelve la lista de recetas con filtros opcionales y el detalle de una receta por ID |
| `search-service` | **Consulta** | `3002` | Recibe una lista de ingredientes, calcula el % de coincidencia y devuelve las recetas ordenadas |
| `history-service` | **Inserción** | `3003` | Registra cada búsqueda realizada y permite consultar el historial |

#### Endpoints por servicio

**`recipes-service`**
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/recipes` | Lista de recetas (acepta `?category=`, `?difficulty=`, `?maxTime=`, `?q=`) |
| `GET` | `/recipes/:id` | Detalle completo de una receta |

**`search-service`**
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/search` | Body: `{ ingredients: string[] }` → recetas con `match %` calculado, ordenadas de mayor a menor |

**`history-service`**
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/history` | Body: `{ ingredients: string, results: number }` → guarda el registro de búsqueda |
| `GET` | `/history` | Devuelve el historial completo |
| `DELETE` | `/history` | Limpia el historial |

> **Nota Etapa 1:** los datos son mock en memoria dentro de cada servicio. En Etapa 2 se conectarán a la base de datos real.

#### Stack de cada micro-servicio

- **Runtime:** Node.js 20
- **Framework:** Express
- **Containerización:** Docker (imagen `node:20-alpine`)
- **Orquestación local:** `docker-compose.yml` en la raíz del proyecto
- **CORS:** habilitado para `http://localhost` (origen del front)

---

### Estructura de carpetas propuesta

```
che-rembiu/
│
├── index.html
│
├── css/
│   ├── variables.css       ← variables :root (colores, radios, sombras)
│   ├── base.css            ← reset, body, tipografía
│   ├── layout.css          ← navbar, container, grid helpers
│   ├── components.css      ← card, badge, btn, form, table, toast
│   └── views.css           ← estilos específicos de cada vista
│
├── js/
│   ├── api.js              ← ★ NUEVO: centraliza todos los fetch a los micro-servicios
│   ├── storage.js          ← wrappers de localStorage (favoritos en Etapa 1)
│   ├── router.js           ← función showView + bind de nav buttons
│   ├── filters.js          ← normalización de texto para búsqueda local
│   ├── recipes.js          ← renderRecipes, openRecipeDetail
│   ├── favorites.js        ← toggleFavorite, renderFavorites, clearFavorites
│   ├── history.js          ← renderHistory, clearHistory
│   ├── imageHandler.js     ← FileReader, preview, simulateImageDetection
│   ├── toast.js            ← showToast
│   └── main.js             ← inicialización, event listeners globales
│
├── services/
│   ├── recipes-service/
│   │   ├── index.js        ← servidor Express con datos mock
│   │   ├── data.js         ← array de las 7 recetas (fuente de verdad)
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── search-service/
│   │   ├── index.js        ← lógica de calculateMatch extraída del prototipo
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── history-service/
│       ├── index.js        ← array en memoria para Etapa 1
│       ├── package.json
│       └── Dockerfile
│
├── docker-compose.yml      ← levanta los 3 servicios con un solo comando
└── README.md
```

> `data.js` del prototipo original **pasa a vivir dentro de `recipes-service`**. El front-end ya no tiene recetas hardcodeadas; las obtiene vía `fetch` a través de `api.js`.

---

### División de tareas por integrante

#### 🧑‍💻 Integrante 1 — Maquetado y estilos

Responsable de toda la capa visual del front-end.

- [ ] Crear la carpeta `css/` y separar los estilos del prototipo en los cinco archivos.
- [ ] Construir el `index.html` estructurado (sin estilos inline, sin scripts inline).
- [ ] Enlazar todos los archivos CSS desde `index.html`.
- [ ] Revisar accesibilidad básica: `aria-label`, roles semánticos, atributos `alt`.
- [ ] Validar diseño responsive en 360 px, 768 px y 1280 px.
- [ ] Asegurarse de que los estados de carga (spinner/skeleton) y los mensajes de error tengan estilo coherente con la paleta.

**Entregable:** el front-end se ve y comporta visualmente igual al prototipo original, usando archivos CSS separados.

---

#### 🧑‍💻 Integrante 2 — Lógica JavaScript del front-end

Responsable de todos los módulos JS del navegador y de la capa de comunicación con los servicios.

- [ ] Crear `js/api.js` con funciones `async/await` para llamar a cada micro-servicio:
  - `getRecipes(filters)` → `GET recipes-service/recipes`
  - `getRecipeById(id)` → `GET recipes-service/recipes/:id`
  - `searchByIngredients(list)` → `POST search-service/search`
  - `saveHistory(entry)` → `POST history-service/history`
  - `getHistory()` → `GET history-service/history`
  - `clearHistory()` → `DELETE history-service/history`
- [ ] Crear `js/router.js`: navegación entre vistas + bind de botones de nav.
- [ ] Crear `js/recipes.js`: `renderRecipes()` y `openRecipeDetail()` usando respuesta de `api.js`.
- [ ] Crear `js/favorites.js`: `toggleFavorite()`, `renderFavorites()`, `clearFavorites()` (persiste en `localStorage` en esta etapa).
- [ ] Crear `js/history.js`: `renderHistory()` y `clearHistory()` consumiendo `history-service`.
- [ ] Crear `js/imageHandler.js`: `FileReader` para preview + `simulateImageDetection()`.
- [ ] Crear `js/storage.js`: wrappers de `localStorage` solo para favoritos.
- [ ] Crear `js/filters.js`: función `normalize()` para filtrado de texto en cliente.
- [ ] Crear `js/toast.js` y `js/main.js`.
- [ ] Agregar indicadores de carga (mostrar/ocultar spinner) antes y después de cada `fetch`.
- [ ] Manejar errores de red con mensajes visibles al usuario.

**Entregable:** el front-end consume los tres micro-servicios en lugar de datos hardcodeados, con manejo de estados de carga y error.

---

#### 🧑‍💻 Integrante 3 — Micro-Servicios e infraestructura Docker

Responsable de los tres servicios y de la configuración de contenedores.

- [ ] Crear `services/recipes-service/`:
  - `data.js` con el array de las 7 recetas del prototipo.
  - `index.js` con Express: endpoints `GET /recipes` (con filtros por query params) y `GET /recipes/:id`.
  - CORS habilitado.
  - `Dockerfile` basado en `node:20-alpine`.
  - `package.json`.
- [ ] Crear `services/search-service/`:
  - `index.js` con Express: endpoint `POST /search` que recibe `{ ingredients: string[] }`, aplica la lógica `calculateMatch` (extraída del prototipo) y devuelve las recetas ordenadas por coincidencia.
  - `Dockerfile` y `package.json`.
- [ ] Crear `services/history-service/`:
  - `index.js` con Express: `POST /history` (inserción), `GET /history` (consulta), `DELETE /history` (limpieza). Datos en memoria para Etapa 1.
  - `Dockerfile` y `package.json`.
- [ ] Crear `docker-compose.yml` en la raíz que levante los tres servicios y exponga los puertos `3001`, `3002` y `3003`.
- [ ] Verificar que `docker compose up` levante todo sin errores.
- [ ] Probar cada endpoint con Postman o Insomnia y documentar los resultados.
- [ ] Escribir instrucciones de ejecución en el `README.md`.

**Entregable:** `docker compose up` levanta los tres servicios; cada endpoint responde correctamente con datos mock.

---

### No incluye en esta etapa
- Base de datos real (los datos son mock en memoria).
- Autenticación de usuarios.
- Detección de ingredientes por IA real.

---

## Etapa 2 — Back-End con API REST

### Objetivo
Construir un servidor con endpoints REST y una base de datos que reemplace los datos mock.

### Tecnologías sugeridas

| Capa | Opción principal | Alternativa |
|---|---|---|
| Lenguaje/runtime | Node.js + Express | Python + FastAPI |
| Base de datos | PostgreSQL | MySQL / SQLite (solo desarrollo) |
| ORM | Prisma | Sequelize / SQLAlchemy |
| Autenticación | JWT | Sesiones + cookies |
| Variables de entorno | dotenv | — |

### Modelo de datos

#### Tabla `recipes`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK | Identificador |
| `name` | VARCHAR(120) | Nombre de la receta |
| `description` | TEXT | Descripción corta |
| `category` | VARCHAR(50) | Tradicional, Rápida, Económica, Postre |
| `difficulty` | VARCHAR(20) | Fácil, Media, Difícil |
| `time_minutes` | INT | Tiempo estimado |
| `created_at` | TIMESTAMP | Fecha de creación |

#### Tabla `ingredients` (catálogo)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK | — |
| `name` | VARCHAR(80) | Nombre normalizado |

#### Tabla `recipe_ingredients` (relación N:N)
| Campo | Tipo | Descripción |
|---|---|---|
| `recipe_id` | INT FK | — |
| `ingredient_id` | INT FK | — |
| `quantity` | VARCHAR(40) | "2 tazas", "1 unidad" (opcional) |

#### Tabla `recipe_steps`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK | — |
| `recipe_id` | INT FK | — |
| `order` | INT | Posición del paso |
| `description` | TEXT | Texto del paso |

#### Tabla `users` *(opcional para el parcial)*
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK | — |
| `email` | VARCHAR(120) UNIQUE | — |
| `password_hash` | VARCHAR | — |
| `created_at` | TIMESTAMP | — |

#### Tabla `favorites` *(depende de usuarios)*
| Campo | Tipo | Descripción |
|---|---|---|
| `user_id` | INT FK | — |
| `recipe_id` | INT FK | — |
| `saved_at` | TIMESTAMP | — |

#### Tabla `search_history` *(depende de usuarios)*
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INT PK | — |
| `user_id` | INT FK | — |
| `ingredients_text` | TEXT | Texto ingresado |
| `results_count` | INT | Cantidad de resultados |
| `searched_at` | TIMESTAMP | — |

### Endpoints REST planificados

#### Recetas
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/recipes` | Listar todas las recetas (soporta `?category=`, `?difficulty=`, `?maxTime=`, `?q=`) |
| `GET` | `/api/recipes/:id` | Detalle de una receta |
| `POST` | `/api/recipes` | Crear receta (admin) |
| `PUT` | `/api/recipes/:id` | Actualizar receta (admin) |
| `DELETE` | `/api/recipes/:id` | Eliminar receta (admin) |

#### Búsqueda por ingredientes
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/search` | Body: `{ ingredients: string[] }` → devuelve recetas ordenadas por % de coincidencia |

#### Autenticación *(si se incluye)*
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registro |
| `POST` | `/api/auth/login` | Login → devuelve JWT |
| `POST` | `/api/auth/logout` | Invalidar sesión |

#### Favoritos *(requiere auth)*
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/favorites` | Favoritos del usuario autenticado |
| `POST` | `/api/favorites/:recipeId` | Agregar favorito |
| `DELETE` | `/api/favorites/:recipeId` | Quitar favorito |

#### Historial *(requiere auth)*
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/history` | Historial del usuario |
| `DELETE` | `/api/history` | Limpiar historial |

### Tareas

- [ ] Inicializar proyecto Node.js / elegir framework.
- [ ] Configurar variables de entorno (`.env`).
- [ ] Diseñar y crear el esquema de base de datos (migraciones).
- [ ] Poblar la BD con las 7 recetas del prototipo (seed).
- [ ] Implementar endpoints de recetas (CRUD).
- [ ] Implementar endpoint de búsqueda con cálculo de coincidencia.
- [ ] Implementar autenticación con JWT *(si se decide incluir)*.
- [ ] Implementar endpoints de favoritos e historial *(si hay auth)*.
- [ ] Documentar la API (comentarios, README o Swagger).
- [ ] Pruebas manuales con Postman / Insomnia.

---

## Etapa 3 — Integración Front-End ↔ Back-End

### Objetivo
Reemplazar todos los datos mock del front-end por llamadas reales a la API.

### Cambios en el front-end

| Módulo actual | Cambio necesario |
|---|---|
| `data.js` | Eliminado. Los datos vienen del servidor. |
| `storage.js` | Favoritos e historial dejan de guardarse en `localStorage`; se persisten en la BD. |
| `search.js` | `calculateMatch` se mueve al servidor; el front solo llama `POST /api/search`. |
| `filters.js` | Los filtros pasan como query params al endpoint `GET /api/recipes`. |
| `recipes.js` | Render a partir de la respuesta JSON de la API. |
| `favorites.js` | Llama a `POST/DELETE /api/favorites/:id`. |
| `history.js` | Llama a `GET/DELETE /api/history`. |

### Capa de servicio (nuevo módulo JS)

Se agrega un módulo `js/api.js` que centraliza todas las llamadas `fetch`:

```js
// Ejemplo estructural
async function getRecipes(filters = {}) { ... }
async function searchByIngredients(ingredients) { ... }
async function toggleFavorite(recipeId) { ... }
async function getHistory() { ... }
```

### Manejo de estados de carga

Cada vista que consume la API debe contemplar tres estados:
- **Cargando** → spinner o skeleton.
- **Con datos** → render normal.
- **Error / sin resultados** → mensaje de estado vacío.

### Tareas

- [ ] Crear `js/api.js` con todas las funciones de fetch.
- [ ] Reemplazar referencias a `data.js` por llamadas a `api.js`.
- [ ] Agregar indicadores de carga en cada vista.
- [ ] Manejar errores HTTP (401, 404, 500) con mensajes en pantalla.
- [ ] Probar flujo completo: búsqueda → detalle → favorito → historial.
- [ ] Validar que `localStorage` ya no almacene datos que deberían estar en la BD.
- [ ] Configurar CORS en el servidor para aceptar peticiones del front.
- [ ] Definir dónde se hostean front y back (mismo servidor o separados).

---

## Paleta de diseño (referencia del prototipo)

| Variable | Valor |
|---|---|
| `--bg` | `#fff8ed` |
| `--primary` | `#ef8f35` |
| `--primary-dark` | `#c96d1d` |
| `--secondary` | `#4f9f78` |
| `--danger` | `#c0392b` |
| `--border` | `#ead8c2` |
| `--text` | `#2e2a24` |
| `--muted` | `#756b5e` |

---

## Criterios de éxito por etapa

### Etapa 1
- `docker compose up` levanta los tres micro-servicios sin errores.
- `GET /recipes`, `GET /recipes/:id`, `POST /search`, `POST /history` y `GET /history` responden con datos correctos.
- El front-end consume los servicios vía `api.js`; no hay datos hardcodeados en el navegador.
- El código está organizado en archivos CSS y JS separados.
- El comportamiento visual es idéntico al prototipo original.

### Etapa 2
- Todos los endpoints responden correctamente con datos reales.
- La base de datos contiene al menos las 7 recetas del prototipo.
- La búsqueda por ingredientes devuelve resultados ordenados por coincidencia.

### Etapa 3
- El front-end no tiene datos hardcodeados.
- El flujo completo funciona de punta a punta.
- Los favoritos y el historial persisten en la base de datos.

---

## Notas y decisiones pendientes

- **¿Autenticación obligatoria?** Si no se implementa, favoritos e historial se mantienen anónimos (por sesión o por `localStorage`) hasta la Etapa 3.
- **¿Detección real de ingredientes por imagen?** No es requerida para el parcial; podría integrarse en la Etapa 3 usando una API externa (ej.: Google Vision).
- **Framework front-end:** El prototipo es Vanilla JS. Para la Etapa 3 se puede mantener así o migrar a un framework ligero (Vue / Svelte), dependiendo de la complejidad que tome la capa de fetch.
