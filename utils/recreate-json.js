const {log} = console;

const fs = require("fs");

function RecreateBookJsonData(books) {

let data = "[";

const brk = "\n";

let index = 0;

for(const book of books){
    // book.id--;
    if (++index == books.length) {
      data += `${brk} ${JSON.stringify(book)} ${brk}]`;
      break
    }

    data += `${brk} ${JSON.stringify(book)},`;
  }


/*fs.writeFileSync("BOOKS.json", data, {
  encoding: "utf-8",
  flag: "w"
  })*/

return data;
}

module.exports = RecreateBookJsonData;