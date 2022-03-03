const express = require('express')
const router = express.Router()
const notificationController = require('../../controllers/notifications')
const grantAccess = require('../../router/router.middleware').grantAccess // Authorisation middleware which checks the users permission.


/**
 * Notification Routes.
 */

// Delete Notification.
router.delete('/:id', (req, res, next) => grantAccess("", req, res, next), notificationController.deleteNotification)

module.exports = router