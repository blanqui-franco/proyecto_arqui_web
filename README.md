# Che rembi'u

Aplicación web con identidad paraguaya que sugiere recetas a partir de los ingredientes que el usuario tiene disponibles en casa.

> "Tengo estos ingredientes, ¿qué puedo cocinar?"

Proyecto académico — materia **Arquitectura Web**.

---

## Integrantes

| Nombre | Rol principal |
|---|---|
| Matias Gaona | Infraestructura, BD, Docker |
| Diego Duarte | Micro-servicios, IA |
| Blanca Franco | Front-End, integración |

---

## Estado del proyecto

| Componente | Estado |
|---|---|
| Front-End estructurado (HTML + CSS + JS) | Completo |
| Micro-servicios con PostgreSQL | Completo |
| IA: reconocimiento de imagen (Gemini Vision) | Completo |
| IA: sugerencia de recetas (Gemini) | Completo |
| Docker Compose (5 servicios + BD) | Completo |

---

## Funcionalidades

- Ingreso manual de ingredientes con chips.
- Carga de imagen con detección automática de ingredientes via Gemini Vision.
- Sugerencia de recetas por porcentaje de coincidencia de ingredientes.
- Sugerencia razonada por IA (Gemini) con posibilidad de insertar nuevas recetas.
- Grilla de recetas ordenada por porcentaje de coincidencia, con filtros por nombre, categoría, dificultad y tiempo.
- Vista de detalle: ingredientes, pasos, tiempo, dificultad y % de coincidencia.
- Recetas favoritas (localStorage).
- Historial de búsquedas persistido en PostgreSQL.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Front-End | HTML5 + CSS3 + JavaScript vanilla |
| Back-End | Node.js 20 + Express |
| Base de datos | PostgreSQL 16 |
| Driver BD | `pg` (node-postgres) |
| IA | Google Gemini API (`gemini-2.5-flash-lite`) |
| Infraestructura | Docker + Docker Compose |

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.
- API key de Google Gemini (gratuita en [aistudio.google.com](https://aistudio.google.com)).

---

## Cómo correr el proyecto

### 1. Variables de entorno

Copiá el archivo de ejemplo y completá tu API key:

```bash
cp .env.example .env
```

Editá `.env` y agregá tu clave:

```
GEMINI_API_KEY=tu_clave_aqui
```

### 2. Levantar los servicios

```bash
# Primera vez o tras cambios en services/
docker compose up --build

# Las siguientes veces
docker compose up
```

Verificar que todo esté activo:

```bash
docker compose ps
```

Detener:

```bash
docker compose down
```

### 3. Abrir el front-end

**Opción A — Live Server (VS Code):**
Click derecho sobre `index.html` → *Open with Live Server*

**Opción B — terminal:**
```bash
npx serve .
```

La app queda disponible en `http://localhost:5500` (Live Server) o `http://localhost:3000` (`npx serve`).

---

## Micro-servicios

| Servicio | Puerto | Descripción |
|---|---|---|
| `recipes-service` | `3001` | Consulta de recetas con filtros |
| `search-service` | `3002` | Búsqueda por ingredientes con % de coincidencia |
| `history-service` | `3003` | Historial de búsquedas en BD |
| `vision-service` | `3004` | Reconocimiento de ingredientes en imagen via Gemini |
| `suggestion-service` | `3005` | Sugerencia razonada de recetas con Gemini |

---

## Endpoints

### recipes-service — `http://localhost:3001`

```bash
# Todas las recetas
GET /recipes

# Con filtros opcionales
GET /recipes?category=Tradicional&difficulty=Fácil&maxTime=30&q=sopa

# Detalle de una receta
GET /recipes/:id

# Estado del servicio
GET /health
```

### search-service — `http://localhost:3002`

```bash
# Buscar recetas por ingredientes
POST /search
Content-Type: application/json
{ "ingredients": ["huevo", "queso", "harina"] }

# Respuesta: array de recetas ordenadas por match % descendente
# [{ id, name, match, ... }, ...]

GET /health
```

### history-service — `http://localhost:3003`

```bash
# Guardar búsqueda
POST /history
Content-Type: application/json
{ "ingredients": "huevo, queso", "results": 3 }

# Ver historial (últimas 20 búsquedas)
GET /history

# Limpiar historial
DELETE /history

GET /health
```

### vision-service — `http://localhost:3004`

```bash
# Detectar ingredientes en una imagen
POST /vision
Content-Type: application/json
{ "image": "<base64 o data URL de la imagen>" }

# Respuesta:
{ "ingredients": ["huevo", "queso", "cebolla"] }

GET /health
```

### suggestion-service — `http://localhost:3005`

```bash
# Obtener sugerencia de recetas por IA
POST /suggest
Content-Type: application/json
{ "ingredients": ["huevo", "queso", "harina"] }

# Respuesta:
{
  "suggestion": "Con esos ingredientes podés preparar...",
  "recipeIds": [1, 3],
  "newCount": 1
}

GET /health
```

---

## Base de datos

Conexión desde DBeaver u otro cliente SQL:

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Puerto | `5432` |
| Base de datos | `che_rembiu` |
| Usuario | `cheuser` |
| Contraseña | `chepass` |

Tablas:

| Tabla | Descripción |
|---|---|
| `recipes` | Recetas |
| `ingredients` | Catálogo de ingredientes |
| `recipe_ingredients` | Relación N:N recetas–ingredientes |
| `recipe_steps` | Pasos de preparación |
| `search_history` | Historial de búsquedas |

Verificar datos:

```bash
docker exec -it che-rembiu-postgres psql -U cheuser -d che_rembiu -c "SELECT name FROM recipes;"
```
