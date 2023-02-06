const express = require('express')
const router = express.Router()
const logoutController = require('../../controllers/logoutController')

// this is a get route for refresh instead of post for authentication
router.get('/', logoutController.handleLogout)

module.exports = router
