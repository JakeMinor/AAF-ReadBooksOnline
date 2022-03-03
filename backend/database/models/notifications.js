/**
 * Notification database schema.
 */
module.exports = mongoose => {
 let notificationSchema = mongoose.Schema(
   {
    message: {
     type: String,
     required: [true, "A message is required."]
    },
    userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
    }
   }
 )
 
 // Mongoose hook which is triggered after a delete which removes the notification from the users notification list.
 notificationSchema.post('remove', function (next) {
  mongoose.models.user.updateMany({notifications: this._id}, {$pull: {notifications: this._id}}).exec()
  next()
 })
 
 // Mongoose hook which is triggered after a save which adds the notification to the users notification list.
 notificationSchema.post('save', function(doc, next) {
  mongoose.models.user.updateOne({_id: this.userId}, {$addToSet: {notifications: {$each: [this._id]}}}).exec()
  next()
 })
 
 return mongoose.model("notification", notificationSchema)
}