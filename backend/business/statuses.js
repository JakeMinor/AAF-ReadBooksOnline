const utilities = require("../utilities")
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
   updatedBy: utilities.convertToObjectId(statusDetails.updatedBy),
   date: new Date().toUTCString()
  }
  return statusDataAccess.create(status)
    .catch(error => {throw error})
 }
}

async function validateStatusDetails(statusDetails) {
 if(!(statusDetails.status === "Pending Review" && (statusDetails.status === "In Review" && statusDetails.message))){
  if(statusDetails.status === "Additional Information Required"){
   await utilities.hasCorrectPermission(statusDetails.updatedBy, "RequestMoreInformation")
  }
  switch(statusDetails.status) {
   case "Denied":
   case "Purchased":
    await utilities.hasCorrectPermission(statusDetails.updatedBy, "AuthoriseRequest")
    break
  }
 }
}
