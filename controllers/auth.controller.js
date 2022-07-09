const { response } = require('express')
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generarJWT')
const { googleVerify } = require('../helpers/googleVerify')

const login = async (req, res = response) => {
  const { correo, password } = req.body

  try {
    const usuario = await Usuario.findOne({ correo })

    if (!usuario || !usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario/password no son correctos'
      })
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password)
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario/password no son correctos'
      })
    }

    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

const googleSignIn = async (req, res = response) => {
  const { idToken } = req.body

  try {
    const { nombre, img, correo } = await googleVerify(idToken)
    let usuario = await Usuario.findOne({ correo })

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        rol: 'USER_ROLE',
        google: true
      }
      usuario = new Usuario(data)
      await usuario.save()
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador usuario bloqueado'
      })
    }

    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token
    })
  } catch (error) {
    res.status(400).json({
      msg: 'El token no se pudo verificar'
    })
  }
}

const renovarToken = async (req, res = response) => {
  const { usuario } = req

  const token = await generarJWT(usuario.id)

  res.json({
    usuario,
    token
  })
}

module.exports = {
  login,
  googleSignIn,
  renovarToken
}
