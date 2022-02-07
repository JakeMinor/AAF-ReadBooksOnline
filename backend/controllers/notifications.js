const NotificationBusiness = require("../business/notification")
const notificationBusiness = new NotificationBusiness()

exports.deleteNotification = (request, response) => {
 notificationBusiness.deleteNotification(request.params.id)
   .then(() => response.status(200).send())
   .catch((error) => response.status(error.status).send(error.message))
}