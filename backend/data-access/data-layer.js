module.exports = class DataService{ 
 constructor(modelName){
  this.model = require('../database/database.config').getModel(modelName)
 }
 
 //Get all documents from collection
 async getAll(filter) {
  return this.model
    .find(JSON.parse(JSON.stringify(filter)))
    .then((result) => {return result})
    .catch(error => {return error})
 }
 
 async getAllAndPaginate(filter){
  return this.model
    .find()
    .limit(filter.limit)
    .skip((filter.offset * filter.limit))
    .catch(error => {
     if (error.message.includes("ObjectId"))
      throw new Error("Could not convert value to ObjectId")
    })
 }
 
 async getAllAndPopulate(filter, populateFilter) {
  return this.model
    .find(JSON.parse(JSON.stringify(filter, ((key, value) => value === "null" ? null : value))))
    .limit(filter.limit)
    .skip((filter.offset * filter.limit))
    .populate(JSON.parse(JSON.stringify(populateFilter)))
    .catch(error => {
     if (error.message.includes("ObjectId"))
      throw new Error("Could not convert value to ObjectId.")
    })
 }

 //Get a document by _id from the collection
 async getById(id){
  return this.model.findById(id)
    .orFail(new Error("No data found."))
    .then((result) => {return result})
    .catch(error => {throw error})
 }
 
 async getByIdAndPopulate(id, populateFilter){
  return this.model.findById(id)
    .orFail(new Error("No data found."))
    .populate(populateFilter)
    .then((result) => {return result})
    .catch(error => {throw error})
 }
 
 async getByFilter(filter){
  return this.model.findOne(filter)
    .orFail(new Error("No data found."))
    .then((result) => {return result})
    .catch(error => {throw error})
 }
 
 async getByFilterAndPopulate(filter, populateFilter) {
  console.log(populateFilter)
  return this.model.findOne(filter)
    .orFail(new Error("No data found."))
    .populate(populateFilter)
    .then((result) => {
     console.log(result)
     return result})
    .catch(error => {throw error})
 }
 
 //Create a new document in the collection
 async create(requestData){
  return this.model.create(requestData)
    .catch((error) => {
     if(error.code === 11000){ throw new Error("Email is already in use.")} //TODO: NOT SURE THIS WILL WORK LATER ON BUT WHO KNOWS LOL
     throw error
    })
 }

 //Update a request in the database
 async update(id, requestData) {
  return this.model.findByIdAndUpdate(id, requestData)
    .orFail(new Error("No data found."))
    .then(() => this.model.findById(id)
      .orFail(new Error("No data found."))
      .then((updatedRequest) => {return updatedRequest})
      .catch(error => {throw error})
    )
    .catch(error => {throw error})
 }

//Delete a request in the database
 async delete(id) {
  return this.model.findByIdAndDelete(id)
    .orFail(new Error("No data found."))
    .catch(error => {throw error})
 }
}