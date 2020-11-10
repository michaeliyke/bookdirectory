
// function(exports, module, require, __filename, __dirname) {
const User = require("../models/user.model");
const path = require("path");
const express = require("express");
const router = express.Router();
const {log} = console;

router.get("/", (request, response, next) => {
  const {userId} = request.session;
  response.sendFile(path.resolve("./", "public/home.html"));
});

// users.login
router.post("/login", redirectHome, require("../models/user.login"));
// router.post("/login", redirectHome, require("../models/user.login"));
router.get("/login", redirectHome, (request, response) => {
  response.sendFile(path.resolve("./", "public/user.login.html"));
});

router.post("/register", redirectHome, redirectRegistered, require("../models/user.registration"));
router.get("/register", redirectHome, (request, response) => {
  log(request.originalUrl)
  response.sendFile(path.resolve("./", "public/user.register.html"));
});
// register

// logout
router.post("/logout", require("../models/user.logout"));
router.get("/dashboard", requiresLogin, (request, response, next) => {
  const {userId} = request.session;
  response.sendFile(path.resolve("./", "public/user.dashboard.html"));
});



/*Let's create some custom middle wares*/
function redirectHome(request, response, next) {
  log("Right here")
  if (request.session.userId) {
    if (request.body && "email" in request.body && "password" in request.body) {
      response.status(200).json({
        authorized: true,
        authenticated: true,
        email: "Unavailable",
        authorization: request.session.userId,
        route: "/home"
      });
      response.end()
    } else {
      response.redirect("/home");
    }

  } else {
    next();
  }
}
function requiresLogin(request, response, next) {
  if (request.session && request.session.sessionId) {
    return next();
  } else {
    response.redirect("/login");
    log("You must be logged in to view this page");
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




async function redirectRegistered(request, response, next) {
  log("Right here too")
  const {email} = request.body;
  const userExists = await User.exists(email);
  if (userExists) {
    const data = {
      authorized: false,
      email: email,
      route: null,
      errorMessage: "User already exists!",
      status: 401
    };
    response.status(200).json(data);
    response.end();
  // response.redirect("back");
  // response.redirect(router.get("referer"));
  } else {
    next();
  }
}

module.exports = router;
