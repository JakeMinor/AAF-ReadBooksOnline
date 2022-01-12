module.exports = mongoose => {
 return mongoose.model(
   "role",
   mongoose.Schema(
     {
      name: {
       type: String,
       unique: true,
       required: true
      },
      description: String,
      permissions: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "permission",
       unique: true
      }]
     }
   )
 )
}