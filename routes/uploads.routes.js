const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads.controller')
const { coleccionesPermitidas } = require('../helpers/dbValidators')
const { validarCampos, validarArchivoSubir } = require('../middlewares')

const router = Router()

router.post('/', validarArchivoSubir, cargarArchivo)

router.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'No es un ID valido').isMongoId(),
  check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('coleccion').custom(coleccion => coleccionesPermitidas(coleccion, ['usuarios', 'productos'])),
  validarCampos
], mostrarImagen)

module.exports = router
