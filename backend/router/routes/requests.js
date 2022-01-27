const express = require('express')
const router = express.Router()
const requestController = require('../../controllers/requests')
const grantAccess = require('../router.middleware').grantAccess
//Request routes

//REQUIRES VALID TOKEN WITH ANY ROLE

//GET ALL REQUESTS
router.get('/', (req, res, next) => grantAccess("ReadRequest", req, res, next), requestController.getAllRequests)

//CREATE REQUEST
router.post('/', (req, res, next) => grantAccess("CreateRequest", req, res, next), requestController.createNewRequest)

//UPDATE REQUEST
router.put('/:id', (req, res, next) => grantAccess("UpdateRequest", req, res, next), requestController.updateRequest)

//DELETE REQUEST
router.delete('/:id', (req, res, next) => grantAccess("DeleteRequest", req, res, next), requestController.deleteRequest)

module.exports = router