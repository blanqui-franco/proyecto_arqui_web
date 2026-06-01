# Che rembi'u 🍲

**Che rembi'u** es una aplicación web que permite ingresar ingredientes disponibles en casa y obtener sugerencias inteligentes de recetas. En la primera etapa, la sugerencia será simulada con datos de prueba; posteriormente, el Back-End podrá integrar un servicio de IA para generar recetas a partir de los ingredientes ingresados.

Este proyecto fue planteado en el contexto de la materia **Arquitectura Web**, con una división progresiva entre Front-End, Back-End e integración funcional.

---

## Objetivo del proyecto

Desarrollar una aplicación web simple, útil y con identidad paraguaya, que permita al usuario encontrar recetas a partir de ingredientes disponibles.

La aplicación busca responder a la pregunta:

> “Tengo estos ingredientes en casa, ¿qué puedo cocinar?”

---

## Alcance académico

El proyecto se divide en tres etapas:

| Etapa | Alcance |
|---|---|
| Segundo Parcial | Desarrollo Front-End con datos de prueba |
| Primer Final | Desarrollo Back-End con API y base de datos |
| Segundo Final | Integración funcional entre Front-End y Back-End |

---

## Alcance del prototipo actual

La versión actual corresponde al **prototipo Front-End**.

En esta etapa no se utiliza una IA real ni conexión con Back-End. Todas las recetas, sugerencias y respuestas se trabajan mediante datos de prueba dentro del navegador.

---

## Funcionalidades principales

- Pantalla de inicio de la aplicación.
- Ingreso manual de ingredientes disponibles.
- Generación simulada de sugerencias de recetas.
- Grilla de recetas con datos de prueba.
- Filtros por:
  - nombre de receta;
  - ingrediente;
  - categoría;
  - dificultad;
  - tiempo de preparación.
- Navegación hacia el detalle de cada receta.
- Visualización de:
  - ingredientes necesarios;
  - ingredientes faltantes;
  - pasos de preparación;
  - tiempo estimado;
  - dificultad;
  - porcentaje de coincidencia.
- Gestión simulada de recetas favoritas.
- Historial de búsquedas realizadas.
- Preparación para una futura integración con IA por texto.

---

# Herramientas y tecnologías

### Front-End

- HTML5
- CSS3
- JavaScript
- React
- Vite
- React Router
- LocalStorage
- Datos mock en formato JSON

### Back-End

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- CORS
- dotenv

### Integración futura

- API REST
- JSON
- Fetch API o Axios
- Servicio externo de inteligencia artificial por texto

---

## Integrantes

- Diego Duarte
- Blanca Franco
- Matias Gaona

---

## Cómo iniciar el proyecto

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- [Node.js 20+](https://nodejs.org/) instalado

---

### 1. Backend (microservicios)

Desde la raíz del proyecto:

```bash
# Primera vez o tras cambios en services/
docker compose up --build -d

# Las siguientes veces
docker compose up -d
```

Verificar que los servicios estén activos:

```bash
docker compose ps
```

Para detenerlos:

```bash
docker compose down
```

---

### 2. Frontend (React + Vite)

```bash
cd frontend

# Solo la primera vez
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app queda disponible en **http://localhost:5173**

---

### Orden recomendado

```
1. docker compose up -d        → levanta los 3 microservicios
2. cd frontend && npm run dev  → levanta el frontend React
3. Abrir http://localhost:5173
```

---

## Microservicios

Tres servicios Node.js + Express con datos mock en memoria:

| Servicio | Puerto | Endpoints |
|---|---:|---|
| recipes-service | 3001 | `GET /recipes`, `GET /recipes/:id` |
| search-service | 3002 | `POST /search` |
| history-service | 3003 | `POST /history`, `GET /history`, `DELETE /history` |

### Pruebas rápidas de endpoints

```bash
curl http://localhost:3001/recipes
curl http://localhost:3001/recipes/1
curl "http://localhost:3001/recipes?category=Tradicional&maxTime=30"
```

```bash
curl -X POST http://localhost:3002/search \
  -H "Content-Type: application/json" \
  -d "{\"ingredients\":[\"huevo\",\"queso Paraguay\",\"harina\",\"leche\"]}"
```

```bash
curl -X POST http://localhost:3003/history \
  -H "Content-Type: application/json" \
  -d "{\"ingredients\":\"huevo, queso Paraguay\",\"results\":3}"

curl http://localhost:3003/history
curl -X DELETE http://localhost:3003/history
```

**Resultados esperados:**

- `GET /recipes` → array con 7 recetas mock
- `GET /recipes/1` → detalle de Tortilla paraguaya
- `GET /recipes?category=Tradicional&maxTime=30` → recetas tradicionales de hasta 30 min
- `POST /search` → recetas ordenadas por mayor porcentaje de coincidencia
- `POST /history` → registro creado con status `201`
- `GET /history` → registros guardados en memoria
- `DELETE /history` → limpia el historial


