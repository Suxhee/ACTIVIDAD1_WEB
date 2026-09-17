//Funciones auxiliares

//Verifica que el texto no venga vacio no solo con espacios
function esTextoValido(texto) {
  return typeof texto === 'string' && texto.trim().length > 0;
}

//Verifica que la prioridad sea alta/media/baja, sin importar como la escriban
function prioridadValida(prioridad) {
  const opciones = ['alta', 'media', 'baja'];
  return typeof prioridad === 'string' && opciones.includes(prioridad.toLowerCase());
}

//Deja la prioridad siempre en el mismo formato antes de guardarla
function normalizarPrioridad(prioridad) {
  const prioridadMinuscula = prioridad.toLowerCase();

  switch (prioridadMinuscula) {
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Media';
    case 'baja':
      return 'Baja';
    default:
      return prioridad; // por si acaso, no debería llegar aqui porque ya se valido antes
  }
}

//Exportar funciones
module.exports = { esTextoValido, prioridadValida, normalizarPrioridad };




