const dataAccess = require("../data-access/requests")
const utilities = require("../utilities")
const httpError = require("http-errors")


module.exports = class requestBusiness {
 async getAllRequests() {
  return dataAccess.getAllRequests()
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async getRequestById(id){
  const requestId = utilities.convertToObjectId(id)
  return dataAccess.getRequestById(requestId)
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async createRequest(requestData) {
  validateCreateRequestData(requestData)
  return dataAccess.createRequest(requestData)
    .catch(error => {throw httpError(500, error.message)})
 }  
 
 async updateRequest(id, requestData){
  const requestId = utilities.convertToObjectId(id)
  validateUpdateRequestData(requestData)
  return dataAccess.updateRequest(requestId, requestData)
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async deleteRequest(id){
  const requestId = utilities.convertToObjectId(id)
  return dataAccess.deleteRequest(requestId)
    .catch(error => {throw httpError(404, error.message)})
 }
}

function validateUpdateRequestData(requestData){
 if(!(requestData.bookType === 'Book' || requestData.bookType === 'Audiobook')){
  throw httpError(400, "Book type must be 'Book' or 'Audiobook'.")
 }
}

function validateCreateRequestData(requestData){
 if (!(requestData.bookName && requestData.author && requestData.requestedDateTime
   && requestData.requestedBy && (requestData.bookType === 'Book' || requestData.bookType === 'Audiobook'))){
  throw httpError(400, "Data was missing or invalid.")
 }
}