// se ci sono file di grosse dimensioni da copiare e riscrivere questo è il metodo più efficiente, perchè stream legge i file chunk per chunk (pezzo per pezzo) invece che restituire il file in un'unica soluzione (impiegherebbe più tempo)

//è lo stesso concetto dello streaming (il flusso di dati è in continuo scorrimento finchè la persona è in live)

const fs = require('fs')
const path = require('path')

const readStream = fs.createReadStream(path.join(__dirname, 'lorem.txt'), {
  encoding: 'utf8',
})

const writeStream = fs.createWriteStream(path.join(__dirname, 'new-lorem.txt'))

// L'evento "data" viene emesso ogni volta che il flusso cede la proprietà di un blocco di dati a un consumatore. Ciò può verificarsi ogni volta che lo stream viene cambiato in modalità flusso chiamando readable.pipe() o allegando una richiamata del listener all'evento 'data'.

// readStream.on('data', (dataChunk) => {
//   writeStream.write(dataChunk)
// })

// ALTERNATIVA PIU EFFICIENTE ALLO SNIPPET APPENA SOPRA
readStream.pipe(writeStream)