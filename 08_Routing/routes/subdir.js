const express = require('express')
const router = express.Router()
const path = require('path')

// in questo file accediamo ai file contenuti all'interno della subdir nella cartella views 

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'))
})

router.get('/test(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'))
})



module.exports = router
