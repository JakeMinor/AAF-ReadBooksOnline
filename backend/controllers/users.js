const UserBusiness = require('../business/users')
const userBusiness = new UserBusiness()

exports.createUser = async (request, response) => {
 userBusiness.createUser(request.body)
   .then((user) => {return response.status(201).send()})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.signIn = async (request, response) => {
 userBusiness.signInUser(request.body)
   .then((token) => {return response.status(200).cookie("access_token", `Bearer ${token}`).send()})
   .catch(error => {return response.status(error.status).send(error.message)})
}