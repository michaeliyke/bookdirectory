const {log, info, table, dir} = console;
const {MongoClient} = require("mongodb");
const dbOperations = require("./model/db-operations");
const assert = require("assert");

const url = "mongodb://127.0.0.1:27017";
const dbName = "json";

MongoClient.connect(url, (error, client) => {
  assert.equal(error, null);
  log("Connected correctly to server");
  const db = client.db(dbName);
  const row = {
    "id": 109,
    "author": "Osy Ugwu",
    "book-title": "The Kidnapper Priest",
    "ISBN": "4110231107"
  }

  dbOperations.insertDocument(db, row, "books", (result) => {
    dbOperations.findDocuments(db, "books", (result) => {
      const update = {
        "book-title": "The Art of Prayer"
      };
      const filter = {
        "ISBN": "4110231107"
      };

      dbOperations.updateDocument(db, filter, update, "books", (result) => {
        dbOperations.findDocuments(db, "books", a => a);
        dbOperations.removeDocument(db, filter, "books", (result) => {
          db.dropCollection("books", (result) => {
            log("ALL DONE!!!");
            client.close();
          });
        });
      });
    });
  });

});