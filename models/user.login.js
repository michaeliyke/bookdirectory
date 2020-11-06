// function(exports, module, require, __filename, __dirname){
const path = require("path");
const User = require("./user.model");
const {log} = console;

module.exports = function login(request, response, next) {
  // store MongoDB userId (_id) in the request.session.userId
  const {email, password, details} = request.body;

  log(details)
  User.authenticate(email, password, (error, user) => {
    // response.setHeader("Content-Type", "application/json");
    if (user && user.authenticated === true) {
      request.session.userId = user._id;
      const authorization = {
        authorized: true,
        email: email,
        authorization: user._id,
        route: "/home"
      };
      response.status(200).json(authorization);
      response.end();
    } else if (user) {
      response.status(200).json({
        status: 200,
        athorized: false,
        email: email,
        errorMessage: "Incorrect password, did you forget your password?",
        route: "/login"
      });
      response.end()
    } else {
      const error = {
        status: 404,
        authorized: false,
        email: email,
        errorMessage: `Account with email ${email} does not exist, would you like to create it?`,
        route: "/register"
      };
      response.status(200).json(error);
      response.end();
    }

  });
};

// return module.exports
// }