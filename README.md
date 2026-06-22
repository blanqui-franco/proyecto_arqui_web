# Che rembi'u 🍲

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

## Estado actual

| Componente | Estado |
|---|---|
| Front-End estructurado (HTML + CSS + JS) | ✅ Completo |
| Micro-servicios con datos mock | ✅ Funcionando |
| PostgreSQL con schema y seed | ✅ Listo |
| Servicios conectados a BD real | ✅ Implementado |
| IA: reconocimiento de imagen (Gemini) | ✅ Implementado |
| IA: sugerencia de recetas (Gemini) | ✅ Implementado |

---

## Etapas académicas

| Etapa | Entrega | Objetivo |
|---|---|---|
| **Etapa 1** | Segundo Parcial | Front-End estructurado + micro-servicios con datos mock |
| **Etapa 2** | Primer Final | BD real + IA con Gemini + integración completa |

---

## Funcionalidades

- Ingreso manual de ingredientes.
- Carga de imagen con detección de ingredientes *(mock en Etapa 1, Gemini Vision en Etapa 2)*.
- Sugerencia de recetas por porcentaje de coincidencia.
- Sugerencia razonada por IA *(Gemini en Etapa 2)*.
- Grilla de recetas con filtros por nombre, categoría, dificultad y tiempo.
- Vista de detalle: ingredientes, pasos, tiempo, dificultad y % de coincidencia.
- Recetas favoritas *(localStorage)*.
- Historial de búsquedas *(localStorage en Etapa 1, BD en Etapa 2)*.

---

## Tecnologías

### Front-End
- HTML5 + CSS3 (archivos separados por responsabilidad)
- JavaScript vanilla (módulos separados por funcionalidad)
- LocalStorage (favoritos)

### Back-End (micro-servicios)
- Node.js 20 + Express
- PostgreSQL 16
- `pg` (node-postgres)
- Docker + Docker Compose

### Inteligencia Artificial *(Etapa 2)*
- Google Gemini API (`gemini-2.0-flash`) — gratuita
- Reconocimiento de imagen (visión)
- Sugerencia de recetas con contexto de BD

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Para el front-end: VS Code con extensión **Live Server**, o `npx serve`

---

## Cómo correr el proyecto

### 1. Variables de entorno

```bash
cp .env.example .env
```

> En Etapa 2 también agregar `GEMINI_API_KEY=tu_clave` al `.env`.  
> Obtener clave gratuita en [aistudio.google.com](https://aistudio.google.com).

### 2. Levantar los servicios y la base de datos

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

### 3. Servir el front-end

**Opción A — Live Server (VS Code):**
Click derecho sobre `index.html` → *Open with Live Server*

**Opción B — terminal:**
```bash
npx serve .
```

La app queda disponible en **http://localhost:5500** (Live Server) o **http://localhost:3000** (`npx serve`).

### Orden recomendado

```
1. docker compose up       → PostgreSQL + micro-servicios
2. Live Server o npx serve → front-end
3. Abrir http://localhost:5500
```

---

## Micro-servicios

| Servicio | Puerto | Descripción |
|---|---|---|
| `recipes-service` | `3001` | Consulta de recetas con filtros |
| `search-service` | `3002` | Búsqueda por ingredientes con % de coincidencia |
| `history-service` | `3003` | Historial de búsquedas |
| `vision-service` | `3004` | Reconocimiento de ingredientes en imagen *(Etapa 2)* |
| `suggestion-service` | `3005` | Sugerencia razonada de recetas con Gemini *(Etapa 2)* |

---

## Endpoints

### recipes-service — `http://localhost:3001`

```bash
# Todas las recetas
curl http://localhost:3001/recipes

# Con filtros
curl "http://localhost:3001/recipes?category=Tradicional&difficulty=Fácil&maxTime=30"

# Detalle de una receta
curl http://localhost:3001/recipes/1

# Estado del servicio
curl http://localhost:3001/health
```

### search-service — `http://localhost:3002`

```bash
curl -X POST http://localhost:3002/search \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["huevo","queso","harina","leche"]}'
```

### history-service — `http://localhost:3003`

```bash
# Guardar búsqueda
curl -X POST http://localhost:3003/history \
  -H "Content-Type: application/json" \
  -d '{"ingredients":"huevo, queso","results":3}'

# Ver historial
curl http://localhost:3003/history

# Limpiar historial
curl -X DELETE http://localhost:3003/history
```

### vision-service — `http://localhost:3004` *(Etapa 2)*

```bash
curl -X POST http://localhost:3004/vision \
  -H "Content-Type: application/json" \
  -d '{"image":"<base64 de la imagen>"}'
# Respuesta: { "ingredients": ["huevo", "queso", "cebolla"] }
```

### suggestion-service — `http://localhost:3005` *(Etapa 2)*

```bash
curl -X POST http://localhost:3005/suggest \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["huevo","queso","harina"]}'
# Respuesta: { "suggestion": "Con esos ingredientes podés hacer una tortilla paraguaya..." }
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

Tablas creadas al levantar el contenedor:
- `recipes` — recetas
- `ingredients` — catálogo de ingredientes
- `recipe_ingredients` — relación N:N
- `recipe_steps` — pasos de preparación
- `search_history` — historial de búsquedas

Verificar datos desde consola:
```bash
docker exec -it che-rembiu-postgres psql -U cheuser -d che_rembiu -c "SELECT name FROM recipes;"
```
