const ConfigBusiness = require('../business/config')
const configBusiness = new ConfigBusiness()

exports.getAllConfig = async (request, response) => {
 configBusiness.getConfigDetails()
   .then((config) => {return response.status(200).send(config)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.updateConfig = async (request, response) => {
 configBusiness.updateConfigDetails(request.params.id, request.body)
   .then((config) => {return response.status(200).send(config)})
   .catch(error => {return response.status(error.status).send(error.message)});
}