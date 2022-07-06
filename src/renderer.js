// Options will be from outside
const options = {
    "tab": 4,
}


/***********************************************************
 * 
 * Text Area
 * 
 */

// elements
const textArea = document.getElementById('textarea');
const textDisplay = document.getElementById('textdisplay');
let text = "";


// event listeners
textArea.oninput = function(e) {
    textDisplay.innerHTML = "";

    let lines = textArea.value.split("\n");
    for (let line of lines) {
        let lineDisplay = document.createElement('pre');

        // coloring
        if (line.startsWith("#")) {
            lineDisplay.style.color = "var(--color-comment)";
        }

        // add changes
        lineDisplay.innerText = line + '\n';
        textDisplay.appendChild(lineDisplay);
    }
}
