const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(u=> u.username === username)? false:true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(u=> u.username === username && u.password === password);

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username,password}=req.body;
  if(username && password && authenticatedUser(username,password)){
    const token = jwt.sign({username:username},"access")
    req.session.authorization = token ;
  return res.status(200).json({message: "Signed in successfully",token});

  }
  return res.status(400).json({message: "Invalid Credintials"});

    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user;
  const {isbn} = req.params;
  const {review}=req.body;
  if(review){
    books[isbn].reviews[user.username]= review;
    return res.status(200).json({message: "Review is completed successfully"});
  }
  return res.status(404).json({message: "there are no review found"});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.user;
    const {isbn} = req.params;
    if(books[isbn].reviews[user.username]){
        delete books[isbn].reviews[user.username]
        return res.status(200).json({message: "Review is deleted successfully"});

    }
  return res.status(404).json({message: "there are no review found"});

})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
