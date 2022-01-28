const UserBusiness = require('../business/users')
const userBusiness = new UserBusiness()

exports.getAllUsers = async (request, response) => {
 userBusiness.getAllUsers(request.query)
   .then((users) => {return response.status(200).send(users)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.getByUserId = async (request, response) => {
 userBusiness.getUserById(request.params.id)
   .then((user) => {return response.status(200).send(user)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.signIn = async (request, response) => {
 userBusiness.signInUser(request.body)
   .then((token) => {return response.status(200).cookie("access_token", `Bearer ${token}`).send()})
   .catch(error => {return response.status(error.status).send(error.message)})
}

exports.signUp = async (request, response) => {
 userBusiness.signUpUser(request.body)
   .then(() => {return response.status(201).send()})
   .catch(error => {return response.status(error.status).send(error.message)});
}

exports.signOut = async (request, response) => {
 try {
  return response.status(200).clearCookie("access_token").send()
 } catch(error){
  return response.status(500).send("You could not be logged out, please try again.")
 }
}

exports.createUser = async (request, response) => {
 userBusiness.createUser(request.body)
   .then((allUsers) => {return response.status(201).send(allUsers)})
   .catch(error => {
    console.log(error)
    return response.status(error.status).send(error.message)});
}

exports.updateUserRole = async (request, response) => {
 userBusiness.updateRoles(request.params.id, request.body.roles)
   .then((updatedUser) => {return response.status(200).send(updatedUser)})
   .catch(error => {
    console.log(error)
    return response.status(error.status).send(error.message)});
}

exports.deleteUser = async (request, response) => {
 userBusiness.deleteUser(request.params.id)
   .then(() => {return response.status(200).send()})
   .catch(error => {return response.status(error.status).send(error.message)})
}