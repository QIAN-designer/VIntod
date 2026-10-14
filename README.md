# 🛍️ Vintod — Marketplace & Admin Platform

Plataforma full-stack de compraventa de moda y artículos de segunda mano entre particulares inspirada en Vinted.  
El proyecto está compuesto por un **backend robusto en Node.js, Express y MongoDB (vía Prisma ORM)** y un **frontend reactivo en Angular (Standalone Components, Signals & Tailwind CSS)** con marketplace público y un **Panel de Administración** completo.

---

## 🏗️ Arquitectura General del Sistema

```text
Vintod/
├── backend/                   # API REST en Node.js + Express + Prisma ORM + MongoDB
│   ├── prisma/
│   │   └── schema.prisma      # Esquema de datos relacional en MongoDB
│   ├── src/
│   │   ├── config/            # Conexión DB y PrismaClient
│   │   ├── ctrls/             # Controladores de la API REST
│   │   ├── services/          # Capa de lógica de negocio
│   │   ├── repos/             # Acceso y consultas a datos
│   │   ├── routes/            # Definición de endpoints HTTP
│   │   ├── schemas/           # Validaciones de esquemas (Zod)
│   │   └── middlewares/       # Validaciones, logging, manejo de errores
│   ├── seed.js                # Población inicial con datos realistas
│   └── package.json
│
├── frontend/                  # SPA Angular con Feature-Based Architecture
│   ├── src/app/
│   │   ├── core/              # Servicios singleton, stores reactivos (Signals), modelos
│   │   ├── shared/            # Componentes reutilizables, modales, pipes
│   │   ├── layouts/           # Layout público y layout de administración
│   │   └── features/
│   │       ├── products/      # Catálogo público, detalle y publicación de prendas
│   │       └── admin/         # Módulos de administración (Prendas, Papelera, Usuarios, Marcas...)
│   └── package.json
│
├── docker-compose.yml         # Contenedor MongoDB con Replica Set habilitado
├── .gitignore                 # Configuración de exclusión para Git/GitHub
└── README.md                  # Documentación principal del proyecto
```

---

## 🛠️ Stack Tecnológico

