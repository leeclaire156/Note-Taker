const express = require('express');
//Used to import path methods like path.join(), see https://nodejs.org/api/path.html for more details
const path = require('path');

const app = express();
// const PORT = process.env.PORT || 3001
const PORT = 3001

// Allows access of all contents in public folder without writing routes to each asset
app.use(express.static('public'));

// HTML Routes - need GET /notes to return notes.html file and GET * to return index.html file

// Homepage HTML Route
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Notes page HTML Route
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard HTML Route - Sends user to homepage if they enter a URL that is not found
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


// API Routes - need GET /api/notes to read (GET?) db.json file and POST /api/notes to perform functions in public/assets/js/index.js

// TODO: Create GET route to read the data on one of the notes
app.get('/api/notes/:id', (req, res) => {
    // TODO: Possibly iterate through the terms ID or title from db.json to check if it matches `req.params.term` aka requestedNote

});

// TODO: Creat POST route to show the data from the note selected and display it on Notes HTML page
// app.post('/api/notes/:id', (req, res) => {

// });


app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);