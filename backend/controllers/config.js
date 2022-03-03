const ConfigBusiness = require('../business/config')
const configBusiness = new ConfigBusiness()

/**
 * Get all config data controller.
 * @returns 200 Ok response with the config data.
 * @returns 404 Not Found Error if the config data cant be found.
 */
exports.getAllConfig = async (request, response) => {
 configBusiness.getConfigDetails()
   .then((config) => {return response.status(200).send(config)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Update config data controller.
 * @returns 200 Ok response with the updated config data.
 * @returns 404 Not Found Error if the config data cant be found.
 */
exports.updateConfig = async (request, response) => {
 configBusiness.updateConfigDetails(request.params.id, request.body)
   .then((config) => {return response.status(200).send(config)})
   .catch(error => {return response.status(error.status).send(error.message)});
}