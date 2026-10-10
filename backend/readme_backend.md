# Vintod API - Backend

Backend de la plataforma **Vintod**, una aplicación de compraventa de ropa y artículos de segunda mano entre particulares inspirada en Vinted. Proyecto desarrollado con arquitectura modular en capas para el ciclo formativo de **2º DAW**.

---

## 🛠️️ Tecnologías Utilizadas

* **Entorno de ejecución:** [Node.js](https://nodejs.org/) (JavaScript en el lado del servidor)
* **Framework:** [Express.js](https://expressjs.com/) (Creación de API REST)
* **Base de datos:** [MongoDB](https://www.mongodb.com/) (NoSQL orientada a documentos)
* **ODM:** [Mongoose](https://mongoosejs.com/) (Modelado de datos y validaciones)
* **Variables de entorno:** [dotenv](https://www.npmjs.com/package/dotenv)
* **Seguridad / Conectividad:** [cors](https://www.npmjs.com/package/cors)
* **Pruebas de endpoints:** [Postman](https://www.postman.com/)

---

## 📁 Estructura del Proyecto

```text
vintod-backend/
├── .env                       # Variables de entorno (no subir al repositorio)
├── .env.example               # Plantilla de variables de entorno
├── .gitignore                 # Exclusiones para Git
├── package.json               # Metadatos y dependencias del proyecto
├── seed.js                    # Script para poblar la base de datos de prueba
└── src/
    ├── app.js                 # Configuración principal de Express, CORS y middlewares
    ├── server.js              # Inicialización de la base de datos y arranque del puerto
    ├── config/
    │   └── db.js              # Conexión a MongoDB con Mongoose
    ├── models/
    │   └── product.model.js   # Esquema y modelo de Mongoose
    ├── repos/
    │   └── products.repo.js   # Acceso directo a la base de datos
    ├── services/
    │   ├── products.service.js# Lógica de negocio y validaciones
    │   └── utils/
    │       └── appError.js    # Clase centralizada para errores HTTP
    ├── ctrls/
    │   └── products.ctrl.js   # Controladores (procesan req, res y next)
    ├── routes/
    │   └── products.routes.js # Definición de endpoints HTTP
    └── middleware/
        ├── notFound.js        # Manejador de rutas no encontradas (404)
        └── errorHandler.js    # Manejador centralizado de errores
```

---

## 🚀 Requisitos Previos

1. **Node.js** (versión 18 o superior recomendada).
2. **MongoDB** corriendo en local (vía servicio del sistema, MongoDB Compass) o una cadena de conexión a **MongoDB Atlas**.
3. **Postman** instalado para probar las rutas.

---

## ⚙️ Instalación y Configuración

### 1. Clonar o descomprimir el proyecto
Ubica el proyecto en una ruta sin espacios ni caracteres especiales:
```bash
cd vintod-backend
```

### 2. Instalar dependencias
Descarga los módulos requeridos mediante npm:
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo llamado `.env` en la raíz del proyecto a partir del archivo de ejemplo:
```bash
cp .env.example .env
```

Abre `.env` y define los valores necesarios:
```ini
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vintod_db
```
*(Si usas MongoDB Atlas, reemplaza la URI por la proporcionada por tu clúster).*

### 4. Cargar datos iniciales (Seed)
Ejecuta el script para limpiar e insertar productos de prueba en la colección:
```bash
npm run seed
# o directamente: node seed.js
```

---

## ▶️ Ejecución del Servidor

### Modo desarrollo (con recarga automática):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

Cuando todo esté en orden, verás en la consola:
```text
[Database] Conectado exitosamente a MongoDB
[Server] Vintod API escuchando en el puerto 3000
```

---

## 📮 Uso y Pruebas con Postman

La API expone las rutas bajo el prefijo unificado `/api`.

### 1. Obtener todos los productos
* **Método:** `GET`
* **URL:** `http://127.0.0.1:3000/api/products`
* **Respuesta esperada (`200 OK`):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "6648a1b2c3d4e5f6a7b8c9d0",
      "title": "Sudadera con capucha vintage",
      "description": "Sudadera oversize estilo retro, algodón grueso y muy cómoda.",
      "price": 24.99,
      "brand": "Nike",
      "size": "L",
      "condition": "Muy bueno",
      "createdAt": "2026-09-29T10:00:00.000Z",
      "updatedAt": "2026-09-29T10:00:00.000Z"
    }
  ]
}
```

### 2. Obtener un producto por ID
* **Método:** `GET`
* **URL:** `http://127.0.0.1:3000/api/products/:id`  
  *(Sustituye `:id` por un `_id` real obtenido de la consulta anterior)*
* **Ejemplo:** `http://127.0.0.1:3000/api/products/6648a1b2c3d4e5f6a7b8c9d0`
* **Respuesta esperada (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "_id": "6648a1b2c3d4e5f6a7b8c9d0",
    "title": "Sudadera con capucha vintage",
    "description": "Sudadera oversize estilo retro, algodón grueso y muy cómoda.",
    "price": 24.99,
    "brand": "Nike",
    "size": "L",
    "condition": "Muy bueno",
    "createdAt": "2026-09-29T10:00:00.000Z",
    "updatedAt": "2026-09-29T10:00:00.000Z"
  }
}
```

### 3. Respuestas de control de errores
* **ID con formato no válido:** Si envías `http://localhost:3000/api/products/123`, obtendrás un código `400 Bad Request`.
* **ID inexistente pero válido:** Si consultas un identificador válido que no existe en la base de datos, obtendrás un código `404 Not Found`.

---

## 🧠 ¿Cómo Funciona la Arquitectura del Backend?

El backend implementa una **arquitectura por capas desacoplada** con una única dirección de flujo para cada petición:

```text
CLIENTE (Postman / Frontend)
           │
           ▼
        [ROUTE]
           │
           ▼
        [CTRL]
           │
           ▼
       [SERVICE]
           │
           ▼
        [REPO]
           │
           ▼
    [MODEL / MONGOOSE]
           │
           ▼
       [MONGODB]
```

### Responsabilidad de cada capa:

1. **Rutas (`src/routes/`):**
   * Declaran la correspondencia entre los métodos HTTP (`GET`, `POST`, etc.), las rutas URL (`/api/products`) y el método del controlador a invocar.
   * No contienen lógica de negocio ni manipulación de datos.

2. **Controladores (`src/ctrls/`):**
   * Reciben la petición HTTP (`req`), extraen los parámetros (`req.params`, `req.query`, `req.body`) y llaman a la capa de servicio.
   * Envían la respuesta formateada al cliente (`res.status().json()`).
   * Capturan excepciones y las redirigen al manejador global mediante `next(error)`.

3. **Servicios (`src/services/`):**
   * Contienen las reglas de negocio.
   * Validan restricciones funcionales (por ejemplo, comprobar si un ID de MongoDB es válido usando `mongoose.Types.ObjectId.isValid`).
   * Si una condición falla, instancian y lanzan un error tipificado (`AppError(mensaje, statusCode)`).

4. **Repositorios (`src/repos/`):**
   * Encapsulan las operaciones contra la base de datos.
   * Son los únicos archivos autorizados a ejecutar métodos de Mongoose (`Product.find()`, `Product.findById()`, etc.).
   * Si en el futuro se cambiara la librería de base de datos, el servicio no necesitaría modificarse.

5. **Modelos (`src/models/`):**
   * Definen el esquema (`Schema`) de los datos en MongoDB con tipos, obligatoriedad y validadores nativos.

6. **Manejo centralizado de errores (`src/middleware/errorHandler.js`):**
   * Intercepta cualquier fallo producido en controladores o servicios.
   * Unifica la respuesta para que la API siempre devuelva un formato JSON consistente con su código de estado HTTP correspondiente.