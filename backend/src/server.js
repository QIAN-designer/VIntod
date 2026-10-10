require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Conectar a la base de datos antes de escuchar peticiones
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] Vintod API escuchando en el puerto ${PORT}`);
    console.log(`[Server] URL base: http://localhost:${PORT}/api/products`);
  });
};

startServer();
