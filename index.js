const {log} = console;

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const booksRouter = require("./routes/router");
const ExceptionHandler = require("./routes/exception-handler");

const HOSTNAME = "127.0.0.1";
const PORT = 3000;
const app = express();

app.use(express.static(`${__dirname}/public`))
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/", booksRouter);
app.use(ExceptionHandler);


app.listen(PORT, HOSTNAME, () => {
  log("Site running...", HOSTNAME, ":", PORT);
});