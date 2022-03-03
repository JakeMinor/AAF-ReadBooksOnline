const httpError = require("http-errors")
const utilities = require("../utilities")
const DataAccess = require('../data-access/data-layer') 
const roleDataAccess = new DataAccess('role') // Creates an instance of the Data Layer using the role model.

module.exports = class RoleBusiness {
 /**
  * Returns all roles stored in the database.
  * @param query - The query string passed into the request which contains limit and offset for pagination.
  */
 async getAllRoles(query) {
  // Formats the filter object for pagination.
  const filter = {
   limit: query.limit ?? 10,
   offset: query.offset ?? 0
  }
  // Gets a total count of the documents in the database.
  const totalDocuments = (await roleDataAccess.getAll(filter)).length
  
  // Passes the filter object to the role data layer and returns an object containing the returned roles with the permissions array populated and the total count of the documents.
  return roleDataAccess.getAllAndPopulate(filter, { path: 'permissions' })
    .then((roles) => {return {roles: roles, count: totalDocuments}})
    .catch(error => {throw httpError(500, error.message)})
 }

 /**
  * Returns a role based on its name.
  * @param name - The name of the role which is to be returned.
  * @returns 404 Not Found Error if the role isnt found in the database.
  */
 async getRoleByName(name) {
  // Formats the filter object which contains the name of the requested role.
  const filter = {
   name: name
  }
  
  // Passes the filter object to the role data layer and returns the specified role with the permissions array populated.
  return roleDataAccess.getByFilterAndPopulate(filter, { path: 'permissions' })
    .catch(error => {throw httpError(404, error.message)})
 }

 /**
  * Creates a role in the database
  * @param roleDetails - The information about the role which is to be inserted into the database.
  * @returns 400 Bad Request Error if the role data isnt valid.
  */
 async createRole(roleDetails) {
  // Calls business logic to validate the new role has all of the required information and that the roles name isnt taken.
  hasRequiredFields(roleDetails)
  await isRoleNameTaken(roleDetails.name)

  // Formats the role information to be created in the database.
  const newRole = {
   name: roleDetails.name,
   description: roleDetails.description,
   permissions: roleDetails.permissions.map(permissionId => {return Object.create(utilities.convertToObjectId(permissionId))})
  }

  // Passes the formatted role object to the role data layer to be inserted into the database.
  return roleDataAccess.create(newRole)
    .then(createdRole => {return createdRole})
    .catch(error => {throw httpError(500, error.message)})
 }

 /**
  * Updates a role in the database.
  * @param id - The ID of the role which is to be updated.
  * @param roleDetails - The updated details for the role.
  * @returns 400 Bad Request Error if the role data isnt valid.
  * @returns 404 Not Found Error if the role isnt found in the database.
  */
 async updateRole(id, roleDetails) {
  // Converts the id into a valid objectID.
  const roleId = utilities.convertToObjectId(id)

  // Calls business logic to validate that the role information has all the required fields, 
  // and that the role exists and that the name of the role hasnt been taken.
  await doesRoleExist(roleId)
  hasRequiredFields(roleDetails)
  await isRoleNameTaken(roleDetails.name)

  // Formats the role information to be updated in the database.
  const updatedRole = {
   name: roleDetails.name,
   description: roleDetails.description,
   permissions: roleDetails.permissions.map(permissionId => {return Object.create(utilities.convertToObjectId(permissionId))})
  }

  // Passes the objectID and the formatted role object to the permission data layer to be updated in the database.
  return roleDataAccess.update(roleId, updatedRole)
    .then(updatedRole => {return updatedRole})
    .catch(error => {throw httpError(404, error.message)})
 }

 /**
  * Deletes a role from the database.
  * @param id - The ID of the role to be deleted.
  * @returns 404 Not Found error if the role isnt found.
  */
 async deleteRole(id) {
  // Converts the id into a valid objectID.
  const roleId = utilities.convertToObjectId(id)

  // Calls business logic to check that the role exists in the database.
  await doesRoleExist(roleId)

  // Passes the role Object Id to the role data layer to be deleted from the database.
  return roleDataAccess.delete(roleId).catch(error => {throw httpError(404, error.message)})
 }
}

/**
 * Checks that the permission is in the database.
 * @param id - The ID of the permission which is to be checked.
 * @returns 404 Not Found error if the role isnt found.
 */
async function doesRoleExist(id) {
 if (!(await roleDataAccess.model.doesRoleExist(id))) {
  throw httpError(404, "Role does not exist in the database.")
 }
}

/**
 * Checks the role information contains all of the required information.
 * @param roleDetails - the details for the role.
 * @returns 400 Bad Request if the role doesnt include a name.
 */
function hasRequiredFields(roleDetails) {
 if (!roleDetails.name) {
  throw httpError(400, "Data was missing or invalid.")
 }
}

/**
 * Checks if the role name already exists in the database.
 * @param roleName - The name of the role which is to be checked for.
 * @returns 400 Bad Request if a role with the same name already exists.
 */
async function isRoleNameTaken(roleName) {
 // Calls a Static Method on the Role model to check the database for the name.
 if ((await roleDataAccess.model.isRoleNameTaken(roleName))) {
  throw httpError(400, `Role with the name ${roleName} already exists.`)
 }
}