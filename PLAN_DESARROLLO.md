# Plan de Desarrollo — Che rembi'u 🍲

> Aplicación web para sugerir recetas según los ingredientes disponibles en casa.  
> Proyecto académico de la materia **Arquitectura Web**.

---

## Estado actual del proyecto

| Área | Estado |
|---|---|
| Prototipo HTML monolítico | ✅ Entregado |
| Front-end estructurado (CSS + JS separados) | ✅ Completo |
| Micro-servicios con datos mock | ✅ Completo |
| Docker (3 servicios levantando) | ✅ Funcionando |
| Infraestructura BD (schema + seed + docker-compose) | ✅ Completo |
| `recipes-service` y `search-service` → PostgreSQL | ✅ Completo |
| `history-service` → PostgreSQL | 🔲 Pendiente (Integrante 3) |
| `vision-service` (Gemini Vision) | ✅ Completo |
| `suggestion-service` (Gemini texto) | 🔲 Pendiente (Integrante 3) |

---

## Etapas del proyecto

| Etapa | Entrega | Objetivo |
|---|---|---|
| **Etapa 1** | Segundo Parcial | Front-End estructurado + micro-servicios con datos mock |
| **Etapa 2** | Primer Final | Back-End con BD real + IA con Gemini + integración completa |

---

## Etapa 1 — Front-End estructurado + Micro-Servicios ✅

### Objetivo
Refactorizar el prototipo monolítico en una estructura de archivos limpia e incorporar tres micro-servicios en contenedores Docker.

---

### Micro-Servicios

| Servicio | Tipo | Puerto | Responsabilidad |
|---|---|---|---|
| `recipes-service` | Consulta | `3001` | Lista de recetas con filtros y detalle por ID |
| `search-service` | Consulta | `3002` | Calcula % de coincidencia por ingredientes |
| `history-service` | Inserción | `3003` | Registra y consulta el historial de búsquedas |

#### Endpoints implementados

**`recipes-service`**
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/recipes` | Lista con filtros `?category`, `?difficulty`, `?maxTime`, `?q` |
| `GET` | `/recipes/:id` | Detalle completo de una receta |
| `GET` | `/health` | Estado del servicio |

**`search-service`**
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/search` | Body: `{ ingredients: string[] }` → recetas ordenadas por match % |
| `GET` | `/health` | Estado del servicio |

