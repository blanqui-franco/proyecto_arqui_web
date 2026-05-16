# Che rembi'u 🍲

**Che rembi'u** es una aplicación web orientada a sugerir recetas a partir de los ingredientes que el usuario tiene disponibles en casa. La idea principal es que el usuario pueda ingresar ingredientes manualmente o cargar una imagen de referencia, y la aplicación le muestre posibles comidas que puede preparar.

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
- Ingreso manual de ingredientes.
- Carga de imagen con vista previa.
- Simulación de detección de ingredientes mediante IA.
- Grilla de recetas sugeridas con datos de prueba.
- Filtros por:
  - nombre o ingrediente;
  - categoría;
  - dificultad;
  - tiempo de preparación.
- Navegación hacia el detalle de cada receta.
- Visualización de:
  - ingredientes necesarios;
  - pasos de preparación;
  - tiempo estimado;
  - dificultad;
  - porcentaje de coincidencia.
- Gestión simulada de recetas favoritas.
- Historial de búsquedas realizadas.
- Almacenamiento local mediante `localStorage`.

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
