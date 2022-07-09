const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/configDb')
const fileUpload = require('express-fileupload')
const { socketController } = require('../sockets/socketController')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT
    this.server = require('http').createServer(this.app)
    this.io = require('socket.io')(this.server)
    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      uploads: '/api/uploads',
      usuarios: '/api/usuarios'
    }
    this.conectarDB()
    this.middlewares()
    this.routes()
    this.sockets()
  }

  async conectarDB () {
    await dbConnection()
  }

  middlewares () {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }))
  }

  routes () {
    this.app.use(this.paths.auth, require('../routes/auth.routes'))
    this.app.use(this.paths.buscar, require('../routes/buscar.routes'))
    this.app.use(this.paths.categorias, require('../routes/categorias.routes'))
    this.app.use(this.paths.productos, require('../routes/productos.routes'))
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'))
    this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'))
  }

  sockets () {
    this.io.on('connection', (socket) => socketController(socket, this.io))
  }

  listen () {
    this.server.listen(this.port, () => {
      console.log(`Server in ${this.port}`)
    })
  }
}

module.exports = Server
