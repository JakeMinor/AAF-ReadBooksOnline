const express = require('express')
const router = express.Router()
const requestController = require('../controllers/requestController')

router.get('/', requestController.getAll)

// router.get('/', (request, response,next) => {
//  response.send("got a GET request at /")
// })

// router.get('/book', (request, response, next) => {
//  client.connect((error) => {
//   const db = client.db(dbName)
//   const collection = db.collection('books')
//   collection.find().toArray((error, data) => {
//    if(error != null) response.status()
//    response.send(data)
//   })
//  })
// })
//
// router.post('/book', upload.array(),(request, response) => {
//  let r = await facade.addBook(request.body)
//  if (r == 400) {
//   response.status(400).send("data not valid")
//  }
//  else if (r == 201){
//   response.status(201).send("Sorted")
//  // client.connect((error) => {
//  //  const db = client.db(dbName)
//  //  const collection = db.collection('books')
//  //  if(error != null) response.status(503).send(error)
//  //  collection.insertOne(newData, (error, result) => {
//  //   if(error != null) response.status(503).send(error) //maybe make error handling file which falls through the different error codes from db and returns the response??
//  //   response.redirect('/books/book')
//  //  })
//  // })
// })
//
// router.put('/book/:id', (request, response) => {
//  let updatedData = {name: request.body.name, author: request.body.author, description: request.body.description}
//  client.connect((error) => {
//   const db = client.db(dbName)
//   const collection = db.collection('books')
//   collection.updateOne({"_id": new ObjectId(request.params.id)}, {$set:updatedData}, (error, result) => {
//    if(error != null) console.log(error)
//    console.log(result)
//    response.send(result)
//   })
//  })
// })
//
// router.delete('/book', (request, response) => {
//  response.send("got a DELETE request at /book")
// })

module.exports = router