const { Router } = require('express')
const { check } = require('express-validator')
const { login, googleSignIn, renovarToken } = require('../controllers/auth.controller')
const { validarCampos, validarJWT } = require('../middlewares')

const router = Router()

router.post('/login', [
  check('correo', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña obligatoria').not().isEmpty(),
  validarCampos
], login)

router.post('/google', [
  check('idToken', 'id_token es obligatorio').not().isEmpty(),
  validarCampos
], googleSignIn)

router.get('/', validarJWT, renovarToken)

module.exports = router
