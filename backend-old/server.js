const http = require("http")
const url = require("url")

function start(handle, route) {
    function onRequest(request, response) {
        const urlObj = new URL(request.url, `${request.protocol}://${request.headers.host}/`)
        route(handle, urlObj.pathname, response, urlObj.searchParams)
    }
    http.createServer(onRequest).listen(3000)
    console.log("Server Started")
}

exports.start = start