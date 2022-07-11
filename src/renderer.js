// Options will be from outside
const options = {
  tab: 4,
  columnCount: 70,
}


/*********************************************************************
 * 
 * Text Area
 * 
 ********************************************************************/

// elements
const title = document.querySelector('title');
const textArea = document.getElementById('textarea');
const textDisplay = document.getElementById('textdisplay');

let file = window.api.newFile();


textArea.setAttribute("cols", options.columnCount);


// event listeners
textArea.oninput = function (e) {
  file.content = textArea.value;
  if (!file.modified) {
    title.innerText = '* ' + title.innerText;
    file.modified = true;
  }

  textDisplay.innerHTML = "";
  textDisplay.appendChild(textFormat(file.content));
}

// Functions
function textFormat(text) {
  let formatted = document.createElement('div');

  let lines = text.split("\n");
  for (let line of lines) {
    let lineDisplay = document.createElement('pre');

    // coloring
    if (line.startsWith("#")) {
      lineDisplay.style.color = "var(--color-comment)";
    }

    // auto new line
    lineDisplay.innerHTML = line;

    // add changes
    formatted.appendChild(lineDisplay);
  }
  return formatted;
}


/*********************************************************************
 * 
 * Functions usable from outside
 * 
 ********************************************************************/
window.api.getFile((event, scope) => {
  // scope is a string like 'new-file', 'save-file', ...
  event.sender.send(scope, file);
});

window.api.setFile((event, _file) => {
  file = _file;
  file.modified = false;

  let fileName = file.filePath ?
    file.filePath.substr(Math.max(file.filePath.lastIndexOf('/'), file.filePath.lastIndexOf('\\')) + 1, file.filePath.length) :
    'Untitled';
  title.innerText = fileName;
  textArea.value = file.content;
});
