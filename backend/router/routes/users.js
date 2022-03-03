const express = require('express')
const router = express.Router()
const grantAccess = require('../../router/router.middleware').grantAccess
const userController = require('../../controllers/users')

/**
 * User Routes.
 */

//Sign Up.
router.post('/sign-up', userController.signUp)

//Sign In.
router.post('/sign-in', userController.signIn)

//Sign Out.
router.post('/sign-out', (req, res, next) => grantAccess("", req, res, next), userController.signOut)

//Get All Users.
router.get('/', (req, res, next) => grantAccess("ReadUser", req, res, next), userController.getAllUsers)

//Get User Notifications.
router.get('/:id/notifications', (req, res, next) => grantAccess("", req, res, next), userController.getNotifications)

//Create User.
router.post('/', (req, res, next) => grantAccess("CreateUser", req, res, next), userController.createUser)

//Update Users Role.
router.put('/:id', (req, res, next) => grantAccess("UpdateUser", req, res, next), userController.updateRole)

//Delete User.
router.delete('/:id', (req, res, next) => grantAccess("DeleteUser", req, res, next), userController.deleteUser)

module.exports = router