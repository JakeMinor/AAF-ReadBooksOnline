const chai = require('chai')
const server = require('../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/bookRequest/'
const dbConfig = require("../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../config/authentication.config").AccessSecret
chai.use(require('chai-http'))
let userId = ""
let existingRequest = null
let authToken = ""

describe("Request", function() {
 //AUTHENTICATION WITH NO ROLES REQUIRED
 //GET ALL REQUESTS
 it('GetAllRequests should return 200 and all requests', async function () {
  const getAllRequestResult = await chai.request(server).get(baseUrl).set("Cookie", authToken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.should.be.lengthOf(1)
 })

 it('GetAllRequests should return 401 if user isnt authorised', async function () {
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}`)

  getAllRequestResult.should.have.status(401)
  getAllRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 //GET REQUEST BY ID
 it('GetRequestById should return a request and a 200 status', async function () {
  const GetRequestByIdResult = await chai.request(server).get(`${baseUrl}${existingRequest._id}`).set("Cookie", authToken)

  GetRequestByIdResult.should.have.status(200)
  GetRequestByIdResult.body.should.have.property("bookName", "SEEDED BOOK")
 })
 
 it('GetRequestById should return 400 if the ID passed in isnt valid', async function () {
  const invalidId = "INVALIDID"
  
  const GetRequestByIdResult = await chai.request(server).get(`${baseUrl}${invalidId}`).set("Cookie", authToken)

  GetRequestByIdResult.should.have.status(400)
  GetRequestByIdResult.text.should.be.equal("ID is not valid.")
 })

 it('GetRequestById should return 401 if user isnt authorised', async function () {
  const GetRequestByIdResult = await chai.request(server).get(`${baseUrl}${existingRequest._id}`)

  GetRequestByIdResult.should.have.status(401)
  GetRequestByIdResult.text.should.be.equal("The provided token is invalid or has expired.")
 })
 
 it('GetRequestById should return 404 if the ID passed doesnt exist in the database', async function () {
  const invalidId = "61e59bba7c2128f042a44eea"
  
  const GetRequestByIdResult = await chai.request(server).get(`${baseUrl}${invalidId}`).set("Cookie", authToken)

  GetRequestByIdResult.should.have.status(404)
  GetRequestByIdResult.text.should.be.equal("No data found.")
 })
 
 //CREATE REQUEST
 it('CreateRequest should create a request and return a 201 status', async function() {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }
  
  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", authToken).send(newRequest)
  createRequestResult.should.have.status(201)
  createRequestResult.body.should.be.property("bookName", "TEST BOOK")
 })
 
 it('CreateRequest should return a 400 if the book name isnt included', async function () {
  const newRequest = {
   "bookName": "",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", authToken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return a 400 if the book type isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", authToken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })
 
 it('CreateRequest should return a 400 if the book type isnt Book or Audiobook', async function () {
  const newRequest = {
   "bookName": "",
   "bookType": "NOT A BOOK",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", authToken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return a 400 if the author isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", authToken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return a 400 if the requested date time isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": "",
   "requestedBy": userId
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", authToken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return a 400 if the requested by ID isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": ""
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", authToken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return 401 if user isnt authorised', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": ""
  }

  const createRequestResult = await chai.request(server).post(baseUrl).send(newRequest)

  createRequestResult.should.have.status(401)
  createRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })


 //UPDATE REQUEST
 it('UpdateRequest should update a request and return a 200 status', async function () {
  existingRequest.bookName = "NEW BOOK NAME"
  
  const updateRequestResult = await chai.request(server).put(`${baseUrl}${existingRequest._id}`).set("Cookie", authToken).send(existingRequest)

  updateRequestResult.should.have.status(200)
  updateRequestResult.body.should.be.property("bookName", "NEW BOOK NAME")
 })

 it('UpdateRequest should return a 400 if the book type isnt included', async function () {
  existingRequest.bookType = ""

  const updateRequestResult = await chai.request(server).put(`${baseUrl}${existingRequest._id}`).set("Cookie", authToken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the book type isnt Book or Audiobook', async function () {
  existingRequest.bookType = "NOT A BOOK"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}${existingRequest._id}`).set("Cookie", authToken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return 401 if user isnt authorised', async function () {
  const updateRequestResult = await chai.request(server).put(`${baseUrl}${existingRequest._id}`).send(existingRequest)

  updateRequestResult.should.have.status(401)
  updateRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })
 
 //DELETE REQUEST
 it('DeleteRequest should delete a request and return a 200 status', async function () {
  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${existingRequest._id}`).set("Cookie", authToken).send()
  const getAllRequestsResult = (await chai.request(server).get(baseUrl).set("Cookie", authToken)).body

  deleteRequestResult.should.have.status(200)
  getAllRequestsResult.should.be.lengthOf(0)
 })

 it('DeleteRequest should return a 400 status if the ID passed isnt valid', async function () {
  const fakeId = "FAKE ID"

  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${fakeId}`).set("Cookie", authToken).send()

  deleteRequestResult.should.have.status(400)
  deleteRequestResult.text.should.be.equal("ID is not valid.")
 })

 it('DeleteRequest should return 401 if user isnt authorised', async function () {
  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${existingRequest._id}`).send()

  deleteRequestResult.should.have.status(401)
  deleteRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })
 
 it('DeleteRequest should return 404 if the ID passed doesnt exist in the database', async function () {
  const id = "61e59bba7c2128f042a44eea"

  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${id}`).set("Cookie", authToken).send()

  deleteRequestResult.should.have.status(404)
  deleteRequestResult.text.should.be.equal("No data found.")
 })

 beforeEach("Initialise Database", async function() {
  await dbConfig.clearTestDb()
  userId = await dbConfig.seedTestData()
  existingRequest = (await chai.request(server).get(baseUrl).set("Cookie", authToken)).body[0]
 })
 
 before("Authenticate", async function() {
  authToken = `Bearer%20${jwt.sign({}, accessSecret, {})}`
 })
})