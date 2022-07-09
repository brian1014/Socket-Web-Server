const { response } = require('express')
const { Producto } = require('../models')

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query
  const query = { estado: true }

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre')
      .limit(Number(limite))
      .skip(Number(desde))
  ])

  res.status(200).json({
    total,
    productos
  })
}

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params
  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

  res.status(200).json(producto)
}

const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body

  const productoBD = await Producto.findOne({ nombre: body.nombre })
  if (productoBD) {
    return res.status(400).json({
      msg: `El producto ${productoBD.nombre} ya existe`
    })
  }
  body.nombre = body.nombre.toUpperCase()

  const data = {
    usuario: req.usuario._id,
    ...body
  }

  const producto = new Producto(data)
  await producto.save()

  res.status(201).json(producto)
}

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params
  const { estado, usuario, ...data } = req.body
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase()
  }

  data.usuario = req.usuario._id

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
  await producto.save()

  res.status(200).json(producto)
}

const borrarProducto = async (req, res = response) => {
  const { id } = req.params
  const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

  res.status(200).json(productoBorrado)
}

module.exports = {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos
}
