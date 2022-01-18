const utilities = require("../utilities")
const httpError = require("http-errors")
const DataAccess = require("../data-access/data-layer")
const dataAccess = new DataAccess("request")


module.exports = class requestBusiness {
 async getAllRequests() {
  return dataAccess.getAll()
    .catch(error => {throw httpError(500, error.message)})
 }
 
 async getRequestById(id){
  const requestId = utilities.convertToObjectId(id)
  return dataAccess.getById(requestId)
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async createRequest(requestData) {
  validateCreateRequestData(requestData)
  return dataAccess.create(requestData)
    .catch(error => {throw httpError(500, error.message)})
 }  
 
 async updateRequest(id, requestData){
  const requestId = utilities.convertToObjectId(id)
  validateUpdateRequestData(requestData)
  return dataAccess.update(requestId, requestData)
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async deleteRequest(id){
  const requestId = utilities.convertToObjectId(id)
  return dataAccess.delete(requestId)
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