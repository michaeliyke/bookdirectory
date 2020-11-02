const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const multer = require("multer");
const {log} = console;
const l = log;

const app = express();

const bodyParser = require("body-parser");
const MAX_AGE = (1000 * 60 * 60) * 24 * 30; //30 days


const {PORT = 3000, SESSION_NAME = "sid", SESSION_SECRETE = "ssh!quiet,it\'asecret", SESSION_LIFETIME = MAX_AGE, NODE_ENV = "development"} = process.env

const IN_PROD = NODE_ENV === "production";

mongoose.connect("mongodb://127.0.0.1:27017/directory", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRETE,
  cookie: {
    maxAge: SESSION_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  },
  store: new MongoStore({
    mongooseConnection: db
  })
}));


// Serve static files from the public directory
app.use(express.static(`${__dirname}/public`));

// ROUTER
app.use("*", require("./router/navigation.routes"));


// Proof againt 404
app.use((request, response, next) => {
  const error = new Error("File Not Found");
  error.status = 404;
  next(error);
});

// LAST CALL TO MAKE
app.use((error, request, response) => {
  response.status(error.status || 500);
  response.send(error && error.message ? error.message : "Internal server error");
});

app.listen(PORT, () => {
  console.log("http://127.0.0.1:3000")
});