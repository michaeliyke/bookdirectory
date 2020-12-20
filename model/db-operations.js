const {log, info, table, dir} = console;
const assert = require("assert");

exports = {
  /**
   * Inserts a document directly into the database
   * @param  {object}   db         The db driver object
   * @param  {object}   document   document object
   * @param  {string}   collectionName Name of collection
   * @param  {Function} cb         Callback function
   * @return {promise}         Returns a Promise
   */
  insertDocument(db, document, collectionName, cb) {
    const collection = db.collection(collectionName);
    return collection.insertOne(document);
  },

  /**
   * Retreives all the documents in a collection
   * @param  {object}   db  The db driver object
   * @param  {string}   collectionName  Name of collection
   * @param  {Function} cb  The callback function
   * @return {promise}  Returns a Promise
   */
  findDocuments(db, collectionName, cb) {
    const collection = db.collection(collectionName);
    return collection.find({}).toArray();
  },

  /**
   * Updates a specific document in a given db and collection
   * @param  {object}   db             The db driver object
   * @param  {object}   document       Filter object
   * @param  {object}   update         Update spec object
   * @param  {string}   collectionName Name
   * @param  {Function} cb             Callback function
   * @return {promise}                 Returns a Promise
   */
  updateDocument(db, document, update, collectionName, cb) {
    const collection = db.collection(collectionName);
    const options = {
      $set: update
    };
    return collection.updateOne(document, options, null);
  },

  /**
   * Removes a specific document in a given db and collection
   * @param  {object}   db             The db driver object
   * @param  {object}   document       Filter object
   * @param  {string}   collectionName Name
   * @param  {Function} cb             Callback
   * @return {promise}                 Returns a Promise
   */
  removeDocument(db, document, collectionName, cb) {
    const collection = db.collection(collectionName);
    return collection.deleteOne(document);
  },
};

module.exports = exports;