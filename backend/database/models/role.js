/**
 * Role database schema.
 */
module.exports = mongoose => {
 let roleSchema = mongoose.Schema({
  name: {
   type: String,
   required: [true, "A name for the role is required."],
   unique: [true, "Role name already exists."]
  },
  description: {
   type: String
  },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "permission" }]
 })
 
 // Static method which checks if the role exists.
 roleSchema.statics.doesRoleExist = async function (id, cb) {
  return ((await this.find({_id: id}).exec(cb)).length > 0)
 }

 // Static method which checks if the role name is taken.
 roleSchema.statics.isRoleNameTaken = async function (name, cb) {
  return ((await this.find({name: name}).exec(cb)).length > 0)
 }
 
 // Gets the roles permissions without making a call to the permissions table.
 roleSchema.virtual('permission', {
  ref: 'permission',
  localField: 'permissions.id',
  foreignField: '_id'
 })

 // Enables virtual fields to appear in data retrieved by mongoose.
 roleSchema.set('toJSON', {virtuals: true});

 return mongoose.model(
   "role",
   roleSchema
 )
}