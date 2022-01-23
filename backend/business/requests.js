const utilities = require("../utilities")
const httpError = require("http-errors")
const StatusBusiness = require('../business/statuses')
const statusBusiness = new StatusBusiness()
const DataAccess = require("../data-access/data-layer")
const requestDataAccess = new DataAccess("request")


module.exports = class requestBusiness {
 async getAllRequests(query) {
  const filter = {
   bookName: query.bookName,
   bookType: query.bookType,
   isbn: query.isbn,
   author: query.author,
   requestedDateTime: query.requestedDateTime,
   requestedBy: query.requestedBy,
   assignedTo: query.assignedTo
  }
  return requestDataAccess
    .getAllAndPopulate(filter, { path: 'statusHistory', populate: { path: 'updatedBy', select: 'username'} })
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async getRequestById(id){
  const requestId = utilities.convertToObjectId(id)
  return requestDataAccess.getById(requestId)
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async getAllRequestsByUserId(id){
  const userId = utilities.convertToObjectId(id)
  return requestDataAccess.getByFilter({ requestedBy: userId })
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async createRequest(requestData) {
  await validateCreateRequestData(requestData)
  const request = {
   bookName: requestData.bookName,
   bookType: requestData.bookType,
   isbn: requestData.isbn,
   author: requestData.author,
   requestedDateTime: requestData.requestedDateTime,
   requestedBy: utilities.convertToObjectId(requestData.requestedBy)
  }
  const status = {
   status: "Pending Review",
   message: "",
   userId: requestData.requestedBy,
  }
  return requestDataAccess.create(request)
    .then((request) => statusBusiness.updateStatus(request._id, status))
    .catch(error => {throw httpError(500, error.message)})
 }  
 
 async updateRequest(id, requestData){
  const requestId = utilities.convertToObjectId(id)
  validateUpdateRequestData(requestData)
  const request = {
   bookName: requestData.bookName,
   bookType: requestData.bookType,
   isbn: requestData.isbn,
   author: requestData.author,
   additionalData: requestData.additionalData
  }
  return requestDataAccess.update(requestId, request)
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async deleteRequest(id){
  const requestId = utilities.convertToObjectId(id)
  return requestDataAccess.delete(requestId)
    .catch(error => {throw httpError(404, error.message)})
 }
}

function validateUpdateRequestData(requestData){
 if(!utilities.bookTypes.includes(requestData.bookType)){
  throw httpError(400, "Book type must be 'Book' or 'Audiobook'.")
 }
}

async function validateCreateRequestData(requestData){
 await utilities.doesUserExist(requestData.requestedBy)
 if (!(requestData.bookName && requestData.author && requestData.requestedDateTime 
   && utilities.bookTypes.includes(requestData.bookType))){
  throw httpError(400, "Data was missing or invalid.")
 }
}