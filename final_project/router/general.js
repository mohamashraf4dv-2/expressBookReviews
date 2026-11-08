const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
const booksArr = Object.values(books);
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} =req.body
  if(username && password && isValid(username)){
    users.push({username,password});
  return res.status(201).json({message: "user created successfully"});

  }
  else if(username&& password)
    return res.status(400).json({message:"username already exists" });
return res.status(400).json({message:"username and password are required fields" });

});

// Get the book list available in the shop
 public_users.get('/',async function (req, res) {
  //Write your code here
  const bookAxios = await axios.get("./router/books.json")
  return res.status(200).json( JSON.stringify(bookAxios));

//   return res.status(200).json(await JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  const bookAxios = await axios.get("./router/books.json")

    const book = bookAxios[isbn];
    return book? res.status(200).json( JSON.stringify(book)): res.status(404).json(" book not found")
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const {author} = req.params;
  const bookAxios = await axios.get("./router/books.json")
  const booksAxiosArr = Object.values(bookAxios);
    const foundBooks = booksAxiosArr.filter(b=> b.author === author);
    if(foundBooks.length>0)
        return res.status(200).json(await JSON.stringify(foundBooks));
    return res.status(404).json("not found")
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const {title} = req.params;
  const bookAxios = await axios.get("./router/books.json")
  const booksAxiosArr = Object.values(bookAxios);
  const foundBooks = booksAxiosArr.filter(b=> b.title === title);
  if(foundBooks.length>0)
    return res.status(200).json(await JSON.stringify(foundBooks));
return res.status(404).json("not found")

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  const foundBook = books[isbn].reviews
  if(foundBook)
    return res.status(200).json(JSON.stringify(foundBook));
 return res.status(404).json("not found")
});

module.exports.general = public_users;
