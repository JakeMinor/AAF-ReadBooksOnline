const secret = require("../config/authentication.config").AccessSecret
const httpError = require("http-errors")
const jsonWebToken = require("jsonwebtoken")
const UserBusiness = require("../business/users")
const userBusiness = new UserBusiness()

module.exports = {
 async grantAccess(role, request, response, next) {
  verifyToken(request)
    .then((payload) => {
     if(role !== ""){
      if (payload.role !== role) {return response.status(403).send("You do not have the correct permissions to access this content.")}
     }
     userBusiness.getUserById(payload.id)
       .then((user) => {
        request.session.userId = user.id.toString()
        next()
       }).catch(error => {throw httpError(401, "The provided token is invalid or has expired.")})
    })
    .catch((error) => {return response.status(error.status).send(error.message)})
 },
}

async function verifyToken(request) {
 try {
  let token
  if(request.headers.referer === "http://localhost:3000/api-docs/") {
   token = request.headers.access_token.split("%20")[1]
  } else {
   const cookies = request.headers.cookie.split(";")
   token = cookies.find(cookie => cookie.includes("access_token")).split("%20")[1]
  }
  
  return await jsonWebToken.verify(token, secret)
 } catch (error) {throw httpError(401, "The provided token is invalid or has expired.")}
}