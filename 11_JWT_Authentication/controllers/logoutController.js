const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}
const fsPromises = require('fs').promises
const path = require('path')

const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleLogout = async (req, res) => {
  // On client (frontend), also delete the accessToken

  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // Successful with NO CONTENT
  const refreshToken = cookies.jwt

  // Is refreshToken in db?
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  )
  if (!foundUser) {
    // if didn't find user, we still want to delete the token
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204)
  }

  // If we've reached this point that means we did find the same refreshToken in the db, so now we need to delete that

  // Delete refreshToken in db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  )
  const currentUser = { ...foundUser, refreshToken: '' }
  // SET USERS WITHOUT THE currentUser's refreshToken
  usersDB.setUsers([...otherUsers, currentUser])

  // OVERWRITE users.json
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  )

  // DELETE cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None'
    // In logout maxAge isn't necessary
    
  })
  // in production --> secure: true - only serves on https
  res.sendStatus(204)
}

module.exports = { handleLogout }
