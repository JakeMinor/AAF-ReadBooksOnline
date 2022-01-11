module.exports = mongoose => {
 return mongoose.model(
   "book",
   mongoose.Schema(
     {
      name: String,
      author: String,
      description: String
     }
   )
 )
}