/**
 * Permission database schema.
 */
module.exports = mongoose => {
 let permissionSchema = mongoose.Schema({
  name: {
   type: String,
   required: [true, "A name for the permission is required."],
   unique: [true, "Permission name already exists."]
  },
  description: {
   type: String
  }
 })
 
 // Static method to check if the permission exists.
 permissionSchema.statics.doesPermissionExist = async function(id, cb) {
  return ((await this.find({_id: id}).exec(cb)).length > 0)
 } 
 
 // Static method to check if the permission name is taken.
 permissionSchema.statics.isPermissionNameTaken = async function(name, cb) {
  return ((await this.find({name: name}).exec(cb)).length > 0)
 }
 
 return mongoose.model(
   "permission",
   permissionSchema
 )
}