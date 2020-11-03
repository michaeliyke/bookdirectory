// function(exports, module, require, __filename, __dirname){

const User = require("./user.model");

module.exports = async function register(request, response, next) {
  // User.create(details).then(success).catch(error);
  const {name, email, password, repassword} = request.body;

  if (!(name && email && password && repassword)) {
    const error = new Error("Please provide all required details.");
    error.status = 400;
    response.send(error);
    response.redirect("/register");
  }
  

  const userExists = await User.exists(email);
  if (userExists) {
    // const error = new Error("User already exists!");
    // error.status = 400;
    // response.send(error);
    console.log("userExists: reg")
    return response.redirect("/login");
  }

  if (password !== repassword) {
    const error = new Error("Passwords do not match.");
    error.status = 400;
    response.send("Passwords do not match.");
    next(error);
  }
  const details = {
    name,
    email,
    password
  };

  const names = name.split(" ");
  if (name.length > 1) {
    details.firstname = names[0];
    details.lastname = names[1];
    details.othernames = names.splice(2).join(" ");
  }
  // console.log(details)
  // return process.exit(0);

  const user = await User.create(details);
  request.session.userId = user._id;
  return response.redirect("/home");
};
// return module.exports
// }