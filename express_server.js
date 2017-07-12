var morgan = require('morgan')
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(morgan())

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text = text + possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


// "/"
app.get("/", (req, res) => {
  res.end("Hello! It's TinyApp!!");
});


// *********** /URLS *****************

app.get("/urls", (req, res) => {

  console.log('index')
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }
  console.log(templateVars.user)
  res.render("urls_index", templateVars) ;

});


app.post("/urls", (req, res) => {

  let shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body['longURL']
  res.redirect('/urls/' + shortURL)

});


app.post("/urls", (req, res) => {
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// ********* 'urls/new' *********

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }
  console.log("Something" , req.cookies["user_id"])
  if ( req.cookies["user_id"] ) {
        console.log("Something 3", typeof req.cookies["user_id"])

    res.render('urls_new', templateVars)
  } else {
    res.redirect("/login")
  }
});



// ********* urls/id *********

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id", (req, res) => {
  console.log("req.params =", req.params)
  console.log("req.params.id =", req.params.id)
  console.log("req.body" , req.body)
  console.log("urlDatabase[req.params.id]", urlDatabase[req.params.id])
  console.log("req.body['longURL']", req.body['longURL'])
  urlDatabase[req.params.id] = req.body['longURL']
  res.redirect('/urls')
  // urlDatabase[shortURL] = req.body
});


// ********* hello *********

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});



// ********* /urls/id/delete ******************

app.post("/urls/:id/delete", (req, res) => {
  var deleteURL = req.params.id
  console.log(deleteURL)
  console.log(urlDatabase[deleteURL])
  delete urlDatabase[deleteURL]
  console.log(urlDatabase[deleteURL])
  console.log(urlDatabase)
  res.redirect('/urls')
});



// ********* /u/shortURL - redirection *********

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  shortURL = req.params.shortURL
  let longerURL = urlDatabase[shortURL]
  console.log(longerURL)
  res.redirect(longerURL);
});


// ********* /login *********

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }
  res.render('urls_login',templateVars)
})

app.post("/login", (req, res) => {
  console.log('req.body = ' , req.body)

  for (var userid in users) {
    if (req.body.email === users[userid].email) {
      if (req.body.password === users[userid].password) {
      res.cookie('user_id', userid)
      res.redirect('/')
      return
      }
    }
  }
res.status(403).send()

});


// ********* /logout *********

app.get("/logout"), (req, res) => {
 res.send("you are logged out!")
}



app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/urls')
});


// ********* /register *********

app.get("/register", (req, res) => {
  res.render('urls_register')
});


app.post("/register", (req, res) => {
  let randomid = generateRandomString();

  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send({error: "No empties!"})
      return
  }

  for (id in users) {
    if (users[id]['email'] === req.body.email) {
      res.status(400).send({error: "The email is already registered!"})
      return
    }
  }

  users[randomid] = { id: randomid ,
    email: req.body.email,
    password: req.body.password}
  res.cookie('user_id',randomid)
  console.log(users)

  res.render('urls_register')
});

// ********* /Listen *********

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})
