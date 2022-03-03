const UserBusiness = require('../business/users')
const userBusiness = new UserBusiness()

/**
 * Get all users controller.
 * @param limit - The amount of permissions which should be returned per page.
 * @param offset - How many records should be skipped.
 * @returns 200 Ok response with the users data.
 */
exports.getAllUsers = async (request, response) => {
 userBusiness.getAllUsers(request.query)
   .then((users) => {return response.status(200).send(users)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Get notifications controller.
 * @param request.params.id - id of the user.
 * @returns 200 Ok response with the requested user data.
 * @returns 404 Not Found Error if the user isnt found in the database.
 */
exports.getNotifications = async (request, response) => {
 userBusiness.getNotifications(request.params.id)
   .then((user) => {return response.status(200).send(user)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Get user by id controller.
 * @param request.params.id - id of the user.
 * @returns 200 Ok response with the requested user data.
 * @returns 404 Not Found Error if the user isnt found in the database.
 */
exports.getByUserId = async (request, response) => {
 userBusiness.getUserById(request.params.id)
   .then((user) => {return response.status(200).send(user)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Sign in controller.
 * @param request.body - contains the users email and password.
 * @returns 200 Ok response with the JWT set in a cookie.
 * @returns 401 Unauthorised Error telling the user that their email and password is wrong.
 */
exports.signIn = async (request, response) => {
 userBusiness.signInUser(request.body)
   .then((token) => {return response.status(200).cookie("access_token", `Bearer ${token}`).send()})
   .catch(error => {return response.status(error.status).send(error.message)})
}

/**
 * Sign up controller.
 * @param request.body - contains the users email, username and password.
 * @returns 201 Created response.
 * @returns 400 Bad Request Error if the user data isnt valid.
 */
exports.signUp = async (request, response) => {
 userBusiness.signUpUser(request.body)
   .then(() => {return response.status(201).send()})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Sign out controller.
 * Clears the authentication cookie.
 * @returns 200 Ok response.
 */
exports.signOut = async (request, response) => {
 try {
  return response.status(200).clearCookie("access_token").send()
 } catch(error){
  return response.status(500).send("You could not be logged out, please try again.")
 }
}

/**
 * Create user controller.
 * @param request.body - contains the users email, username and password.
 * @returns 201 Created response and created user details.
 * @returns 400 Bad Request Error if the user data isnt valid.
 */
exports.createUser = async (request, response) => {
 userBusiness.signUpUser(request.body)
   .then((user) => {return response.status(201).send(user)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Update role controller.
 * @param request.params.id - The ID of the user which is to be updated.
 * @param request.body.roles - The IDs of the roles which are to be assigned to the user.
 * @returns 200 Ok response and the updated user data.
 * @returns 400 Bad Request Error if the user or roles data isnt valid. 
 */
exports.updateRole = async (request, response) => {
 userBusiness.updateRoles(request.params.id, request.body.roles)
   .then((updatedUser) => {return response.status(200).send(updatedUser)})
   .catch(error => {return response.status(error.status).send(error.message)});
}

/**
 * Delete user controller.
 * @param request.params.id - The ID of the user which is to be deleted.
 * @returns 200 Ok response.
 * @returns 400 Bad Request Error if the user or roles data isnt valid.
 */
exports.deleteUser = async (request, response) => {
 userBusiness.deleteUser(request.params.id)
   .then(() => {return response.status(200).send()})
   .catch(error => {return response.status(error.status).send(error.message)})
}