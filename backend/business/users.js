const httpError = require("http-errors")
const bcrypt = require("bcrypt")
const jsonWebToken = require("jsonwebtoken")
const accessSecret = require("../config/authentication.config").AccessSecret // Gets the access secret from the authentication config file.
const accessLifetime = require("../config/authentication.config").AccessExpiryInSeconds // Gets the access expiry time from the authentication config file.
const utilities = require("../utilities")
const DataAccess = require("../data-access/data-layer")
const RolesBusiness = require("./roles")
const rolesBusiness = new RolesBusiness() // Create an instance of the Business facade layer.
const userDataAccess = new DataAccess("user") // Creates an instance of the Data Layer using the user model.

module.exports = class userBusiness {
 /**
  * Returns all user stored in the database.
  * @param query - The query string passed into the request which contains limit and offset for pagination.
  */
 async getAllUsers(query) {
  // Formats the filter object for pagination.
  const filter = {
   limit: query.limit ?? 10,
   offset: query.offset ?? 0
  }
  // Gets a total count of the documents in the database.
  const totalDocuments = (await userDataAccess.getAll(filter)).length

  // Passes the filter object to the permission data layer and returns an object containing the returned users without their passwords and the total count of the documents.
  return userDataAccess.getAllAndPopulate(filter, [{path: 'roles', populate: {path: 'permissions', select: 'name'}}, {path: 'notifications', select: '_id, message'}]).then((users) => {
   return { users: users.map(user => {return {_id: user._id, username: user.username, email: user.email, roles: user.roles, notifications: user.notifications}}), count: totalDocuments }
  }).catch(error => {throw httpError(500, error.message)})
 }

 /**
  * Returns a user based on its id.
  * @param id - The ID of the user which is to be returned.
  * @returns 404 Not Found Error if the user isnt found in the database.
  */
 async getUserById(id) {
  // Converts the id into a valid objectID.
  const userId = utilities.convertToObjectId(id)
  
  // Validates the user exists in the database.
  await utilities.doesUserExist(userId)
   
  // Passes the object ID to the user data layer and returns a user object with their password with their roles, permissions and notifications populated.
  return userDataAccess.getByIdAndPopulate(userId, [{path: 'roles', populate: {path: 'permissions', select: 'name'}}, {path: 'notifications', select: '_id, message'}]).then((user) => {
   return {_id: user._id, username: user.username, email: user.email, roles: user.roles, notifications: user.notifications}
  }).catch(error => {throw httpError(404, error.message)})
 }

 /**
  * Get a users notifications from the database.
  * @param id - The ID of the user which is to be returned.
  * @returns 404 Not Found Error if the user isnt found in the database.
  */
 async getNotifications(id) {
  // Converts the id into a valid objectID.
  const userId = utilities.convertToObjectId(id)

  // Validates the user exists in the database.
  await utilities.doesUserExist(userId)

  // Passes the object ID to the user data layer and returns the users notifications.
  return userDataAccess.getByIdAndPopulate(userId, {path: 'notifications', select: '_id, message'}).then((user) => {
   return user.notifications
  }).catch(error => {throw httpError(404, error.message)})
 }

 /**
  * Authenticates a user and returns JWT Token
  * @param signInDetails - The email and password supplied by the user.
  * @returns 401 Unauthorised Error telling the user that their email and password is wrong.
  */
 async signInUser(signInDetails) {
  // Validates the users sign in credentials.
  const user = await validateCredentials(signInDetails)
  
  // Generates JWT with the user information.
  return generateJWTToken(user)
 }

 /**
  * Creates a user in the database.
  * @param newUser - The email, password and username supplied by the user.
  * @returns 400 Bad Request Error if the user data isnt valid.
  */
 async signUpUser(newUser) {
  // Gets the id of the client role
  const clientRoleId = (await rolesBusiness.getRoleByName("Client"))._id

  // Formats the user information to be created in the database.
  const user = {
   email: newUser.email,
   password: await hashPassword(newUser.password),
   username: newUser.username,
   roles: [clientRoleId]
  }
  
  // Validates the user has supplied the email, password and username.
  await validateNewUserData(user)

  // Passes the objectID and the formatted user object to the user data layer to be created in the database.
  return userDataAccess.create(user).catch(error => {throw httpError(400, error.message)})
 }

 /**
  * Updates a users roles.
  * @param id - The ID of the user which is to be updated.
  * @param roles - The IDs of the roles which are to be assigned to the user.
  * @returns 400 Bad Request Error if the user or roles data isnt valid.
  */
 async updateRoles(id, roles) {
  // Converts the id into a valid objectID.
  const userId = utilities.convertToObjectId(id)
  
  //Validates the user exists and the roles supplied are valid.
  await utilities.doesUserExist(userId)
  await validateRoles(roles)

  // Formats the users role information to be updated in the database.
  const newRoles = {
   roles: roles.map(role => utilities.convertToObjectId(role))
  }

  // Passes the user ID and the formatted users roles object to the user data layer to be updated on the user in the database.
  return userDataAccess.update(userId, newRoles).catch(error => {throw httpError(404, error.message)})
 }

 /**
  * Delete a user in the database.
  * @param id - The ID of the user which is to be deleted.
  * @returns 400 Bad Request Error if the user or roles data isnt valid.
  */
 async deleteUser(id) {
  // Converts the id into a valid objectID.
  const userId = utilities.convertToObjectId(id)

  //Validates the user exists.
  await utilities.doesUserExist(userId)

  // Passes the user Object Id to the user data layer to be deleted from the database.
  return userDataAccess.delete(userId).catch(error => {throw httpError(404, error.message)})
 }
}

