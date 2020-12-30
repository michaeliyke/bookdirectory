const {log, info, dir, table, error} = console;

const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model("User", UserSchema)