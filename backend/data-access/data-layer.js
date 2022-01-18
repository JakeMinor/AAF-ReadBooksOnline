module.exports = class DataService{ 
 constructor(modelName){
  this.model = require('../database/database.config').getModel(modelName)
 }
 
 //Get all documents from collection
 async getAll() {
  return this.model.find()
    .then((result) => {return result})
    .catch(error => {throw error})
 }

 //Get a document by _id from the collection
 async getById(id){
  return this.model.findById(id)
    .orFail(new Error("No data found."))
    .then((result) => {return result})
    .catch(error => {throw error})
 }
 
 async getByFilter(filter){
  return this.model.findOne(filter)
    .orFail(new Error("No data found."))
    .then((result) => {return result})
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