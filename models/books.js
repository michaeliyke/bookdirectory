const {log, info, table, dir} = console;

const mongoose = require("mongoose");
const {Schema} = mongoose;

const BookDetails = {

  reference: {
    type: mongoose.ObjectId,
    default: Buffer.from("Thisisjust12")
  },

  "id": {
    type: Number,
    unique: true
  },

  "author": {
    type: String,
  },

  "book-title": {
    type: String,
  },

  "ISBN": {
    type: Number,
    min: 1000000000,
    max: 9999999999999,
    unique: true
  }

};

const options = {
  timestamps: {
    createdAt: "date_created",
    updatedAt: "date_updated"
  }
};

const BookSchema = new Schema(BookDetails, options);
const Books = mongoose.model("book", BookSchema);

module.exports = Books;