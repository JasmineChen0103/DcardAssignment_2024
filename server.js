//server.js

var express = require('express');
var cors = require('cors');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
var bodyParser = require('body-parser');
const axios = require('axios');

var app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// GitHub API endpoint
const GITHUB_API_URL = 'https://api.github.com';

// GitHub OAuth credentials
const CLIENT_ID = '80959feac4174348bcda';
const CLIENT_SECRET = 'd04d04a7af65dc26598582d3532a2f0ffe3a4eda';

app.use(cors());
app.use(bodyParser.json());

// Route to handle GitHub OAuth callback
app.get('/getAccessToken', async function (req, res) {

    console.log(req.query.code);

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

    await fetch('https://github.com/login/oauth/access_token' + params, {
        method: "POST",
        headers: {
            "Accept": 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    });
});

app.get('/getUserData', async function (req, res) {
    req.get("Authorization");
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    });
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});