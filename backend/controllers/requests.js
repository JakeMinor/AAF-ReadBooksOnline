const business = require('../business/business')

exports.getAll = async (request, response) => {
 await business.getAll()
   .then((allRequests) => {return response.status(200).send(allRequests)})
   .catch(error => { return response.status(error.statusCode).send(error.message) });
}