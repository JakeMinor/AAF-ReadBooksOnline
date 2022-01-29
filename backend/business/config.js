const utilities = require('../utilities')
const httpError = require("http-errors")
const DataAccess = require('../data-access/data-layer')
const configDataAccess = new DataAccess('config')

module.exports = class ConfigBusiness {
 async getConfigDetails() {
  return configDataAccess.getAll({})
    .then(result => {return result})
    .catch(error => {throw httpError(404, error.message())
    })
 }
 
 async updateConfigDetails(id, updatedConfig) {
  const configId = utilities.convertToObjectId(id)
  const config = {
   spendThreshold: updatedConfig.spendThreshold,
   monthlySpendThreshold: updatedConfig.monthlySpendThreshold,
   totalMonthlySpend: updatedConfig.totalMonthlySpend
  }
  return configDataAccess.update(configId, config).catch(error => {throw httpError(404, error.message)})
 }
}