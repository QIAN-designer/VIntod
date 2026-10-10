# Vintod Frontend (Angular 18)

Frontend moderno desarrollado en **Angular** para la plataforma de compraventa de ropa de segunda mano **Vintod** (estilo Vinted).

---

## 1. Stack Tecnológico

- **Angular 18**: Framework SPA con componentes Standalone y zoneless-ready.
- **TypeScript**: Tipado estático estricto.
- **Angular Signals**: Gestión reactiva y granular del estado de la aplicación.
- **CSS3 / CSS Variables**: Maquetación responsive nativa sin librerías externas pesadas.
- **Fetch API / Async-Await**: Comunicación asíncrona estándar con la API REST.

---

## 2. Estructura del Proyecto

```text
src/app/
├── models/                     # Interfaces TypeScript (Product, ApiResponse, etc.)
│   └── product.model.ts
├── services/                   # Llamadas HTTP a la API REST
│   └── products.service.ts
├── stores/                     # Gestión reactiva de estado con Angular Signals
│   └── products.store.ts
├── components/                 # Componentes reutilizables de UI
│   ├── header/
│   ├── footer/
│   ├── product-card/
│   ├── loading/
│   └── error-message/
├── pages/                      # Vistas y páginas enlazadas por el Router
│   ├── home/
│   ├── products/
│   ├── product-detail/
│   └── not-found/
├── app.routes.ts               # Definición de rutas del frontend
├── app.config.ts               # Configuración global de la aplicación (Locale 'es', Router)
└── app.component.ts            # Componente contenedor raíz con Header, RouterOutlet y Footer
```

---

## 3. Función de Cada Capa

- **`models/`**: Define los tipos de datos que viajan entre cliente y servidor. Coincide exactamente con el esquema de Mongoose (`_id`, `title`, `description`, `price`, `brand`, `size`, `condition`, `createdAt`).
- **`services/`**: Encapsula las peticiones `fetch` contra la API (`GET /api/products`, `GET /api/products/:id`). Transforma respuestas fallidas en errores entendibles.
- **`stores/`**: Gestiona el estado reactivo (`products`, `selectedProduct`, `loading`, `error`) mediante `signal` y `computed`. Proporciona métodos como `loadProducts()` y `loadProductById()`.
- **`components/`**: Bloques visuales atómicos e independientes (tarjetas de prenda, cabecera de navegación, ruleta de carga y avisos de error).
- **`pages/`**: Vistas principales que conectan los Stores con los componentes para ofrecer la experiencia de navegación.

---

## 4. Flujo de Datos

```text
PAGE / COMPONENT  ──(ejecuta acción)──>  STORE  ──(solicita datos)──>  SERVICE  ──(fetch)──>  API REST (Express + MongoDB)
      │                                    │
      └──────(reacciona a Signals)─────────┘
```

---

## 5. Instalación y Ejecución

### Prerrequisitos
- Node.js instalado (v18 o superior).
- Backend de Vintod activo en `http://localhost:3000`.

### Comandos
1. Entrar en la carpeta del frontend:
   ```bash
   cd vintod-frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo de Angular:
   ```bash
   npm start
   # o: npx ng serve
   ```
4. Abrir en el navegador: [http://localhost:4200](http://localhost:4200)

---

## 6. Configuración de la API

La URL base del backend está centralizada en `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 7. Funcionalidades Implementadas

- **Página de Inicio (`/`)**: Hero visual con llamada a la acción y visualización de novedades.
- **Catálogo de Prendas (`/products`)**: Listado completo de artículos con grid responsive de tarjetas (título, precio, talla, marca y condición).
- **Detalle de Producto (`/products/:id`)**: Ficha detallada con identificador de MongoDB, características completas, estado y fecha de publicación.
- **Manejo de Estados**:
  - Pantallas de carga (*Spinner*) durante las peticiones asíncronas.
  - Gestión centralizada de errores (cuando el backend está apagado o el ID no existe).
  - Estado vacío cuando no hay prendas registradas en MongoDB.
