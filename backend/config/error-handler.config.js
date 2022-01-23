let httpError = require('http-errors');

module.exports = (app) => {
 //Throw a 404 for an invalid route
 app.use(function (request, result, next) { 
  next(httpError(404, "The page you are looking for doesn't exist!"));
 });

 // error handler
 app.use(function (error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  response.status(error.status || 500).send(error.message);
 });
}

