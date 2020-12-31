const {log, info, table, dir, error} = console;
const ERR = require("../utils/errors");
const Users = require("../models/user");

function loginAuth(request, response, next) {
  response.setHeader("Content-Type", "application/json");
  response.status(200);
  response.json({
    status: "You are successfully logged in!",
    success: true
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