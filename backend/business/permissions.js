const httpError = require("http-errors")
const utilities = require("../utilities")
const DataAccess = require('../data-access/data-layer')
const permissionDataAccess = new DataAccess('permission') // Creates an instance of the Data Layer using the permissions model.

module.exports = class permissionBusiness {
 /**
  * Returns all the permissions stored in the database.
  * @param query - The query string passed into the request which contains limit and offset for pagination.
  */
 async getAllPermissions(query) {
  // Formats the filter object for pagination.
  const filter = {
   limit: query.limit ?? Number.MAX_VALUE,
   offset: query.offset ?? 0
  }
  // Gets a total count of the documents in the database.
  const totalDocuments = (await permissionDataAccess.getAll({})).length
  
  // Passes the filter object to the permission data layer and returns an object containing the returned permissions and the total count of the documents.
  return permissionDataAccess.getAllAndPaginate(filter)
    .then((permissions) => { return {permissions: permissions, count: totalDocuments}})
    .catch(error => {throw httpError(400, error.message)})
 }

 /**
  * Returns a permission based on its name.
  * @param name - The name of the permission which is to be returned.
  * @returns 404 Not Found Error if the permission isnt found in the database.
  */
 async getPermissionByName(name) {
  // Formats the filter object which contains the name of the requested permission.
  const filter = {
   name: name
  }

  // Passes the filter object to the permission data layer and returns the specified permission.
  return permissionDataAccess.getByFilter(filter)
    .catch(error => { throw httpError(404, error.message)})
 }

 /**
  * Creates a permission in the database.
  * @param permissionDetails - The information about the permission which is to be inserted into the database.
  * @returns 400 Bad Request Error if the permission data isnt valid.
  */
 async createPermission(permissionDetails) {
  // Calls business logic to validate the new permission has all of the required information and that the permissions name isnt taken.
  hasRequiredFields(permissionDetails)
  await isPermissionNameTaken(permissionDetails.name)
  
  // Formats the permission information to be created in the database.
  const newPermission = {
   name: permissionDetails.name,
   description: permissionDetails.description
  }

  // Passes the formatted permission object to the permission data layer to be inserted into the database.
  return permissionDataAccess.create(newPermission)
    .then(createdPermission => {return createdPermission})
    .catch(error => {throw httpError(500, error.message)})
 }

 /**
  * Updates a permission in the database.
  * @param id - The ID of the permission which is to be updated.
  * @param permissionDetails - The updated details for the permission.
  * @returns 400 Bad Request Error if the permission data isnt valid.
  * @returns 404 Not Found Error if the permission isnt found in the database.
  */
 async updatePermission(id, permissionDetails) {
  // Converts the id into a valid objectID.
  const permissionId = utilities.convertToObjectId(id)
  
  // Calls business logic to validate that the permission information has all the required fields, 
  // and that the permission exists and that the name of the permission hasnt been taken.
  hasRequiredFields(permissionDetails)
  await doesPermissionExist(permissionId)
  await isPermissionNameTaken(permissionDetails.name)

  // Formats the permission information to be updated in the database.
  const updatedPermission = {
   name: permissionDetails.name,
   description: permissionDetails.description
  }

  // Passes the objectID and the formatted permission object to the permission data layer to updated in the database.
  return permissionDataAccess.update(permissionId, updatedPermission)
    .then(updatedPermission => {return updatedPermission})
    .catch(error => {throw httpError(404, error.message)})
 }

 /**
  * Deletes a permission from the database.
  * @param id - The ID of the permission to be deleted.
  * @returns 404 Not Found Error if the permission isnt found in the database.
  */
 async deletePermission(id) {
  // Converts the id into a valid objectID.
  const permissionId = utilities.convertToObjectId(id) 

  // Calls business logic to check that the permission exists in the database.
  await doesPermissionExist(id)
  
  // Passes the permission Object Id to the permission data layer to be deleted from the database.
  return permissionDataAccess.delete(permissionId).catch(error => {throw httpError(404, error.message)})
 }
}

/**
 * Checks that the permission is in the database.
 * @param id - The ID of the permission which is to be checked.
 * @returns 404 Not Found error if the permission isnt found.
 */
async function doesPermissionExist(id) {
 if(!(await permissionDataAccess.model.doesPermissionExist(id))){
  throw httpError(404, "Permission does not exist in the database.")
 }
}

/**
 * Checks the permission information contains all of the required information.
 * @param permissionDetails - The details for the permission.
 * @returns 400 Bad Request if the permission doesnt include a name.
 */
function hasRequiredFields(permissionDetails){
 // Checks that the permission contains a name field
 if (!permissionDetails.name) {
  throw httpError(400, 'Data was missing or invalid.')
 }
}

/**
 * Checks if the permission name already exists in the database.
 * @param permissionName - The name of the permission which is to be checked for.
 * @returns 400 Bad Request if a permission with the same name already exists.
 */
async function isPermissionNameTaken(permissionName) {
 // Calls a Static Method on the Permissions model to check the database for the name.
 if ((await permissionDataAccess.model.isPermissionNameTaken(permissionName))) {
  throw httpError(400, `Permission with the name ${permissionName} already exists.`)
 }
}