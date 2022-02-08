const chai = require('chai')
const server = require('../../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/bookRequest'
const dbConfig = require("../../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../../config/authentication.config").AccessSecret
chai.use(require('chai-http'))

let requests = null
let userId = ""
let employeeId = ""
let authoriserId = ""
let clientAuthToken = ""
let employeeAuthToken = ""
let authoriserAuthToken = ""
let noPermissionsAuthToken = ""

describe("Request", function() {
 /**
  * Tests for the GetAllRequests Controller.
  */
 context("Get All Requests", () => {
  it('GetAllRequests should return 200 and all requests', async function () {
   //ARRANGE

   //ACT
   const getAllRequestResult = await chai.request(server).get(baseUrl).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(3)
   getAllRequestResult.body.requests.should.be.lengthOf(3)
  })

  it('GetAllRequests should return 200 and one request that matches the bookName filter', async function () {
   //ARRANGE
   const bookName = "SEEDED BOOK 2"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?bookName=${bookName}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(2)
   getAllRequestResult.body.requests.should.be.lengthOf(2)
   getAllRequestResult.body.requests[0].bookName.should.equal(bookName)
  })

  it('GetAllRequests should return 200 and one request that matches the bookType filter', async function () {
   //ARRANGE
   const bookType = "Audiobook"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?bookType=${bookType}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(2)
   getAllRequestResult.body.requests.should.be.lengthOf(2)
   getAllRequestResult.body.requests[0].bookType.should.equal(bookType)
  })

  it('GetAllRequests should return 200 and one request that matches the isbn filter', async function () {
   //ARRANGE
   const isbn = "SEEDEDISBN"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?isbn=${isbn}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(2)
   getAllRequestResult.body.requests.should.be.lengthOf(2)
   getAllRequestResult.body.requests[0].isbn.should.equal(isbn)
  })

  it('GetAllRequests should return 200 and one request that matches the author filter', async function () {
   //ARRANGE
   const author = "SEEDED AUTHOR"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?author=${author}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(1)
   getAllRequestResult.body.requests.should.be.lengthOf(1)
   getAllRequestResult.body.requests[0].author.should.equal(author)
  })

  it('GetAllRequests should return 200 and one request that matches the requestedDateTime filter', async function () {
   //ARRANGE
   const requestedDateTime = "2022-01-31T18:38:00.000Z"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?requestedDateTime=${requestedDateTime}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(2)
   getAllRequestResult.body.requests.should.be.lengthOf(2)
   getAllRequestResult.body.requests[0].requestedDateTime.should.equal(requestedDateTime)
  })

  it('GetAllRequests should return 200 and one request that matches the requestedBy filter', async function () {
   //ARRANGE
   const userId = "313233343536373839313039"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?requestedBy=${userId}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(3)
   getAllRequestResult.body.requests.should.be.lengthOf(3)
   getAllRequestResult.body.requests[1].requestedBy.should.equal(userId)
  })

  it('GetAllRequests should return 200 and one request that matches the assignedTo filter', async function () {
   //ARRANGE
   const employeeId = "313233343536373839313130"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?assignedTo=${employeeId.toString()}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(2)
   getAllRequestResult.body.requests.should.be.lengthOf(2)
   getAllRequestResult.body.requests[0].assignedTo.should.equal(employeeId.toString())
  })

  it('GetAllRequests should return 200 and one request that matches the status filter', async function () {
   //ARRANGE
   const status = "In Review"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?status=${status}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(2)
   getAllRequestResult.body.requests.should.be.lengthOf(2)
   getAllRequestResult.body.requests[0].status.should.equal(status)
  })

  it('GetAllRequests should return 200 and one request if the limit filter is one', async function () {
   //ARRANGE
   const limit = 1

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?limit=${limit}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(3)
   getAllRequestResult.body.requests.should.be.lengthOf(1)
  })

  it('GetAllRequests should return 200 and no requests if the offset is one', async function () {
   //ARRANGE
   const offset = 1

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?offset=${offset}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(200)
   getAllRequestResult.body.count.should.equal(3)
   getAllRequestResult.body.requests.should.be.lengthOf(0)
  })

  it('GetAllRequests should return 400 if ObjectID isnt valid', async function () {
   //ARRANGE
   const invalidId = "INVALIDID"

   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}?requestedBy=${invalidId}`).set("Cookie", clientAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(400)
   getAllRequestResult.text.should.be.equal("Could not convert value to ObjectId.")
  })

  it('GetAllRequests should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}`)

   //ASSERT
   getAllRequestResult.should.have.status(401)
   getAllRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('GetAllRequests should return 403 if user doesnt have the correct permissions', async function () {
   //ARRANGE
   //ACT
   const getAllRequestResult = await chai.request(server).get(`${baseUrl}`).set("Cookie", noPermissionsAuthToken)

   //ASSERT
   getAllRequestResult.should.have.status(403)
   getAllRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })
 
 /**
  * Tests for the CreateRequest Controller.
  */
 context("Create Request", () => {
  it('CreateRequest should create a request and return a 201 status', async function () {
   //ARRANGE
   const newRequest = {
    "bookName": "TEST BOOK",
    "bookType": "Book",
    "author": "TEST AUTHOR"
   }

   //ACT
   const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", clientAuthToken).send(newRequest)

   //ASSERT
   createRequestResult.should.have.status(201)
   createRequestResult.body.status.should.equal("Pending Review")
  })

  it('CreateRequest should return a 400 if the book name isnt included', async function () {
   //ARRANGE
   const newRequest = {
    "bookName": "",
    "bookType": "Book",
    "author": "TEST AUTHOR"
   }

   //ACT
   const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", clientAuthToken).send(newRequest)

   //ASSERT
   createRequestResult.should.have.status(400)
   createRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('CreateRequest should return a 400 if the book type isnt included', async function () {
   //ARRANGE
   const newRequest = {
    "bookName": "TEST BOOK",
    "bookType": "",
    "author": "TEST AUTHOR"
   }

   //ACT
   const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", clientAuthToken).send(newRequest)

   //ASSERT
   createRequestResult.should.have.status(400)
   createRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('CreateRequest should return a 400 if the book type isnt Book or Audiobook', async function () {
   //ARRANGE
   const newRequest = {
    "bookName": "",
    "bookType": "NOT A BOOK",
    "author": "TEST AUTHOR"
   }

   //ACT
   const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", clientAuthToken).send(newRequest)

   //ASSERT
   createRequestResult.should.have.status(400)
   createRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('CreateRequest should return a 400 if the author isnt included', async function () {
   //ARRANGE
   const newRequest = {
    "bookName": "TEST BOOK",
    "bookType": "Book",
    "author": ""
   }

   //ACT
   const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", clientAuthToken).send(newRequest)

   //ASSERT
   createRequestResult.should.have.status(400)
   createRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('CreateRequest should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   const newRequest = {
    "bookName": "TEST BOOK",
    "bookType": "Book",
    "author": "TEST AUTHOR"
   }

   //ACT
   const createRequestResult = await chai.request(server).post(baseUrl).send(newRequest)

   //ASSERT
   createRequestResult.should.have.status(401)
   createRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('CreateRequest should return 403 if user doesnt have the correct permissions', async function () {
   //ARRANGE
   const newRequest = {
    "bookName": "TEST BOOK",
    "bookType": "Book",
    "author": "TEST AUTHOR"
   }

   //ACT
   const createRequestResult = await chai.request(server).post(baseUrl).set("Cookie", noPermissionsAuthToken).send(newRequest)

   //ASSERT
   createRequestResult.should.have.status(403)
   createRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
 })
 
 /**
  * Tests for the UpdateRequest Controller.
  */
 context("Update Request", () => {
  it('UpdateRequest should return a 200 status and update a request', async function () {
   //ARRANGE
   requests[0].bookName = "NEW BOOK NAME"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[0]._id}`).set("Cookie", clientAuthToken).send(requests[0])

   //ASSERT
   updateRequestResult.should.have.status(200)
   updateRequestResult.body.bookName.should.equal("NEW BOOK NAME")
  })

  it('UpdateRequest should return a 200 and set the status to purchased if the price is below the cost threshold', async function () {
   //ARRANGE
   requests[1].status = "Awaiting Approval"
   requests[1].price = 9
   requests[1].isbn = "123"
   
   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(200)
   updateRequestResult.body.status.should.equal("Purchased")
  })

  it('UpdateRequest should return a 200 and set the status to awaiting approval if the price is above the cost threshold', async function () {
   //ARRANGE
   requests[1].status = "Awaiting Approval"
   requests[1].price = 15
   requests[1].isbn = "123"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(200)
   updateRequestResult.body.status.should.equal("Awaiting Approval")
  })

  it('UpdateRequest should return a 200 if user has the correct permissions to update the request status to Additional Information Required', async function () {
   //ARRANGE
   requests[1].status = "Additional Information Required"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(200)
  })

  it('UpdateRequest should return a 400 if the book name isnt included', async function () {
   //ARRANGE
   requests[1].bookName = ""
   requests[1].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdateRequest should return a 400 if the author isnt included', async function () {
   //ARRANGE
   requests[1].author = ""
   requests[1].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdateRequest should return a 400 if the isbn isnt included', async function () {
   //ARRANGE
   requests[1].isbn = ""
   requests[1].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdateRequest should return a 400 if the price isnt included when completing a request', async function () {
   //ARRANGE
   requests[1].price = ""
   requests[1].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdateRequest should return a 400 if the book type isnt included', async function () {
   //ARRANGE
   requests[1].bookType = ""
   requests[1].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdateRequest should return a 400 if the book type isnt Book or Audiobook', async function () {
   //ARRANGE
   requests[1].bookType = "NOT A BOOK"
   requests[1].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Data was missing or invalid.")
  })

  it('UpdateRequest should return a 400 if the request hasnt been through the previous statuses', async function () {
   //ARRANGE
   requests[0].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[0]._id}`).set("Cookie", employeeAuthToken).send(requests[0])

   //ASSERT
   updateRequestResult.should.have.status(400)
   updateRequestResult.text.should.be.equal("Request must go through the previous statuses.")
  })

  it('UpdateRequest should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(401)
   updateRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('UpdateRequest should return a 403 if user doesnt have the correct permissions to update', async function () {
   //ARRANGE
   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", noPermissionsAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(403)
   updateRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })
  
  it('UpdateRequest should return a 403 if user doesnt have the correct permissions to update the request status to In Review', async function () {
   //ARRANGE
   requests[0].status = "In Review"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[0]._id}`).set("Cookie", clientAuthToken).send(requests[0])

   //ASSERT
   updateRequestResult.should.have.status(403)
   updateRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('UpdateRequest should return a 403 if user doesnt have the correct permissions to update the request status to Purchased', async function () {
   //ARRANGE
   requests[2].status = "Purchased"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[2]._id}`).set("Cookie", clientAuthToken).send(requests[2])

   //ASSERT
   updateRequestResult.should.have.status(403)
   updateRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('UpdateRequest should return a 403 if user doesnt have the correct permissions to update the request status to Denied', async function () {
   //ARRANGE
   requests[2].status = "Denied"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[2]._id}`).set("Cookie", clientAuthToken).send(requests[2])

   //ASSERT
   updateRequestResult.should.have.status(403)
   updateRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('UpdateRequest should return a 403 if user doesnt have the correct permissions to complete a request', async function () {
   //ARRANGE
   requests[1].status = "Awaiting Approval"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${requests[1]._id}`).set("Cookie", clientAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(403)
   updateRequestResult.text.should.be.equal("You do not have the correct permission to access this content.")
  })

  it('UpdateRequest should return a 404 if the request doesnt exist', async function () {
   //ARRANGE
   const invalidId = "INVALIDID"
   requests[1].bookType = "NOT A BOOK"

   //ACT
   const updateRequestResult = await chai.request(server).put(`${baseUrl}/${invalidId}`).set("Cookie", employeeAuthToken).send(requests[1])

   //ASSERT
   updateRequestResult.should.have.status(404)
   updateRequestResult.text.should.be.equal("Request doesn't exist.")
  })
 })
 
 /**
  * Tests for the DeleteRequest Controller.
  */
 context("Delete Request", () => {
  it('DeleteRequest should delete a request and return a 200 status', async function () {
   //ARRANGE
   //ACT
   const deleteRequestResult = await chai.request(server).delete(`${baseUrl}/${requests[0]._id}`).set("Cookie", clientAuthToken).send()
   const getAllRequestResult = (await chai.request(server).get(baseUrl).set("Cookie", clientAuthToken)).body

   //ASSERT
   deleteRequestResult.should.have.status(200)
   getAllRequestResult.requests.should.be.lengthOf(2)
  })

  it('DeleteRequest should return a 400 status if the ID passed isnt valid', async function () {
   //ARRANGE
   const fakeId = "FAKE ID"

   //ACT
   const deleteRequestResult = await chai.request(server).delete(`${baseUrl}/${fakeId}`).set("Cookie", clientAuthToken).send()

   //ASSERT
   deleteRequestResult.should.have.status(400)
   deleteRequestResult.text.should.be.equal("ID is not valid.")
  })

  it('DeleteRequest should return 401 if user isnt authenticated', async function () {
   //ARRANGE
   //ACT
   const deleteRequestResult = await chai.request(server).delete(`${baseUrl}/${requests[0]._id}`).send()

   //ASSERT
   deleteRequestResult.should.have.status(401)
   deleteRequestResult.text.should.be.equal("The provided token is invalid or has expired.")
  })

  it('DeleteRequest should return 404 if the ID passed doesnt exist in the database', async function () {
   //ARRANGE
   const id = "61e59bba7c2128f042a44eea"

   //ACT
   const deleteRequestResult = await chai.request(server).delete(`${baseUrl}/${id}`).set("Cookie", clientAuthToken).send()

   //ASSERT
   deleteRequestResult.should.have.status(404)
   deleteRequestResult.text.should.be.equal("No data found.")
  })
 })

 /**
  * Clears and seeds the in memory database before each test is ran.
  */
 beforeEach("Initialise Database", async function() {
  //Reset the database after each test
  await dbConfig.clearTestDb()
  await dbConfig.seedTestData()
  
  requests = (await chai.request(server).get(baseUrl).set("Cookie", clientAuthToken)).body.requests
 })

 /**
  * Creates Authentication tokens to be used within the tests
  */
 before("Authenticate", async function() {
  userId = "313233343536373839313039"
  employeeId = "313233343536373839313130"
  authoriserId = "313233343536373839313131"
 
  clientAuthToken = `;access_token=Bearer%20${jwt.sign({id: userId, roles: [{name: 'Client', permissions: [{name: 'ReadRequest'}, {name: 'CreateRequest'}, {name: 'UpdateRequest'}, {name: 'DeleteRequest'}]}]}, accessSecret, {})}`
  employeeAuthToken = `;access_token=Bearer%20${jwt.sign({id: employeeId, roles: [{name: 'Employee', permissions: [{name: 'ReadRequest'}, {name: 'AllocateRequest'}, {name: 'RequestMoreInformation'}, {name: 'CompleteRequest'}, {name: 'UpdateRequest'}]}]}, accessSecret, {})}`
  authoriserAuthToken = `;access_token=Bearer%20${jwt.sign({id: authoriserId, roles: [{name: 'Authoriser', permissions: [{name: 'ReadRequest'}, {name: 'AuthoriseRequest'}, {name: 'ReadStatisticReports'}, {name: 'UpdateRequest'}]}]}, accessSecret, {})}`
 
  noPermissionsAuthToken = `;access_token=Bearer%20${jwt.sign({id: "NOTAUSER", roles: [{name: 'role', permissions: []}]}, accessSecret, {})}`
 })
})