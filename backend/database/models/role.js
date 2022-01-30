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

 // roleSchema.post('remove', function (next) {
 //  mongoose.models.user.updateMany({roles: this._id}, {$pull: {roles: this._id}}).exec()
 //  next()
 // })
 
 roleSchema.statics.doesRoleExist = async function (id, cb) {
  return ((await this.find({_id: id}).exec(cb)).length > 0)
 }

 roleSchema.statics.isRoleNameTaken = async function (name, cb) {
  return ((await this.find({name: name}).exec(cb)).length > 0)
 }

 roleSchema.virtual('permission', {
  ref: 'permission',
  localField: 'permissions.id',
  foreignField: '_id'
 })
 
 roleSchema.set('toJSON', {virtuals: true});

 return mongoose.model(
   "role",
   roleSchema
 )
}