module.exports = mongoose => {
 return mongoose.model(
   "request",
   mongoose.Schema(
     {
      name: String,
      author: String,
      description: String
     }
   )
 )
}