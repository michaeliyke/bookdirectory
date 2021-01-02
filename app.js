const {log, info, table, dir, error} = console;

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");

const config = require("./controllers/config");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/router");
const ExceptionHandler = require("./routes/exception-handler");

const mongoose = require("mongoose");
const url = config.mongoUrl;
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


app.use(passport.initialize());



app.use("/", indexRouter);
app.use("/users", usersRouter);

// Remove auth to apply only on POST, PUT, DELETE 
app.use("/books", booksRouter);

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
