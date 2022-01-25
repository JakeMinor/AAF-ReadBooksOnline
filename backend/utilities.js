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
  throw new httpError(400, "ID is not valid.")
 }

 static async doesUserExist(userId) {
  if (!(await userDataAccess.model.doesUserExist(userId))) {
   throw httpError(404, "User does not exist in the database.")
  }
 }
 
 static async isUserEmployee(userId) {
  await this.doesUserExist(userId)
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
  if (!(await requestDataAccess.model.doesRequestExist(requestId))) {
   throw httpError(404, "Request does not exist in the database.")
  }
 }
 
 static async getLoggedInUsersId(){
  
 }
 
 static statuses = ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied']
 static bookTypes = ['Audiobook', 'Book']
 static roles = ['Client', 'Employee', 'Authoriser']
}

