
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const TWO_HOURS = (1000 * 60 * 60) * 2;


const {
  PORT = 3000,
  SESSION_NAME = "sid",
  SESSION_SECRETE = "ssh!quiet,it\'asecret",
  SESSION_LIFETIME = TWO_HOURS,
  NODE_ENV = "development"
} = process.env

const IN_PROD = NODE_ENV === "production";

const users = [
  {id: 1, name: "Alex", email: "alex@gmail.com", password: "secret"},
  {id: 2, name: "Max", email: "max@gmail.com", password: "secret"},
  {id: 3, name: "Alex", email: "alex @gmail.com", password: "secret"}
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
    sameSite: true ,
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

app.get("/home", redirectLogin, (request, response) =>{
  response.send(`
    <h1>Home!</h1>
    <a href="/">Main</a>
  <ul>
    <li>Name: </li>
    <li>Email: </li>
  </ul>
    `);
});
app.get("/login", redirectHome, (request, response) =>{
  response.send(
    `<h1>Login</h1>
  <form action="/login" method="post">
    <input type="email" name="email" placeholder="email" required />
    <input type="password" name="password" placeholder="password" required />
    <input type="submit" />
  </form>
  <a href="/register">Register</a>
  `

    );
});
app.get("/register", redirectHome, (request, response) =>{
  response.send(`
    <h1>Register</h1>
  <form action="/register" method="post">
    <input name="name" placeholder="Name" required />
    <input type="email" name="email" placeholder="email" required />
    <input type="password" name="password" placeholder="password" required />
    <input type="submit" />
  </form>
  <a href="/login">Login</a>
    `);
});

app.post("/login", redirectHome, (request, response) =>{
  const {email, password} = request.body;
  if (email && password) {
    const user = users.find((user) =>{
      return user.email == email && user.password == password;
    });

    if (user) {
      request.session.userId = user.id;
      return response.redirect("/home");
    }
  }
  redirect("/login");
});

app.post("/register", redirectHome, (request, response) =>{
  const {name, email, password} = request.body;
  if (name && email && password) {
    const exists = users.some((user) =>{
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

app.post("/logout", redirectLogin, (request, response) =>{
  request.session.destroy((error) =>{
    if (error) {
      return response.redirect("/home");
    }
    response.clearCookie(SESSION_NAME);
    response.redirect("/login");
  });
});

app.get("/", (request, response, next) =>{
  
  const {userId} = request.session;
  // const userId = 1;
  
  console.log(request.session);
  
  const str = `
 <h1>Welcome!</h1>
${userId ? `<a href="/home">Home</a>
<form action="/logout" method="post">
  <button type="submit">Logout</button>
</form>
`
:`<a href="/login">Login</a>
<a href="/register">Register</a>
`}`
  ;
  response.send(str);
});

app.listen(PORT, () =>{console.log("http://127.0.0.1:3000")});
