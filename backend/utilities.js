const objectId = require("mongoose").Types.ObjectId
const DataAccess = require("./data-access/data-layer")
const httpError = require("http-errors")
const userDataAccess = new DataAccess("user")
const requestDataAccess = new DataAccess("request")

module.exports = class Utilities{
 static convertToObjectId(id) {
  if (objectId.isValid(id)) {
   return objectId(id)
  }
  throw httpError(400, "ID is not valid.")
 }

 static async doesUserExist(userId) {
  if (!(await userDataAccess.model.doesUserExist(userId))) {
   throw httpError(404, "User does not exist in the database.")
  }
 }
 
 static async hasCorrectPermission(userId, permission) {
  if(!(await userDataAccess.model.hasCorrectPermission(userId, permission))){
   throw(httpError(403, "You do not have the correct permission to access this content."))
  }
 }
 
 static async isUserEmployee(userId) {
  if (!(await userDataAccess.model.isUserEmployee(userId))) {
   throw httpError(400, "User isn't an employee.")
  }
 }
 
 static async isUserAuthoriser(userId) {
  await this.doesUserExist(userId)
  if (!(await userDataAccess.model.isUserAuthoriser(userId))) {
   throw httpError(400, "User isn't an authoriser.")
  }
 }
 
 static async doesRequestExist(requestId) {
  const request = await requestDataAccess.model.doesRequestExist(requestId)

  if (!(request)) {
   throw httpError(404, "Request does not exist in the database.")
  }
  return request
 }
 
 static async isPriceBelowThreshold(price) {
  return await requestDataAccess.model.isPriceBelowThreshold(price);
 }
 
 static async updateTotalMonthlySpend(price) {
  return await requestDataAccess.model.updateMonthlySpend(price)
 }
 
 static statuses = ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied']
 static bookTypes = ['Audiobook', 'Book']
 static roles = ['Client', 'Employee', 'Authoriser']
}

