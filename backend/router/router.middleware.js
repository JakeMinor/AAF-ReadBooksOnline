const secret = require("../config/authentication.config").AccessSecret
const httpError = require("http-errors")
const jsonWebToken = require("jsonwebtoken")

module.exports = {
 async grantAccess(role, request, response, next) {
   verifyToken(request)
    .then((payload) => {
     if(role !== ""){
      if (payload.role !== role) {return response.status(403).send("You do not have the correct permissions to access this content.")} 
      else {next()}
     }
     next()
    })
    .catch((error) => {return response.status(error.status).send(error.message)})
 },
}

async function verifyToken(request) {
 try {
  return await jsonWebToken.verify(request.headers.authorization.split(" ")[1], secret)
 } catch (error) {
  throw httpError(401, "The provided token is invalid or has expired.")
 }
}