const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data
  },
}
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body
  console.log(req.body)
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required' })

  const foundUser = usersDB.users.find((person) => person.username === user)
  console.log(foundUser)
  if (!foundUser) return res.sendStatus(401) //Unauthorized when founduser is undefined

  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password)
  if (match) {
    const roles = Object.values(foundUser.roles) // return an array with values of a given object's own enumerable string-keyed property values.
    // create JWTs
    const accessToken = jwt.sign(
      {
         "UserInfo": {
          username: foundUser.username,
          roles: roles
          }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    )
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
      // REFRESH TOKEN NEEDS TO LAST MUCH LONGER THAN ACCESS TOKEN
    )

    // STORE REFRESH TOKEN WITH CURRENT USER IN DB JSON
    // BECAUSE refreshToken CAN BE CROSS-REFERENCED (confirmed) WHEN IT SENT BACK TO CREATE ANOTHER accessToken
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    )
    const currentUser = { ...foundUser, refreshToken }
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(usersDB.users)
    )

    // sending a refreshToken in a cookie that is httpOnly (more secure), so is not accessible via javascript
    // when we now log in, in the cookies section of the response there will be the refresh token
    // when we make a get request to /refresh endpoint we don't need to put anything wheter in the body or auth ecc.
    // so the refresh token remains stored in cookies and every time we make this get request we'll get a new access token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'None',
      // C'è una cross-site response, ovvero frontend application non ha lo stesso dominio del backend api (viene notificato nel client in Headers), quindi specifichiamo sameSite: 'None'
      // in production secure:true - (https)
    })
    res.json({ accessToken })
  } else {
    res.sendStatus(401) //Unauthorized
  }
}

module.exports = { handleLogin }
