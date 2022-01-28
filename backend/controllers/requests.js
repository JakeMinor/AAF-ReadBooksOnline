const RequestBusiness = require('../business/requests')
const requestBusiness = new RequestBusiness()

exports.getAllRequests = async (request, response) => {
 requestBusiness.getAllRequests(request.query)
   .then((allRequests) => {return response.status(200).send(allRequests) })
   .catch(error => { return response.status(error.status).send(error.message) });
}

exports.getAllRequestsByUserId = async (request, response) => {
 requestBusiness.getAllRequestsByUserId(request.params.id)
   .then((request) => {return response.status(200).send(request)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.createNewRequest = async (request, response) => {
 requestBusiness.createRequest(request)
   .then((allRequests) => { return response.status(201).send(allRequests) })
   .catch(error => {return response.status(error.status).send(error.message) });
}

exports.updateRequest = async (request, response) => {
 requestBusiness.updateRequest(request)
   .then(() => {return response.status(200).send()})
   .catch(error => {
    console.log(error)
    return response.status(error.status).send(error.message)});
}

exports.deleteRequest = async (request, response) => {
 requestBusiness.deleteRequest(request.params.id)
   .then(() => { return response.status(200).send()})
   .catch(error => { return response.status(error.status).send(error.message) });
}

