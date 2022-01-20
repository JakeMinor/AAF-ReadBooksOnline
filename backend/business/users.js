const httpError = require("http-errors")
const bcrypt = require("bcrypt")
const jsonWebToken = require("jsonwebtoken")
const accessSecret = require("../config/authentication.config").AccessSecret
const accessLifetime = require("../config/authentication.config").AccessExpiryInSeconds
const utilities = require("../utilities")
const DataAccess = require("../data-access/data-layer")
const dataAccess = new DataAccess("user")

module.exports = class userBusiness {
 async getAllUsers() {
  return dataAccess.getAll().then((users) => {
   return users.map(user => { return {id: user._id, username: user.username, email: user.email, role: user.role} })
  }).catch(error => {throw httpError(500, error.message)})
 }
 
 async getUserById(id) {
  const userId = utilities.convertToObjectId(id)
  return dataAccess.getById(userId).then((user) => {
   return {id: user._id, username: user.username, email: user.email, role: user.role}
  }).catch(error => {throw httpError(404, error.message)})
 }

 async signInUser(signInDetails) {
  const user = await validateCredentials(signInDetails)
  return generateJWTToken(user)
 }
 
 async signUpUser(newUser) {
  const user = {
   email: newUser.email,
   password: await hashPassword(newUser.password),
   username: newUser.username,
   role: "Client"
  }
  validateNewUserData(user)
  return dataAccess.create(user).catch(error => {throw httpError(400, error.message)})
 }
 
 async createUser(newUser) {
  validateNewUserData(newUser)
  const user = {
   email: newUser.email,
   password: await hashPassword(newUser.password),
   username: newUser.username,
   role: newUser.role
  }
  return dataAccess.create(user).catch(error => {throw httpError(400, error.message)})
 }
 
 async updateRole(id, role) {
  validateRole(role)
  const userId = utilities.convertToObjectId(id)
  const newRole = { role: role }
  return dataAccess.update(userId, newRole).catch(error => {throw httpError(404, error.message)})
 }
 
 async deleteUser(id) {
  const userId = utilities.convertToObjectId(id)
  return dataAccess.delete(userId).catch(error => {throw httpError(404, error.message)})
 }
}

function generateJWTToken(user){
 return jsonWebToken.sign({
  id: user._id,
  username: user.username,
  role: user.role
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

function validateNewUserData(newUserData) {
 validateRole(newUserData.role)
 if(!(newUserData.username && newUserData.email && newUserData.password)){
  throw httpError(400, "Username, email or password was missing.")
 }
}

function validateRole(role) {
 if(!(role === "Client" || role === "Employee" || role === "Authoriser")){
  throw httpError(400, "Invalid role, the supplied role should be either Client, Employee or Authoriser.")
 }
}

async function validateCredentials(signInDetails) {
 const user = await dataAccess.getByFilter({"email": signInDetails.email})
   .then((user) => {return user})
   .catch(() => {throw httpError(401, "Your email or password is invalid, please try again.")})
   
 await bcrypt.compare(signInDetails.password, user.password)
   .then(match => {if(!match) {throw httpError(401, "Your email or password is invalid, please try again.")}})
   .catch(() => {throw httpError(401, "Your email or password is invalid, please try again.")})
 
 return user
}