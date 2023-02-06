const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}

const jwt = require('jsonwebtoken')

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  if (!cookies?.jwt)
    return res
      .sendStatus(401)
  console.log(cookies);  
  const refreshToken = cookies.jwt

  const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken)

  if (!foundUser) return res.sendStatus(403) // Forbidden

  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
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
        { expiresIn: '30s' }
      )
      res.json({ accessToken })
    }
  )
}

module.exports = { handleRefreshToken }