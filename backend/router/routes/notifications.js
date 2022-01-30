const express = require('express')
const router = express.Router()
const grantAccess = require('../../router/router.middleware').grantAccess
const notificationController = require('../../controllers/notifications')

router.delete('/:id', (req, res, next) => grantAccess("", req, res, next), notificationController.deleteNotification)

module.exports = router