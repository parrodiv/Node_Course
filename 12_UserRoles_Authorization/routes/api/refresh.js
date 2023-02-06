const express = require('express')
const router = express.Router()
const refreshTokenController = require('../../controllers/refreshTokenController')

// this is a get route for refresh instead of post for authentication
router.get('/', refreshTokenController.handleRefreshToken)

module.exports = router
