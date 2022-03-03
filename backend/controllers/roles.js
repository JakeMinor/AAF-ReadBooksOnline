const RoleBusiness = require('../business/roles')
const roleBusiness = new RoleBusiness()

/**
 * Get all roles controller.
 * @param limit - The amount of roles which should be returned per page.
 * @param offset - How many records should be skipped.
 * @returns 200 Ok response with the roles data.
 */
exports.getAllRoles = async (request, response) => {
 return roleBusiness.getAllRoles(request.query)
   .then(roles => {return response.status(200).send(roles)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

/**
 * Get role by name controller.
 * @param request.params.name - name of the role passed in the query parameters.
 * @returns 200 Ok response with the requested role data.
 * @returns 404 Not Found Error if the role isnt found in the database.
 */
exports.getRoleByName = async (request, response) => {
 return roleBusiness.getRoleByName(request.params.name)
   .then(role => {return response.status(200).send(role)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

/**
 * Create role controller.
 * @param request.body - new request data for the role.
 * @returns 201 Created response with the new role data.
 * @returns 400 Bad Request Error if the role data isnt valid.
 */
exports.createRole = async (request, response) => {
 return roleBusiness.createRole(request.body)
   .then(role => {return response.status(201).send(role)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

/**
 * Update role controller.
 * @param request.params.id - ID of the role passed in the query parameters.
 * @returns 200 Ok response with the updated role data.
 * @returns 400 Bad Request Error if the role data isnt valid.
 * @returns 404 Not Found Error if the role isnt found in the database.
 */
exports.updateRole = async (request, response) => {
 return roleBusiness.updateRole(request.params.id, request.body)
   .then(role => {return response.status(200).send(role)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

/**
 * Delete role controller.
 * @param request.params.id - ID of the role passed in the query parameters.
 * @returns 200 Ok response with the updated role data.
 * @returns 404 Not Found Error if the role isnt found in the database.
 */
exports.deleteRole = async (request, response) => {
 return roleBusiness.deleteRole(request.params.id)
   .then(() => {return response.status(200).send()})
   .catch(error => {return response.status(error.status).send(error.message)
   })
}