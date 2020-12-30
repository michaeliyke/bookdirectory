const {log, info, table, dir, error} = console;

function auth(request, response, next) {
  log(request.header);
  const authHeader = request.headers.authorization;


  if (!authHeader) {
    // Client is not athorized, so we need to challenge her
    const error = new Error("Athentication required!"); //We will not allow them to go further
    response.setHeader("WWW-Authenticate", "Basic");
    error.status = 401;
    return next(error);
  }
  log(request.headers);
  const [authType, credentials] = authHeader.split(" "); //Lives at index position 1
  const auth = new Buffer(credentials, "base64");
  const [username, password] = auth.toString().split(":");
  if (username == "admin" && password == "password") {
    return next();
  }
  const error = new Error("Incorrect username or password");
  response.setHeader("WWW-Authenticate", "Basic");
  error.status = 401;
  return next(error);
}

module.exports = {
  auth
};