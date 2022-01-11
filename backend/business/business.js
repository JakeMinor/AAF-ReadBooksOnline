const dataAccess = require("../data-access/requests")
const httpError = require("http-errors")

exports.getAll = async () => {
  let allRequests = await dataAccess.getAll()
  if (allRequests.length === 0) {
    throw httpError(404, "No Books were found")
  }
  return allRequests
} 


// exports.addBook = async (data) => {
//  let parsedData = {name: data.name, author: data.author, description: data.description}
//  return await dataAccess.addBook(parsedData)
// }