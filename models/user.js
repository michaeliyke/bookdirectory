const {log, info, dir, table, error} = console;

const mongoose = require("mongoose");
const PassportLocalMongoose = require("passport-local-mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  /*
  username & passowrd removed cause passport-local-mongoose 
    adds them automatically
   */
  admin: {
    type: Boolean,
    default: false
  }
});

UserSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("User", UserSchema)