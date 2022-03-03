const express = require('express')
const router = express.Router()
const requestController = require('../../controllers/requests')
const grantAccess = require('../router.middleware').grantAccess // Authorisation middleware which checks the users permission.

/**
 * Request Routes.
 */

//Get All Requests.
router.get('/', (req, res, next) => grantAccess("ReadRequest", req, res, next), requestController.getAllRequests)

//Create Requests.
router.post('/', (req, res, next) => grantAccess("CreateRequest", req, res, next), requestController.createNewRequest)

//Update Requests.
router.put('/:id', (req, res, next) => grantAccess("UpdateRequest", req, res, next), requestController.updateRequest)

//Delete Requests.
router.delete('/:id', (req, res, next) => grantAccess("DeleteRequest", req, res, next), requestController.deleteRequest)

module.exports = router