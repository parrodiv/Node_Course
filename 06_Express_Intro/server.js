const express = require('express')
const app = express()
const path = require('path');
const PORT = process.env.PORT || 3500

// Express automatically sets the correct status code and content type unlike node.js 

// must begin with slash and end with slash OR /index.html  (.html)? means it is optional
app.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html') //non serve specificare il path completo perchè c'è nel precedente
  // specifico status code 301 perche di default restituisce status code 302
})


// Route Handlers
app.get('/hello(.html)?', (req, res, next) => {
  console.log('Attempted to load hello.html')
  next()
}, (req, res) => {
  res.send('Hello World!')
})

// Chaining route handlers
const one = (req, res, next) => {
  console.log('one');
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
app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// i route handlers sono simili ai middleware e questi verranno approfonditi nel prossimo capitolo
