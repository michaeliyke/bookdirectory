// function(exports, module, require, _-filename, __dirname){


module.exports = async function register(request, response, next) {
  // User.create(details).then(success).catch(error);
  const {name, email, password, repassword} = request.body;

  if (!(name && email && password && repassword)) {
    const error = new Error("Please provide all required details.");
    error.status = 400;
    response.send(error);
    response.redirect("/register");
  }

  const userExists = await UserModel.exists(email);
  if (userExists) {
    const error = new Error("User already exists!");
    error.status = 400;
    response.send(error);
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
    details.firtName = names[0];
    details.lastName = names[1];
    details.otherNames = [,, ...names].join(" ");
  }


  const user = await UserModel.create(details);
  request.session.userId = user._id;
  return response.redirect("/home");
};
// return module.exports
// }