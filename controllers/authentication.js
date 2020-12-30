const {log, info, table, dir, error} = console;

function auth(request, response, next) {
  log(request.signedCookies);
  const authHeader = request.headers.authorization;

  if (request.signedCookies.user) {
    if (request.signedCookies.user == "admin") {
      return next();
    }
    const error = new Error("You are not authenticated!");
    response.setHeader("WWW-Authenticate", "Basic");
    error.status = 401;
    next(error);
  }

  if (!authHeader) {
    // Client is not athorized, so we need to challenge her
    const error = new Error("Athentication required!"); //We will not allow them to go further
    response.setHeader("WWW-Authenticate", "Basic");
    error.status = 401;
    return next(error);
  }
  const [authType, credentials] = authHeader.split(" "); //Lives at index position 1
  const auth = new Buffer.from(credentials, "base64");
  const [username, password] = auth.toString().split(":");
  if (username == "admin" && password == "password") {
    response.cookie("user", "admin", {
      signed: true,
    });
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