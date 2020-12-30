const {log, info, table, dir, error} = console;
const ERR = require("../utils/errors");
const Users = require("../models/user");

function loginAuth(request, response, next) {

  const authHeader = request.headers.authorization;

  if (request.session.user) {
    response.status(200);
    response.setHeader("Content-Type", "text/plain");
    response.end("You are already authenticated.");
    return
  }

  if (!authHeader) {
    // Client is not athorized, so we need to challenge her
    response.setHeader("WWW-Authenticate", "Basic");
    error.status = 401;
    return next(ERR.create({
      msg: "Athentication required!", //We will not allow them to go further
      status: 401 // Client not athorized
    }));
  }
  const [authType, credentials] = authHeader.split(" "); //Lives at index position 1
  const auth = new Buffer.from(credentials, "base64");
  const [username, password] = auth.toString().split(":");

  Users.findOne({
    username
  }).then(user => {
    if (!user || user == null) {
      response.setHeader("WWW-Authenticate", "Basic");
      return next(ERR.create({
        msg: "User " + username + " doesn't exits!",
        status: 403 //Forbidden
      }));
    }
    if (user.username == username && user.password == password) {
      request.session.user = "authenticated";
      response.status(200);
      response.setHeader("Content-Type", "text/plain");
      response.end("You are authenticated.");
      return
    }
    response.setHeader("WWW-Authenticate", "Basic");
    return next(ERR.create({
      msg: "Incorrect password!",
      status: 403 //Forbidden
    }));
  }).catch(error => next(error));
}


function auth(request, response, next) {
  log(request.session);
  const authHeader = request.headers.authorization;
  const [authType, credentials] = authHeader.split(" "); //Lives at index position 1
  const auth = new Buffer.from(credentials, "base64");
  const [username, password] = auth.toString().split(":");
  if (request.session.user) {
    if (request.session.user == "authenticated") {
      return next();
    }
    response.setHeader("WWW-Authenticate", "Basic");
    next(ERR.create({
      msg: "You are not authenticated!",
      status: 403 // Forbidden
    }));
  }

  if (!authHeader || !username) {
    // Client is not athorized, so we need to challenge her
    response.setHeader("WWW-Authenticate", "Basic");
    return next(ERR.create({
      msg: "Athentication required!", //We will not allow them to go further
      status: 401 //Not authorized
    }));
  }

  Users.findOne({
    username
  }).then(user => {
    if (!user || user == null) {
      response.setHeader("WWW-Authenticate", "Basic");
      return next(ERR.create({
        msg: "User " + username + " does not exist!",
        status: 403 //Fobiiden
      }));
    }
    if (user.username == username && user.password == password) {
      request.session.user = "authenticated";
      response.status(200);
      response.setHeader("Content-Type", "text/plain");
      response.end("You are authenticated.");
      return
    }

    return next(ERR.create({
      msg: "Incorrect username or password",
      status: 401 //Not authorized
    }));
  }).catch(error => next(error));
}

module.exports = {
  auth,
  loginAuth
};