### Backend
* **Entorno de ejecución:** [Node.js](https://nodejs.org/)
* **Framework Web:** [Express.js](https://expressjs.com/)
* **Base de Datos:** [MongoDB](https://www.mongodb.com/) (con soporte de transacciones y Replica Set `rs0`)
* **ORM:** [Prisma ORM](https://www.prisma.io/) (con Prisma Client v5.22+)
* **Validación de Datos:** [Zod](https://zod.dev/)
* **Seguridad y Utilidades:** [Helmet](https://helmetjs.github.io/), [CORS](https://www.npmjs.com/package/cors), [Morgan](https://github.com/expressjs/morgan), [dotenv](https://www.npmjs.com/package/dotenv)

### Frontend
* **Framework:** [Angular 18/20+](https://angular.dev/) (100% Standalone Components)
* **Gestión de Estado:** [Angular Signals](https://angular.dev/guide/signals) (estado reactivo optimista en tiempo real)
* **Estilos y Maquetación:** [Tailwind CSS](https://tailwindcss.com/)
* **Alertas y Notificaciones:** [SweetAlert2](https://sweetalert2.github.io/)
* **Control de Tipos:** TypeScript estricto

---

## 💾 Modelo de Datos (MongoDB + Prisma)

La base de datos sigue un modelo relacional normalizado:

1. **`Role` (`roles`):** Permisos y perfiles (`ADMIN`, `USER`, `MODERATOR`).
2. **`User` (`users`):** Compradores, vendedores y administradores, con enlace a roles y productos.
3. **`Category` (`categories`):** Estructura jerárquica con autorreferencia para categorías y subcategorías.
4. **`Brand` (`brands`):** Marcas de moda (Nike, Levi's, Adidas, Zara, Vans, etc.).
5. **`Product` (`products`):** Entidad base del catálogo, vinculada a vendedor, categoría, marca, con soporte de *soft-delete* (`deletedAt`) y visibilidad (`isActive`).
6. **`ProductVariant` (`product_variants`):** Variantes de prenda con talla, color, estado de conservación (`condition`), precio y stock.
7. **`ProductImage` (`product_images`):** Fotografías asociadas a variantes con indicador de portada (`isCover`) y orden.

---

## 🚀 Puesta en Marcha Rápida

### 1. Prerrequisitos
* [Node.js](https://nodejs.org/) (v18+)
* [Docker](https://www.docker.com/) y Docker Compose (para levantar MongoDB con Replica Set) o una instancia activa de MongoDB.

### 2. Iniciar la Base de Datos con Docker
Desde la raíz del proyecto:
```bash
docker compose up -d
```
> Esto iniciará un contenedor MongoDB en el puerto `27017` con el replica set `rs0` listo para Prisma.

---

### 3. Configuración y Arranque del Backend

1. Entra a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` (puedes copiar `.env.example`):
   ```ini
   PORT=3000
   MONGODB_URI=mongodb://admin:erestonto@127.0.0.1:27017/vintod_db?authSource=admin&replicaSet=rs0&directConnection=true
   DATABASE_URL=mongodb://admin:erestonto@127.0.0.1:27017/vintod_db?authSource=admin&replicaSet=rs0&directConnection=true
   ```
4. Sincroniza el esquema con MongoDB y genera el cliente Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Poblar la base de datos con registros iniciales de prueba:
   ```bash
   npm run seed
   # o: node seed.js
   ```
6. Inicia el servidor backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   * El backend estará escuchando en: `http://localhost:3000`
   * API de productos: `http://localhost:3000/api/products`

---

### 4. Configuración y Arranque del Frontend

1. En una nueva terminal, entra a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación Angular:
   ```bash
   npm start
   # o: npx ng serve
   ```
4. Abre el navegador en:
   * **Marketplace Público:** [http://localhost:4200](http://localhost:4200)
   * **Panel de Administración:** [http://localhost:4200/admin](http://localhost:4200/admin)

---

## 🎯 Funcionalidades Principales

### 🛒 Marketplace Público
* **Catálogo de Prendas:** Exploración de artículos activos y visibles en tiempo real.
* **Filtros Dinámicos:** Búsqueda por texto, marcas, categorías y rangos de precio.
* **Detalle de Artículo:** Visualización de imágenes, tallas, estado de conservación, vendedor y precios.
* **Publicación de Artículos:** Formulario validado para publicar nuevas prendas con asignación de características.

### 🛡️ Panel de Administración (`/admin`)
* **Gestión de Prendas (`/admin/products`):** Auditoría del catálogo, activación/desactivación instantánea (`isActive`), edición y borrado lógico.
* **Papelera y Reactivación (`/admin/recycle-bin`):** Listado exclusivo de artículos con `deletedAt ≠ null`, con opción de **Reactivar Prenda** en un clic.
* **Gestión de Marcas (`/admin/brands`):** CRUD completo y moderación de marcas del catálogo.
* **Gestión de Categorías (`/admin/categories`):** Estructura y control de visibilidad del árbol de categorías.
* **Estados de Conservación (`/admin/conditions`):** Configuración de etiquetas de estado ("Nuevo con etiquetas", "Muy bueno", "Bueno", etc.).
* **Usuarios y Vendedores (`/admin/users`):** Control de perfiles, permisos por rol y moderación de cuentas.
* **Pedidos y Transacciones (`/admin/orders`):** Supervisión de ventas entre particulares y estados de entrega.

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/products` | Obtener todos los productos activos (no eliminados) |
| `GET` | `/api/products/deleted` | Obtener productos eliminados en papelera (`deletedAt ≠ null`) |
| `GET` | `/api/products/:id` | Obtener el detalle de un producto por ID |
| `GET` | `/api/products/slug/:slug` | Obtener el detalle de un producto por su slug único |
| `POST` | `/api/products` | Crear un nuevo producto con variantes |
| `PUT` | `/api/products/:id` | Actualización completa de producto y variante |
| `PATCH` | `/api/products/:id` | Actualización parcial de producto |
| `PATCH` | `/api/products/:id/activate` | Activar visibilidad (`isActive: true`) |
| `PATCH` | `/api/products/:id/deactivate` | Desactivar visibilidad (`isActive: false`) |
| `DELETE` | `/api/products/:id` | Borrado lógico (*Soft delete*, asigna `deletedAt`) |
| `POST` | `/api/products/:id/restore` | Restaurar prenda eliminada (`deletedAt: null`) |

---

## 📦 Scripts Disponibles

### Backend
* `npm start`: Inicia el servidor en producción.
* `npm run dev`: Inicia el servidor con recarga en caliente (`node --watch`).
* `npm run seed`: Limpia y puebla la base de datos con datos de prueba.

### Frontend
* `npm start`: Inicia el servidor de desarrollo de Angular en `http://localhost:4200`.
* `npm run build`: Compila el frontend optimizado para producción en `dist/vintod-frontend`.

---

## 📄 Licencia

Proyecto con fines formativos y académicos para el ciclo de **Desarrollo de Aplicaciones Web (DAW)**.

