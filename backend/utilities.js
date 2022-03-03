const objectId = require("mongoose").Types.ObjectId
const DataAccess = require("./data-access/data-layer")
const httpError = require("http-errors")
const userDataAccess = new DataAccess("user")
const requestDataAccess = new DataAccess("request")

module.exports = class Utilities{
 /**
  * Converts an ID to and ObjectID
  * @param id - string ID which is to be converted.
  * @returns 400 Bad Request Error if the supplied ID is an invalid ObjectID.
  */
 static convertToObjectId(id) {
  if (objectId.isValid(id)) {
   return objectId(id)
  }
  throw httpError(400, "ID is not valid.")
 }

 /**
  * Checks that the user exists in the database.
  * @param userId - The ID of the user.
  * @returns 404 Not Found Error if the user isnt found in the database.
  */
 static async doesUserExist(userId) {
  if (!(await userDataAccess.model.doesUserExist(userId))) {
   throw httpError(404, "User does not exist in the database.")
  }
 }

 /**
  * Checks that the user has the correct permission
  * @param userId - The ID of the user.
  * @param permission - The permission which is to be checked against.
  * @returns 403 Forbidden Error if the user doesnt have the correct permissions.
  */
 static async hasCorrectPermission(userId, permission) {
  if(!(await userDataAccess.model.hasCorrectPermission(userId, permission))){
   throw httpError(403, "You do not have the correct permission to access this content.")
  }
 }

 /**
  * Checks that the user is an employee 
  * @param userId - The ID of the user.
  * @returns 400 Bad Request Error if the user isnt an employee.
  */
 static async isUserEmployee(userId) {
  if (!(await userDataAccess.model.isUserEmployee(userId))) {
   throw httpError(400, "User isn't an employee.")
  }
 }

 /**
  * Checks that the user is an authoriser.
  * @param userId - The ID of the user.
  * @returns 400 Bad Request Error if the user isnt an authoriser.
  */
 static async isUserAuthoriser(userId) {
  await this.doesUserExist(userId)
  if (!(await userDataAccess.model.isUserAuthoriser(userId))) {
   throw httpError(400, "User isn't an authoriser.")
  }
 }

 /**
  * Checks that the request exists.
  * @param requestId - The ID of the request.
  * @returns 404 Not Found Error if the request doesnt exist.
  * @returns request : Request
  */
 static async doesRequestExist(requestId) {
  const request = await requestDataAccess.model.doesRequestExist(requestId)
  if (request.length === 0) {
   throw httpError(404, "Request does not exist in the database.")
  }
  return request
 }

 /**
  * Checks if the price is below the set thresholds.
  * @param price - The price of the book.
  * @returns Boolean
  */
 static async isPriceBelowThreshold(price) {
  return await requestDataAccess.model.isPriceBelowThreshold(price);
 }

 /**
  * Updates the total monthly spend.
  * @param price - The price which is to be added on.
  */
 static async updateTotalMonthlySpend(price) {
  await requestDataAccess.model.updateMonthlySpend(price)
 }

 /**
  * Static lists of Statuses, Book types and Roles which are used in the system.
  */
 static statuses = ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied']
 static bookTypes = ['Audiobook', 'Book']
 static roles = ['Client', 'Employee', 'Authoriser']
}

