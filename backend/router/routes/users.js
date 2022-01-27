const express = require('express')
const router = express.Router()
const grantAccess = require('../../router/router.middleware').grantAccess
const userController = require('../../controllers/users')
  
//SIGN UP
router.post('/sign-up', userController.signUp)

//SIGN IN
router.post('/sign-in', userController.signIn)

//REQUIRES USER TO BE AUTHENTICATED
router.post('/sign-out', (req, res, next) => grantAccess("", req, res, next), userController.signOut)

//REQUIRES USER TO BE AUTHENTICATED WITH AUTHORISER ROLE

//GET ALL USERS
router.get('/', (req, res, next) => grantAccess("ReadUser", req, res, next), userController.getAllUsers)

//GET USER BY ID
router.get('/:id', (req, res, next) => grantAccess("ReadUser", req, res, next), userController.getByUserId)

//CREATE USER
router.post('/', (req, res, next) => grantAccess("CreateUser", req, res, next), userController.createUser)

//UPDATE USERS ROLE
router.put('/:id', (req, res, next) => grantAccess("UpdateUser", req, res, next), userController.updateUserRole)

//DELETE USER
router.delete('/:id', (req, res, next) => grantAccess("DeleteUser", req, res, next), userController.deleteUser)

module.exports = router