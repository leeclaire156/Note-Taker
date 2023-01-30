const notes = require('express').Router(); //allows for routes/index.js to redirect path to this file for API-based routes
const fs = require('fs'); //Helps to read/write/append to files
const path = require('path'); //Used to join file path of db.json in savedNotesRoute constant
const savedNotesRoute = path.join(__dirname, '../db/db.json');

// Create GET route to read and show the data on one of the notes
notes.get('/', (req, res) => {
    res.sendFile(savedNotesRoute);
});

// Create POST route to create new data from the active note and add it to rendered notes list on Notes HTML page
notes.post('/', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the title and text properties are present a new note is made with its contents plus a unique id and the db.json file will be read
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
                // New constant to parse existing db.json note data, converting a JSON string into JSON object for data manipulation.
                const parsedNote = JSON.parse(data);

                // Add a new note object from line 18 to the array of objects we call parsedNotes
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

// DELETE Route to delete the data from notes - - note that line 47 of index.js has a path called `api/notes/${id}` so we will be using '/api/notes/:id'
notes.delete('/:id', (req, res) => {
    //When clicking on a delete trash can, it's respective id is going to be console.logged
    const noteID = req.params.id;
    console.log(noteID);
    //Filter out id from existing notes
    fs.readFile(savedNotesRoute, 'utf8', (error, data) => {
        if (error) {
            console.error(error);
        } else {
            // Parsing existing db.json note data, converting a JSON string into JSON object for data manipulation. parsedNote serves as an array of our notes.
            const parsedNote = JSON.parse(data);

            function removeNoteWithID(parsedNote, id) {
                return parsedNote.filter((obj) => obj.id != id); //Any note that doesn't match the noteID click on gets filtered out.
            }

            const newNotesList = removeNoteWithID(parsedNote, noteID); //A new notes list with the filtered out notes is made and will be written on line 86

            // Updated file goes back to db.json file
            fs.writeFile(savedNotesRoute, JSON.stringify(newNotesList, null, 4), //convert array into string bc any JSON that is saved needs to be a string (same rules applied for local storage). null and 4 is for formatting so that its the staggered look.
                (writeError) =>
                    writeError
                        ? console.error(writeError)
                        : console.info('Successfully updated notes!')
            );

        }
    })
    res.sendFile(savedNotesRoute);
});

module.exports = notes;