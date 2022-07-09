const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('BD Online')
  } catch (error) {
    console.error(error)
    throw new Error('Error no se levanto la Base de Datos')
  }
}

module.exports = {
  dbConnection
}
