const {log, info, dir, table, error} = console;
const ERR = require("../utils/errors");
const ENV = require("../utils/env_");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const User = require("../models/user");
const {loginAuth} = require("../controllers/authentication");

const router = express.Router();
router.use(bodyParser.json());


/*
GET users listing.
  This means /users/
 */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});


// This means /users/login/
router.post("/login", passport.authenticate("local"), (request, response, next) => {
  loginAuth(request, response, next);
});


//This means /users/signup/
router.post("/signup", (request, response, next) => {
  const {username, password} = request.body;
  User.register(new User({
    id: ++ENV.USER_ID,
    username,
  }), password, (error, user) => {
    if (error) {
      log("Error: ", error);
      error.status = 500; //Server error
      response.setHeader("Content-Type", "application/json");
      response.json({
        error
      });
      return response.end();
    }
    passport.authenticate("local")(request, response, () => {
      response.setHeader("Content-Type", "application/json");
      response.status(200);
      response.json({
        status: "Registration successful!",
        success: true
      });
    });
  });
});


router.get("/logout", (request, response, next) => {
  if (request.session) {
    request.session.destroy();
    response.clearCookie("book-directory-api");
    response.redirect("/");
    return
  }
  next(ERR.create({
    msg: "You are not logged in!",
    status: 403 //Forbidden
  }));
});

module.exports = router;
