# VillaMarkets

VillaMarkets es un prototipo educativo de e-commerce creado para practicar diseño web y desarrollo front-end. Incluye páginas estáticas en HTML, estilos personalizados en CSS y componentes de Bootstrap 5 para lograr un layout responsivo.

---

## 📚 Tabla de contenidos
1. [Descripción general](#descripción-general)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Tecnologías](#tecnologías)
4. [Características principales](#características-principales)
5. [Ejecución local](#ejecución-local)
6. [Convenciones de estilos](#convenciones-de-estilos)
7. [Guía de contribución](#guía-de-contribución)
8. [Próximos pasos sugeridos](#próximos-pasos-sugeridos)
9. [Licencia](#licencia)

---

## Descripción general

El proyecto simula una tienda llamada **VillaMarkets**. Su objetivo es servir como base para actividades de clase: maquetación, personalización con CSS, experimentación con Bootstrap y preparación para integrar lógica front-end o back-end en futuras iteraciones.

---

## Estructura del proyecto
.
├── index.html # Landing page principal
├── shop.html # Listado de productos
├── product.html # Detalle de un producto
├── cart.html # Mock del carrito de compras
└── static/
├── css/ # Hojas de estilo personalizadas
├── img/ # Imágenes del sitio
└── js/ # Scripts opcionales (si aplica)

> Ajusta los nombres y rutas según la estructura real de tu carpeta `static/`.

---

## Tecnologías

- **HTML5** para la maquetación.
- **CSS3** para estilos personalizados.
- **Bootstrap 5** (a través de CDN) para componentes y grid responsivo.
- **Imágenes estáticas** en formatos JPG y PNG.

---

## Características principales

- Diseño responsivo básico con Bootstrap.
- Navegación entre páginas estáticas (`index`, `shop`, `product`, `cart`).
- Sección de productos con tarjetas reutilizables.
- Prototipo de carrito para ejercicios de UI.

---

## Ejecución local

### Opción rápida
Abre `index.html` directamente en tu navegador.

### Servidor local (recomendado)
Sirve el proyecto con cualquier servidor estático:

```powershell
# Ejecuta en la raíz del proyecto
python -m http.server 8000
# Luego visita:
# http://localhost:8000
