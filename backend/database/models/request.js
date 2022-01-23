module.exports = mongoose => {
 const requestSchema = mongoose.Schema(
   {
    bookName: {
     type: String,
     required: [true, "You must supply the name of the book."]
    },
    bookType: {
     type: String,
     required: [true, "You must supply a book type."],
     enum: {
      values: ['Audiobook', 'Book'],
      message: "{VALUE} is not valid. Please use either 'Audiobook' or 'Book'."
     }
    },
    isbn: String,
    author: {
     type: String,
     required: [true, "You must supply the name of the Author."]
    },
    requestedDateTime: {
     type: Date,
     required: [true, "You must supply the date and time that the request was made."]
    },
    requestedBy: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "user",
     required: [true, "You must supply the user who made the request."]
    },
    assignedTo: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "user"
    },
    additionalInformation: String,
    cost: Number,
    authorised: Boolean
   }
 )
 requestSchema.set('toJSON', {virtuals: true});
 
 requestSchema.virtual('statusHistory', {
  ref: 'status',
  localField: '_id',
  foreignField: 'requestId'
 })
 
 requestSchema.statics.doesRequestExist = async function(id, cb) {
  return (await this.find({_id: id}).exec(cb)).length > 0
 }
 
 return mongoose.model(
   "request",
   requestSchema
 )
}