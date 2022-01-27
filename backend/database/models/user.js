module.exports = mongoose => {
 let userSchema = mongoose.Schema(
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
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "role"}]
   }
 )
 
 userSchema.set('toJSON', {virtuals: true});
 
 userSchema.statics.doesUserExist = async function(id, cb) {
  return ((await this.find({_id: id}).exec(cb)).length > 0)
 }
 
 userSchema.statics.isUserEmployee = async function(id, cb) {
  return ((await this.find({_id: id, role: "Employee"}).exec(cb)).length > 0)
 }

 userSchema.statics.isUserAuthoriser = async function (id, cb) {
  return ((await this.find({_id: id, role: "Authoriser"}).exec(cb)).length > 0)
 }
 
 return mongoose.model(
   "user",
   userSchema 
 )
}