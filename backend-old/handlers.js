const queryString = require("querystring")

function start(){
    response.writeHead(200, {"Content-Type": "text/plain"})
    response.write("Request handler start called")
    response.end()
}

function submit(response, query){
    response.writeHead(200, {"Content-Type": "text/plain"})
    response.write(`Request handler submit called ${query.get('name')}`)
    response.end()
}

exports.start = start
exports.submit = submit