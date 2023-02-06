require('dotenv').config()  //spostato dal singolo middleware al server
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const connectDB = require('./config/dbConn')

// Connect to MongoDB.
connectDB()

// custom middleware logger cleaned up
app.use(logger)

// Handle options credentials check - before CORS!
// e recuperare i requisiti delle credenziali dei cookie
app.use(credentials)

app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data (form data)
app.use(express.urlencoded({ extended: false }))

// built-in middleware for JSON
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/login'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

// protect all routes that are below app.use(verifyJWT)
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

// asterisco significa tutto
// all http methods
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    console.log('Loggato 404')
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

// custom error handling
app.use(errorHandler)

// verify if it's connected 
mongoose.connection.once('open', () => {  //"once" instead "on" because we want to log only once we're connected to mongoDB, "open" means connected
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

