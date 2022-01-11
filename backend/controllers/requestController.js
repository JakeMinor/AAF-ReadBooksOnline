const business = require('../business/business')

exports.getAll = async (request, response) => {
 await business.getAll()
   .then((allBooks) => {return response.status(200).send(allBooks)})
   .catch(error => { return response.status(error.statusCode).send(error.message) });
}