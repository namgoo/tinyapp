var cookieSession = require('cookie-session')
var express = require("express");
var app = express();
var methodOverride = require('method-override');
const bcrypt = require('bcrypt')

app.use(methodOverride('_method'))
app.use(cookieSession({
  name: 'session',
  keys: ['awesome'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var PORT = process.env.PORT || 8080; // default port 8080

// var cookieParser = require('cookie-parser')
// app.use(cookieParser())



// var morgan = require('morgan')
// app.use(morgan())


var urlDatabase = {

  "b2xVn2": { userid: "userRandomID", longURL : "http://www.lighthouselabs.ca" },
  "9sm5xK": { userid: "user2RandomID", longURL: "http://www.google.com" }

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


function urlsForUser(id) {
 var myurl = {}
  for (i in urlDatabase) {
    if (urlDatabase[i]['userid'] === id) {
        myurl[i] = { 'userid' : urlDatabase[i]['userid'],'longURL' : urlDatabase[i]['longURL'] }
    }
  }
  return myurl
}


// "/"
app.get("/", (req, res) => {
  res.end("Hello! It's TinyApp!!");
});


// *********** /URLS *****************

app.get("/urls", (req, res) => {

  let templateVars = { urls: urlsForUser(req.session.user_id) , user: users[req.session.user_id] }
  // if (req.cookies['user_id']) {
    console.log("urlDatabase: ", urlDatabase)
    console.log("user_id: " , req.session.user_id)
    console.log("urlsForUser: ", urlsForUser(req.session.user_id))
  //   res.render("urls_index", templateVars) ;
  // } else {
  res.render("urls_index", templateVars) ;

});

// Creates new_urls

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString()
  if (req.body['longURL'].match(/^http|https/)) {
    urlDatabase[shortURL] = { userid: req.session.user_id, longURL : req.body['longURL']}
    res.redirect('/urls/' + shortURL)
  } else {
    console.log("Please specify the protocal - http or https!")
    res.redirect('/urls/new')
  }
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// ********* 'urls/new' *********

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id] }
  console.log("req.session.user_id === urlDatabase[req.params.id].userid")
  console.log("req.session.user_id === urlDatabase[req.params.id].userid")
  if ( req.session.user_id ) {
    res.render('urls_new', templateVars)
  } else {
    res.redirect("/login")
  }
});



// ********* urls/id *********

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]['longURL'], user: users[req.session.user_id] };
  if (req.session.user_id === urlDatabase[req.params.id].userid) {
    res.render("urls_show", templateVars);
  } else{
    res.send("You are not logged in, go away!")
  }
});

// Changing the existing url

app.put("/urls/:id", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userid) {
    urlDatabase[req.params.id] = {userid: req.session.user_id, longURL : req.body['longURL']}
    res.redirect('/urls')
  } else {
    res.redirect('/login')
  }

});


// ********* hello *********

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});



// ********* /urls/id/delete ******************

app.delete("/urls/:id/delete", (req, res) => {
  var deleteURL = req.params.id
  delete urlDatabase[deleteURL]
  res.redirect('/urls')
});



// ********* /u/shortURL - redirection *********

app.get("/u/:shortURL", (req, res) => {

  var gotoURL = req.params.shortURL
  if (urlDatabase[gotoURL]['longURL']) {
    res.redirect(urlDatabase[gotoURL]['longURL']);
  }
  else {
    res.send("The URL does not exist!")
  }
});


// ********* /login *********

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.session.user_id] }
  res.render('urls_login',templateVars)
})

app.post("/login", (req, res) => {
  console.log('req.body = ' , req.body)
  var inputpword = req.body.password
  console.log(inputpword)
  console.log('login', users)
  for (let userid in users) {
    var realpword = users[userid].password
    var hashed_password = bcrypt.hashSync(realpword, 10);
    if (req.body.email === users[userid].email) {
      if (bcrypt.compareSync(inputpword, hashed_password)) {
        req.session.user_id = userid
        res.redirect('/urls')
        return
      } else {
        console.log('The password is wrong.')
      }
    }
  }
  res.status(403).send('The email was not registered')
})

//
// });


//****************
//   var correctEmail = false
//   var correctPass = false
//   for (let userid in users) {
//     console.log(userid)
//     console.log(req.body.email)
//     console.log(users[userid])
//     var realpword = users[userid].password
//     var hashed_password = bcrypt.hashSync(realpword, 10);
//     if (req.body.email === users[userid].email) {
//       correctEmail = true
//       if (bcrypt.compareSync(inputpword, hashed_password)) {
//         correctPass = true
//         req.session.user_id = userid

//       }
//     }
//   }

//   if (correctEmail && correctPass) {
//     res.redirect('/urls')
//   } else {
//     console.log('email or password is wrong.')
//   }
// })
// ****************** //





// ********* /logout *********

app.get("/logout", (req, res) => {
  req.session = null
  console.log('You are logged out')
  res.redirect('/urls')
});



app.post("/logout", (req, res) => {
  req.session = null
  console.log('You are logged out')
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



  console.log(users)
  res.redirect('/urls')
});

// ********* /Listen *********

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})
