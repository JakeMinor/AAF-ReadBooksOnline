const dataAccess = require("../data-access/requests")
const httpError = require("http-errors")

exports.getAllRequests = async () => {
  let allRequests = await dataAccess.getAllRequests()
  if (allRequests.length === 0) {
    throw httpError(404, "No Books were found")
  }
  return allRequests
}