**`history-service`**
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/history` | Guarda registro de búsqueda |
| `GET` | `/history` | Devuelve el historial |
| `DELETE` | `/history` | Limpia el historial |
| `GET` | `/health` | Estado del servicio |

---

### Estructura de carpetas (Etapa 1)

```
proyecto_arqui_web/
│
├── index.html                  ✅
├── css/
│   ├── variables.css           ✅
│   ├── base.css                ✅
│   ├── layout.css              ✅
│   ├── components.css          ✅
│   └── views.css               ✅
│
├── js/
│   ├── api.js                  ✅
│   ├── storage.js              ✅
│   ├── router.js               ✅
│   ├── filters.js              ✅
│   ├── recipes.js              ✅
│   ├── favorites.js            ✅
│   ├── history.js              ✅
│   ├── imageHandler.js         ✅
│   ├── toast.js                ✅
│   └── main.js                 ✅
│
├── services/
│   ├── recipes-service/
│   │   ├── data.js             ✅ (mock — se elimina en Etapa 2)
│   │   ├── index.js            ✅
│   │   ├── package.json        ✅
│   │   └── Dockerfile          ✅
│   ├── search-service/
│   │   ├── data.js             ✅ (mock — se elimina en Etapa 2)
│   │   ├── index.js            ✅
│   │   ├── package.json        ✅
│   │   └── Dockerfile          ✅
│   └── history-service/
│       ├── index.js            ✅
│       ├── package.json        ✅
│       └── Dockerfile          ✅
│
├── docker-compose.yml          ✅
└── README.md                   ✅
```

---

### División de tareas — Etapa 1

#### 🧑‍💻 Integrante 1 — Maquetado y estilos
- [x] Crear `css/` con los cinco archivos separados.
- [x] Construir `index.html` estructurado (sin estilos ni scripts inline).
- [x] Revisar accesibilidad: `aria-label`, roles semánticos, `alt`.
- [x] Estados de carga (spinner/skeleton) y mensajes de error con estilo coherente.
- [ ] Validar responsive en 360 px, 768 px y 1280 px.

#### 🧑‍💻 Integrante 2 — Lógica JavaScript del front-end
- [x] Crear todos los módulos `js/` (`api.js`, `router.js`, `recipes.js`, `favorites.js`, `history.js`, `imageHandler.js`, `storage.js`, `filters.js`, `toast.js`, `main.js`).
- [x] `api.js` centraliza todos los `fetch` a los tres micro-servicios.
- [x] Estados de carga y manejo de errores de red.
- [ ] Probar flujo completo con los servicios levantados.

#### 🧑‍💻 Integrante 3 — Micro-Servicios e infraestructura Docker
- [x] Crear los tres micro-servicios (Express + datos mock).
- [x] Dockerfiles basados en `node:20-alpine`.
- [x] `docker-compose.yml` levantando los tres servicios.
- [x] Instrucciones de ejecución en `README.md`.
- [ ] Probar todos los endpoints con Postman y documentar respuestas.

---

## Etapa 2 — Back-End + IA con Gemini + Integración completa

### Objetivo
Reemplazar los datos mock por PostgreSQL real, agregar dos nuevos micro-servicios de inteligencia artificial usando **Google Gemini API** (reconocimiento de imagen y sugerencia de recetas), e integrar todo con el front-end.

---

### Stack tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20 + Express |
| Base de datos | PostgreSQL 16 (contenedor Docker) |
| Driver de BD | `pg` (node-postgres) |
| IA — Visión | Google Gemini API (`gemini-2.0-flash`) |
| IA — Sugerencias | Google Gemini API (`gemini-2.0-flash`) |
| Variables de entorno | `.env` (basado en `.env.example`) |
| Contenedores | Docker + docker-compose |

---

### Modelo de datos

#### Tabla `recipes`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | Identificador |
| `name` | VARCHAR(120) | Nombre de la receta |
| `description` | TEXT | Descripción corta |
| `category` | VARCHAR(50) | Tradicional, Rápida, Económica, Postre |
| `difficulty` | VARCHAR(20) | Fácil, Media |
| `time_minutes` | INT | Tiempo estimado en minutos |
| `match_default` | INT | % base sin búsqueda por ingredientes |
| `created_at` | TIMESTAMP DEFAULT now() | Fecha de creación |

#### Tabla `ingredients`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `name` | VARCHAR(80) UNIQUE | Nombre normalizado (sin tildes, minúsculas) |

#### Tabla `recipe_ingredients` (N:N)
| Campo | Tipo | Descripción |
|---|---|---|
| `recipe_id` | INT FK → `recipes.id` | — |
| `ingredient_id` | INT FK → `ingredients.id` | — |
| PRIMARY KEY | `(recipe_id, ingredient_id)` | — |

#### Tabla `recipe_steps`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `recipe_id` | INT FK → `recipes.id` | — |
| `step_order` | INT | Posición del paso |
| `description` | TEXT | Texto del paso |

#### Tabla `search_history`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `ingredients_text` | TEXT | Texto ingresado por el usuario |
| `results_count` | INT | Cantidad de resultados devueltos |
| `searched_at` | TIMESTAMP DEFAULT now() | Fecha y hora |

---

### Endpoints por servicio (Etapa 2)

**`recipes-service` — puerto `3001`** *(actualizado: BD real)*
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/recipes` | Lista desde BD con filtros SQL |
| `GET` | `/recipes/:id` | Detalle con JOINs a pasos e ingredientes |
| `GET` | `/health` | Estado del servicio |

**`search-service` — puerto `3002`** *(actualizado: BD real)*
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/search` | Calcula match % con JOIN en BD, ordena de mayor a menor |
| `GET` | `/health` | Estado del servicio |

**`history-service` — puerto `3003`** *(actualizado: BD real)*
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/history` | INSERT en `search_history` |
| `GET` | `/history` | SELECT últimos 20 registros |
| `DELETE` | `/history` | DELETE todos los registros |
| `GET` | `/health` | Estado del servicio |

