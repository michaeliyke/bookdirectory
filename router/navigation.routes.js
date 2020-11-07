// function(exports, module, require, __filename, __dirname) {
const User = require("../models/user.model");
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
router.post("/register", redirectHome, redirectRegistered, require("../models/user.registration"));

// users.logout
router.post("/logout", require("../models/user.logout"));

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
    // User is logged in 
    if (request.body && "email" in request.body && "password" in request.body) {
      response.status(200).json({
        authorized: true,
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


async function redirectRegistered(request, response, next) {
  const {email} = request.body;
  const userExists = await User.exists(email);
  if (userExists) {
    // const error = new Error("User already exists!");
    // error.status = 400;
    // return response.sendFile(path.resolve("./", "public/register.html"));
    response.redirect("back");
    response.end();
  // response.redirect(router.get("referer"))
  } else {
    next();
  }
}

module.exports = router;

// return module.exports
// }