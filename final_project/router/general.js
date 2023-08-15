
const express = require('express');
//const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    getBooksAsync().then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: "Couldn't get the books in the shop." });
      })
  });
  function getBooksAsync() {
    return new Promise((resolve) => {
      resolve(JSON.stringify(books, null, 4));
    });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByIsbnAsync(isbn)
    .then(bookRecord => {
      return res.send(bookRecord);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })
});
function getBookByIsbnAsync(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book based on ISBN not Found");
    }
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
  
    getBookByAuthorAsync(author)
      .then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
  });
  function getBookByAuthorAsync(author) {
    return new Promise((resolve, reject) => {
      const booksExist = Object.values(books).filter(book => book.author == author);
      if (booksExist.length > 0) {
        resolve(booksExist);
      } else {
        reject("Book based on the author not Found");
      }
    });
  }
  
  // Get all books based on title
  public_users.get('/title/:title', function (req, res) {
  
    const title = req.params.title;
  
    getBookByTitleAsync(title)
      .then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
  });
  function getBookByTitleAsync(title) {
    return new Promise((resolve, reject) => {
      const booksExist = Object.values(books).filter(book => book.title == title);
      if (booksExist.length > 0) {
        resolve(booksExist);
      } else {
        reject("Book based on the title not Found");
      }
    });
  }
  //  Get book review
  public_users.get('/review/:isbn', function (req, res) {
    // Extract ISBN from request parameters
    const myisbn = req.params.isbn;
  
    // Check if the book exists in the books object
    const book = books[myisbn];
  
    if (book) {
      // Check if the book has reviews
      if (Object.keys(book.reviews).length > 0) {
        res.json(book.reviews);
      } else {
        res.status(404).json({ message: 'No reviews found for the given book.' });
      }
    } else {
      res.status(404).json({ message: 'Book not found.' });
    }
  });
  
  public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registred. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    }
    return res.status(404).json({ message: "Unable to register user." });
  });
  
  
  
  
  module.exports.general = public_users;
