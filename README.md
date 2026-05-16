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
- Ingreso manual de ingredientes disponibles en casa.
- Generación simulada de sugerencias de recetas a partir de los ingredientes ingresados.
- Grilla de recetas sugeridas con datos de prueba.
- Filtros por:
  - nombre de receta o ingrediente;
  - categoría;
  - dificultad;
  - tiempo de preparación.
- Navegación hacia el detalle de cada receta.
- Visualización de:
  - ingredientes necesarios;
  - ingredientes ingresados por el usuario;
  - ingredientes faltantes;
  - pasos de preparación;
  - tiempo estimado;
  - dificultad;
  - porcentaje de coincidencia.
- Gestión simulada de recetas favoritas.
- Historial de búsquedas realizadas.
- Almacenamiento local mediante `localStorage`.
- Estructura preparada para una futura integración con Back-End e IA por texto.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Datos mock en memoria


---

## Integrantes

- Diego Duarte
- Blanca Franco
- Matias Gaona

---

## Estructura del prototipo

El prototipo se encuentra desarrollado en un solo archivo HTML para facilitar su ejecución y revisión.

```bash
che-rembiu/
│
├── index.html
└── README.md
