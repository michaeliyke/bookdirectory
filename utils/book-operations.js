const {log} = console;
const fs = require("fs");
const path = require("path");
const bookPath = path.resolve(`./Books.json`);

const recreateJSONData = require("./recreate-json");

exports = {

  data: JSON.parse(fs.readFileSync(bookPath, "utf-8")),
  

  get books() {
    return this.data;
  },


  get totalStock() {
    return this.books.length;
  },


  has(y) {
    return !!this.data.find(x => x.id == y || x.ISBN == y);
  },


  getAllBooks() {
    return this.books;
  },


  getBook(ID_OR_ISBN) {
    const x = ID_OR_ISBN;
    return this.data.find((y) => y.id == x || y.ISBN == x);
  },


  addBook(book) {
    book.id = this.books.length;
    this.data.push(book);
    this.overWriteBookData(this.data);
    return true;
  },


  updateBook(ID_OR_ISBN, update) {

    const book = this.getBook(ID_OR_ISBN); //Return a ref
    const abortMsg = `<h1>No changes made!</h1>`;
    if (
        book["book-title"] == update["book-title"] && 
        book["author"] == update["author"] && 
        book["ISBN"] == update["ISBN"]) {
      return `${abortMsg}<p>There's nothing to change.<p>`;
    }
    
    // Because of the way object ref works, 
    // updating the ref will update the original on this.data
    if (update["book-title"]) {
      book["book-title"] = update["book-title"];
    }
    
    if (update.author) {
      book["author"] = update["author"];
    }
      
    if (update.ISBN) {
      book["ISBN"] = update["ISBN"];
    }

    this.overWriteBookData(this.data);
    return book;
  },


  deleteBook(ID_OR_ISBN) {
    const ID = ID_OR_ISBN;
    let index = 0;
    const books = [];
    
    for(const book of this.books) {
      if (book.id == ID || book.ISBN == ID) {
        continue;
      }
      book.id = index++;
      books.push(book);
    }

    this.data = books;

    this.overWriteBookData(books);
    return true;
  },


  overWriteBookData(data) {
    const dest = bookPath;
    
    const options = {
      flag: "w",
      encoding: "utf8"
    };

    fs.writeFileSync(dest, recreateJSONData(data), options);
  }


};

// log(exports.getAllBooks());
// log(exports.getBookB  yId(28));

module.exports = exports;