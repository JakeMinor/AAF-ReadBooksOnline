const utilities = require("../utilities")
const httpError = require("http-errors")
const DataAccess = require("../data-access/data-layer")
const statusDataAccess = new DataAccess("status")

module.exports = class statusBusiness {
 async updateStatus(requestId, statusDetails) {
  await utilities.doesRequestExist(requestId)
  await validateStatusDetails(statusDetails)
  const status = {
   requestId: utilities.convertToObjectId(requestId),
   status: statusDetails.status,
   message: statusDetails.message,
   updatedBy: utilities.convertToObjectId(statusDetails.userId),
   date: new Date().toUTCString()
  }
  return statusDataAccess.create(status)
    .catch(error => {
     throw httpError(500, error)
    })
 }
}

async function validateStatusDetails(statusDetails) {
 statusDetails.status !== "Pending Review" ? await utilities.isUserEmployee(statusDetails.userId) : await utilities.doesUserExist(statusDetails.userId)
 if (!(utilities.statuses.includes(statusDetails.status))) {
  throw httpError(400, "Data was missing or invalid.")
 }
}
