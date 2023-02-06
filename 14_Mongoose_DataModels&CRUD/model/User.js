const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  roles: {
    User: {
      type: Number,
      default: 2001 // User role
    },
    Editor: Number,
    Admin: Number
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String  // it's not required because it's not always there
})

module.exports = mongoose.model('User', userSchema)
