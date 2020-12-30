"use strict";

/**
 * Helper interface for the ENV parser module
 */

const {log, table, dir, error, info} = console;
const path = require("path");

const fs = require("fs");
const filePath = process.env.PROJ_PATH ?
  path.resolve(`${process.env.PROJ_PATH}/.env`) :
  path.resolve("../.env");
const file = fs.readFileSync(filePath, "utf-8");
const lines = file.split(/[\r\n]+/);
// log(lines.join("\r\n"));

const obj = {
  lines,
  vals: {},

  /**
   * Replace the .env content with a modiefied version
   * @return {boolean}
   */
  save() {
    fs.writeFileSync(filePath, this.lines.join("\r\n"), "utf-8");
    return true;
  },

  /**
   * Modify the content of the .env file
   * @param  {string} key env key
   * @param  {string} val env value
   * @return {string}  Description of operation
   */
  modify(key, val) {
    const lineNumber = this[key + "LineNumber"];
    const changes = key + "=" + val;
    this.lines[lineNumber] = changes; //Locate by line number and replace
    this.vals[key] = val;
    this.save();
    const changeNote = "On line " + lineNumber + ": " + changes;
    return changeNote;
  }
};


let lineIndex = 0;

for (const line of lines) {
  const keyVal = line.split("=");
  let key,
    val = "";
  if (!keyVal[0]) {
    continue;
  }

  if (keyVal[1]) {
    val = keyVal[1].trim();
  }

  key = keyVal[0].trim();

  obj[key + lineIndex] = line; //Save full line as is
  obj[key + "LineNumber"] = lineIndex; //Save line number
  obj[lineIndex] = key; //Make line number point to key
  obj.vals[key] = val; //Make key point to its value in vals object
  obj.length = ++lineIndex; //Define e length property for a little madness

  obj.__defineGetter__(key, function Getter() {
    // Get its value
    return this.vals[key];
  });

  obj.__defineSetter__(key, function Getter(value) {
    // Set its value
    // throw ("Setting incorrectly!");
    this.modify(key, value);
  });
/*Object.defineProperty(obj, key, {
  set(value){
    this.modify(key, value);
  },
  get() {
    return this.vals[key];
  }
});*/
}

obj.__proto__ = Array.prototype; //A little madness is not bad!

module.exports = obj;
