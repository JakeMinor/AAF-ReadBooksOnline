const httpError = require("http-errors")
const utilities = require("../utilities")
const DataAccess = require("../data-access/data-layer")
const notificationDataAccess = new DataAccess('notification') // Creates an instance of the Data Layer using the notification model.

module.exports = class notificationBusiness {
 /**
  * Creates a notification for a user, this is called when a status is changed.
  * @param id - The ID of the user the notification is for.
  * @param message - The message which is attached to the notification.
  */
 async createNotification(id, message) {
  // Converts the id into a valid objectID.
  const userId = utilities.convertToObjectId(id)
  
  // Validates that the user exists within the database.
  await utilities.doesUserExist(id)
  
  // Formats the notification information to be created in the database.
  const notification = {
   userId: userId,
   message: message
  }
  
  // Passes the formatted notification object to the notification data layer to be inserted into the database.
  return notificationDataAccess.create(notification).catch((error) => { throw error })
 }

 /**
  * Deletes a notification from the database.
  * @param id - The ID of the notification to be deleted.
  * @returns 404 Not Found Error if the notification cant be found.
  */
 async deleteNotification(id) {
  // Converts the id into a valid objectID.
  const notificationId = utilities.convertToObjectId(id) 

  // Passes the notification Object Id to the notification data layer to be deleted from the database.
  return notificationDataAccess.delete(notificationId)
    .catch(error => {throw httpError(404, error.message)})
 }
}