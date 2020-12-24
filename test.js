const {log, info, table, dir, error} = console;

const mongoose = require("mongoose");
const Books = require("./models/books");
const url = "mongodb://127.0.0.1:27017/json";

const dbConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

const connect = mongoose.connect(url, dbConnectOptions);
connect.then((db) => {
  info("Connected correctly to server.");

  const book = {
    "id": 9,
    "author": "Alpha",
    "book-title": "Grus canadensis",
    "ISBN": "4167514486009"
  }

  Books.create(book).then((book) => {
    info(book);

    const update = {
      $set: {
        "id": 1,
        "author": "Michael C. Iyke",
        "book-title": "The Art of Prayer"
      }
    };

    const flags = {
      new: true,
      useFindAndModify: false
    };

    return Books.findByIdAndUpdate(book._id, update, flags).exec();
  }).then((book) => {
    info(book);
    return Books.deleteOne({});
  }).then(() => {
    mongoose.connection.close();
  }).catch(error => console.error(error));

});