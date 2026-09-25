const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ======================================================
// Q7 - Register a new user
// ======================================================
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


// ======================================================
// Internal endpoint used by Axios
// ======================================================
public_users.get('/api/books', function (req, res) {
    return res.status(200).json(books);
});


// ======================================================
// Q2 - Get all books
// Using Axios + async/await
// ======================================================
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// ======================================================
// Q3 - Get book details based on ISBN
// Using Axios + async/await
// ======================================================
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        const allBooks = response.data;

        if (allBooks[isbn]) {
            return res.status(200).json(allBooks[isbn]);
        }

        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// ======================================================
// Q4 - Get book details based on author
// Using Axios + async/await
// ======================================================
public_users.get('/author/:author', async function (req, res) {
    const author = decodeURIComponent(req.params.author).toLowerCase();

    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        const allBooks = response.data;

        const result = Object.keys(allBooks)
            .filter(isbn =>
                allBooks[isbn].author.toLowerCase() === author
            )
            .reduce((obj, isbn) => {
                obj[isbn] = allBooks[isbn];
                return obj;
            }, {});

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// ======================================================
// Q5 - Get all books based on title
// Using Axios + async/await
// ======================================================
public_users.get('/title/:title', async function (req, res) {
    const title = decodeURIComponent(req.params.title).toLowerCase();

    try {
        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        const allBooks = response.data;

        const result = Object.keys(allBooks)
            .filter(isbn =>
                allBooks[isbn].title.toLowerCase() === title
            )
            .reduce((obj, isbn) => {
                obj[isbn] = allBooks[isbn];
                return obj;
            }, {});

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});


// ======================================================
// Q6 - Get book review
// ======================================================
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// ======================================================
// Export router
// ======================================================
module.exports.general = public_users;
