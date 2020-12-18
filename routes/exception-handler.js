module.exports = function ExceptionHandler(request, response, next){
  if (request.method.toLowerCase() == "post") {
    const path = request.path;
    response.write(`
      <h1>Unrecognized endpoint: <b>${path}</b></h1>
      `);
    return response.end(`<p>Data not saved!</p>`);
  }
  response.json(404);
}