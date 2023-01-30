const notes = require('express').Router(); //allows for routes/index.js to redirect path to this file for API-based routes


// API Routes - need GET /api/notes to read (GET?) db.json file and POST /api/notes to perform functions in public/assets/js/index.js
// TODO: Create GET route to read the data on one of the notes

notes.get('/', (req, res) => {
    console.info(`${req.method} request received!`);

});

// TODO: Create POST route to show the data from the note selected and display it on Notes HTML page
notes.post('/', (req, res) => {
    console.info(`${req.method} request received!`);
    
});



// // DELETE Route to delete the data from notes - - note that line 47 of index.js has a path called `api/notes/${id}` so we will be using '/api/notes/:id'
// notes.delete('/:id', (req, res) => {
//     const noteID = req.params.id;

//     //Filter out id from existing notes
// });


module.exports = notes;