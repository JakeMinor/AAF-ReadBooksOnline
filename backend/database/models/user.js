module.exports = mongoose => {
 let schema = mongoose.Schema(
   {
    username: {
     type: String,
     required: [true, "A username is required."]
    },
    email: {
     type: String,
     unique: true,
     required: [true, "An email is required."]
    },
    password: {
     type: String,
     required: [true, "A password is required."]
    },
    roles: [mongoose.Schema.Types.ObjectId]
   }
 )
 
 schema.statics.doesUserExist = async function(id, cb) {
  return ((await this.find({_id: id}).exec(cb)).length > 0)
 }
 
 schema.statics.isUserEmployee = async function(id, cb) {
  return ((await this.find({_id: id, role: "Employee"}).exec(cb)).length > 0)
 }

 schema.statics.isUserAuthoriser = async function (id, cb) {
  return ((await this.find({_id: id, role: "Authoriser"}).exec(cb)).length > 0)
 }
 
 return mongoose.model(
   "user",
   schema 
 )
}