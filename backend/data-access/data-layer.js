module.exports = class DataService{ 
 // Gets the model dependant on the name passed in on initialisation in the business logic
 constructor(modelName){
  this.model = require('../database/database.config').getModel(modelName)
 }

 /**
  * Get All.
  * @param filter - A mongoose filter supplied by the business logic.
  */
 async getAll(filter) {
  return this.model
    .find(JSON.parse(JSON.stringify(filter)))
    .then((result) => {return result})
    .catch(error => {return error})
 }

 /**
  * Get All and Paginate.
  * @param filter  - A mongoose pagination filter supplied by the business logic.
  */
 async getAllAndPaginate(filter){
  return this.model
    .find()
    .limit(filter.limit)
    .skip((filter.offset * filter.limit))
 }

 /**
  * Get All and Populate.
  * @param filter - A mongoose filter containing pagination and data filtering.
  * @param populateFilter - A mongoose populate filter which populates related data.
  */
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

 /**
  * Get By Id and Populate.
  * @param id - The ID of the model.
  * @param populateFilter - A mongoose populate filter which populates related data.
  */
 async getByIdAndPopulate(id, populateFilter){
  return this.model.findById(id)
    .orFail(new Error("No data found."))
    .populate(populateFilter)
    .then((result) => {return result})
    .catch(error => {throw error})
 }

 /**
  * Get By Filter.
  * @param filter - A mongoose pagination filter supplied by the business logic.
  */
 async getByFilter(filter){
  return this.model.findOne(filter)
    .orFail(new Error("No data found."))
    .then((result) => {return result})
    .catch(error => {throw error})
 }

 /**
  * Get By Filter and Populate.
  * @param filter - A mongoose pagination filter supplied by the business logic. 
  * @param populateFilter - A mongoose populate filter which populates related data.
  */
 async getByFilterAndPopulate(filter, populateFilter) {
  return this.model.findOne(filter)
    .orFail(new Error("No data found."))
    .populate(populateFilter)
    .then((result) => {
     return result})
    .catch(error => {throw error})
 }

 /**
  * Create
  * @param requestData - The data which is to be created in the database
  */
 async create(requestData){
  return this.model.create(requestData)
    .catch((error) => {
     if(error.code === 11000){ throw new Error("Email is already in use.")}
     throw error
    })
 }

 /**
  * Update
  * @param id - The ID of the model which is to be updated.
  * @param requestData - The data which is to be updated in the database
  */
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

 /**
  * Delete
  * @param id - The ID of the model which is to be updated.
  */
 async delete(id) {
  return this.model.findByIdAndDelete(id)
    .orFail(new Error("No data found."))
    .catch(error => {throw error})
 }
}