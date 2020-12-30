const ERR = require("../utils/errors");
const ENV = require("../utils/env_");
const express = require("express");
const bodyParser = require("body-parser");
const Users = require("../models/user");
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
router.post("/login", (request, response, next) => {
  loginAuth(request, response, next);
});


//This means /users/signup/
router.post("/signup", (request, response, next) => {
  const {username, password} = request.body;
  Users.findOne({
    username,
    password
  }).then((user) => {
    if (user && user != null) {
      const error = new Error("User " + username + " already exists!");
      error.status = 403; //Forbidden
      return next(error);
    }
    return Users.create({
      id: ++ENV.USER_ID,
      username,
      password
    }).then((user) => {
      response.setHeader("Content-Type", "application/json");
      response.status(200);
      user.status = "Registration successful!";
      response.json({
        user
      });
    }).catch(error => next(error));
  }).catch(error => next(error));
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
