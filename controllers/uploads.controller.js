const path = require('path')
const fs = require('fs')
const { response } = require('express')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { subirArchivo } = require('../helpers/subirArchivo')
const { Usuario, Producto } = require('../models')

const cargarArchivo = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, 'imgs')
    res.json({
      nombre
    })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) return res.status(400).json({ msg: `No existe un usuario ${id}` })
      break
    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) return res.status(400).json({ msg: `No existe un producto ${id}` })
      break
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' })
  }

  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
    if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen)
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion)
  modelo.img = nombre

  await modelo.save()

  res.json(modelo)
}

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) return res.status(400).json({ msg: `No existe un usuario ${id}` })
      break
    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) return res.status(400).json({ msg: `No existe un producto ${id}` })
      break
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' })
  }

  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
    if (fs.existsSync(pathImagen)) return res.sendFile(pathImagen)
  }
  const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
  res.sendFile(pathImagen)
}

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) return res.status(400).json({ msg: `No existe un usuario ${id}` })
      break
    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) return res.status(400).json({ msg: `No existe un producto ${id}` })
      break
    default:
      return res.status(500).json({ msg: 'Se me olvidó validar esto' })
  }

  if (modelo.img) {
    const nombreArr = modelo.img.split('/')
    const nombre = nombreArr.at(-1)
    const [publicID] = nombre.split('.')
    cloudinary.uploader.destroy(publicID)
  }
  const { tempFilePath } = req.files.archivo
  const { secure_url: secureURL } = await cloudinary.uploader.upload(tempFilePath)

  modelo.img = secureURL
  await modelo.save()
  res.json(modelo)
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
}
