const httpError = require("http-errors")
const bcrypt = require("bcrypt")
const jsonWebToken = require("jsonwebtoken")
const accessSecret = require("../config/authentication.config").AccessSecret
const accessLifetime = require("../config/authentication.config").AccessExpiryInSeconds
const utilities = require("../utilities")
const DataAccess = require("../data-access/data-layer")
const RolesBusiness = require("./roles")
const rolesBusiness = new RolesBusiness()
const userDataAccess = new DataAccess("user")

module.exports = class userBusiness {
 async getAllUsers(query) {
  const filter = {
   limit: query.limit ?? 10,
   offset: query.offset ?? 0
  }
  const totalDocuments = (await userDataAccess.getAll(filter)).length
  return userDataAccess.getAllAndPopulate(filter, {path: 'roles', populate: {path: 'permissions', select: 'name'}}).then((users) => {
   return { users: users.map(user => {return {_id: user._id, username: user.username, email: user.email, roles: user.roles}}), count: totalDocuments }
  }).catch(error => {throw httpError(500, error.message)})
 }
 
 async getUserById(id) {
  const userId = utilities.convertToObjectId(id)
  return userDataAccess.getByIdAndPopulate(userId, {path: 'roles', populate: {path: 'permissions', select: 'name'}}).then((user) => {
   return {_id: user._id, username: user.username, email: user.email, roles: user.roles, permissions: user.permissions}
  }).catch(error => {throw httpError(404, error.message)})
 }

 async signInUser(signInDetails) {
  const user = await validateCredentials(signInDetails)
  return generateJWTToken(user)
 }
 
 async signUpUser(newUser) {
  const clientRoleId = (await rolesBusiness.getRoleByName("Client"))._id
  const user = {
   email: newUser.email,
   password: await hashPassword(newUser.password),
   username: newUser.username,
   roles: [clientRoleId]
  }
  await validateNewUserData(user)
  return userDataAccess.create(user).catch(error => {throw httpError(400, error.message)})
 }
 
 async createUser(newUser) {
  const clientRoleId = (await rolesBusiness.getRoleByName("Client"))._id
  const user = {
   email: newUser.email,
   password: await hashPassword(newUser.password),
   username: newUser.username,
   roles: [clientRoleId]
  }
  await validateNewUserData(user)
  return userDataAccess.create(user).catch(error => {throw httpError(400, error.message)})
 }
 
 async updateRoles(id, roles) {
  const userId = utilities.convertToObjectId(id)
  await validateRoles(roles)
  const newRoles = {
   roles: roles.map(role => utilities.convertToObjectId(role))
  }
  return userDataAccess.update(userId, newRoles).catch(error => {throw httpError(404, error.message)})
 }
 
 async deleteUser(id) {
  const userId = utilities.convertToObjectId(id)
  return userDataAccess.delete(userId).catch(error => {throw httpError(404, error.message)})
 }
}

function generateJWTToken(user){
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

async function hashPassword(password) {
 if(password){
  return await bcrypt.hash(password, 10)
 }
 return ""
}

async function validateNewUserData(newUserData) {
 await validateRoles(newUserData.roles)
 if(!(newUserData.username && newUserData.email && newUserData.password)){
  throw httpError(400, "Username, email or password was missing.")
 }
}

async function validateRoles(roles) {
 const rolesInDb = (await rolesBusiness.getAllRoles({})).roles
 console.log(roles)
 const valid = roles.every(role => rolesInDb.find(dbRole => dbRole._id.toString() === role.toString()))
 if(!(valid)){
  throw httpError(400, `Invalid role, the supplied role should be either ${rolesInDb.values()}.`)
 }
}

async function validateCredentials(signInDetails) {
 const user = await userDataAccess.getByFilterAndPopulate({"email": signInDetails.email}, {path: 'roles', populate: {path: 'permissions', select: 'name'}})
   .catch(() => {throw httpError(401, "Your email or password is invalid, please try again.")})
 
 await bcrypt.compare(signInDetails.password, user.password)
   .then(match => {if(!match) {throw httpError(401, "Your email or password is invalid, please try again.")}})
   .catch(() => {throw httpError(401, "Your email or password is invalid, please try again.")})
 
 return user
}