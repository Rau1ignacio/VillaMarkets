# VillaMarkets · Plataforma Fullstack de Minimarkets

VillaMarkets es una aplicación educativa construida con **React + Vite** que simula el flujo completo de un cliente en una red de minimarkets: exploración de productos, gestión de carrito, checkout, historial de pedidos y navegación por tiendas cercanas. El proyecto sirve como base para prácticas de desarrollo fullstack II, enfocadas en arquitectura frontend moderna, manejo de estado y pruebas automatizadas.

---

## Tabla de contenido
1. [Stack tecnológico](#stack-tecnológico)
2. [Características principales](#características-principales)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos y configuración](#requisitos-y-configuración)
5. [Scripts disponibles](#scripts-disponibles)
6. [Testing y calidad](#testing-y-calidad)
7. [Convenciones](#convenciones)
8. [Próximos pasos sugeridos](#próximos-pasos-sugeridos)
9. [Licencia](#licencia)

---

## Stack tecnológico

| Área | Tecnologías |
| ---- | ----------- |
| **Frontend** | React 19, React Router 7, React Hooks, Context/Redux (en progreso) |
| **Build Tooling** | Vite 5, ES Modules, Babel |
| **UI / Estilos** | Bootstrap 5, Bootstrap Icons, Font Awesome, CSS Modules locales |
| **Mapas y utilidades** | Leaflet / React-Leaflet, FileSaver, XLSX |
| **Calidad** | ESLint 9, Jest 30, Testing Library, Vitest-ready |

---

## Características principales

- **Catálogo filtrable** (`src/pages/cliente/Producto.jsx`): filtros por categoría, stock, búsqueda y ordenamiento; integración con `localStorage` para persistir carrito.
- **Mi Carrito + Checkout** (`src/pages/cliente/MiCarrito.jsx`): cálculo de subtotal, IVA, envío y descuentos en formato CLP, paso de métodos de pago (`MetodoPago.jsx`) y generación de historial.
- **Historial de pedidos** (`src/pages/cliente/MisPedidos.jsx`): listado compacto de compras con imágenes, totales, estado y navegación rápida.
- **Dashboard de cliente** (`src/pages/cliente/ClienteInicio.jsx`): banner de bienvenida, accesos rápidos, estadísticas y ofertas dinámicas con estilos modularizados (`src/styles/ClienteInicio.css`).
- **Minimarkets cercanos** (`src/pages/cliente/MinimarketCliente.jsx`): integración con Leaflet para mostrar tiendas sobre un mapa interactivo.
- **Flujo de pruebas** (`src/testing/*.test.jsx`): suites de ejemplo para componentes clave, configuradas con Jest + React Testing Library.

---

## Estructura del proyecto

```
├── public/                     # Recursos estáticos servidos por Vite
├── src/
│   ├── components/             # Componentes reutilizables (Navbar, Layout, etc.)
│   ├── pages/                  # Páginas agrupadas por rol (cliente, admin, etc.)
│   ├── styles/                 # Hojas de estilo específicas (ClienteInicio.css, etc.)
│   ├── testing/                # Pruebas unitarias/Jest
│   ├── utils/                  # Helpers, servicios y constantes
│   ├── App.jsx                 # Definición de rutas
│   └── main.jsx                # Bootstrapping de React + Vite
├── package.json
├── vite.config.js
└── README.md
```

---

## Requisitos y configuración

1. **Node.js 18+** y **npm 9+** (o pnpm/yarn si prefieres).
2. Clona el repositorio y entra en la carpeta del proyecto.
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Variables de entorno: Vite usa `.env`. Puedes duplicar `.env.example` si existe.

---

## Scripts disponibles

| Script | Descripción |
| ------ | ----------- |
| `npm run dev` | Levanta el servidor de desarrollo Vite (http://localhost:5173). |
| `npm run build` | Genera la versión optimizada en `dist/`. |
| `npm run preview` | Sirve el build para pruebas antes del deploy. |
| `npm run lint` | Ejecuta ESLint con la configuración del proyecto. |
| `npm run test` | Corre las suites de Jest/Testing Library. |

---

## Testing y calidad

- **Unit/Component tests**: ubicados en `src/testing`. Importa el componente desde `src/pages/...` o `src/components/...` y usa `@testing-library/react` para assertions.
- **Lint**: usa reglas base de ESLint y plugins para hooks + react-refresh. Corre `npm run lint` antes de abrir PRs.
- **Cobertura**: Jest está configurado para generar reportes HTML en `coverage/` cuando se ejecuta con la flag correspondiente.

---

## Convenciones

- **Componentes**: PascalCase en archivos y nombres de función (`MiCarrito.jsx`). Mantén los hooks principales (`useEffect`, `useState`) en la parte superior.
- **Estilos**: se prioriza Bootstrap y utilidades; los estilos a medida se guardan en `src/styles`. Evita bloques `<style>` inline.
- **Rutas**: todas las rutas públicas viven en `App.jsx`; agrega nuevas rutas importando la página correspondiente.
- **Estado global**: hoy se usa `localStorage` + props; la migración a Redux Toolkit está planificada.

---

## Próximos pasos sugeridos

1. **API real**: reemplazar los mocks/localStorage por un backend REST/GraphQL.
2. **Autenticación**: integrar flujo de login, roles y guardas de ruta.
3. **Redux Toolkit / Zustand**: centralizar carrito, usuario y pedidos.
4. **Internacionalización (i18n)**: exponer strings en español/inglés.
5. **CI/CD**: añadir pipeline de lint + pruebas + preview automático (GitHub Actions/Vercel).
6. **Accesibilidad**: auditar con Lighthouse y corregir contraste, labels y navegación por teclado.

---

## Licencia

Este repositorio se distribuye bajo la licencia MIT incluida en `LICENSE`. Eres libre de usarlo con fines educativos y extenderlo según tus necesidades, manteniendo el aviso de copyright.
