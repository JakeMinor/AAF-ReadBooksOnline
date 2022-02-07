const httpError = require("http-errors")
const utilities = require("../utilities")
const DataAccess = require('../data-access/data-layer')
const permissionDataAccess = new DataAccess('permission')

module.exports = class permissionBusiness {
 async getAllPermissions(query) {
  const filter = {
   limit: query.limit ?? Number.MAX_VALUE,
   offset: query.offset ?? 0
  }
  const totalDocuments = (await permissionDataAccess.getAll({})).length
  return permissionDataAccess.getAllAndPaginate(filter)
    .then((permissions) => { return {permissions: permissions, count: totalDocuments}})
    .catch(error => {throw httpError(400, error.message)})
 }
 
 async getPermissionByName(name) {
  return permissionDataAccess.getByFilter({name: name})
    .catch(error => { throw httpError(404, error.message)})
 }
 
 async createPermission(permissionDetails) {
  hasRequiredFields(permissionDetails)
  await isPermissionNameTaken(permissionDetails.name)
  const newPermission = {
   name: permissionDetails.name,
   description: permissionDetails.description
  }
  return permissionDataAccess.create(newPermission)
    .then(createdPermission => {return createdPermission})
    .catch(error => {throw httpError(500, error.message)})
 }
 
 async updatePermission(id, permissionDetails) {
  const permissionId = utilities.convertToObjectId(id)
  hasRequiredFields(permissionDetails)
  await doesPermissionExist(permissionId)
  await isPermissionNameTaken(permissionDetails.name)
  const updatedPermission = {
   name: permissionDetails.name,
   description: permissionDetails.description
  }
  return permissionDataAccess.update(permissionId, updatedPermission)
    .then(updatedPermission => {return updatedPermission})
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async deletePermission(id) {
  const permissionId = utilities.convertToObjectId(id)
  return permissionDataAccess.delete(permissionId).catch(error => {throw httpError(404, error.message)})
 }
}

async function doesPermissionExist(id) {
 if(!(await permissionDataAccess.model.doesPermissionExist(id))){
  throw httpError(404, "Permission does not exist in the database.")
 }
}

function hasRequiredFields(permissionDetails){
 if (!permissionDetails.name) {
  throw httpError(400, 'Data was missing or invalid.')
 }
}

async function isPermissionNameTaken(permissionName) {
 if ((await permissionDataAccess.model.isPermissionNameTaken(permissionName))) {
  throw httpError(400, `Permission with the name ${permissionName} already exists.`)
 }
}