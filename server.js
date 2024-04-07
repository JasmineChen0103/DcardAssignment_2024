//server.js

var express = require('express');
var cors = require('cors');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
var bodyParser = require('body-parser');
const axios = require('axios');



const CLIENT_ID = '20b6da379f6121cedbe4';
const CLIENT_SECRET = 'cc0a9dc626d4343c81c8bd4c230fd2dd89b15218';

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// GitHub API endpoint
const GITHUB_API_URL = 'https://api.github.com';

// Route to handle GitHub OAuth callback
app.get('/getAccessToken', async function (req, res) {

    console.log(req.query.code);

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json",
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    })

});

// Route to get user data from GitHub
app.get('/getUserData', async function (req, res) {

    req.get("Authorization"); //Bearer ACCESSTOKEN
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization")//Bearer ACCESSTOKEN
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    })
})

// Route to create a new GitHub issue
app.post('/createIssue', async function (req, res) {
    const { title, body, selectedRepoId } = req.body;
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const url = `${GITHUB_API_URL}/repositories/${selectedRepoId}/issues`;
    const data = {
        title,
        body
    };
    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response.status).json({ error: error.response.data });
    }
});

// Route to update an existing GitHub issue
app.patch('/updateIssue/:issueNumber', async function (req, res) {
    const { title, body } = req.body;
    const { issueNumber } = req.params;
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    const url = `${GITHUB_API_URL}/repos/DannierForDcard/issues/${issueNumber}`;
    const data = {
        title,
        body
    };
    try {
        const response = await axios.patch(url, data, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response.status).json({ error: error.response.data });
    }
});


// Start the server
app.listen(4000, function () {
    console.log(`CORs server is running on port 4000`);
});