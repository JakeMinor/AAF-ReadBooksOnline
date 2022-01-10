const server = require('./server')
const router = require('./router')
const handlers = require('./handlers')

let handle = {}
handle["/"] = handlers.start
handle["/start"] = handlers.start
handle["/submit"] = handlers.submit

server.start(handle, router.route);