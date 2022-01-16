const express = require('express')
const router = express.Router()
const requestController = require('../../controllers/requests')

//Request routes

//GETALL
router.get('/', requestController.getAllRequests)

//GETBYID
router.get('/:id', requestController.getRequestById)

//POST
router.post('/', requestController.createNewRequest)

//PUT
router.put('/:id', requestController.updateRequest)

//DELETE
router.delete('/:id', requestController.deleteRequest)

module.exports = router