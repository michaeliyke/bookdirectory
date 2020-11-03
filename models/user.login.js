// function(exports, module, require, __filename, __dirname){
const path = require("path");
const User = require("./user.model");
const {log} = console;

module.exports = function login(request, response, next) {
  // store MongoDB userId (_id) in the request.session.userId
  const {email, password} = request.body;


  User.authenticate(email, password, (error, user) => {
    if (user) {
      request.session.userId = user._id;
      response.redirect("/home");
    } else {
      response.redirect("/login");
    }

  });
};

// return module.exports
// }