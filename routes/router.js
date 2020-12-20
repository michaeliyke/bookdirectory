const {log} = console;
const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

let ops = null;

router.all(/\/books\/{0,1}/, GenericHandler);
function GenericHandler(request, response, next) {
  ops = require("../utils/book-operations");
  next();
}


router.get(/^\/books\/{0,1}$/, (request, response, next) => {
  const ret = ops.getAllBooks();
  response.json(ret);
  response.end();
});
//{"id":108,"author":"Osy Ugwu","book-title":"The Praying Mantis","ISBN":"1992105350"} 


router.get("/books/:ID", (request, response, next) => {
  const book = ops.getBook(request.params.ID);
  log(request.params)
  if (!book) {
    return next();
  }

  response.json(book);
  response.end();
});


router.post(/^\/books\/{0,1}$/, (request, response, next) => {
  // Add a book. Book id is auto-generated
  const {body} = request;
  if ("id" in body) {
    throw ("The internal property `id` is auto-generated");
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


x = [/^\/books\/{0,1}$/, "/books/:ID"];
router.put(x, handleUpdate);
function handleUpdate(request, response, next) {
  const body = request.body;
  const ID = request.params.ID || body.ISBN;

  if (!ops.has(ID)) {
    return next();
  }

  if ("id" in body) {
    throw ("The internal property `id` can't be updated!");
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
x = [/^\/books\/{0,1}$/, "/books/:ID"];
router.delete(x, (request, response, next) => {
  // delete book by id OR ISBN
  const body = request.body;
  const ID = request.params.ID || body.ISBN;
  if (request.params.ID && body.ISBN) {
    throw ("You must specify either one of ID or ISBN but not both.");
  }
  if (!ops.has(ID)) {
    return next();
  }

  const ret = ops.deleteBook(ID);
  response.json(ret);
  response.end();
});


module.exports = router;