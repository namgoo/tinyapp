var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var cookieParser = require('cookie-parser')
app.use(cookieParser())


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text = text + possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// "/"
app.get("/", (req, res) => {
  res.end("Hello!");
});

//



// *********** /URLS *****************

app.get("/urls", (req, res) => {

  console.log('index')
  let templateVars = { urls: urlDatabase, username: req.cookies["username"]
 }
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
   let templateVars = { urls: urlDatabase, username: req.cookies["username"]
 }
  res.render('urls_new', templateVars)
});



// ********* urls/id *********

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
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

app.post("/login", (req, res) => {

  console.log("req.body = " , req.body)
  res.cookie('username', req.body['username'])
  res.redirect('/urls')
});


// ********* /logout *********

app.post("/logout", (req, res) => {
  console.log("is username deleted?" , username)
  // req.clearCookie('username')
  res.redirect('/urls')
});



// ********* Listen *********

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})
