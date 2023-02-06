const allowedOrigins = require('../config/allorwedOrigins')

const credentials = (req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true)
  }
  next()
}

module.exports = credentials

// Abbiamo bisogno di settare 'Access-Control-Allow-Credentials' al header della response in true perchè altrimenti darebbe errore da CORS, pertanto bisogna settarlo su true prima di raggiungere la linea di codice in cui vengono settate le options di CORS