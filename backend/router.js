function route(handle, pathname, response, query){
    if(typeof handle[pathname] === 'function') {
        handle[pathname](response, query)
    }
    else {
        response.writeHead(404, {"Content-Type": "text/plain"})
        response.write("Page not found")
        response.end()
    } 
}
exports.route = route