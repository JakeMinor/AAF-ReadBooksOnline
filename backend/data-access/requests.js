const dbo = require('../database/database.config').getDatabase()

//Get all requests from the database
exports.getAllRequests = async() => {
 return dbo.request.find().orFail(new Error("No Requests Found"))
   .then((result) => {return result})
   .catch(error => {throw error})
}

//Get a request by an ID from the database
exports.getRequestById = async(id) => {
 return dbo.request.findById(id)
   .orFail(new Error("No Request Found"))
   .then((result) => {return result})
   .catch(error => {throw error})
}

//Create a new request in the database
exports.createRequest = async (requestData) => {
 return dbo.request.create(requestData)
   .then(() => dbo.request.find()
       .then((allRequests) => {return allRequests})
       .catch((error) => {throw error})
   )
   .catch((error) => {throw error})
}

//Update a request in the database
exports.updateRequest = async (id, requestDto) => {
 return dbo.request.findByIdAndUpdate(id, requestDto)
   .orFail(new Error("No Request Found"))
   .then(() => dbo.request.findById(id)
     .orFail(new Error("No Request Found"))
     .then((updatedRequest) => {return updatedRequest})
     .catch(error => {throw error})
   )
   .catch(error => {throw error})
}

//Delete a request in the database
exports.deleteRequest = async(id) => {
 return dbo.request.findByIdAndDelete(id)
   .orFail(new Error("No Request Found"))
   .catch(error => {throw error})
}