const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3500
const { logger, logEvents } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')


// custom middleware logger cleaned up
app.use(logger)


// Cross Origin Resource Sharing
// Se volessimo whitelistare alcuni indirizzi e quindi poter accedere ai dati del server solo da determinati indirizzi
const whitelist = ['https://www.google.com', 'http://localhost:3500'] //undefined if we are on localhost
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {  //!origin = undefined || false
      callback(null, true)
      // null perchè non c'è nessun errore, true perchè conferma che origin è accettato. (nella whitelist)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))  

// BUILT-IN MIDDLEWARE HAVE next() incorporated

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// built-in middleware for JSON
app.use(express.json())

// serve static files
// this is applied before our other routes so it will search the public directory for the requests before it moves to these other routes
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))


// asterisco significa tutto
// all http methods
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')){
    console.log("Loggato 404");
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({error: "404 Not Found"})
  } else {
    res.type('txt').send("404 Not Found")
  }
})

// custom error handling (from new Error)
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