**`vision-service` — puerto `3004`** *(nuevo)*
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/vision` | Body: `{ image: string (base64) }` → llama a Gemini Vision y devuelve `{ ingredients: string[] }` |
| `GET` | `/health` | Estado del servicio |

**`suggestion-service` — puerto `3005`** *(nuevo)*
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/suggest` | Body: `{ ingredients: string[] }` → consulta recetas de BD, arma prompt con contexto y devuelve sugerencia razonada de Gemini |
| `GET` | `/health` | Estado del servicio |

---

### Estructura de carpetas actualizada (Etapa 2)

```
proyecto_arqui_web/
│
├── db/
│   ├── schema.sql              ✅ (creado por Integrante 1)
│   └── seed.sql                ✅ (creado por Integrante 1)
│
├── services/
│   ├── recipes-service/
│   │   ├── db.js               ✅ pool pg
│   │   ├── index.js            ✅ migrado a queries SQL (Integrante 2)
│   │   ├── package.json        ✅ incluye "pg"
│   │   └── Dockerfile
│   │
│   ├── search-service/
│   │   ├── db.js               ✅ pool pg
│   │   ├── index.js            ✅ migrado a queries SQL (Integrante 2)
│   │   ├── package.json        ✅ incluye "pg"
│   │   └── Dockerfile          ✅ actualizado (Integrante 2)
│   │
│   ├── history-service/
│   │   ├── db.js               ✅ pool pg
│   │   ├── index.js            🔲 migrar a INSERT/SELECT (Integrante 3)
│   │   ├── package.json        ✅ incluye "pg"
│   │   └── Dockerfile
│   │
│   ├── vision-service/         ✅ CREADO (Integrante 2)
│   │   ├── index.js            ✅ Express + Gemini Vision API
│   │   ├── package.json        ✅ express, cors, @google/generative-ai
│   │   └── Dockerfile          ✅
│   │
│   └── suggestion-service/     🔲 NUEVO (Integrante 3)
│       ├── index.js            ← Express + Gemini text + contexto de BD
│       ├── db.js               ← pool pg para consultar recetas
│       ├── package.json        ← express, cors, @google/generative-ai, pg
│       └── Dockerfile
│
├── js/
│   ├── api.js                  ✅ detectIngredients() agregado (Integrante 2)
│   └── imageHandler.js         ✅ usa API real en lugar de simulación (Integrante 2)
│
├── docker-compose.yml          ✅ vision-service agregado (Integrante 2)
│                               🔲 agregar suggestion-service (Integrante 1/3)
├── .env.example                ✅ GEMINI_API_KEY agregado (Integrante 2)
└── .gitignore                  ✅
```

---

### División de tareas — Etapa 2

#### 🧑‍💻 Integrante 1 — BD, Docker e infraestructura IA

- [x] Crear `db/schema.sql` con todas las tablas.
- [x] Crear `db/seed.sql` con las 7 recetas, ingredientes y pasos.
- [x] Actualizar `docker-compose.yml` con PostgreSQL, red interna y healthcheck.
- [x] Crear `.env.example`.
- [x] Crear `db.js` en los tres servicios existentes.
- [x] Agregar `"pg"` a los tres `package.json`.
- [ ] Obtener API key de Google Gemini (gratuita en aistudio.google.com).
- [x] Agregar `GEMINI_API_KEY` a `.env.example`. *(realizado por Integrante 2)*
- [x] Actualizar `docker-compose.yml` para agregar `vision-service` (puerto `3004`) con la variable `GEMINI_API_KEY`. *(realizado por Integrante 2)*
- [ ] Actualizar `docker-compose.yml` para agregar `suggestion-service` (puerto `3005`).
- [ ] Verificar que `docker compose up --build` levante los 5 servicios + PostgreSQL.
- [ ] Prueba final de punta a punta: imagen → detección → búsqueda → sugerencia IA → historial persistente.

**Entregable:** infraestructura completa con 5 micro-servicios + PostgreSQL corriendo; API key de Gemini disponible para los otros integrantes.

---

#### 🧑‍💻 Integrante 2 — `recipes-service`, `search-service` y `vision-service`

- [x] Actualizar `recipes-service/index.js` para usar BD:
  - `GET /recipes`: query SQL con `WHERE` dinámicos + EXISTS sobre `ingredients`.
  - `GET /recipes/:id`: subqueries correlacionadas a `recipe_steps` e `ingredients`.
  - Eliminado `require('./data')`.
