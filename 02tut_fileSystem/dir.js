const fs = require('fs')


// possiamo aggiungere delle condizioni per verificare se è gia esistente una cartella o file
// CREO DIRECTORY
if (!fs.existsSync('./new')) {
  fs.mkdir('./new', (err) => {
    if (err) throw err
    console.log('Directory created')
  })
}

//ELIMINO DIRECTORY SE ESISTE
if (fs.existsSync('./new')) {
  fs.rmdir('./new', (err) => {
    if (err) throw err
    console.log('Directory deleted')
  })
}
