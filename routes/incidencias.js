const express = require('express'); //Agregar express
const router = express.Router();
const controller = require('../controllers/incidenciasController'); //Agregar controlador

// se decide que URL llama a que función, la logica esta en el controller
router.post('/incidencias', controller.crearIncidencia);
router.get('/incidencias', controller.listarIncidencias);
router.get('/incidencias/:id', controller.buscarPorId);
router.put('/incidencias/:id/estado', controller.cambiarEstado);
router.delete('/incidencias/:id', controller.eliminarIncidencia);
router.get('/estadisticas', controller.obtenerEstadisticas);
router.get('/incidencias/:id/clasificacion', controller.clasificarIncidencia);

module.exports = router; //exportar router