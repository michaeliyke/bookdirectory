const {log, info, table, dir, error} = console;
const ERR = require("../utils/errors");
const Users = require("../models/user");
const authenticate = require("../controllers/authenticate");

function loginAuth(request, response, next) {
  const token = authenticate.getToken({
    _id: request.user._id
  });
  response.setHeader("Content-Type", "application/json");
  response.status(200);
  response.json({
    status: "You are successfully logged in!",
    success: true,
    token
  });
}


function auth(request, response, next) {
  if (request.user) {
    return next();
  }
  response.setHeader("WWW-Authenticate", "Basic");
  next(ERR.create({
    msg: "You are not authenticated!",
    status: 403 // Forbidden
  }));
}

module.exports = {
  auth,
  loginAuth
};