- [x] Actualizar `search-service/index.js` para usar BD:
  - `POST /search`: obtiene recetas con ingredientes desde BD, calcula match % y ordena de mayor a menor, excluye match 0.
  - Eliminado `require('./data')`.
  - Actualizado `Dockerfile` (ya no depende del contexto raíz).
- [x] Crear `services/vision-service/`:
  - `index.js`: recibe imagen en base64 o data URL, llama a `gemini-2.0-flash` Vision con el prompt indicado, devuelve `{ ingredients: string[] }`.
  - `package.json` con `express`, `cors`, `@google/generative-ai`.
  - `Dockerfile`.
- [x] Actualizar `js/api.js` para agregar:
  - `detectIngredients(base64)` → `POST vision-service/vision`
- [x] Actualizar `js/imageHandler.js`: reemplazada `simulateImageDetection` por `detectIngredientsFromImage()` async que llama a `API.detectIngredients()`.
- [ ] Probar con Postman: `POST http://localhost:3004/vision` con una imagen en base64.

**Entregable:** recetas y búsqueda desde BD; reconocimiento real de ingredientes por imagen vía Gemini.

---

#### 🧑‍💻 Integrante 3 — `history-service`, `suggestion-service` y documentación

- [ ] Actualizar `history-service/index.js` para usar BD:
  - `POST /history`: INSERT en `search_history`.
  - `GET /history`: SELECT últimos 20 registros.
  - `DELETE /history`: DELETE todos.
  - Eliminar array en memoria.
- [ ] Crear `services/suggestion-service/`:
  - `index.js`: recibe `{ ingredients: string[] }`, consulta la BD para obtener las recetas disponibles, construye un prompt con esa lista como contexto y pide a Gemini que sugiera cuáles preparar y por qué, devuelve `{ suggestion: string }`.
  - `db.js` para consultar la BD de recetas.
  - `package.json` con `express`, `cors`, `@google/generative-ai`, `pg`.
  - `Dockerfile`.
- [ ] Actualizar `js/api.js` para agregar:
  - `getSuggestion(ingredients)` → `POST suggestion-service/suggest`
- [ ] Agregar en el front-end (vista Ingredientes) un botón "Sugerencia IA" que muestre la respuesta de Gemini en un panel.
- [ ] Actualizar `js/storage.js` para que el historial no se guarde en `localStorage`.
- [ ] Verificar flujo completo con BD real e IA.
- [ ] Documentar todos los endpoints (incluyendo los nuevos) en `README.md`.

**Entregable:** historial en BD; sugerencias razonadas por Gemini; front-end completamente integrado; README actualizado.

---

## Criterios de éxito

### Etapa 1
- [x] `docker compose up` levanta los tres micro-servicios sin errores.
- [x] Los endpoints responden con datos mock correctos.
- [x] El front-end consume los servicios vía `api.js`.
- [x] El código está organizado en archivos CSS y JS separados.
- [ ] Flujo completo verificado (búsqueda → grilla → detalle → historial).

### Etapa 2
- [ ] `docker compose up --build` levanta PostgreSQL + 5 micro-servicios sin errores.
- [x] `GET /recipes` y `GET /recipes/:id` devuelven datos reales desde la BD.
- [x] `POST /search` calcula match % con datos de PostgreSQL.
- [ ] `POST /history` inserta en BD; historial persiste al recargar.
- [x] `POST /vision` identifica ingredientes reales desde una imagen.
- [ ] `POST /suggest` devuelve una sugerencia razonada de Gemini.
- [ ] El front-end funciona de punta a punta sin datos hardcodeados.
- [ ] Todos los endpoints documentados en `README.md`.

---

## Notas y decisiones

- **IA gratuita:** Google Gemini API tiene un free tier de 15 llamadas/minuto y 1M tokens/día — suficiente para el proyecto académico. API key en **aistudio.google.com**.
- **`GEMINI_API_KEY` en `.env`:** nunca commitear el archivo `.env`; el `.gitignore` ya lo excluye.
- **Favoritos:** siguen en `localStorage` en Etapa 2. No se implementa autenticación.
- **Front-end:** Vanilla JS. No se migra a ningún framework.
- **`data.js` en los servicios:** se elimina en Etapa 2 cuando los servicios consumen la BD.
