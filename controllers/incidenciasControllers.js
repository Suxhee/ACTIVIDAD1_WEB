const db = require('../data/incidencias');
const { esTextoValido, prioridadValida, normalizarPrioridad } = require('../utils/helpers');

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