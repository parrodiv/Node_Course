const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3500
const { logger, logEvents } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')

// MIDDLEWARE are functions that are between the request and the response and have access  to the request object, response object and next function.

// IF WE PUT app.use ABOVE OUR ROUTES THAN THIS WILL APPLY TO ALL ROUTES THAT COME IN



// 4 custom middleware logger
// app.use((req, res, next) => {
//   logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
//   console.log(`${req.method} ${req.path}`)
//   next()
// })


//5 custom middleware logger cleaned up
app.use(logger)


//6 Cross Origin Resource Sharing
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

//1 built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//2 built-in middleware for JSON
app.use(express.json())

//3 serve static files
// this is applied before our other routes so it will search the public directory for the requests before it moves to these other routes
app.use(express.static(path.join(__dirname, '/public')))


app.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html')
})

// Route Handlers
app.get(
  '/hello(.html)?',
  (req, res, next) => {
    console.log('Attempted to load hello.html')
    next()
  },
  (req, res) => {
    res.send('Hello World!')
  }
)

// Chaining route handlers
const one = (req, res, next) => {
  console.log('one')
  next()
}

const two = (req, res, next) => {
  console.log('two')
  next()
}

const three = (req, res) => {
  console.log('three')
  res.send('Finished!')
}

app.get('/chain(.html)?', [one, two, three])


// asterisco significa tutto
// all http methods
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({error: "404 Not Found"})
  } else {
    res.type('txt').send("404 Not Found")
  }
})

//7 custom error handling (from new Error)
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
