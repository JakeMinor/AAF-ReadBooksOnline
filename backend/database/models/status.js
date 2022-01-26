module.exports = mongoose => {
 const statusSchema = mongoose.Schema({
   requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "request",
    required: [true, "You must supply the request the history applies to."]
   },
   status: {
    type: String,
    enum: {
     values: ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied'],
     message: "{VALUE} is not valid status. Please use either 'Pending Review', 'In Review', 'Additional Information Required', 'Additional Information Supplied', 'Awaiting Approval', 'Purchased' or 'Denied'."
    },
    required: [true, "You must supply the status."]
   },
   message: {
    type: String
   },
   updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "You must supply the user who updated the status."]
   },
   date: {
    type: String,
    required: [true, "You must supply the date and time that the request status was updated."]
   }
  })
 
 return mongoose.model(
   "status",
   statusSchema
 )
}