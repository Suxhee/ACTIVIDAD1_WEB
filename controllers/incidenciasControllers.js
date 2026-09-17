const db = require('../data/incidencias');
const { esTextoValido, prioridadValida, normalizarPrioridad } = require('../utils/helpers');


module.exports = {
  crearIncidencia,
  listarIncidencias,
  buscarPorId,
  cambiarEstado,
  eliminarIncidencia,
  obtenerEstadisticas,
  clasificarIncidencia
};