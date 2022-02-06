const chai = require('chai')
const server = require('../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/bookRequest'
const dbConfig = require("../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../config/authentication.config").AccessSecret
chai.use(require('chai-http'))

let userId = ""
let employeeId = ""
let existingRequest = null
let permissionsAuthtoken = ""
let noPermissionsAuthToken = ""

describe.only("Request", function() {
 //AUTHENTICATION WITH NO ROLES REQUIRED
 //GET ALL REQUESTS
 it('GetAllRequests should return 200 and all requests', async function () {
  const getAllRequestResult = await chai.request(server).get(baseUrl).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(2)
  getAllRequestResult.body.requests.should.be.lengthOf(2)
 })
 
 it('GetAllRequests should return 200 and one request that matches the bookName filter', async function () {
  const bookName = "SEEDED BOOK 2"
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?bookName=${bookName}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(1)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
  getAllRequestResult.body.requests[0].bookName.should.equal(bookName)
 })

 it('GetAllRequests should return 200 and one request that matches the bookType filter', async function () {
  const bookType = "Audiobook"
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?bookType=${bookType}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(1)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
  getAllRequestResult.body.requests[0].bookType.should.equal(bookType)
 })

 it('GetAllRequests should return 200 and one request that matches the isbn filter', async function () {
  const isbn = "SEEDEDISBN"
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?isbn=${isbn}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(1)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
  getAllRequestResult.body.requests[0].isbn.should.equal(isbn)
 })

 it('GetAllRequests should return 200 and one request that matches the author filter', async function () {
  const author = "SEEDED AUTHOR"
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?author=${author}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(1)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
  getAllRequestResult.body.requests[0].author.should.equal(author)
 })

 it('GetAllRequests should return 200 and one request that matches the requestedDateTime filter', async function () {
  const requestedDateTime = "2022-01-31T18:38:00.000Z"
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?requestedDateTime=${requestedDateTime}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(1)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
  getAllRequestResult.body.requests[0].requestedDateTime.should.equal(requestedDateTime)
 })

 it('GetAllRequests should return 200 and one request that matches the requestedBy filter', async function () {
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?requestedBy=${userId.toString()}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(2)
  getAllRequestResult.body.requests.should.be.lengthOf(2)
  getAllRequestResult.body.requests[1].requestedBy.should.equal(userId.toString())
 })

 it('GetAllRequests should return 200 and one request that matches the assignedTo filter', async function () {
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?assignedTo=${employeeId.toString()}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(1)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
  getAllRequestResult.body.requests[0].assignedTo.should.equal(employeeId.toString())
 })

 it('GetAllRequests should return 200 and one request that matches the status filter', async function () {
  const status = "In Review"
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?status=${status}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(1)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
  getAllRequestResult.body.requests[0].status.should.equal(status)
 })

 it('GetAllRequests should return 200 and one request if the limit filter is one', async function () {
  const limit = 1
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?limit=${limit}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(2)
  getAllRequestResult.body.requests.should.be.lengthOf(1)
 })

 it('GetAllRequests should return 200 and no requests if the offset is one', async function () {
  const offset = 1
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?offset=${offset}`).set("Cookie", permissionsAuthtoken)
  getAllRequestResult.should.have.status(200)
  getAllRequestResult.body.count.should.equal(2)
  getAllRequestResult.body.requests.should.be.lengthOf(0)
 })
 
 it('GetAllRequests should return 400 if ObjectID isnt valid', async function () {
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}?requestedBy=INVALIDID`).set("Cookie", permissionsAuthtoken)

  getAllRequestResult.should.have.status(400)
  getAllRequestResult.text.should.be.equal("Could not convert value to ObjectId.")
 })
 
 it('GetAllRequests should return 401 if user isnt authenticated', async function () {
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}`)

  getAllRequestResult.should.have.status(401)
  getAllRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('GetAllRequests should return 403 if user doesnt have the correct permissions', async function () {
  const getAllRequestResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", noPermissionsAuthToken)

  getAllRequestResult.should.have.status(403)
  getAllRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
 })
 
 //CREATE REQUEST
 it('CreateRequest should create a request and return a 201 status', async function() {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR"
  }
  
  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", permissionsAuthtoken).send(newRequest)
  createRequestResult.should.have.status(201)
  createRequestResult.body.status.should.equal("Pending Review")
 })
 
 it('CreateRequest should return a 400 if the book name isnt included', async function () {
  const newRequest = {
   "bookName": "",
   "bookType": "Book",
   "author": "TEST AUTHOR"
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", permissionsAuthtoken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return a 400 if the book type isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "",
   "author": "TEST AUTHOR"
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", permissionsAuthtoken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })
 
 it('CreateRequest should return a 400 if the book type isnt Book or Audiobook', async function () {
  const newRequest = {
   "bookName": "",
   "bookType": "NOT A BOOK",
   "author": "TEST AUTHOR"
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", permissionsAuthtoken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return a 400 if the author isnt included', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": ""
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", permissionsAuthtoken).send(newRequest)
  createRequestResult.should.have.status(400)
  createRequestResult.text.should.be.equal("Data was missing or invalid.")
 })

 it('CreateRequest should return 401 if user isnt authenticated', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR"
  }

  const createRequestResult = await chai.request(server).post(baseUrl).send(newRequest)

  createRequestResult.should.have.status(401)
  createRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('CreateRequest should return 403 if user doesnt have the correct permissions', async function () {
  const newRequest = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR"
  }

  const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", noPermissionsAuthToken).send(newRequest)

  createRequestResult.should.have.status(403)
  createRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
 })

 //UPDATE REQUEST
 it('UpdateRequest should return a 200 status and update a request', async function () {
  existingRequest.bookName = "NEW BOOK NAME"
  
  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)

  updateRequestResult.should.have.status(200)
  updateRequestResult.body.bookName.should.equal("NEW BOOK NAME")
 })

 it('UpdateRequest should return a 200 and set the status to purchased if the price is below the cost threshold', async function () {
  existingRequest.status = "Awaiting Approval"
  existingRequest.price = 9
  existingRequest.isbn = "123"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(200)
  updateRequestResult.body.status.should.equal("Purchased")
 })

 it('UpdateRequest should return a 200 and set the status to awaiting approval if the price is above the cost threshold', async function () {
  existingRequest.status = "Awaiting Approval"
  existingRequest.price = 15
  existingRequest.isbn = "123"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(200)
  updateRequestResult.body.status.should.equal("Awaiting Approval")
 })

 it('UpdateRequest should return a 400 if the request doesnt exist', async function () {
  const invalidId = "INVALIDID"
  existingRequest.bookType = "NOT A BOOK"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(404)
  updateRequestResult.text.should.be.equal("Request doesn't exist.")
 })

 it('UpdateRequest should return a 400 if the book name isnt included', async function () {
  existingRequest.bookName = ""

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the author isnt included', async function () {
  existingRequest.bookType = ""

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the isbn isnt included', async function () {
  existingRequest.bookType = ""

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the price isnt included when completing a request', async function () {
  existingRequest.bookType = ""

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })
 
 it('UpdateRequest should return a 400 if the book name isnt included', async function () {
  existingRequest.bookType = ""

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the book type isnt included', async function () {
  existingRequest.bookType = ""

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the book type isnt Book or Audiobook', async function () {
  existingRequest.bookType = "NOT A BOOK"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the request hasnt been through the previous statuses', async function () {
  existingRequest.bookType = "NOT A BOOK"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 400 if the reviewer doesnt exist', async function () {
  existingRequest.bookType = "NOT A BOOK"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })
 
 it('UpdateRequest should return 401 if user isnt authenticated', async function () {
  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).send(existingRequest)

  updateRequestResult.should.have.status(401)
  updateRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })

 it('UpdateRequest should return a 403 if user doesnt have the correct permissions to update', async function () {
  existingRequest.bookType = "NOT A BOOK"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 it('UpdateRequest should return a 403 if user doesnt have the correct permissions to complete a request', async function () {
  existingRequest.bookType = "NOT A BOOK"

  const updateRequestResult = await chai.request(server).put(`${baseUrl}/${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send(existingRequest)
  updateRequestResult.should.have.status(400)
  updateRequestResult.text.should.be.equal("Book type must be 'Book' or 'Audiobook'.")
 })

 //DELETE REQUEST
 it('DeleteRequest should delete a request and return a 200 status', async function () {
  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${existingRequest._id}`).set("Cookie", permissionsAuthtoken).send()
  const getAllRequestsResult = (await chai.request(server).get(baseUrl).set("Cookie", permissionsAuthtoken)).body

  deleteRequestResult.should.have.status(200)
  getAllRequestsResult.should.be.lengthOf(0)
 })

 it('DeleteRequest should return a 400 status if the ID passed isnt valid', async function () {
  const fakeId = "FAKE ID"

  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${fakeId}`).set("Cookie", permissionsAuthtoken).send()

  deleteRequestResult.should.have.status(400)
  deleteRequestResult.text.should.be.equal("ID is not valid.")
 })

 it('DeleteRequest should return 401 if user isnt authenticated', async function () {
  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${existingRequest._id}`).send()

  deleteRequestResult.should.have.status(401)
  deleteRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
 })
 
 it('DeleteRequest should return 404 if the ID passed doesnt exist in the database', async function () {
  const id = "61e59bba7c2128f042a44eea"

  const deleteRequestResult = await chai.request(server).delete(`${baseUrl}${id}`).set("Cookie", permissionsAuthtoken).send()

  deleteRequestResult.should.have.status(404)
  deleteRequestResult.text.should.be.equal("No data found.")
 })

 beforeEach("Initialise Database", async function() {
  await dbConfig.clearTestDb()
  let ids = await dbConfig.seedTestData()
  userId = ids.userId
  employeeId = ids.employeeId
  permissionsAuthtoken = `;access_token=Bearer%20${jwt.sign({id: userId, roles: [{name: 'role', permissions: [{name: 'ReadRequest'}, {name: 'CreateRequest'}, {name: 'UpdateRequest'}, {name: 'DeleteRequest'}]}]}, accessSecret, {})}`
  noPermissionsAuthToken = `;access_token=Bearer%20${jwt.sign({id: userId, roles: [{name: 'role', permissions: []}]}, accessSecret, {})}`
  existingRequest = (await chai.request(server).get(baseUrl).set("Cookie", permissionsAuthtoken)).body.requests[0]
 })
})