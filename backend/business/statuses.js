const utilities = require("../utilities")
const DataAccess = require("../data-access/data-layer")
const statusDataAccess = new DataAccess("status") // Creates an instance of the Data Layer using the status model.

module.exports = class statusBusiness {
 /**
  * Updates the status in the status history table
  * @param requestId - The ID of the request which has had its status updated.
  * @param statusDetails - The Status and a message attached to the status.
  * @returns 400 Bad Request Error if the status data isnt valid.
  */
 async updateStatus(requestId, statusDetails) {
  // Checks if the request exists and validates the status details.
  await utilities.doesRequestExist(requestId)
  await validateStatusDetails(statusDetails)
  
  // Formats the status information to be created in the database.
  const status = {
   requestId: utilities.convertToObjectId(requestId),
   status: statusDetails.status,
   message: statusDetails.message,
   updatedBy: utilities.convertToObjectId(statusDetails.updatedBy),
   date: new Date().toUTCString()
  }

  // Passes the formatted status object to the role data layer to be inserted into the database.
  return statusDataAccess.create(status)
    .catch(error => {throw error})
 }
}

/**
 * Checks that the user has the correct permissions to update specific statuses.
 * @param statusDetails - The Status and a message attached to the status.
 * @returns 403 Forbidden Error telling the user they dont have the correct permissions.
 */
async function validateStatusDetails(statusDetails) {
 // Checks that the status isnt pending review or in review with a message
 if(!(statusDetails.status === "Pending Review" && (statusDetails.status === "In Review" && statusDetails.message))){
  switch(statusDetails.status) {
   // If the status is Additional Information Required, it checks the user can request more information
   case "Additional Information Required":
    await utilities.hasCorrectPermission(statusDetails.updatedBy, "RequestMoreInformation")
    break;
   // If the status is Denied or Purchased, it checks the user can authorise a request.
   case "Denied":
   case "Purchased":
    await utilities.hasCorrectPermission(statusDetails.updatedBy, "AuthoriseRequest")
    break
  }
 }
}
