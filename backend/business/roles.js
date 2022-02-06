const httpError = require("http-errors")
const utilities = require("../utilities")
const DataAccess = require('../data-access/data-layer')
const roleDataAccess = new DataAccess('role')

module.exports = class RoleBusiness {
 async getAllRoles(query) {
  const filter = {
   limit: query.limit ?? 10,
   offset: query.offset ?? 0
  }
  const totalDocuments = (await roleDataAccess.getAll(filter)).length
  return roleDataAccess.getAllAndPopulate(filter, { path: 'permissions' })
    .then((roles) => {return {roles: roles, count: totalDocuments}})
    .catch(error => {throw httpError(500, error.message)})
 }

 async getRoleByName(name) {
  return roleDataAccess.getByFilterAndPopulate({name: name}, { path: 'permissions' })
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async createRole(roleDetails) {
  hasRequiredFields(roleDetails)
  await isRoleNameTaken(roleDetails.name)
  const newRole = {
   name: roleDetails.name,
   description: roleDetails.description,
   permissions: roleDetails.permissions.map(permissionId => {return Object.create(utilities.convertToObjectId(permissionId))})
  }
  return roleDataAccess.create(newRole)
    .then(createdRole => {return createdRole})
    .catch(error => {throw httpError(500, error.message)})
 }
 
 async updateRole(id, roleDetails) {
  const roleId = utilities.convertToObjectId(id)
  await doesRoleExist(roleId)
  hasRequiredFields(roleDetails)
  await isRoleNameTaken(roleDetails.name)
  const updatedRole = {
   name: roleDetails.name,
   description: roleDetails.description,
   permissions: roleDetails.permissions.map(permissionId => {return Object.create(utilities.convertToObjectId(permissionId))})
  }
  return roleDataAccess.update(roleId, updatedRole)
    .then(updatedRole => {return updatedRole})
    .catch(error => {throw httpError(404, error.message)})
 }
 
 async deleteRole(id) {
  const roleId = utilities.convertToObjectId(id)
  return roleDataAccess.delete(roleId).catch(error => {throw httpError(404, error.message)})
 }
}

async function doesRoleExist(id) {
 if (!(await roleDataAccess.model.doesRoleExist(id))) {
  throw httpError(404, "Role does not exist in the database.")
 }
}

function hasRequiredFields(roleDetails) {
 if (!roleDetails.name) {
  throw httpError(400, "Data was missing or invalid.")
 }
}

async function isRoleNameTaken(roleName) {
 if ((await roleDataAccess.model.isRoleNameTaken(roleName))) {
  throw httpError(400, `Role with the name ${roleName} already exists.`)
 }
}