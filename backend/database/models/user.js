/**
 * User database schema.
 */
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
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "notification"}],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "role"}]
   }
 )

 // Enables virtual fields to appear in data retrieved by mongoose.
 userSchema.set('toJSON', {virtuals: true});

 // Static method which checks if a user exists.
 userSchema.statics.doesUserExist = async function(id, cb) {
  return ((await this.find({_id: id})).length > 0)
 }

 // Static method which checks if the user has the correct permission.
 userSchema.statics.hasCorrectPermission = async function(id, permission, cb) {
  const user = ((await this.find({_id: id}).populate({ path: 'roles', populate: { path: 'permissions', select: 'name'}})))[0]
  return user.roles.some(role => role.permissions.find(userPermission => userPermission.name === permission))
 }

 // Static method which checks if the user is an employee.
 userSchema.statics.isUserEmployee = async function(id, cb) {
  return (await this.find({_id: id, role: "Employee"}).populate({path: 'roles', populate: {path: 'permissions', select: 'name'}}).length !== 0)
 }

 // Static method which checks if the user is an authoriser.
 userSchema.statics.isUserAuthoriser = async function (id, cb) {
  return (await this.find({_id: id, role: "Authoriser"}).populate({path: 'roles', populate: {path: 'permissions', select: 'name'}}).length > 0)
 }
 
 return mongoose.model(
   "user",
   userSchema 
 )
}