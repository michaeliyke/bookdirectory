const {log} = console;

const express = require("express");
const morgan = require("morgan");
const http = require("http");
const HOSTNAME = "127.0.0.1";
const PORT = 3000;

const app = express();
app.use(morgan("dev"));

app.use(express.static(`${__dirname}/public`));

app.use((request, response, next) =>{
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");
  response.end(`
    <html> <body>
      <h1>This is An Express Server!</h1>
    </body>
    `);
});

app.listen(PORT, HOSTNAME, () => {
  log("Site running...", HOSTNAME, ":", PORT);
});