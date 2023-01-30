const notes = require('express').Router(); //allows for routes/index.js to redirect path to this file for API-based routes
const fs = require('fs'); //Helps to read/write/append to files
const path = require('path'); //Used to join file path of db.json in savedNotesRoute constant
const savedNotesRoute = path.join(__dirname, '../db/db.json');

// Create GET route to read the data on one of the notes
notes.get('/', (req, res) => {
    res.sendFile(savedNotesRoute);
});

// Create POST route to show the data from the note selected and display it on Notes HTML page
notes.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the title and text properties are present a new note is made with its contents plus a unique id
    if (title && text) {
        const newNote = {
            title,
            text,
            id: Math.floor(Math.random() * 10000)
        };

        // fs.readFile() Asynchronously reads the entire contents of a file and the contents get passed in as the data argument
        // The db.json file must be read first before writing additional objects to the file's array.
        // If there is a file to read, THEN there will be written content
        fs.readFile(savedNotesRoute, 'utf8', (error, data) => {
            if (error) {
                // Catching any errors first, which may occur if there is no data in the db.file
                console.error(error);
            } else {
                // New constant to parse note data Convert string into JSON object
                const parsedNote = JSON.parse(data);

                // Add a new note object to the array of objects we call parsedNotes
                parsedNote.push(newNote);

                // Updated file goes back to db.json file
                fs.writeFile(savedNotesRoute, JSON.stringify(parsedNote, null, 4), //convert array into string bc any JSON that is saved needs to be a string (same rules applied for local storage). null and 4 is for formatting so that its the staggered look.
                    (writeError) =>
                        writeError
                            ? console.error(writeError)
                            : console.info('Successfully updated notes!')
                );

            }
        })

        // After the db.json file has been read and additional content has been written, we will log successes
        const response = {
            status: 'success',
            body: newNote,
        }
        console.log(response);

        //When status 201 code returns, we will request the response JSON object
        res.status(201).json(response);

    } else {
        res.status(500).json('Error in saving note');
    }
});

// // DELETE Route to delete the data from notes - - note that line 47 of index.js has a path called `api/notes/${id}` so we will be using '/api/notes/:id'
// notes.delete('/:id', (req, res) => {
//     const noteID = req.params.id;
//      console.log(noteID);
//     //Filter out id from existing notes
// });

module.exports = notes;