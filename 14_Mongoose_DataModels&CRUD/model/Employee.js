const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
  // don't need an id because it will automatically create for us with ObjectId
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Employee', employeeSchema)
// The first argument is the singular name of the collection your model is for.
// Mongoose automatically looks for the plural, lowercased version of your model name. Employee => employees