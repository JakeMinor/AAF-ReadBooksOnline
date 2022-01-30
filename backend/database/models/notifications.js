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
 
 notificationSchema.post('remove', function (next) {
  mongoose.models.user.updateMany({notifications: this._id}, {$pull: {notifications: this._id}}).exec()
  next()
 })
 
 notificationSchema.post('save', function(doc, next) {
  mongoose.models.user.updateOne({_id: this.userId}, {$addToSet: {notifications: {$each: [this._id]}}}).exec()
  next()
 })
 
 return mongoose.model("notification", notificationSchema)
}