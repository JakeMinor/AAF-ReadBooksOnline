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
   assignedTo: query.assignedTo,
   status: query.status
  }
  return requestDataAccess
    .getAllAndPopulate(filter, { path: 'statusHistory', populate: { path: 'updatedBy', select: 'username'} })
    .catch(error => {throw httpError(400, error.message)})
 }
 
 async getAllRequestsByUserId(id){
  const userId = utilities.convertToObjectId(id)
  return requestDataAccess.getByFilter({ requestedBy: userId })
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async createRequest(request) {
  await validateCreateRequestData(request.body)
  const newRequest = {
   bookName: request.body.bookName,
   bookType: request.body.bookType,
   isbn: request.body.isbn,
   author: request.body.author,
   requestedDateTime: new Date().toUTCString(),
   requestedBy: utilities.convertToObjectId(request.session.userId),
   status: "Pending Review"
  }
  return requestDataAccess.create(newRequest)
    .then((req) => {
     statusBusiness.updateStatus(req._id, {status: "Pending Review", message: "", updatedBy: request.session.userId})
    })
    .catch(error => {throw httpError(500, error.message)})
 }
 
 async updateRequest(request) {
  await validateUpdatedRequest(request)
  const updatedRequest = {
   bookName: request.body.bookName,
   bookType: request.body.bookType,
   isbn: request.body.isbn,
   author: request.body.author,
   assignedTo: request.body.assignedTo ? utilities.convertToObjectId(request.body.assignedTo) : undefined,
   authorised: request.body.authorised,
   price: request.body.price,
   status: request.body.status
  }
  
  
  return requestDataAccess.update(request.params.id, updatedRequest)
    .then((req) => {
     statusBusiness.updateStatus(req._id, {status: request.body.status, message: request.body.statusMessage, updatedBy: request.session.userId})
       .catch(error => {throw error})
    })
    .catch(error => {throw httpError(404, error.message)})
 }

 async deleteRequest(id) {
  const requestId = utilities.convertToObjectId(id)
  return requestDataAccess.delete(requestId)
    .catch(error => {
     throw httpError(404, error.message)
    })
 }
}

async function validateUpdatedRequest(request) {
 await utilities.doesRequestExist(request.params.id)
 
 switch(request.body.status){
  case "Awaiting Approval":
   await validateCompletedRequest(request)
   break;
  case "In Review":
   await validateReviewer(request)
   break;
 }
}

async function validateReviewer(request){
 if(!request.body.statusMessage){
  await utilities.isUserEmployee(request.body.assignedTo)
 }
}

async function validateCompletedRequest(request){
 await utilities.isUserEmployee(request.session.userId)
 if (!(request.body.bookName && request.body.author &&
   request.body.price && request.body.isbn && utilities.bookTypes.includes(request.body.bookType))) {
   throw httpError(400, "Data was missing or invalid.")
  }
}

async function validateCreateRequestData(requestData){
 if (!(requestData.bookName && requestData.author && utilities.bookTypes.includes(requestData.bookType))){
  throw httpError(400, "Data was missing or invalid.")
 }
}