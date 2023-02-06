const mongoose = require('mongoose')
const User = require('../model/User')

const getAllUsers = async (req, res) => {
  const users = await User.find().exec()
  !users && res.status(204).json({ message: 'No users found.' })
  res.json(users)
}

const deleteUser = async (req, res) => {
  if (!req.body?.id)
    return res.status(400).json({ message: 'User ID required' })

  const { id } = req.body

  const userDeleted = await User.findById(id).exec()
  console.log(userDeleted)
  if (!userDeleted) return res.json({ message: `User ID ${id} not found` })

  const result = await User.deleteOne({ _id: id })
  res.json(userDeleted)
}

const getUser = async (req, res) => {
  !req.params?.id && res.status(400).json({ message: 'User ID required' })
  const { id } = req.params

  // ******** GESTIONE ERRORI **********

  // check validate id
  // const isValid = mongoose.isValidObjectId(id)

  // if (!isValid) {
  //   return res.status(400).json({message: "The provided ID is not valid!"})
  // }

  const user = await User.findById(id)
    .exec()
    .catch((error) => res.status(400).json(error.message))

  !user && res.status(204).json({ message: `No user matches ID ${id}` })

  res.json(user)
}

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
}
