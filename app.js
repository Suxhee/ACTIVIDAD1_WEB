const express = require('express');
const incidenciasRoutes = require('./routes/incidencias');

const app = express();
const PORT = 3000;

// esto permite que express entienda JSON en el body (sin esto no llegan los datos del POST)
app.use(express.json());

// aqui conectamos todas las rutas del proyecto
app.use('/', incidenciasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});