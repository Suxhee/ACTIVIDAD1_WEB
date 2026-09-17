const db = require('../data/incidencias'); 
const {esTextoValido, prioridadValida} = require('../utils/helpers'); //Importando funciones auxiliares

// 1. Crear incidencia
function crearIncidencia(req, res) {
  const { empleado, area, descripcion, prioridad } = req.body; //lo que se espera en body

  if ( //validar que todos los datos vengan con el texto valido
    !esTextoValido(empleado) ||
    !esTextoValido(area) ||
    !esTextoValido(descripcion) ||
    !esTextoValido(prioridad)
  ) {
    return res.status(400).json({
      mensaje: 'Todos los campos son obligatorios y no pueden estar vacíos'
    });
  }

  if (!prioridadValida(prioridad)) {
    return res.status(400).json({ //validar datos para prioridad
      mensaje: 'La prioridad debe ser Alta, Media o Baja'
    });
  }

  //creacion del objeto
  const nuevaIncidencia = {
    id: db.nextId, //asignar ID
    empleado: empleado.trim(), //Uso de trim() para limpiar espacios a ambos lados
    area: area.trim(),
    descripcion: descripcion.trim(),
    prioridad: normalizarPrioridad(prioridad), // guardamos siempre con el mismo formato (Alta/Media/Baja)
    estado: 'Pendiente' //Estado por defecto
  };

  db.incidencias.push(nuevaIncidencia); //insertar en el arreglo
  db.nextId++; //el ID aumenta de 1 en 1

  res.status(201).json({ mensaje: 'Incidencia registrada correctamente' });
}

// 2. Listar todas las incidencias
function listarIncidencias(req, res) {
  res.json(db.incidencias); //devuelve el arreglo y sus datos almacenados
}

// 3. Buscar incidencia por id
function buscarPorId(req, res) {
  const id = parseInt(req.params.id); //convierte el parametro recibido (string) en un entero con parseInt()
  const incidencia = db.incidencias.find(inc => inc.id === id); //recorre el arreglo con fnd() hasta encontrar coincidencia con el ID dado

  if (!incidencia) { 
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  res.json(incidencia); //cuando lo encuentra retorna la incidencia
}

// 4. Cambiar estado de una incidencia (uso obligatorio de switch)
function cambiarEstado(req, res) {
  const id = parseInt(req.params.id);
  const { estado } = req.body;
  const incidencia = db.incidencias.find(inc => inc.id === id); //localiza la incidencia por el ID

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  switch (estado) {
    case 'Pendiente':
    case 'En Proceso':
    case 'Resuelta':
    case 'Cancelada':
      incidencia.estado = estado;
      res.json({ mensaje: `Estado actualizado a ${estado}` });
      break;
    default:
      res.status(400).json({ mensaje: 'Estado no válido' });
  }
}

// 5. Eliminar incidencia
function eliminarIncidencia(req, res) {
  const id = parseInt(req.params.id);
  const index = db.incidencias.findIndex(inc => inc.id === id); //Usa findIndex() para obtener el indice del arreglo a eliminar

  if (index === -1) { //no existe el index
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  db.incidencias.splice(index, 1); //splice()
  res.json({ mensaje: 'Incidencia eliminada correctamente' });
}

// 6. Estadísticas generales
function obtenerEstadisticas(req, res) {
  const estadisticas = {
    totalIncidencias: db.incidencias.length, //calcula la cantidad de incidencias en el arreglo
    pendientes: db.incidencias.filter(inc => inc.estado === 'Pendiente').length,
    enProceso: db.incidencias.filter(inc => inc.estado === 'En Proceso').length,
    resueltas: db.incidencias.filter(inc => inc.estado === 'Resuelta').length,
    canceladas: db.incidencias.filter(inc => inc.estado === 'Cancelada').length
  };

  res.json(estadisticas);
}

// 7. Traduce la prioridad a una clasificacion
function clasificarIncidencia(req, res) {
  const id = parseInt(req.params.id);
  const incidencia = db.incidencias.find(inc => inc.id === id); //busca el id

  if (!incidencia) {
    return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
  }

  let clasificacion; // se utiliza let porque se va a reasignar el valor de la variable dependiendo del caso
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



//Exportacion de funciones
module.exports = {
  crearIncidencia,
  listarIncidencias,
  buscarPorId,
  cambiarEstado,
  eliminarIncidencia,
  obtenerEstadisticas,
  clasificarIncidencia
};