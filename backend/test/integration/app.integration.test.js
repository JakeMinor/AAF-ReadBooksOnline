const chai = require('chai')
const server = require('../../app')
const should = chai.should();

chai.use(require('chai-http'))

describe('root', () => {
 it('Should return a 404 for a GET', () => {
  chai.request(server)
    .get('/')
    .end((error, response) => {
     response.should.have.status(404)
    })
 })

 it('Should return a 404 for a POST', () => {
  chai.request(server)
    .post('/')
    .end((error, response) => {
     response.should.have.status(404)
    })
 })

 it('Should return a 404 for a PUT', () => {
  chai.request(server)
    .put('/')
    .end((error, response) => {
     response.should.have.status(404)
    })
 })

 it('Should return a 404 for a DELETE', () => {
  chai.request(server)
    .delete('/')
    .end((error, response) => {
     response.should.have.status(404)
    })
 })
})