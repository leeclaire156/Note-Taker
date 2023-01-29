const express = require('express');
//Used to import path methods like path.join(), see https://nodejs.org/api/path.html for more details
const path = require('path');
const api = require('./routes/index.js'); //To be uncommented for modular routing purposes once API GET method issues have been resolved

const app = express();
// const PORT = process.env.PORT || 3001
const PORT = 3001

// Sets up the Express app to handle data parsing from json file
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api); //To be uncommented for modular routing purposes once API GET method issues have been resolved

// Allows access of all contents in public folder without writing routes to each asset
app.use(express.static('public'));

// HTML Routes - need GET /notes to return notes.html file and GET * to return index.html file

/* Homepage HTML Route */
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

/* Notes page HTML Route */
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

/* Wildcard HTML Route - Sends user to homepage if they enter a URL that is not found */
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);