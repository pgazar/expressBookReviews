const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'aVeryLongRandomString', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;

    // Extract review from request query
    const review = req.query.review;

    // Extract username from the session
    const username = req.session.authorization.username;

    // Check if the book exists in the books object
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
    }

    if (!review) {
        return res.status(400).json({ message: 'Review content is missing.' });
    }

    // If the book has reviews, check if the user has already given a review
    if (!book.reviews) {
        book.reviews = {};
    }

    // Update or add the user's review
    book.reviews[username] = review;

    // Update the book in the books object
    books[isbn] = book;

    res.send(`Review for the book with ISBN ${isbn} has been updated/added.`);
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


