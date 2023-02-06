const User = require('../model/User')

const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  console.log(cookies)
  const refreshToken = cookies.jwt

  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
  if (!foundUser) return res.sendStatus(403) // Forbidden

  //evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log({ decoded });
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403)
    const roles = Object.values(foundUser.roles) // return an array with values of a given object's own enumerable string-keyed property values es:[2001, 1984]
    // create new access token every time we make a request on /refresh route endpoint
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    )
    res.json({ accessToken })
  })
}

module.exports = { handleRefreshToken }
