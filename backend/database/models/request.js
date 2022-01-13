module.exports = mongoose => {
 return mongoose.model(
   "request",
   mongoose.Schema(
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
      status: {
       type: String,
       enum: {
        values: ['Pending Review', 'In Review', 'Additional Information Required', 'Purchased', 'Denied'],
        default: 'Pending Review',
        message: "{VALUE} is not valid status. Please use either 'Pending Review', 'In Review', 'Additional Information Required', 'Purchased' or 'Denied'."
       }
      }
     }
   )
 )
}