// nodemon è un pacchetto che monitora i file e appena salvi riavvia automaticamente  il server

// non digitiamo più "node [file]" nel terminale, nodemon lo fa in automatico 

// se il file da avviare è index.js ci basta digitare a terminale "nodemon" altrimenti "nodemon [file]"

console.log("testing")

// npm init per inizializzare npm prima di installare packages

// npm i date-fns (date functions)
// npm i uuid

const {format} = require('date-fns')
const {v4: uuid} = require('uuid')

console.log(format(new Date(), 'yyyy-MM-dd\tHH:mm:ss'));
console.log(uuid());

// INSTALLARE DEV DEPENDENCIES
// npm i nodemon -D

// npm start (node index) / npm run dev (nodemon)

// VERSIONS
// ^8.3.2    ^ = do not update a major version (dalla 8 alla 9 ad esempio o 7 ecc) 
// il tilde davanti invece indica di non installare la minor version diversa (3)

