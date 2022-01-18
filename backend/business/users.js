const httpError = require("http-errors")
const bcrypt = require("bcrypt")
const jsonWebToken = require("jsonwebtoken")
const secret = require("../config/authentication.config").secret
const DataAccess = require("../data-access/data-layer")
const dataAccess = new DataAccess("user")

module.exports = class userBusiness {
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
 
 async signInUser(signInDetails) {
  const user = await validateCredentials(signInDetails)
  return generateJWTToken(user)
 }
}

async function validateCredentials(signInDetails){
 const user = await dataAccess.getByFilter({"email": signInDetails.email})
                        .then((user) => {return user})
                        .catch(error => {throw httpError(401, "Your email or password was wrong.")})

 if(!bcrypt.compare(signInDetails.password, user.password))
 {
  throw httpError(401, "Your email or password was wrong.")
 }
 
 return user
}

function generateJWTToken(user){
 return jsonWebToken.sign({
  id: user._id,
  username: user.username,
  role: user.role
 }, secret, {
  expiresIn: "1h"
 })
}

async function hashPassword(password) {
 return await bcrypt.hash(password, 10)
}

function validateNewUserData(newUserData) {
 if(!(newUserData.username && newUserData.email && newUserData.password && 
   (newUserData.role === "Client" || newUserData.role === "Employee" || newUserData.role === "Authoriser"))){
  throw httpError(400, "Data was missing or invalid.")
 }
}

