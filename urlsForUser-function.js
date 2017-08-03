var urlDatabase = {

  "b2xVn2": { userid: "userRandomID", longURL : "http://www.lighthouselabs.ca" },
  "9sm5xK": { userid: "user2RandomID", longURL: "http://www.google.com" },
  "5JvXEF": { userid: "zteQuv", longURL: "sharktank.com" }
};


function urlsForUser(id) {
 var myurl = {}
  for (i in urlDatabase) {
    if (urlDatabase[i]['userid'] === id) {
        myurl[i] = { 'userid' : urlDatabase[i]['userid'],'longURL' : urlDatabase[i]['longURL'] }
    }
  }
  return myurl
}

console.log(urlsForUser('zteQuv'))