// aqui damos vida a todos los datos en memoria, se borra si se apaga el servidor
const db = {
  incidencias: [], // el arreglo con todas las incidencias
  nextId: 1 // para no repetir ids
};

module.exports = db;
