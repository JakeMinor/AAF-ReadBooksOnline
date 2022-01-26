
module.exports = mongoose => {
 let schema = mongoose.Schema({
  name: {
   type: String,
   required: [true, "A name for the permission is required."],
   unique: [true, "Permission name already exists."]
  },
  description: {
   type: String
  }
 })
 
 schema.statics.doesPermissionExist = async function(id, cb) {
  return ((await this.find({_id: id}).exec(cb)).length > 0)
 } 
 
 schema.statics.isPermissionNameTaken = async function(name, cb) {
  return ((await this.find({name: name}).exec(cb)).length > 0)
 }
 
 return mongoose.model(
   "permission",
   schema
 )
}