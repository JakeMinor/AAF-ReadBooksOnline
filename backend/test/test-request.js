const chai = require('chai')
const server = require('../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/bookRequest/'
const dbConfig = require("../database/database.config")
chai.use(require('chai-http'))
let userId = ""

describe("Request", function() {
 it('GetAll should return 1 request and a 200 status', async function () {
  const result = await chai.request(server).get(baseUrl)
  result.should.have.status(200)
  result.body.should.be.lengthOf(1)
 })
 
 it('GetById should return 1 request and a 200 status', async function () {
  const requestId = (await chai.request(server).get(baseUrl)).body[0]._id
  const result = await chai.request(server).get(`${baseUrl}${requestId}`)

  result.should.have.status(200)
  result.body.should.have.property("bookName", "SEEDED BOOK")
 })
 
 it('GetById should return 400 if the ID passed in isnt valid', async function () {
  const result = await chai.request(server).get(`${baseUrl}1`)

  result.should.have.status(400)
  result.text.should.be.equal("ID is not valid.")
 })
 
 it('GetById should return 404 if the ID passed doesnt exist in the database', async function () {
  const id = "61e59bba7c2128f042a44eea"
  
  const result = await chai.request(server).get(`${baseUrl}${id}`)

  result.should.have.status(404)
  result.text.should.be.equal("No data found.")
 })
 
 it('Create should create a request and return a 201 status', async function() {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }
  
  const result = await chai.request(server).post(baseUrl).send(newRequest)
  result.should.have.status(201)
  result.body[1].should.be.property("bookName", "TEST BOOK")
 })
 
 it('Create should return a 400 if the book name isnt included', async function () {
  const newRequest = {
   "bookName": "",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const result = await chai.request(server).post(baseUrl).send(newRequest)
  result.should.have.status(400)
  result.text.should.be.equal("Data was missing or invalid.")
 })

 it('Create should return a 400 if the book type isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const result = await chai.request(server).post(baseUrl).send(newRequest)
  result.should.have.status(400)
  result.text.should.be.equal("Data was missing or invalid.")
 })
 
 it('Create should return a 400 if the book type isnt Book or Audiobook', async function () {
  const newRequest = {
   "bookName": "",
   "bookType": "NOT A BOOK",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const result = await chai.request(server).post(baseUrl).send(newRequest)
  result.should.have.status(400)
  result.text.should.be.equal("Data was missing or invalid.")
 })

 it('Create should return a 400 if the author isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const result = await chai.request(server).post(baseUrl).send(newRequest)
  result.should.have.status(400)
  result.text.should.be.equal("Data was missing or invalid.")
 })

 it('Create should return a 400 if the requested date time isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": "",
   "requestedBy": userId
  }

  const result = await chai.request(server).post(baseUrl).send(newRequest)
  result.should.have.status(400)
  result.text.should.be.equal("Data was missing or invalid.")
 })

 it('Create should return a 400 if the requested by ID isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": ""
  }

  const result = await chai.request(server).post(baseUrl).send(newRequest)
  result.should.have.status(400)
  result.text.should.be.equal("Data was missing or invalid.")
 })
 
 it('Update should update a request and return a 200 status', async function () {
  let requestToUpdate = (await chai.request(server).get(baseUrl)).body[0]
  requestToUpdate.bookName = "NEW BOOK NAME"
  
  const result = await chai.request(server).put(`${baseUrl}${requestToUpdate._id}`).send(requestToUpdate)
  
  result.should.have.status(200)
  result.body.should.be.property("bookName", "NEW BOOK NAME")
 })

 it('Update should return a 400 if the book type isnt included', async function () {
  let requestToUpdate = (await chai.request(server).get(baseUrl)).body[0]
  requestToUpdate.bookType = ""

  const result = await chai.request(server).put(`${baseUrl}${requestToUpdate._id}`).send(requestToUpdate)
  result.should.have.status(400)
  result.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('Update should return a 400 if the book type isnt Book or Audiobook', async function () {
  let requestToUpdate = (await chai.request(server).get(baseUrl)).body[0]
  requestToUpdate.bookType = "NOT A BOOK"

  const result = await chai.request(server).put(`${baseUrl}${requestToUpdate._id}`).send(requestToUpdate)
  result.should.have.status(400)
  result.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })
 
 it('Delete should delete a request and return a 200 status', async function () {
  const requestToDelete = (await chai.request(server).get(baseUrl)).body[0]

  const deleteResult = await chai.request(server).delete(`${baseUrl}${requestToDelete._id}`).send(requestToDelete)
  const getAllResult = (await chai.request(server).get(baseUrl)).body

  deleteResult.should.have.status(200)
  getAllResult.should.be.lengthOf(0)
 })

 it('Delete should return a 400 status if the ID passed isnt valid', async function () {
  const fakeId = "FAKE ID"
  const requestToDelete = (await chai.request(server).get(baseUrl)).body[0]

  const result = await chai.request(server).delete(`${baseUrl}${fakeId}`).send(requestToDelete)

  result.should.have.status(400)
  result.text.should.be.equal("ID is not valid.")
 })
 
 it('Delete should return 404 if the ID passed doesnt exist in the database', async function () {
  const id = "61e59bba7c2128f042a44eea"
  const requestToDelete = (await chai.request(server).get(baseUrl)).body[0]

  const result = await chai.request(server).delete(`${baseUrl}${id}`).send(requestToDelete)

  result.should.have.status(404)
  result.text.should.be.equal("No data found.")
 })
 
 beforeEach("Initialise Database", async function() {
  await dbConfig.clearTestDb()
  userId = await dbConfig.seedTestData()
 })
})