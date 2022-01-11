const dataAccess = require("../data/dataAccess")
const httpError = require("http-errors")

exports.getAll = async () => {
  let allBooks = await dataAccess.getAll()
  if(allBooks.length === 0) throw httpError(404, "No Books were found")
  return allBooks
} 


// exports.addBook = async (data) => {
//  let parsedData = {name: data.name, author: data.author, description: data.description}
//  return await dataAccess.addBook(parsedData)
// }