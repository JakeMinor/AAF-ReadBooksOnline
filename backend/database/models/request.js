/**
 * Request database schema.
 */
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
 
 // Enables virtual fields to appear in data retrieved by mongoose.
 requestSchema.set('toJSON', {virtuals: true});
 
 // Gets the requests status history without making a call to the status history table.
 requestSchema.virtual('statusHistory', {
  ref: 'status',
  localField: '_id',
  foreignField: 'requestId'
 })
 
 // Static method to check if the request exists.
 requestSchema.statics.doesRequestExist = async function(id, cb) {
  return await this.find({_id: id}).populate({path: 'statusHistory', populate: {path: 'updatedBy', select: 'username'}}).exec(cb)
 }
 
 // Instance method to check if the request has been through the previous statuses.
 requestSchema.methods.hasRequestBeenThroughPreviousStatuses = async function(newStatus, cb) {
  // List of the all of the statuses in the system.
  const statuses = ['Pending Review', 'In Review', 'Additional Information Required', 'Awaiting Approval', 'Purchased', 'Denied']
  
  // Gets the current status history for the model.
  const statusHistory = await this.model('status').find({requestId: this._id}).exec(cb)
  
  // Takes the current status of the request and gets the previous statuses and removes additional information required, purchased and denied.
  const previousStatuses = statuses.indexOf(newStatus) - 1 === -1 ? [] : statuses.slice(0, (statuses.indexOf(newStatus) - 1)).filter(status => status !== 'Additional Information Required' && status !== 'Purchased' && status !== 'Denied')
  
  // Checks that all of the previous statuses exist in the list.
  return previousStatuses.every(status => statusHistory.find(statusHistory => statusHistory.status === status))
 }
 
 // Static method to check that the price is below the spend threshold.
 requestSchema.statics.isPriceBelowThreshold = async function(price, cb) {
  // Gets the config data.
  const config = (await this.model('config').find().exec(cb))[0]
  
  // Checks if the price of the book is below the spend threshold and that the updated total monthly spend isnt going to be above the monthly spend threshold.
  const purchased = ((config.spendThreshold > price) && (config.monthlySpendThreshold > (parseInt(config.totalMonthlySpend ?? 0) + parseInt(price))))
  if(purchased){
   await this.model('config').update({ totalMonthlySpend: (parseInt(config.totalMonthlySpend ?? 0) + parseInt(price))}).exec(cb)
  }
  return purchased
 }
 
 // Static method to update the monthly spend threshold.
 requestSchema.statics.updateMonthlySpend = async function(price, cb) {
  const config = (await this.model('config').find().exec(cb))[0]
  await this.model('config').update({totalMonthlySpend: (parseInt(config.totalMonthlySpend ?? 0) + parseInt(price))}).exec(cb)
 }
 
 return mongoose.model(
   "request",
   requestSchema
 )
}