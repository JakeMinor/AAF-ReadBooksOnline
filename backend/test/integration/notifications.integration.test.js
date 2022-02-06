const chai = require('chai')
const server = require('../../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/notification'
const dbConfig = require("../../database/database.config")
const jwt = require("jsonwebtoken")
const accessSecret = require("../../config/authentication.config").AccessSecret
chai.use(require('chai-http'))

let userId = ""
let clientAuthToken = ""
let noPermissionsAuthToken = ""

describe("Notification", function () {
 /**
  * Tests for the DeleteNotification Controller.
  */
  context("Delete Notification", () => {
   it('DeleteNotification should delete a notification and return a 200 status', async function () {
    //ARRANGE
    const notificationId = "313233343536373839313334"
    
    //ACT
    const deleteNotificationResult = await chai.request(server).delete(`${baseUrl}/${notificationId}`).set("Cookie", clientAuthToken).send()

    //ASSERT
    deleteNotificationResult.should.have.status(200)
   })

   it('DeleteRequest should return a 400 status if the ID passed isnt valid', async function () {
    //ARRANGE
    const fakeId = "FAKE ID"

    //ACT
    const deleteNotificationResult = await chai.request(server).delete(`${baseUrl}/${fakeId}`).set("Cookie", clientAuthToken).send()

    //ASSERT
    deleteNotificationResult.should.have.status(400)
    deleteNotificationResult.text.should.be.equal("ID is not valid.")
   })

   it('DeleteRequest should return 401 if user isnt authenticated', async function () {
    //ARRANGE
    const notificationId = "313233343536373839313334"

    //ACT
    const deleteNotificationResult = await chai.request(server).delete(`${baseUrl}/${notificationId}`).send()

    //ASSERT
    deleteNotificationResult.should.have.status(401)
    deleteNotificationResult.text.should.be.equal("The provided token is invalid or has expired.")
   })

   it('DeleteRequest should return 404 if the ID passed doesnt exist in the database', async function () {
    //ARRANGE
    const id = "61e59bba7c2128f042a44eea"

    //ACT
    const deleteNotificationResult = await chai.request(server).delete(`${baseUrl}/${id}`).set("Cookie", clientAuthToken).send()

    //ASSERT
    deleteNotificationResult.should.have.status(404)
    deleteNotificationResult.text.should.be.equal("No data found.")
   })
  })
 
 /**
  * Clears and seeds the in memory database before each test is ran.
  */
 beforeEach("Initialise Database", async function () {
  //Reset the database after each test
  await dbConfig.clearTestDb()
  await dbConfig.seedTestData()
 })

 /**
  * Creates Authentication tokens to be used within the tests
  */
 before("Authenticate", async function () {
  userId = "313233343536373839313039"
  
  clientAuthToken = `;access_token=Bearer%20${jwt.sign({id: userId, roles: [{name: 'Client', permissions: [{name: 'ReadRequest'}, {name: 'CreateRequest'}, {name: 'UpdateRequest'}, {name: 'DeleteRequest'}]}]}, accessSecret, {})}`
  
  noPermissionsAuthToken = `;access_token=Bearer%20${jwt.sign({
   id: "NOTAUSER",
   roles: [{name: 'role', permissions: []}]
  }, accessSecret, {})}`
 })
})