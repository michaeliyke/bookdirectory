const {log, info, table, dir, error} = console;

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const morgan = require("morgan");
const passport = require("passport");

const authenticate = require("./controllers/authenticate");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/router");
const ExceptionHandler = require("./routes/exception-handler");
const {auth} = require("./controllers/authentication");

const mongoose = require("mongoose");
const Books = require("./models/books");
const url = "mongodb://127.0.0.1:27017/json";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

const connect = mongoose.connect(url, dbOptions);
connect.then((database) => {
  log("Connected to Database successfully!");
}).catch(e => error(e));

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// app.use(cookieParser("9210293-18391-31893-3u1223h128;[u38?:"));
app.use(session({
  name: "book-directory-api",
  secret: "9210293-18391-31893-3u1223h128;[u38?:",
  resave: false,
  saveUninitialized: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());



app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(auth);
app.use("/books", booksRouter)

app.use(express.static(path.join(__dirname, "public")));
app.use(ExceptionHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
