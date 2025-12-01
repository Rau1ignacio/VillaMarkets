# VillaMarkets Frontend

Aplicacion SPA desarrollada con **React + Vite** para el proyecto VillaMarkets. Implementa el flujo completo de clientes y administradores: catalogo, carrito sincronizado, pedidos, panel de control y consumo de la API REST del backend Spring Boot.

## Tabla de contenidos
1. [Arquitectura](#arquitectura)
2. [Requisitos](#requisitos)
3. [Instalacion y ejecucion](#instalacion-y-ejecucion)
4. [Variables de entorno](#variables-de-entorno)
5. [Scripts](#scripts)
6. [Estructura de carpetas](#estructura-de-carpetas)
7. [Integracion con el backend](#integracion-con-el-backend)
8. [Testing y linting](#testing-y-linting)
9. [Despliegue](#despliegue)
10. [Contribuir](#contribuir)

## Arquitectura
- **Framework**: React 18 + React Router.
- **Build**: Vite 5 con ES Modules.
- **Estilos**: Bootstrap 5, utilidades personalizadas en `src/styles` y componentes propios.
- **Estado**: Hooks + `localStorage` para carrito/usuario, servicios axios (`src/services`) para consumir la API.
- **Mapas y utilidades**: Leaflet, FileSaver, XLSX.

## Requisitos
- Node.js 18+ y npm 9+ (o pnpm/yarn).
- Acceso al backend en `http://<host>:8080/api` o la URL configurada en `.env`.

## Instalacion y ejecucion
```bash
git clone https://github.com/Rau1ignacio/VillaMarkets.git
cd VillaMarkets
npm install
npm run dev        # levanta http://localhost:5173
```

Para un build optimizado:
```bash
npm run build
npm run preview    # sirve la carpeta dist
```

## Variables de entorno
Crea `.env` (o copia `.env.example`) con:
```
VITE_API_BASE_URL=http://localhost:8080/api
```
En despliegues S3/CloudFront apunta a la IP/ALB del backend.

## Scripts
| Comando | Descripcion |
| ------- | ----------- |
| `npm run dev` | Modo desarrollo con HMR. |
| `npm run build` | Genera `dist/`. |
| `npm run preview` | Sirve `dist/` localmente. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run test` | Corre Jest + React Testing Library. |

## Estructura de carpetas
```
public/
src/
  components/      # Navbar, cards, layout
  pages/           # Vistas por rol (publico, cliente, admin)
  services/        # axios instance + servicios (productoService, carritoService, etc.)
  styles/          # CSS especificos
  testing/         # Suites Jest
  App.jsx          # Definicion de rutas
  main.jsx         # Bootstrap React
vite.config.js
```

## Integracion con el backend
- `src/services/api.js` configura axios con `baseURL = VITE_API_BASE_URL` y adjunta el token almacenado en `localStorage` (`authToken`).
- Servicios como `carritoService` y `pedidoService` consumen los endpoints REST (`/v1/carritos`, `/v1/pedidos`, `/v1/productos`).
- Componentes clave:
  - `Producto.jsx`: lista productos y dispara `POST /carritos/usuario/{id}/add`.
  - `MiCarrito.jsx`: sincroniza carrito remoto, permite modificar cantidades y crear pedidos.
  - `Login.jsx`: guarda `usuarioActual` y `authToken` que luego reutilizan las rutas protegidas.

## Testing y linting
- **Testing**: Jest + React Testing Library (`npm run test`). Los archivos viven en `src/testing` e incluyen pruebas de componentes y hooks.
- **Linting**: ESLint 9 con reglas para React Hooks. Ejecuta `npm run lint` antes de subir cambios.

## Despliegue
1. Ejecuta `npm run build` y sube `dist/` a S3 (Static Website Hosting) o a cualquier CDN.
2. Configura el dominio (S3 + CloudFront) con fallback a `index.html`.
3. Asegura que `VITE_API_BASE_URL` apunte a la URL publica del backend (idealmente HTTPS).

## Contribuir
- Crea ramas con el prefijo `feature/` o `fix/`.
- Ejecuta `npm run lint` y `npm run test` antes del pull request.
- Documenta nuevas rutas o variables en este README.

Proyecto mantenido en el marco del curso **DSY1104 - Desarrollo Fullstack II**.
