const StatusBusiness = require('../business/statuses')
const statusBusiness = new StatusBusiness()

exports.updateStatus = async (request, response) => {
 statusBusiness.updateStatus(request)
   .then(() => {return response.status(200).send()})
   .catch(error => {return response.status(error.status).send(error.message)});
}