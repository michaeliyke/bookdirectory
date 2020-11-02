// function(exports, module, require, __filename, __dirname){

module.exports = async function login(request, response, next) {
  // store MongoDB userId (_id) in the request.session.userId
  const {email, password} = request.body;

  UserModel.authenticate(email, password, (error, user) => {
    if (user) {
      request.session.userId = user._id;
      return response.redirect("/home");
    }

  });
  response.redirect("/login");
};

// return module.exports
// }