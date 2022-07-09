const Router = require('express')
const { check } = require('express-validator')
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller')
const { existeProductoPorID, existeCategoriaPorID } = require('../helpers/dbValidators')
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares')
const router = Router()

router.get('/', obtenerProductos)

router.get('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  validarCampos,
  check('id').custom(existeProductoPorID),
  validarCampos
], obtenerProducto)

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un ID de Mongo valido').isMongoId(),
  validarCampos,
  check('categoria').custom(existeCategoriaPorID),
  validarCampos
], crearProducto)

router.put('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos,
  check('id').custom(existeProductoPorID),
  validarCampos
], actualizarProducto)

router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos,
  check('id').custom(existeProductoPorID)
], borrarProducto)
module.exports = router
