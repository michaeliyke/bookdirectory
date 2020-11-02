// function(exports, module, require, __filename, __dirname) {

const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/", (request, response, next) => {
  const {userId} = request.session;
  response.sendFile(path.resolve("./", "public/home.html"));
});


router.get("/home", redirectLogin, (request, response) => {
  response.sendFile(path.resolve("./", "public/dashboard.html"));
});

router.get("/login", redirectHome, (request, response) => {
  response.sendFile(path.resolve("./", "public/login.html"));
});

router.get("/register", redirectHome, (request, response) => {
  response.sendFile(path.resolve("./", "public/register.html"));
});

// users.login
router.post("/login", redirectHome, require("../models/user.login"));

// users.register
router.post("/register", redirectHome, require("../models/user.registration"));

// users.logout
router.post("/logout", redirectLogin, require("../models/user.logout"));

function requiresLogin(request, response, next) {
  if (request.session && request.session.sessionId) {
    return next();
  } else {
    const error = new Error("You must be logged in to view this page");
    error.status = 401;
    return next(error);
  }
}


/*Let's create some custom middle wares*/
function redirectLogin(request, response, next) {
  if (!request.session.userId) {
    // User is not logged in
    response.redirect("/login");
  } else {
    next();
  }
}


/*Let's create some custom middle wares*/
function redirectHome(request, response, next) {
  if (request.session.userId) {
    // User is not logged in
    response.redirect("/home");
  } else {
    next();
  }
}

module.exports = router;

// return module.exports
// }