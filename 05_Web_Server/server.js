const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

//importo funzione da logEvents.js
const logEvents = require('./logEvents')
const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
//initialize object
const myEmitter = new MyEmitter()

//listening for the event
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))


const PORT = process.env.PORT || 3500 // will be using 3500

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf8' : ''
      // per le immagini non c'è da specificare utf8
    ) 
      //viene prima parsato in javascript object e poi restitutito come stringa
    const data = contentType === 'application/json'
      ? JSON.parse(rawData) : rawData
    
    response.writeHead(
      filePath.includes('404.html') ? 404 : 200,
      { 'Content-Type': contentType }
      // restituire risposta 404 nel caso in cui il filePath richiesto non esista e
      // lo verifichiamo attraverso il nuovo filePath che è reindirizzato alla pagina 404.html ("serve a 404 response" r.114)
    )
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    )
  } catch (error) {
    console.log(error)
    myEmitter.emit('log', `${error.name}\t${error.message}`, 'errLog.txt') // (msg, fileName)
    response.statusCode = 500 //server error
    response.end()
  }
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)

  myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt') // (msg, fileName)

  // FUNZIONA MA E' INEFFICIENTE
  // let pathFile
  // if (req.url === '/' || req.url === 'index.html') {
  //   res.statusCode = 200
  //   res.setHeader('Content-Type', 'text/html')
  //   pathFile = path.join(__dirname, 'views', 'index.html')
  //   fs.readFile(pathFile, 'utf8', (err, data) => {
  //     res.end(data)
  //   })
  // }

  const extension = path.extname(req.url)

  let contentType

  switch (extension) {
    case '.css':
      contentType = 'text/css'
      break
    case '.js':
      contentType = 'text/javascript'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.jpg':
      contentType = 'image/jpeg'
      break
    case '.txt':
      contentType = 'text/plain'
      break
    default:
      contentType = 'text/html'
  }

  let filePath =
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
      ? path.join(__dirname, 'views', req.url, 'index.html') //subdirectory (la req.url dovrà essere /subdir/, senza specificare il percorso xk lo fa in auto)
      : contentType === 'text/html'
      ? path.join(__dirname, 'views', req.url) //whatever was requested in the views folder
      : path.join(__dirname, req.url) // css / json / txt / img

  // makes .html extension not required in the browser
  if (!extension && req.url.slice(-1) !== '/') filePath += '.html'

  console.log(filePath)
  const fileExists = fs.existsSync(filePath)

  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, res)
  } else {
    // 301 redirect
    // 404
    // console.log(path.parse(filePath))

    switch (path.parse(filePath).base){   // es: index.html
      case 'old-page.html':
        res.writeHead(301, { Location: '/new-page.html' })
        res.end()
        break
      case 'www-page.html':
        res.writeHead(301, { Location: '/' })
        res.end()
        break
      default:
      // serve a 404 response
      serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
    }
  }
})

server.listen(PORT, () => console.log(`Server running on ${PORT}`))