const RequestBusiness = require('../business/requests')
const requestBusiness = new RequestBusiness()

exports.getAllRequests = async (request, response) => {
 requestBusiness.getAllRequests()
   .then((allRequests) => { return response.status(200).send(allRequests) })
   .catch(error => { return response.status(error.status).send(error.message) });
}

exports.getRequestById = async (request, response) => {
 requestBusiness.getRequestById(request.params.id)
   .then((request) => {return response.status(200).send(request)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.createNewRequest = async (request, response) => {
 requestBusiness.createRequest(request.body)
   .then((allRequests) => { return response.status(201).send(allRequests) })
   .catch(error => { return response.status(error.status).send(error.message) });
}

exports.updateRequest = async (request, response) => {
 requestBusiness.updateRequest(request.params.id, request.body)
   .then((updatedRequest) => {return response.status(200).send(updatedRequest)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.deleteRequest = async (request, response) => {
 requestBusiness.deleteRequest(request.params.id)
   .then(() => { return response.status(200).send()})
   .catch(error => { return response.status(error.status).send(error.message) });

}