module.exports = mongoose => {
 return mongoose.model(
   "user",
   mongoose.Schema(
     {
      username: {
       type: String,
       required: [true, "A username is required."]
      },
      email: {
       type: String,
       unique: true,
       required: [true, "An email is required."]
      },
      password: {
       type: String,
       required: [true, "A password is required."]
      },
      role: {
       type: String,
       enum: {
        values: ['Client', 'Employee', 'Authoriser'],
        default: 'Client',
        message: "{VALUE} is not valid role. Please use either 'Client', 'Employee' or 'Authoriser'."
       }
      }
     }
   )
 )
}