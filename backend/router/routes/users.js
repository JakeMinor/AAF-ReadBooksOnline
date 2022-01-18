const express = require('express')
const router = express.Router()
const userController = require('../../controllers/users')

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.signIn)

module.exports = router