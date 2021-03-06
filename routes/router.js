const {log} = console;
const express = require("express");
const bodyParser = require("body-parser");
const Books = require("../models/books");
const Actions = require("../models/actions");
const authenticate = require("../controllers/authenticate");

const ENV = require("../utils/env_");
const actions = new Actions(Books);

const router = express.Router();
router.use(bodyParser.json());

/*Equivalent to /books */
router.get("/", (request, response, next) => {
  Books.find({}).then((books) => {
    if (!books) {
      return next();
    }
    response.setHeader("Content-Type", "application/json");
    response.status(200).json(actions.prune(books));
    response.end();
  }, (err) => next(err)).catch(err => next(err));
});


/* Equivalent to /books/first*/
router.get("/first", async (request, response, next) => {
  const data = await actions.first(1);
  response.status(200).json(data);
  response.end();
});


/* Equivalent to /books/last */
router.get("/last", async (request, response, next) => {
  const data = await actions.last(1);
  response.status(200).json(data);
  response.end();
});


/*Equivalent to /books/last/ten */
router.get("/last/ten", async (request, response, next) => {
  const data = await actions.last(10);
  response.status(200).json(data);
  response.end();
});


/*Equivallent to /books/first/ten */
router.get("/first/ten", async (request, response, next) => {
  const data = await actions.first(10);
  response.status(200).json(data);
  response.end();
});


/* Equivalent to /books/first/:no*/
router.get("/first/:number", async (request, response, next) => {
  const data = await actions.first(Number(request.params.number));
  response.status(200).json(data);
  response.end();
});


/*Equivalent to /books/last/:no*/
router.get("/last/:number", async (request, response, next) => {
  const data = await actions.last(Number(request.params.number));
  response.status(200).json(data);
  response.end();
});


/* Equivalent to /books/:ID*/
router.get("/:ID", (request, response, next) => {
  const params = request.params;
  let filter = {
    "id": params.ID
  };

  // ID may be a book id or ISBN number
  if (params.ID.length == 10 || params.ID.length == 13) {
    filter = {
      "ISBN": params.ID
    };
  }

  if (isNaN(params.ID)) {
    filter = {
      "book-title": params.ID,
      "author": params.ID
    };
  }

  Books.findOne(filter).then((book) => {
    if (!book) {
      return next();
    }
    response.setHeader("Content-Type", "application/json");
    response.status(200).json(actions.prune(book));
    response.end();
  }, (err) => next(err)).catch(err => next(err));
});


/*Equivalent to /books*/
router.post("/", authenticate.verifyUser, async (request, response, next) => {
  // Add a book. Id is auto-generated
  const {body} = request;
  if ("id" in body) {
    throw ("The internal property `id` is auto-generated");
  }

  let book = await Books.findOne({
    "ISBN": body.ISBN
  });
  if (book) {
    response.status(403).end("Book already exists");
    return
  }

  book = {
    id: ++ENV.bookId, //Increment this value on disk as well
    author: body.author,
    "book-title": body["book-title"],
    ISBN: body.ISBN
  };

  Books.create(book).then((book) => {
    response.setHeader("Content-Type", "application/json");
    response.status(200).json(book);
    response.end();
  }, (err) => {
    next(err);
  }).catch((err) => {
    // log(err);
    next(err);
  });
});


/*Equivalent to [/books, /books/:ID]*/
router.put(["/", "/:ID"], authenticate.verifyUser, handleUpdate);
function handleUpdate(request, response, next) {
  const body = request.body;
  const ID = request.params.ID || body.ISBN || body.reference;
  let filter;

  if ("id" in body) {
    throw ("The internal property `id` can't be updated!");
  }

  const update = {};
  const options = {
    new: true
  };

  switch (true) {
    case !ID.length:
      thow("A filter required: id, ISBN, reference");
      break;
    case ID.length == 10 || ID.length == 13:
      filter = {
        ISBN: ID
      };
      break;
    case ID.length == 24:
      filter = {
        reference: ID
      };
      break;
    default:
      filter = {
        id: ID
      };
  }

  switch (true) {
    case "author" in body:
      update["author"] = body["author"];
    case "book-title" in body:
      update["book-title"] = body["book-title"];
    case "ISBN" in body:
      update["ISBN"] = body["ISBN"];
  }

  Books.updateOne(filter, update, options).then((result) => {
    response.setHeader("Content-Type", "application/json");
    response.status(200).json(result);
    response.end();
  }, (err) => next(err)).catch(err => next(err));

}


/*Equivalent to /books/:ID*/
router.delete("/:ID", authenticate.verifyUser, (request, response, next) => {
  // delete book by id OR ISBN
  const {params, body} = request;
  if (!params.ID) {
    thrower("An id or ISBN is required to delete a book record.");
  }
  let filter = {
    "id": params.ID
  };

  // ID may be a book id or ISBN number
  if (params.ID.length == 10 || params.ID.length == 13) {
    filter = {
      "ISBN": params.ID
    };
  }

  if (body.id || body.ISBN) {
    throw ("JSON data is not expected!");
  }

  Books.findOneAndRemove(filter).then((result) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.json(result);
    response.end();
  }, (err) => next(err)).catch(err => next(err));
});



/*Equivalent to /books/massive */
router.post("/massive", authenticate.verifyUser, (request, response, next) => {
  next();
  /*const fs = require("fs");

  const books = JSON.parse(
    fs.readFileSync(process.env.PROJ_PATH + "/BOOKS.json", "utf-8")
  ).map(book => {
    book.id = ++ENV.bookId;
    return book;
  });
  // response.setHeader("Content-Type", "application/json");
  // response.status(200).json(books);
  // response.end("Ready Here");

  Books.create(books).then((books) => {
    response.setHeader("Content-Type", "application/json");
    response.status(200).json(books);
    response.end();
  }, (err) => {
    next(err);
  }).catch((err) => {
    // log(err);
    next(err);
  });*/

});

module.exports = router;