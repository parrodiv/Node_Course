const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500
const { logger, logEvents } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')



// custom middleware logger cleaned up
app.use(logger)



app.use(cors(corsOptions))  


// built-in middleware to handle urlencoded data (form data)
app.use(express.urlencoded({ extended: false }))

// built-in middleware for JSON
app.use(express.json())

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/employees', require('./routes/api/employees'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/login'))


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
