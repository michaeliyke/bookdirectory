const {log, info, table, dir, error} = console;
const passport = require("passport");
const PassportLocal = require("passport-local");
const JWT = require("jsonwebtoken"); //Json Web Token
const PassportJWT = require("passport-jwt"); //.Strategy & .ExtractJwt present

const config = require("./config");
const User = require("../models/user");

exports.local = passport.use(new PassportLocal.Strategy(User.authenticate()));
// Take care of session/cookie
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return JWT.sign(user, config.secretKey, {
    expiresIn: 60 * 60 * 24 * 7, //Re-authenticate after 1 wk
  });
};

const options = {};
options.jwtFromRequest = PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;

exports.PassportJWT = passport.use(
  new PassportJWT.Strategy(options, (jwt_payload, cb) => {
    log("JWT payload", jwt_payload);
    User.findOne({
      _id: jwt_payload._id
    }, (error, user) => {
      if (error) {
        return cb(error, false);
      }
      if (user) {
        return cb(null, user);
      }
      return cb(null, false);
    });
  }));


exports.verifyUser = passport.authenticate("jwt", {
  session: false
});