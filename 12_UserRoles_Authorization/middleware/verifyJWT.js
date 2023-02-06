const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization // it can be with a lower case or uppercase
  if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401) //Unauthorized
  // if we don't have an authHeader, or even if we do have an authHeader, if it doesn't starts with Bearer so ....
  const token = authHeader.split(' ')[1] //token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403) // Forbidden (Invalid token)
      req.user = decoded.UserInfo.username 
      req.roles = decoded.UserInfo.roles 
      next()
    })
    
}

module.exports = verifyJWT
