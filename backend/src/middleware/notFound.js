const AppError = require('../services/utils/appError');

// Middleware para capturar rutas no encontradas (404)
const notFound = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
};

module.exports = notFound;
