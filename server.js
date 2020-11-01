const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const TWO_HOURS = (1000 * 60 * 60) * 2;


const {PORT = 3000, SESSION_NAME = "sid", SESSION_SECRETE = "ssh!quiet,it\'asecret", SESSION_LIFETIME = TWO_HOURS, NODE_ENV = "development"} = process.env

const IN_PROD = NODE_ENV === "production";

const users = [
  {
    id: 1,
    name: "Alex",
    email: "alex@gmail.com",
    password: "secret"
  },
  {
    id: 2,
    name: "Max",
    email: "max@gmail.com",
    password: "secret"
  },
  {
    id: 3,
    name: "Alex",
    email: "alex @gmail.com",
    password: "secret"
  },
  {
    id: 4,
    name: "root",
    email: "root@g.c",
    password: "test"
  },
  {
    id: 5,
    name: "Tester",
    email: "test@test.test",
    password: "test"
  }
];

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRETE,
  cookie: {
    maxAge: SESSION_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}));

/*Let's create some custom middle wares*/
const redirectLogin = (request, response, next) => {
  if (!request.session.userId) {
    // User is not logged in
    response.redirect("/login");
  } else {
    next();
  }
};

/*Let's create some custom middle wares*/
const redirectHome = (request, response, next) => {
  if (request.session.userId) {
    // User is not logged in
    response.redirect("/home");
  } else {
    next();
  }
};

app.get("/home", redirectLogin, (request, response) => {
  response.sendFile(path.join(`${__dirname}/public/dashboard.html`));
});

app.get("/login", redirectHome, (request, response) => {
  response.sendFile(path.join(`${__dirname}/public/login.html`));
});

app.get("/register", redirectHome, (request, response) => {
  response.sendFile(path.join(`${__dirname}/public/register.html`));
});

app.post("/login", redirectHome, (request, response) => {
  const {email, password} = request.body;
  if (email && password) {
    const user = users.find((user) => {
      return user.email == email && user.password == password;
    });

    if (user) {
      request.session.userId = user.id;
      return response.redirect("/home");
    }
  }
  redirect("/login");
});

app.post("/register", redirectHome, (request, response) => {
  const {name, email, password} = request.body;
  if (name && email && password) {
    const exists = users.some((user) => {
      return user.email == email;
    });
    if (!exists) {
      const user = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password
      };
      users.push(user);
      request.session.userId = user.id
      return response.redirect("/home");
    }
  }
  response.redirect("/register");
});

app.post("/logout", redirectLogin, (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      return response.redirect("/home");
    }
    response.clearCookie(SESSION_NAME);
    response.redirect("/login");
  });
});

app.get("/", (request, response, next) => {

  const {userId} = request.session;
  // const userId = 1;

  console.log(request.session);
  response.sendFile(path.join(`${__dirname}/public/home.html`));
});

app.listen(PORT, () => {
  console.log("http://127.0.0.1:3000")
});
