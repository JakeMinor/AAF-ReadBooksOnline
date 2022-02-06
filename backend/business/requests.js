const utilities = require("../utilities")
const httpError = require("http-errors")
const StatusBusiness = require('../business/statuses')
const statusBusiness = new StatusBusiness()
const NotificationBusiness = require('../business/notification')
const notificationBusiness = new NotificationBusiness()
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
   status: query.status,
   limit: query.limit ?? 10,
   offset: query.offset ?? 0
  }
  const totalDocuments = (await requestDataAccess.getAll(filter)).length
  return requestDataAccess
    .getAllAndPopulate(filter, { path: 'statusHistory', populate: { path: 'updatedBy', select: 'username'} })
    .then((result) => { return {requests: result, count: totalDocuments}})
    .catch(error => {throw httpError(400, error.message)})
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
     statusBusiness.updateStatus(req._id, {status: "Pending Review", message: "", updatedBy: request.session.userId}).then((status) => {
      notificationBusiness
        .createNotification(req.requestedBy, `Status updated to ${status.status}`)
        .catch(error => {throw error})
     })
     return req
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
   status: request.body.status,
   chatHistory: request.body.chatHistory
  }
  
  
  return requestDataAccess.update(request.params.id, updatedRequest)
    .then((req) => {
     if(request.body.status){
      statusBusiness.updateStatus(req._id, {
       status: request.body.status,
       message: request.body.statusMessage,
       updatedBy: request.session.userId
      }).then((status) => {
       notificationBusiness
         .createNotification(req.requestedBy, `Status updated to ${status.status}`)
         .catch(error => {throw error})
      }).catch(error => {throw error})
     }
     return req
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
  const req = await utilities.doesRequestExist(request.params.id)
    .catch((error) => {throw httpError(404, "Request doesn't exist.")})
 
  if(request.body.status){
   if(!(await req[0].hasRequestBeenThroughPreviousStatuses(request.body.status))){
    throw httpError(400, "Request must go through the previous statuses.")
   }
 }
 
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
 await utilities.hasCorrectPermission(request.session.userId, "AllocateRequest")
}

async function validateCompletedRequest(request){
 await utilities.hasCorrectPermission(request.session.userId, "CompleteRequest")
 if (!(request.body.bookName && request.body.author &&
   request.body.price && request.body.isbn && utilities.bookTypes.includes(request.body.bookType))) {
   throw httpError(400, "Data was missing or invalid.")
 }
 await utilities.isPriceBelowThreshold(request.body.price) ? request.body.status = "Purchased" : "Awaiting Approval"
}

async function validateCreateRequestData(requestData){
 if (!(requestData.bookName && requestData.author && utilities.bookTypes.includes(requestData.bookType))){
  throw httpError(400, "Data was missing or invalid.")
 }
}