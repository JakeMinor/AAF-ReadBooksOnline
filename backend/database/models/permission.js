module.exports = mongoose => {
 return mongoose.model(
   "permission",
   {
    name: {
     type: String,
     required: [true, "A name for the permission is required."]
    },
    description: {
     type: String
    }
   }
 )
}