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

// 3)busca una incidencia especifica por su id
function buscarPorId(req, res) {
  const id = parseInt(req.params.id); // los params llegan como texto, por eso el parseInt
  const incidencia = db.incidencias.find(inc => inc.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  res.json(incidencia);
}

// 4)cambia el estado de una incidencia (esta parte pide switch si o si)
function cambiarEstado(req, res) {
  const id = parseInt(req.params.id);
  const { estado } = req.body;
  const incidencia = db.incidencias.find(inc => inc.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  // el switch valida que el estado sea uno de los 4 permitidos
  switch (estado) {
    case 'Pendiente':
    case 'En Proceso':
    case 'Resuelta':
    case 'Cancelada':
      incidencia.estado = estado;
      res.json({ mensaje: Estado actualizado a ${estado} });
      break;
    default:
      res.status(400).json({ mensaje: 'Estado no válido' });
  }
}

