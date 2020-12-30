const {log, info, table, dir} = console;

const mongoose = require("mongoose");
const {Schema} = mongoose;

const uploads = {
  image: {
    extension: {
      type: String,
      default: ""
    },
    uploaded_path: {
      type: String,
      default: ""
    },
    mimetype: {
      type: String,
      default: ""
    },
    filename: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 0
    }
  }
};

const BookDetails = {

  uploads,

  "reference": {
    type: mongoose.ObjectId,
    default: Buffer.from("Thisisjust12")
  },

  "id": {
    type: Number,
    unique: true
  },

  "author": String,

  "book-title": String,

  "ISBN": {
    type: Number,
    min: 10000000,
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

