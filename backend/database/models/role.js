module.exports = mongoose => {
 let roleSchema = mongoose.Schema({
  name: {
   type: String,
   required: [true, "A name for the role is required."]
  },
  description: {
   type: String
  },
  permissions: [mongoose.Schema.Types.ObjectId]
 })

 roleSchema.set('toJSON', {virtuals: true});

 return mongoose.model(
   "role",
   roleSchema
 )
}