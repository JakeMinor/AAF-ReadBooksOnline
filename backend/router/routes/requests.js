const express = require('express')
const router = express.Router()
const requestController = require('../../controllers/requests')
const statusController = require('../../controllers/statuses')
const grantAccess = require('../router.middleware').grantAccess
//Request routes

//REQUIRES VALID TOKEN WITH ANY ROLE

//GET ALL REQUESTS
router.get('/', (req, res, next) => grantAccess("", req, res, next), requestController.getAllRequests)

//CREATE REQUEST
router.post('/', (req, res, next) => grantAccess("", req, res, next), requestController.createNewRequest)

//UPDATE THE REQUESTS ADDITIONAL INFORMATION
router.put('/:id', (req, res, next) => grantAccess("", req, res, next), requestController.updateRequest)

//UPDATE REQUEST STATUS
router.put('/:id/status', (req, res, next) => grantAccess("", req, res, next), statusController.updateStatus)

//DELETE REQUEST
router.delete('/:id', (req, res, next) => grantAccess("", req, res, next), requestController.deleteRequest)

module.exports = router