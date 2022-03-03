const PermissionBusiness = require("../business/permissions")
const permissionBusiness = new PermissionBusiness()

/**
 * Get all permissions controller.
 * @param limit - The amount of permissions which should be returned per page.
 * @param offset - How many records should be skipped.
 * @returns 200 Ok response with the permissions data.
 */
exports.getAllPermissions = async (request, response) => {
 permissionBusiness.getAllPermissions(request.query)
   .then((allRequests) => {return response.status(200).send(allRequests)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Get permission by name controller.
 * @param request.params.name - name of the permission passed in the query parameters.
 * @returns 200 Ok response with the requested permission data.
 * @returns 404 Not Found Error if the permission isnt found in the database.
 */
exports.getPermissionByName = async (request, response) =>  {
 permissionBusiness.getPermissionByName(request.params.name)
   .then((permission) => {return response.status(200).send(permission)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Create permission controller.
 * @param request.body - new request data for the permission.
 * @returns 201 Created response with the new permission data.
 * @returns 400 Bad Request Error if the permission data isnt valid.
 */
exports.createPermission = async (request, response) => {
 permissionBusiness.createPermission(request.body)
   .then((createdPermission) => {return response.status(201).send(createdPermission)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Update permission controller.
 * @param request.params.id - ID of the permission passed in the query parameters.
 * @returns 200 Ok response with the updated permission data.
 * @returns 400 Bad Request Error if the permission data isnt valid.
 * @returns 404 Not Found Error if the permission isnt found in the database.
 */
exports.updatePermission = async (request, response) => {
 permissionBusiness.updatePermission(request.params.id, request.body)
   .then((updatedPermission) => {return response.status(200).send(updatedPermission)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Delete permission controller.
 * @param request.params.id - ID of the permission passed in the query parameters.
 * @returns 200 Ok response with the updated permission data.
 * @returns 404 Not Found Error if the permission isnt found in the database.
 */
exports.deletePermission = async (request, response) => {
 permissionBusiness.deletePermission(request.params.id)
   .then(() => {return response.status(200).send()})
   .catch(error => {return response.status(error.status).send(error.message)});
}
  
  
  
  
  