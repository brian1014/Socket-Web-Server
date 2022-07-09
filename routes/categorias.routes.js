const { Router } = require('express')
const { check } = require('express-validator')
const { crearCategorias, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller')
const { existeCategoriaPorID } = require('../helpers/dbValidators')
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares')

const router = Router()

router.get('/', obtenerCategorias)

router.get('/:id', [
  check('id', 'No es un ID de mongo valido').isMongoId(),
  validarCampos,
  check('id').custom(existeCategoriaPorID),
  validarCampos
], obtenerCategoria)

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategorias)

router.put('/:id', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('id', 'No es un ID de mongo valido').isMongoId(),
  validarCampos,
  check('id').custom(existeCategoriaPorID),
  validarCampos
], actualizarCategoria)

router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID de mongo valido').isMongoId(),
  validarCampos,
  check('id').custom(existeCategoriaPorID),
  validarCampos
], borrarCategoria)

module.exports = router
