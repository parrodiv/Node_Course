const whitelist = [
  'https://www.google.com',
  'http://localhost:3500'
] //undefined if we are on localhost

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      //!origin = undefined || false
      callback(null, true)
      // null perchè non c'è nessun errore, true perchè conferma che origin è accettato. (nella whitelist)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
}

module.exports = corsOptions