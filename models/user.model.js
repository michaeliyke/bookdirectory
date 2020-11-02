const {Schema} = require("mongoose");
const bcrypt = require("bcrypt");

const UserModel = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: false
  },
  password: {
    type: String,
    required: false
  },
  firstname: {
    type: String,
    default: ""
  },
  lastname: {
    type: String,
    default: ""
  },
  othername: {
    type: String,
    default: ""
  },
  admin: {
    type: Boolean,
    default: false
  }
});

UserModel.pre("save", function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(error, hash) {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});

UserModel.statics.exists = async function exists(email, fn) {
  return await UserModel.findOne({
      email
    }).exec();
};


UserModel.statics.authenticate = function authenticate(email, password, fn) {
  UserModel.findOne({
    email: email
  }).exec((error, user) => {
    if (error) {
      return fn(error);
    } else if (!user) {
      const error = new Error("User does not exist!");
      error.status = 401;
      return fn(error);
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if (result === true) {
        return fn(null, user);
      } else {
        return fn();
      }
    });
  });
};

module.exports = mongoose.model("UserModel", UserModel);