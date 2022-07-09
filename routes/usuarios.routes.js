const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos, validarJWT, tieneRole } = require('../middlewares')
const { esRoleValido, emailExiste, existeUsuarioPorID } = require('../helpers/dbValidators')
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete
} = require('../controllers/usuarios.controllers')

const router = Router()

router.get('/', usuariosGet)

router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorID),
  check('rol').custom(esRoleValido),
  validarCampos
], usuariosPut)

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom(emailExiste),
  check('rol').custom(esRoleValido),
  validarCampos
], usuariosPost)

router.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos,
  check('id').custom(existeUsuarioPorID),
  validarCampos
], usuariosDelete)

module.exports = router
