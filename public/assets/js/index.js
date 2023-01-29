let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

//window.location.pathname returns the path and filename of the current page, comes after domain (and after the port but before the query string separator + parameters if theyre in the URL) 
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline'; //HTML DOM manipulation to style display
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea - This is for the body of the note, not the title which is in an input class
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET', // Route to reading data with GET method
    headers: {
      'Content-Type': 'application/json', // Tells us what type of data to expect/how to interpret it
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST', // Route to creating data (by saving) with POST method
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note), // Have to stringify data before we can save it
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE', // Route to delete notes
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn); // Disables ability to save the note, since we saved it already? Does this mean we can't edit saved notes???

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title; // This allows us to view the title of the selected saved note
    noteText.value = activeNote.text; // This allows us to view the contents of the selected save note
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = ''; // This is so that deleted  or nonactive notes aren't displaying as well and overlapping.
    noteText.value = ''; // This is so that deleted or nonactive notes aren't displaying as well and overlapping.
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes(); // Line 175
    renderActiveNote(); // Line 54
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked - stops chain reaction
  e.stopPropagation();

  const note = e.target; //This returns the type of element that was involved in the (in this case, click) event - in other words, it returns the note that was clicked on
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {}; // ??? Sets active note to empty object?
  }

  deleteNote(noteId).then(() => { // Line 46 - route to delete note in JSON via the noteID
    getAndRenderNotes(); // Line 175
    renderActiveNote(); // Line 54
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote(); // Line 54
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {}; // A new note should be blank
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) { // The trim() method removes whitespace from both ends of a string and returns a new string, without modifying the original string.
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles that will appear on the left hand side with red trash icons for deletion
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView); // When users click on the note, it triggers the functions needed to view it (see line 100)

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete); //The 'click' is the event that gets passed into the handleNoteDelete(e) function to execute that function's code

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
