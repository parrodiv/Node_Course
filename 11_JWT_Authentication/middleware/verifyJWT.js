const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.sendStatus(401) //Unauthorized
  console.log(authHeader) // Bearer token
  const token = authHeader.split(' ')[1] //token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403) // Forbidden (Invalid token)
      req.user = decoded.username // we passed the username in the jwt so we can access to the username (see authController when we created tokens)
      next()
    })
    
}

module.exports = verifyJWT
