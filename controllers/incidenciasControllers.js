const db = require('../data/incidencias');
const { esTextoValido, prioridadValida, normalizarPrioridad } = require('../utils/helpers');

// 7)traduce la prioridad a una clasificacion
function clasificarIncidencia(req, res) {
  const id = parseInt(req.params.id);
  const incidencia = db.incidencias.find(inc => inc.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  let clasificacion;
  switch (incidencia.prioridad) { // el switch obligatorio
    case 'Alta':
      clasificacion = 'Crítica';
      break;
    case 'Media':
      clasificacion = 'Importante';
      break;
    case 'Baja':
      clasificacion = 'Normal';
      break;
    default:
      clasificacion = 'Sin clasificar';
  }

  res.json({ id: incidencia.id, clasificacion });
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