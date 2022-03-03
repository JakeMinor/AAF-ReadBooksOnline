const utilities = require("../utilities")
const httpError = require("http-errors")
const StatusBusiness = require('../business/statuses')
const statusBusiness = new StatusBusiness() // Creates an instance of the Status facade layer.
const NotificationBusiness = require('../business/notification')
const notificationBusiness = new NotificationBusiness() // Create an instance of the Notifications facade layer.
const DataAccess = require("../data-access/data-layer") 
const requestDataAccess = new DataAccess("request") // Creates an instance of the Data Layer using the permissions model.

module.exports = class requestBusiness {
 /**
  * Returns all requests stored in the database.
  * @param query - The query string passed into the request which allows filtering for book name, book type, 
  * isbn, author, requested date, assigned to, status and limit and offset for pagination
  * @returns {requests: Requests[], count: Number}
  */
 async getAllRequests(query) {
  // Formats the filter object.
  const filter = {
   bookName: query.bookName,
   bookType: query.bookType,
   isbn: query.isbn,
   author: query.author,
   requestedDateTime: query.requestedDateTime,
   requestedBy: query.requestedBy,
   assignedTo: query.assignedTo,
   status: query.status,
   price: query.price,
   limit: query.limit ?? 10,
   offset: query.offset ?? 0
  }
  
  // Gets the total count of the documents in the database.
  const totalDocuments = (await requestDataAccess.getAll(filter)).length
  
  // Passes the filter object to the request data layer and populates the status history for each request
  return requestDataAccess
    .getAllAndPopulate(filter, { path: 'statusHistory', populate: { path: 'updatedBy', select: 'username'} })
    .then((result) => { return {requests: result, count: totalDocuments}})
    .catch(error => {throw httpError(400, error.message)})
 }

 /**
  * Creates a request in the database.
  * @param request - The request object passed into the controller.
  * @returns 400 Bad Request Error if the request data isnt valid.
  * @returns the new request object.
  */
 async createRequest(request) {
  // Calls business logic to validate the new request data.
  await validateCreateRequestData(request.body)

  // Formats the request information to be created in the database.
  const newRequest = {
   bookName: request.body.bookName,
   bookType: request.body.bookType,
   isbn: request.body.isbn,
   author: request.body.author,
   requestedDateTime: new Date().toUTCString(),
   requestedBy: utilities.convertToObjectId(request.session.userId), // Gets the authenticated user ID from the session on the request and converts it to an object ID.
   status: "Pending Review"
  }
  
  // Passes the formatted request object to the request data layer to be inserted into the database.
  return requestDataAccess.create(newRequest)
    .then((req) => {
     // Once the request has been created it calls the status facade layer to update the status history table with the new request.
     statusBusiness.updateStatus(req._id, {status: "Pending Review", message: "", updatedBy: request.session.userId}).then((status) => {
      // Once the status history for the request has been updated, it calls the notification facade layer to create a new notification for the user.
      notificationBusiness
        .createNotification(req.requestedBy, `Status updated to ${status.status}`)
        .catch(error => {throw error})
     })
     return req
    })
    .catch(error => {throw httpError(500, error.message)})
 }

 /**
  * Updates a request in the database.
  * @param request - The request object passed into the controller.
  * @returns 404 Not Found Error if the request isnt found in the database.
  * @returns 400 Bad Request Error if the request data isnt valid.
  * @returns the updated request object.
  */
 async updateRequest(request) {
  // Calls business logic to validate the updated request data.
  await validateUpdatedRequest(request)

  // Formats the request information to be updated in the database.
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
  
  // Passes the requests ID and the formatted request object to the request data layer to be updated in the database.
  return requestDataAccess.update(request.params.id, updatedRequest)
    .then((req) => {
     // Checks if the status has been updated for the request.
     if(request.body.status){
      // Calls the status facade layer and creates a new record in the status history table with the new status and message.
      statusBusiness.updateStatus(req._id, {
       status: request.body.status,
       message: request.body.statusMessage,
       updatedBy: request.session.userId
      }).then((status) => {
       // Once the status history for the request has been updated, it calls the notification facade layer to create a new notification for the user.
       notificationBusiness
         .createNotification(req.requestedBy, `Status updated to ${status.status}`)
         .catch(error => {throw error})
      }).catch(error => {throw error})
     }
     return req
    })
    .catch(error => {throw httpError(404, error.message)})
 }

 /**
  * Deletes a request from the database.
  * @param id - The ID of the request which is to be deleted.
  * @returns 404 Not Found if the request doesnt exist in the database. 
  */
 async deleteRequest(id) {
  const requestId = utilities.convertToObjectId(id) // Converts the id into a valid objectID.  
  
  // Passes the request Object Id to the request data layer to be deleted from the database.
  return requestDataAccess.delete(requestId)
    .catch(error => {throw httpError(404, error.message)})
 }
}

