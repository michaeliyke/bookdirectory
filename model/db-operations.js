const {log, info, table, dir} = console;
const assert = require("assert");

exports = {
  /**
   * Inserts a document directly into the database
   * @param  {object}   db         The db driver object
   * @param  {object}   document   document object
   * @param  {string}   collectionName Name of collection
   * @param  {Function} cb         Callback function
   * @return {object}         Returns this for chanining
   */
  insertDocument(db, document, collectionName, cb) {
    const collection = db.collection(collectionName);
    collection.insert(document, (error, result) => {
      assert.equal(error, null);
      log("Inserrted:", result.result.n,
        " document into the collection ", collectionName);
      cb(result);
    });
    return this;
  },

  /**
   * Retreives all the documents in a collection
   * @param  {object}   db  The db driver object
   * @param  {string}   collectionName  Name of collection
   * @param  {Function} cb  The callback function
   * @return {object}  Returns this object
   */
  findDocuments(db, collectionName, cb) {
    const collection = db.collection(collectionName);
    collection.find({}).toArray((error, documents) => {
      assert.equal(error, null);
      log("Found: ", documents);
      cb(documents);
    });
    return this;
  },

  /**
   * Updates a specific document in a given db and collection
   * @param  {object}   db             The db driver object
   * @param  {object}   document       Filter object
   * @param  {object}   update         Update spec object
   * @param  {string}   collectionName Name
   * @param  {Function} cb             Callback function
   * @return {object}                  returns this
   */
  updateDocument(db, document, update, collectionName, cb) {
    const collection = db.collection(collectionName);
    const options = {
      $set: update
    };
    collection.updateOne(document, options, null, (e, r) => {
      assert.equal(e, null);
      log("Updated the document, ", document);
      cb(r);
    });
    return this;
  },

  /**
   * Removes a specific document in a given db and collection
   * @param  {object}   db             The db driver object
   * @param  {object}   document       Filter object
   * @param  {string}   collectionName Name
   * @param  {Function} cb             Callback
   * @return {object}                  returns this
   */
  removeDocument(db, document, collectionName, cb) {
    const collection = db.collection(collectionName);
    collection.deleteOne(document, (error, result) => {
      assert.equal(error, null);
      log("Removed the document, ", document);
      cb(result);
    });
    return this;
  },
};

module.exports = exports;