const httpError = require("http-errors")
const utilities = require("../utilities")
const DataAccess = require("../data-access/data-layer")
const notificationDataAccess = new DataAccess('notification')

module.exports = class notificationBusiness {
 async getNotificationsByUserId(userId) {
  const id = utilities.convertToObjectId(userId)
  await utilities.doesUserExist(id)
  return notificationDataAccess.getAll({ userId: id })
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async createNotification(userId, message) {
  const id = utilities.convertToObjectId(userId)
  await utilities.doesUserExist(id)
  return notificationDataAccess.create({ message: message, userId: id }).catch((error) => { throw error })
 }
 
 async deleteNotification(notificationId) {
  const id = utilities.convertToObjectId(notificationId)
  return notificationDataAccess.delete(id)
    .catch(error => {throw httpError(404, error.message)})
 }
}