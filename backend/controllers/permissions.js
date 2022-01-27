const PermissionBusiness = require("../business/permissions")
const permissionBusiness = new PermissionBusiness()

exports.getAllPermissions = async (request, response) => {
 permissionBusiness.getAllPermissions(request.query)
   .then((allRequests) => {return response.status(200).send(allRequests)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.getPermissionByName = async (request, response) =>  {
 permissionBusiness.getPermissionByName(request.params.name)
   .then((permission) => {return response.status(200).send(permission)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.createPermission = async (request, response) => {
 permissionBusiness.createPermission(request.body)
   .then((createdPermission) => {return response.status(201).send(createdPermission)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.updatePermission = async (request, response) => {
 permissionBusiness.updatePermission(request.params.id, request.body)
   .then((updatedPermission) => {return response.status(200).send(updatedPermission)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.deletePermission = async (request, response) => {
 permissionBusiness.deletePermission(request.params.id)
   .then(() => {return response.status(200).send()})
   .catch(error => {return response.status(error.status).send(error.message)});
}
  
  
  
  
  