/**
 * Generates a JWT Token using the user information.
 * @param user - The authenticated users details
 * @returns a JWT Token
 */
function generateJWTToken(user){
 // Creates a JWT Token with the users information.
 return jsonWebToken.sign({
  id: user._id,
  username: user.username,
  roles: user.roles,
  permissions: user.permissions,
  email: user.email,
 }, accessSecret, {
  expiresIn: `${accessLifetime}s`
 })
}

/**
 * Hashes a password
 * @param password - The password for the users account
 * @returns {Promise<*|string>}
 */
async function hashPassword(password) {
 //if a password is supplied, return a hashed password.
 if(password){
  return await bcrypt.hash(password, 10)
 }
 return ""
}

/**
 * Checks if the user details has valid roles and contains all the required user information.
 * @param newUserData - The details for the user.
 * @returns 400 Bad Request Error if the user data isnt valid.
 */
async function validateNewUserData(newUserData) {
 // Validates the roles for the new user.
 await validateRoles(newUserData.roles)
 
 // Checks that the new user has a username, email and password.
 if(!(newUserData.username && newUserData.email && newUserData.password)){
  throw httpError(400, "Username, email or password was missing.")
 }
}

/**
 * Checks that the roles exist in the roles table.
 * @param roles - An array of role ids.
 * @returns 400 Bad Request Error if the role Ids arent valid.
 */
async function validateRoles(roles) {
 // Get the roles from the database.
 const rolesInDb = (await rolesBusiness.getAllRoles({})).roles
 
 // Check that every ID in the roles supplied to the function exists in the database.
 const valid = roles.every(role => rolesInDb.find(dbRole => dbRole._id.toString() === role.toString()))
 if(!(valid)){
  throw httpError(400, `The role supplied does not exist in the database.`)
 }
}

/**
 * Validates the sign in credentials against the credentials stored in the database.
 * @param signInDetails
 * @returns 401 Unauthorised Error telling the user that their email and password is wrong.
 */
async function validateCredentials(signInDetails) {
 // Gets the user by the email and populate the users roles and permissions, throws a 401 error if they aren't found.
 const user = await userDataAccess.getByFilterAndPopulate({"email": signInDetails.email}, {path: 'roles', populate: {path: 'permissions', select: 'name'}})
   .catch(() => {throw httpError(401, "Your email or password is invalid, please try again.")})
 
 // Compare the hashed password from the database with the password supplied by the user, throws a 401 error if they dont match.
 await bcrypt.compare(signInDetails.password, user.password)
   .then(match => {if(!match) {throw httpError(401, "Your email or password is invalid, please try again.")}})
   .catch(() => {throw httpError(401, "Your email or password is invalid, please try again.")})
 
 return user
}