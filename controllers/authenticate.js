const passport = require("passport");
const LocalStretegy = require("passport-local").Strategy;

const User = require("../models/user");

exports.local = passport.use(new LocalStretegy(User.authenticate()));
// Take care of session/cookie
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());