const dbo = require('../database/database.config').getDatabase()

exports.addBook = async (parsedData) => {
 await dbo.book.create(parsedData)
   .then(res => {return res})
   .catch(error => { throw error })
}

exports.getAll = async() => {
 return await dbo.book.find()
}

exports.findBook = async (id) => {
 await dbo.book.findById(id)
}