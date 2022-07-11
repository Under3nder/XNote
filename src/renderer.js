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
const textArea = document.getElementById('textarea');
const textDisplay = document.getElementById('textdisplay');

let file = new File();


textArea.setAttribute("cols", options.columnCount);


// event listeners
textArea.oninput = function(e) {
    file.content = textArea.value;
    file.modified = true;

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
        // TODO remake this
        lineDisplay.innerHTML = line;
        /*if (line.length - 1 > options.columnCount) {
            let words = line.split(" ");
            let lineText = "";
            for (let word of words) {
                if (lineText.length + word.length + 1 > options.columnCount) {
                    if (word.length < options.columnCount) {
                        lineDisplay.innerHTML += lineText + "\n";
                        lineText = "";
                    } else {
                        lineDisplay.innerHTML += word.substr(0, options.columnCount + 1) + "\n";
                        word = word.substr(options.columnCount + 1, word.length);
                        lineText = "";
                    }
                }
                lineText += word + " ";
            }
            lineDisplay.innerHTML += lineText;
        } else {
            lineDisplay.innerHTML = line + "\n";
        }*/

        // add changes
        //lineDisplay.innerText = line + '\n';
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
    textArea.value = file.content;
});
