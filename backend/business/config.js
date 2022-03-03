const utilities = require('../utilities')
const httpError = require("http-errors")
const DataAccess = require('../data-access/data-layer')
const configDataAccess = new DataAccess('config') // Creates an instance of the Data Layer using the config model.

module.exports = class ConfigBusiness {
 /**
  * Calls the config model through the data layer to return config information.
  * @returns 404 Not Found Error if the config data cant be found.
  */
 async getConfigDetails() {
  return configDataAccess.getAll({})
    .then(result => {return result})
    .catch(error => {throw httpError(404, error.message())
    })
 }

 /**
  * Updates the config model which is stored in the database.
  * @param id - the id of the config object.
  * @param updatedConfig - the updated config values.
  * @returns 404 Not Found Error if the config data cant be found.
  */
 async updateConfigDetails(id, updatedConfig) {
  const configId = utilities.convertToObjectId(id) // Converts the id into a valid objectID.
  
  // Formats the config information to be updated in the database.
  const config = {
   spendThreshold: updatedConfig.spendThreshold,
   monthlySpendThreshold: updatedConfig.monthlySpendThreshold,
   totalMonthlySpend: updatedConfig.totalMonthlySpend
  }
  
  // Passes the objectID and the formatted config object to the Config data layer to updated in the database.
  return configDataAccess.update(configId, config).catch(error => {throw httpError(404, error.message)})
 }
}