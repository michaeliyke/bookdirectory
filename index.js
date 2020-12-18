const {log} = console;

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

let ops = null;

const app = express();
app.use(express.static(`${__dirname}/public`))
app.use(morgan("dev"));
app.use(bodyParser.json());

app.all(/\/books/, (request, response, next) => {
  ops = require("./utils/book-operations");
  next();
});


app.get("/", (request, response, next) =>{
  const ret = ops.getAllBooks();
  response.json(ret);
});


app.get("/books", (request, response, next) =>{
  const ret = ops.getAllBooks();
  response.json(ret);
  response.end();
});


app.get("/books/:bookId", (request, response, next) =>{
  const book = ops.getBook(request.params.bookId);
  
  if (!book) {
    return next();
  }

  response.json(book);
  response.end();
});


app.post("/books", (request, response, next) =>{
  // Add a book. Book id is auto-generated
  const {body} = request;
  if ("id" in body) {
      throw("The internal property `id` is auto-generated");
    }


  if (ops.has(body.ISBN)) {
    response.status(403);
    response.end("Book already exists");
    return
  }

  const ret = ops.addBook({
    id: ops.totalStock,
    author: body.author,
    "book-title": body["book-title"],
    ISBN: body.ISBN
  });

  response.json(ret);
  response.end();
});


// app.put("/books/:Id_OR_ISBN", handleUpdate);
// const z = /^\/books\/{0,1}$|^\/books\/\w+\/{0,1}$/;
const y = /^\/books\/{0,1}$/;
const x = [y, "/books/:ID", "/books/:ID/"];
app.put(x, handleUpdate);

function handleUpdate(request, response, next) {
  const body = request.body;
  const ID = request.params.ID || body.ISBN;
  
  if (!ops.has(ID)) {
    return next();
  }

  if ("id" in body) {
    throw("The internal property `id` can't be updated!");
  }
  
  const update = {
    "author": body["author"],
    "book-title": body["book-title"],
    "ISBN": body["ISBN"]
  };

  const ret = ops.updateBook(ID, update);
  response.json(ret);
  response.end();
}


// app.delete(x.slice(1), (request, response, next) =>{
app.delete(x, (request, response, next) =>{
  // delete book by id OR ISBN
  const body = request.body;
  const ID = request.params.ID || body.ISBN;
  if (request.params.ID && body.ISBN) {
    throw("You must specify either one of ID or ISBN but not both.");
  }
  if (!ops.has(ID)) {
    return next();
  }

  const ret = ops.deleteBook(ID);
  response.json(ret);
  response.end();
});


app.use((request, response, next) =>{
  if (request.method.toLowerCase() == "post") {
    const path = request.path;
    response.write(`
      <h1>Unrecognized endpoint: <b>${path}</b></h1>
      `);
    return response.end(`<p>Data not saved!</p>`);
  }
  response.json(404);
});


app.listen(PORT, HOSTNAME, () => {
  log("Site running...", HOSTNAME, ":", PORT);
});