

const verifyRoles = (...allowedRoles) => { // rest operator --> it will be an array of parameters that I will pass to him
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401)
    // in verifyJWT we passed req.user and req.roles
    // so since verifyJWT will be called before verifyRoles the request must already be set with user and roles
    const rolesArray = [...allowedRoles]
    console.log({allowedRoles, rolesArray})
    console.log(req.roles);
    const result = req.roles.map(role => rolesArray.includes(role)).find(value => value === true)
    // confronto se nel req.roles (i ruoli che ha chi fa la richiesta) c'è almeno un valore true tra i ruoli accettati (rolesArray) ES: [false, true, true].find(...) sarà uguale a true 
    console.log(result);
    if(!result) return res.sendStatus(401)
    next()
  }
}

module.exports = verifyRoles