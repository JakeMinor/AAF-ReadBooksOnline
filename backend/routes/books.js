const express = require('express')
const router = express.Router()

router.get('/', (request, response,next) => {
 response.send("got a GET request at /")
})

router.get('/book', (request, response, next) => {
 response.send("got a GET request at /book")
})

// router.post('/', upload.array(),(req, res) => {
//  res.send("got a POST request at /")
// })

router.put('/book', (request, response) => {
 response.send("Got a PUT request at /book")
})

router.delete('/book', (request, response) => {
 response.send("got a DELETE request at /book")
})

module.exports = router