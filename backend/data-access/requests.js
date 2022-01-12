const dbo = require('../database/database.config').getDatabase()

//Get all requests from db
exports.getAllRequests = async() => {
 return await dbo.request.find()
   .then((result) => {return result})
   .catch((error) => {return error})
}

// //Create a new request in the db
// exports.createRequest = async (data) => {
//  await dbo.request.create(data)
//    .then((result) => {return result})
//    .catch((error) => {return error})
// }
