const User = require('../model/User')

const handleLogout = async (req, res) => {
  // On client (frontend), also delete the accessToken

  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // Successful with NO CONTENT
  const refreshToken = cookies.jwt

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
  if (!foundUser) {
    // if didn't find user, we still want to delete the token
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204)
  }

  // If we've reached this point that means we did find the same refreshToken in the db, so now we need to delete that

  // Delete refreshToken in db
  const result = await User.updateOne(
    { username: foundUser.username },
    { $set: { refreshToken: '' } }
  )

  console.log(result);

  // ******ALTERNATIVA*****
  // foundUser.refreshToken = ''
  // const result = await foundUser.save() //salva il nuovo foundUser document senza refreshToken


  // DELETE cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    // In logout maxAge isn't necessary
  })
  // in production --> secure: true - only serves on https
  res.sendStatus(204)
}

module.exports = { handleLogout }
