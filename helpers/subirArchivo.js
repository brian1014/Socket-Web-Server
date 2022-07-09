/* eslint-disable prefer-promise-reject-errors */
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
  return new Promise((resolve, reject) => {
    const { archivo } = files
    const nombreCortado = archivo.name.split('.')
    const extension = nombreCortado.at(-1)

    if (!extensionesValidas.includes(extension)) {
      return reject(`La extensión ${extension} no es permitida, extensiones permitidas -> ${extensionesValidas}`)
    }

    const nombreTemporal = uuidv4() + '.' + extension
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal)

    archivo.mv(uploadPath, (err) => {
      if (err) return reject(err)

      resolve(nombreTemporal)
    })
  })
}

module.exports = {
  subirArchivo
}