/**
 * Validates the updated request data.
 * @param request - the updated details for the request.
 * @returns 404 Not Found Error if the request doesnt exist in the database.
 * @returns 400 Bad Request Error if the request data isnt valid.
 */
async function validateUpdatedRequest(request) {
  // Checks if the request exists in the database.
  const req = await utilities.doesRequestExist(request.params.id)
    .catch(() => {throw httpError(404, "Request doesn't exist.")})
 
  // If the request has a new status, it calls a instance method on the request model to check it has been through the previous statuses.
  if(request.body.status){
   if(!(await req[0].hasRequestBeenThroughPreviousStatuses(request.body.status))){
    throw httpError(400, "Request must go through the previous statuses.")
   }
  }
  
  switch (request.body.status) {
   // If the new status is Awaiting Approval, it validates the request data to make sure no data is missing.
   case "Awaiting Approval":
    await validateCompletedRequest(request)
    break;
   // If the new status is In Review, it validates the request data to make sure the reviewer is an employee and exists.
   case "In Review":
    await validateReviewer(request)
    break;
   // If the new status is Denied, it checks that the user has the correct permissions.
   case "Denied": 
    await utilities.hasCorrectPermission(request.session.userId, "AuthoriseRequest")
    break;
   // If the new status is Purchased, it checks that the user has the correct permissions. If they do the total monthly spend is updated.
   case "Purchased":
    await utilities.hasCorrectPermission(request.session.userId, "AuthoriseRequest")
    await utilities.updateTotalMonthlySpend(request.body.price)
    break;
  }
}

/**
 * Checks if the review has the correct permissions to allocate a request to themselves.
 * @param request - The request object passed into the controller.
 * @returns 403 Forbidden Error telling the user they dont have the correct permissions.
 */
async function validateReviewer(request){
 if(request.body.statusMessage === undefined){
  await utilities.hasCorrectPermission(request.session.userId, "AllocateRequest")
 }
}

/**
 * Checks if the user has the correct permissions to complete a request, if the request has all the required information and checks if the price is below the cost threshold.
 * @param request - The details for the request.
 * @returns 400 Bad Request Error if the request data isnt valid.
 * @returns 403 Forbidden Error telling the user they dont have the correct permissions.
 */
async function validateCompletedRequest(request){
 // Checks if the user has the correct permissions.
 await utilities.hasCorrectPermission(request.session.userId, "CompleteRequest")
 
 // Checks to see if the request contains all the required data to complete a request.
 if (!(request.body.bookName && request.body.author &&
   request.body.price && request.body.isbn && utilities.bookTypes.includes(request.body.bookType))) {
   throw httpError(400, "Data was missing or invalid.")
 }
 
 // Updates the status of the request to Purchased or Awaiting Approval depending on if the price is below the threshold set in the config table.
 await utilities.isPriceBelowThreshold(request.body.price) ? request.body.status = "Purchased" : "Awaiting Approval"
}

/**
 * Checks if the request information contains all of the required information.
 * @param requestData - The details for the request.
 * @returns 400 Bad Request Error if the request data isnt valid.
 */
async function validateCreateRequestData(requestData){
 if (!(requestData.bookName && requestData.author && utilities.bookTypes.includes(requestData.bookType))){
  throw httpError(400, "Data was missing or invalid.")
 }
}