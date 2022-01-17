const chai = require('chai')
const server = require('../app')
const should = chai.should();
const expect = chai.expect
const baseUrl = '/bookRequest/'
const mongoose = require('mongoose')
chai.use(require('chai-http'))

let userId = ""

describe('Request', () => {
 beforeEach("Seed Data", async () => {
  await mongoose.model("user").create({
   "username": "TEST USER",
   "email": "TEST EMAIL",
   "password": "TEST PASSWORD",
   "role": "Client"
  })
  await mongoose.model("user").findOne().then((response) => {
   userId = response._id
  })
 })
 
 it('should create a request and return a 201 status', () => {
  const request = {
   "bookName": "TEST BOOK",
   "bookType": "Book",
   "author": "TEST AUTHOR",
   "requestedDateTime": new Date().toUTCString(),
   "requestedBy": userId
  }
  
  chai.request(server)
    .post(baseUrl).send(request)
    .end((error, response) => {
     response.should.have.status(201)
    })
  
  chai.request(server)
    .get(baseUrl)
    .end((error, response) => {
     response.should.have.status(200)
     response.body.should.have.lengthOf(1)
    })
 })
 
 it('Should return all data and a 200 status', () => {
  chai.request(server)
    .get(baseUrl)
    .end((error, response) => {
     response.should.have.status(200)
     response.body.should.have.lengthOf(0)
    })
 })
 
 afterEach("Clear Database", async () => await require('../database/database.config').clearTestDb())
})