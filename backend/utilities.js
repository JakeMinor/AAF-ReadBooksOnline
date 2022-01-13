const objectId = require("mongoose").Types.ObjectId
const httpError = require("http-errors")

module.exports = class Utilities{
 static convertToObjectId(id) {
  if (objectId.isValid(id)) {
   return objectId(id)
  }
  throw new httpError(400, "ID is not valid.")
 }
}