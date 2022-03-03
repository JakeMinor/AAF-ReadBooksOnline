const NotificationBusiness = require("../business/notification")
const notificationBusiness = new NotificationBusiness()

/**
 * Delete notification controller.
 * @returns 200 Ok response if the notification is deleted successfully.
 * @returns 404 Not Found Error if the notification cant be found.
 */
exports.deleteNotification = (request, response) => {
 notificationBusiness.deleteNotification(request.params.id)
   .then(() => response.status(200).send())
   .catch((error) => response.status(error.status).send(error.message))
}