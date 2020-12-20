const {log, info, table, dir} = console;
const {MongoClient} = require("mongodb");
const assert = require("assert");

const url = "mongodb://127.0.0.1:27017";
const dbName = "json";

MongoClient.connect(url, (error, client) => {
  assert.equal(error, null);
  log("Connected correctly to server");
  const db = client.db(dbName);
  const collection = db.collection("books");
  const row = {
    "id": 109,
    "author": "Osy Ugwu",
    "book-title": "The Kidnapper Priest",
    "ISBN": "4110231107"
  }
  collection.insertOne(row, (error, result) => {
    assert.equal(error, null);
    log("After insert:");
    log(result.ops);

    collection.find({}).toArray((error, docs) => {
      assert.equal(error, null);
      log("Found: ");
      log(docs);

      db.dropCollection("books", (error, result) => {
        assert.equal(error, null);

        client.close();
      });
    });
  });
});