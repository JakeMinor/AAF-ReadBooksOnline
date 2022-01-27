const RoleBusiness = require('../business/roles')
const roleBusiness = new RoleBusiness()

exports.getAllRoles = async (request, response) => {
 return roleBusiness.getAllRoles(request.query)
   .then(roles => {return response.status(200).send(roles)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

exports.getRoleByName = async (request, response) => {
 return roleBusiness.getRoleByName(request.params.name)
   .then(role => {return response.status(200).send(role)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

exports.createRole = async (request, response) => {
 return roleBusiness.createRole(request.body)
   .then(role => {return response.status(201).send(role)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

exports.updateRole = async (request, response) => {
 return roleBusiness.updateRole(request.params.id, request.body)
   .then(role => {return response.status(200).send(role)})
   .catch(error => {return response.status(error.status).send(error.message)})
}

exports.deleteRole = async (request, response) => {
 return roleBusiness.deleteRole(request.params.id)
   .then(() => {return response.status(200).send()})
   .catch(error => {return response.status(error.status).send(error.message)
   })
}