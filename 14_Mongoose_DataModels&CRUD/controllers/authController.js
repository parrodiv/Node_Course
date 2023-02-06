const User = require('../model/User')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body
  console.log(req.body)
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required' })

  const foundUser = await User.findOne({ username: user }).exec()
  console.log(foundUser)
  if (!foundUser) return res.sendStatus(401) //Unauthorized when founduser is undefined

  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password)
  if (match) {
    const roles = Object.values(foundUser.roles) // return an array with values of a given object's own enumerable string-keyed property values.
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    )
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
      // REFRESH TOKEN NEEDS TO LAST MUCH LONGER THAN ACCESS TOKEN
    )

    // STORE REFRESH TOKEN WITH CURRENT USER IN DB mongo
    // BECAUSE refreshToken CAN BE CROSS-REFERENCED (confirmed) WHEN IT IS SENT BACK TO CREATE ANOTHER accessToken
    
    // Update user with refreshToken added
    await User.updateOne(
      { username: foundUser.username },
      { $set: { refreshToken: refreshToken } }
    ).exec()
    // *******ALTERNATIVA
    // foundUser.refreshToken = refreshToken
    // const result = await foundUser.save()

    // sending a refreshToken in a cookie that is httpOnly (more secure), so is not accessible via javascript
    // when we now log in, in the cookies section of the response there will be the refresh token
    // when we make a get request to /refresh endpoint we don't need to put anything wheter in the body or auth ecc.
    // so the refresh token remains stored in cookies and every time we make this get request we'll get a new access token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'None',
      // C'è una cross-site response, ovvero frontend application non ha lo stesso dominio del backend api (viene notificato nel client in Headers), quindi specifichiamo sameSite: 'None'
      //secure:true //in production- (https)
    })
    res.json({ accessToken })
  } else {
    res.sendStatus(401) //Unauthorized
  }
}

module.exports = { handleLogin }
