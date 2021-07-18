var ncontent = document.getElementById("notes_content");
var selection;
var Notes = [];

function highlighter() {
  selection = window.getSelection().toString().trim();

  if (selection == "") {
    toggleNotes("hide");
    return;
  }

  ncontent.textContent = selection;

  toggleNotes("show");
}

function interact() {
  let possibleInteractions = [];

  for (let key in pageInteractions) {
    let k = key.split("/");

    for (let i in k) {
      if (selection.includes(k[i])) {
        possibleInteractions.push(key);
        break;
      }
    }
  }

  let message = "";

  if (possibleInteractions.length > 1) {
    message = "you gotta be a bit more precise.";
  } else if (possibleInteractions.length == 1) {
    pageInteractions[possibleInteractions[0]]();
  } else {
    message = "unfortunately, there's nothing you can do about this.";
  }

  if (message != "") {
    let span = document.createElement("span");
    span.className = "message";
    span.textContent = message;
    span.onclick = function() { this.remove() };
    setInterval(function() {
      span.remove();
    }, 5000);
    bookmarks.appendChild(span);
  }

  toggleNotes("hide");
}

function compare() {
  // compare mode

  toggleNotes("hide");
}

function note() {
  for (let i in Notes) {
    let note = Notes[i];
    if (
      note.content == selection &&
      note.root == _history.cursor
    ) {
      toggleNotes("hide");
      return;
    }
  }

  Notes.push({
    content: selection,
    root: _history.cursor
  });
  toggleNotes("hide");

  if (Notes.length > v.notesLimit) {
    bookmarks.firstElementChild.remove();
  }

  let bookmark = document.createElement("span");
  bookmark.name = _history.cursor;
  bookmark.onclick = function() {
    pagination(this.name - _history.cursor)
  };
  bookmark.textContent = selection;
  bookmark.className = "onpage";
  bookmarks.appendChild(bookmark);
}

function toggleNotes(p) {
  if (p == "hide") {
    notes.classList.add("hidden");
  } else if (p == "show") {
    notes.classList.remove("hidden");
    let s = window.getSelection();
    let range = s.getRangeAt(0); //get the text range
    let rect = range.getBoundingClientRect();
    notes.style.left = rect.left + rect.width/2 + "px";
    notes.style.top = rect.top + rect.height + "px";
  } else {
    if (notes.classList.contains("hidden")) {
      notes.classList.remove("hidden");
    } else {
      notes.classList.add("hidden");
    }
  }
}