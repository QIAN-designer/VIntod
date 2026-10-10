// Middleware centralizado de gestión de errores
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode
    }
  });
};

module.exports = errorHandler;
