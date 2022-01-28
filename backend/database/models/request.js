const utilities = require('../../utilities')
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
    authorised: Boolean,
    price: Number,
    status: String,
    chatHistory: [Object]
   }
 )
 requestSchema.set('toJSON', {virtuals: true});
 
 requestSchema.virtual('statusHistory', {
  ref: 'status',
  localField: '_id',
  foreignField: 'requestId'
 })
 
 requestSchema.statics.doesRequestExist = async function(id, cb) {
  return await this.find({_id: id}).exec(cb)
 }
 
 requestSchema.methods.hasRequestBeenThroughPreviousStatuses = async function(newStatus, cb) {
  const statuses = ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied']
  const statusHistory = await this.model('status').find({requestId: this._id}).exec(cb)
  const previousStatuses = statuses.slice(0, (statuses.indexOf(newStatus) - 1)).filter(status => status !== 'Additional Information Required' && status !== 'Purchased' && status !== 'Denied')
  return previousStatuses.every(status => statusHistory.find(statush => statush.status === status))
 }
 
 return mongoose.model(
   "request",
   requestSchema
 )
}