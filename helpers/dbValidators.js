const { Categoria, Role, Usuario, Producto } = require('../models')

const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol })
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`)
  }
}

const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo })
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado`)
  }
}

const existeUsuarioPorID = async (id) => {
  const existeUsuario = await Usuario.findById(id)
  if (!existeUsuario) {
    throw new Error(`No existe un usuario con este ID: ${id}`)
  }
}

const existeCategoriaPorID = async (id) => {
  const existeCategoriaPorID = await Categoria.findById(id)
  if (!existeCategoriaPorID) {
    throw new Error(`No existe una categoria con este ID: ${id}`)
  }
}

const existeProductoPorID = async (id) => {
  const existeProductoPorID = await Producto.findById(id)
  if (!existeProductoPorID) {
    throw new Error(`No existe un producto con este ID: ${id}`)
  }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion)
  if (!incluida) throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`)

  return true
}

module.exports = {
  coleccionesPermitidas,
  emailExiste,
  esRoleValido,
  existeCategoriaPorID,
  existeProductoPorID,
  existeUsuarioPorID
}
