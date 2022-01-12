module.exports = mongoose => {
 return mongoose.model(
   "user",
   mongoose.Schema(
     {
      firstName: String,
      lastName: String,
      email: {
       type: String,
       unique: true,
       required: true
      },
      password: {
       type: String,
       required: true
      },
      roles: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "role",
       unique: true
      }]
     }
   )
 )
}