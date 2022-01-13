const chai = require('chai')
const server = require('../app')
const should = chai.should();

const baseUrl = '/request/'

chai.use(require('chai-http'))

describe('Request', () => {
 it('Should return all data and a 200 status', () => {
  chai.request(server)
    .get(baseUrl)
    .end((error, response) => {
     response.should.have.status(200)
    })
 })
})