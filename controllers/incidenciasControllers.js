const db = require('../data/incidencias');
const { esTextoValido, prioridadValida, normalizarPrioridad } = require('../utils/helpers');

// 1) registra una incidencia nueva

function crearIncidencia(req, res) {
  const { empleado, area, descripcion, prioridad } = req.body;

  // validamos que ningun campo este vacio
  if (
    !esTextoValido(empleado) ||
    !esTextoValido(area) ||
    !esTextoValido(descripcion) ||
    !esTextoValido(prioridad)
  ) {
    return res.status(400).json({
      mensaje: 'Todos los campos son obligatorios y no pueden estar vacíos'
    });
  }

  // validamos que la prioridad sea una de las permitidas (sin importar mayus/minus)
  if (!prioridadValida(prioridad)) {
    return res.status(400).json({
      mensaje: 'La prioridad debe ser Alta, Media o Baja'
    });
  }

  const nuevaIncidencia = {
    id: db.nextId,
    empleado: empleado.trim(),
    area: area.trim(),
    descripcion: descripcion.trim(),
    prioridad: normalizarPrioridad(prioridad), // se guarda siempre con el mismo formato (Alta/Media/Baja)
    estado: 'Pendiente' // toda incidencia nueva arranca como Pendiente
  };

  db.incidencias.push(nuevaIncidencia);
  db.nextId++; // se aumenta el contador para el siguiente id

  res.status(201).json({ mensaje: 'Incidencia registrada correctamente' });
}

// 2) devuelve todas las incidencias tal cual estan guardadas

function listarIncidencias(req, res) {
  res.json(db.incidencias);
}



module.exports = {
  crearIncidencia,
  listarIncidencias,
  buscarPorId,
  cambiarEstado,
  eliminarIncidencia,
  obtenerEstadisticas,
  clasificarIncidencia
};