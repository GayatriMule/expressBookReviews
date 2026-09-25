const express = require('express');
const jwt = require('jsonwebtoken');

let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check whether username already exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check username and password
const authenticatedUser = (username, password) => {
    return users.some(
        user =>
            user.username === username &&
            user.password === password
    );
};


// Login
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    // Check whether username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check whether user exists and password is correct
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Create JWT token
    const token = jwt.sign(
        { username: username },
        "access",
        { expiresIn: "1h" }
    );

    // Store token in session
    req.session.authorization = {
        accessToken: token
    };

    // Login successful
    return res.status(200).json({
        message: "Login successful",
        token: token
    });
});


// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user.username;
    const review = req.body.review;

    // Check whether book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Check whether review is provided
    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    // Create reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.user.username;

    // Check whether book exists
    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Check whether review exists
    if (
        !books[isbn].reviews ||
        !books[isbn].reviews[username]
    ) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    // Delete review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully"
    });
});


// Export router and functions
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
