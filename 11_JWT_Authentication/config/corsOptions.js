const allowedOrigins = require('../config/allorwedOrigins')

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //!origin = undefined || false, lo inseriamo perchè localhost restituisce undefined e vogliamo concedere l'accesso al localhost altrimenti non potremmo andare avanti
      callback(null, true)
      // null perchè non c'è nessun errore, true perchè conferma che origin è accettato. (nella whitelist)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
}

module.exports = corsOptions