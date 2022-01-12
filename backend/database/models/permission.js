module.exports = mongoose => {
 return mongoose.model(
   "permission",
   mongoose.Schema(
     {
      name: {
       type: String,
       unique: true,
       required: true
      },
      description: String
     }
   )
 )
}