const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = decodeURIComponent(req.params.author).toLowerCase();

    const result = Object.keys(books)
        .filter(isbn => books[isbn].author.toLowerCase() === author)
        .reduce((obj, isbn) => {
            obj[isbn] = books[isbn];
            return obj;
        }, {});

    return res.status(200).json(result);
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = decodeURIComponent(req.params.title).toLowerCase();

    const result = Object.keys(books)
        .filter(isbn => books[isbn].title.toLowerCase() === title)
        .reduce((obj, isbn) => {
            obj[isbn] = books[isbn];
            return obj;
        }, {});

    return res.status(200).json(result);
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


module.exports.general = public_users;
