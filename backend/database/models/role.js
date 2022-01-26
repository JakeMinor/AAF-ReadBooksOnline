module.exports = mongoose => {
 let schema = {
  name: {
   type: String,
   required: [true, "A name for the role is required."]
  },
  description: {
   type: String
  },
  permissions: [mongoose.Schema.Types.ObjectId]
 }

 return mongoose.model(
   "role",
   schema
 )
}