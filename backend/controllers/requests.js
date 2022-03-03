const RequestBusiness = require('../business/requests')
const requestBusiness = new RequestBusiness()

/**
 * Get all permissions controller, all parameters are found in the query string.
 * @param bookName - The name of the book to filter by.
 * @param bookType - The type of the book to filter by.
 * @param isbn - The ISBN number to filter by.
 * @param author - The author name to filter by.
 * @param requestDateTime - the requested date and time to filter by.
 * @param assignedTo - The assigned to userId to filter by.
 * @param status - The status to filter by.
 * @param limit - The amount of requests which should be returned per page.
 * @param offset - How many records should be skipped.
 * @returns 200 Ok response with the requests data.
 */
exports.getAllRequests = async (request, response) => {
 requestBusiness.getAllRequests(request.query)
   .then((allRequests) => {return response.status(200).send(allRequests) })
   .catch(error => { return response.status(error.status).send(error.message) });
}

/**
 * Create request controller.
 * @param request.body - new request data for the request.
 * @returns 201 Created response with the new request data.
 * @returns 400 Bad Request Error if the request data isnt valid.
 */
exports.createNewRequest = async (request, response) => {
 requestBusiness.createRequest(request)
   .then((allRequests) => { return response.status(201).send(allRequests) })
   .catch(error => {return response.status(error.status).send(error.message) });
}

/**
 * Update request controller.
 * @param request - The request object passed into the controller.
 * @returns 200 Ok response with the updated request data.
 * @returns 404 Not Found Error if the request isnt found in the database.
 * @returns 400 Bad Request Error if the request data isnt valid.
 */
exports.updateRequest = async (request, response) => {
 requestBusiness.updateRequest(request)
   .then((updatedRequest) => {return response.status(200).send(updatedRequest)})
   .catch(error => {
    return response.status(error.status).send(error.message)});
}

/**
 * Delete request controller.
 * @param request.params.id - ID of the request passed in the query parameters.
 * @returns 200 Ok response with the updated request data.
 * @returns 404 Not Found Error if the request isnt found in the database.
 */
exports.deleteRequest = async (request, response) => {
 requestBusiness.deleteRequest(request.params.id)
   .then(() => { return response.status(200).send()})
   .catch(error => { return response.status(error.status).send(error.message) });
}

