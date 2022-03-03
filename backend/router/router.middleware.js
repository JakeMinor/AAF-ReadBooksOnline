const secret = require("../config/authentication.config").AccessSecret
const httpError = require("http-errors")
const jsonWebToken = require("jsonwebtoken")
const UserBusiness = require("../business/users")
const userBusiness = new UserBusiness()

module.exports = {
 // Checks the users permissions against the permission which is required to access the route.
 async grantAccess(permission, request, response, next) {
  // Verifies the token is valid.
  verifyToken(request)
    .then((payload) => {
     // Checks if the route has a permission.
     if(permission !== "") {
      // Checks thats one of the users roles contains the permission, if not it throws a 403 error.
      if (!payload.roles.some(role => { return !!(role.permissions.find(payloadPermission => payloadPermission.name === permission))})) 
      {return response.status(403).send("You do not have the correct permission to access this content.")}
     }
     
     // Gets the user by the Id in the tokens payload and assigns it to the session.
     userBusiness.getUserById(payload.id)
       .then((user) => {
        request.session.userId = user._id.toString()
        next()
       }).catch(() => {return response.status(401).send("The provided token is invalid or has expired.")})
    })
    .catch((error) => {return response.status(error.status).send(error.message)})
 },
}

// Verifies that the token is valid.
async function verifyToken(request) {
 try {
  let token
  // Gets the token from the
  if(request.headers.referer === "http://localhost:3000/api-docs/") {
   token = request.headers.access_token.split("%20")[1]
  } else {
   const cookies = request.headers.cookie.split(";")
   token = cookies.find(cookie => cookie.includes("access_token")).split("%20")[1]
  }
  
  // Verifies the token is a valid token.
  return await jsonWebToken.verify(token, secret)
 } catch (error) {throw httpError(401, "The provided token is invalid or has expired.")}
}