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

    const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`;

    try {
        const response = await fetch(`https://github.com/login/oauth/access_token${params}`, {
            method: "POST",
            headers: {
                "Accept": 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);

        // Send the access token back to the client
        res.json(data);
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

// Route to get user data from GitHub
app.get('/getUserData', async function (req, res) {
    const accessToken = req.get("Authorization");

    try {
        const response = await fetch(`${GITHUB_API_URL}/user`, {
            method: "GET",
            headers: {
                "Authorization": accessToken
            }
        });

        const userData = await response.json();
        console.log(userData);
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});