const express = require('express')
const router = express.Router()
const requestController = require('../../controllers/requests')
const grantAccess = require('../router.middleware').grantAccess
//Request routes

//GETALL
router.get('/', (req, res, next) => grantAccess("", req, res, next), requestController.getAllRequests)

//GETBYID
router.get('/:id', (req, res, next) => grantAccess("", req, res, next), requestController.getRequestById)

//POST
router.post('/', (req, res, next) => grantAccess("", req, res, next), requestController.createNewRequest)

//PUT
router.put('/:id', (req, res, next) => grantAccess("", req, res, next), requestController.updateRequest)

//DELETE
router.delete('/:id', (req, res, next) => grantAccess("", req, res, next), requestController.deleteRequest)

module.exports = router