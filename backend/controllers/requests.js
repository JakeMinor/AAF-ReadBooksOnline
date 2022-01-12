const business = require('../business/business')

exports.getAllRequests = async (request, response) => {
 await business.getAllRequests()
   .then((allRequests) => {return response.status(200).send(allRequests)})
   .catch(error => { return response.status(error.statusCode).send(error.message) });
}
