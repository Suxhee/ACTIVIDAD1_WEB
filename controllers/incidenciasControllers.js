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
// 6)cuenta cuantas incidencias hay de cada estado, sin usar variables sueltas
function obtenerEstadisticas(req, res) {
  const estadisticas = {
    totalIncidencias: db.incidencias.length,
    pendientes: db.incidencias.filter(inc => inc.estado === 'Pendiente').length,
    enProceso: db.incidencias.filter(inc => inc.estado === 'En Proceso').length,
    resueltas: db.incidencias.filter(inc => inc.estado === 'Resuelta').length,
    canceladas: db.incidencias.filter(inc => inc.estado === 'Cancelada').length
  };

  res.json(estadisticas);
}

// 3)busca una incidencia especifica por su id
function buscarPorId(req, res) {
  const id = parseInt(req.params.id); // los params llegan como texto, por eso el parseInt
  const incidencia = db.incidencias.find(inc => inc.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  res.json(incidencia);
}



// 5)borra una incidencia del arreglo
function eliminarIncidencia(req, res) {
  const id = parseInt(req.params.id);
  const index = db.incidencias.findIndex(inc => inc.id === id); // primero buscamos en que posicion esta

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  db.incidencias.splice(index, 1); // y la quitamos del arreglo
  res.json({ mensaje: 'Incidencia eliminada correctamente' });
}


// 6)cuenta cuantas incidencias hay de cada estado, sin usar variables sueltas
function obtenerEstadisticas(req, res) {
  const estadisticas = {
    totalIncidencias: db.incidencias.length,
    pendientes: db.incidencias.filter(inc => inc.estado === 'Pendiente').length,
    enProceso: db.incidencias.filter(inc => inc.estado === 'En Proceso').length,
    resueltas: db.incidencias.filter(inc => inc.estado === 'Resuelta').length,
    canceladas: db.incidencias.filter(inc => inc.estado === 'Cancelada').length
  };

  res.json(estadisticas);
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
