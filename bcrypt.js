const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // you will probably this from req.params
const hashed_password = bcrypt.hashSync(password, 10);

console.log(bcrypt.compareSync("purple-monkey-dinosaur", hashed_password)); // returns true
console.log(bcrypt.compareSync("pink-donkey-minotaur", hashed_password)); // returns false