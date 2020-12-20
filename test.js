const {log, info, table, dir} = console;
const {MongoClient} = require("mongodb");
const dbOperations = require("./model/db-operations");
const assert = require("assert");

const url = "mongodb://127.0.0.1:27017";
const dbName = "json";

MongoClient.connect(url).then((client) => {
  log("Connected correctly to server");
  const db = client.db(dbName);
  const row = {
    "id": 109,
    "author": "Osy Ugwu",
    "book-title": "The Kidnapper Priest",
    "ISBN": "4110231107"
  }

  dbOperations.insertDocument(db, row, "books").then((result) => {
    log(result);
    return dbOperations.findDocuments(db, "books");
  }).then((result) => {
    log(result);
    const update = {
      "book-title": "The Art of Prayer"
    };

    const filter = {
      "ISBN": "4110231107"
    };

    return dbOperations.updateDocument(db, filter, update, "books");
  }).then((result) => {
    log(result);
    const filter = {
      "ISBN": "4110231107"
    };
    dbOperations.findDocuments(db, "books", a => log(a));

    return dbOperations.removeDocument(db, filter, "books");
  }).then((result) => {
    log(result);

    return db.dropCollection("books");
  }).then((result) => {
    log(result);
    log("All DONE!!!");
    client.close();
  }).catch(error => log(error));

}).catch(error => log(error));