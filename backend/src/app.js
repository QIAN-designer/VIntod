const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const productsRouter = require('./routes/products.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares de seguridad
app.use(helmet());

// Middlewares de logging
// 1. Mostrar logs en la terminal
app.use(morgan('dev'));

// 2. Guardar logs en un archivo
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas base bajo /api
app.use('/api/products', productsRouter);

// Manejo de rutas no encontradas (404)
app.use(notFound);

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;
