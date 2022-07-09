const jwt = require('jsonwebtoken')
const { Usuario } = require('../models')

const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.SECRET_PRIVATE_KEY, {
      expiresIn: '4h'
    }, (err, token) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      if (err) reject('No se pudo generar el token')
      resolve(token)
    })
  })
}

const comprobarJWT = async (token = '') => {
  try {
    if (token.length <= 10) return null

    const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY)
    const usuario = await Usuario.findById(uid)
    if (!usuario || !usuario.estado) return null

    return usuario
  } catch (error) {
    return null
  }
}

module.exports = {
  generarJWT,
  comprobarJWT
}
