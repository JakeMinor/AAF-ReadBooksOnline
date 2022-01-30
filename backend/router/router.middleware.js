const secret = require("../config/authentication.config").AccessSecret
const httpError = require("http-errors")
const jsonWebToken = require("jsonwebtoken")
const UserBusiness = require("../business/users")
const userBusiness = new UserBusiness()

module.exports = {
 async grantAccess(permission, request, response, next) {
  verifyToken(request)
    .then((payload) => {
     if(permission !== "") {
      if (!payload.roles.some(role => { return !!(role.permissions.find(payloadPermission => payloadPermission.name === permission))})) 
      {return response.status(403).send("You do not have the correct permission to access this content.")}
     }
     userBusiness.getUserById(payload.id)
       .then((user) => {
        request.session.userId = user._id.toString()
        next()
       }).catch(() => {return response.status(401).send("The provided token is invalid or has expired.")})
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