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
// search for ['#', 'http://', 'https://']
let filters = {
  '#': {
    priority: 1,
    end: ['\n'],
    color: 'var(--color-comment)'
  },
  'http://': {
    priority: 2,
    end: [' ', '\n'],
    color: 'var(--color-link)'
  },
  'https://': {
    priority: 2,
    end: [' ', '\n'],
    color: 'var(--color-link)'
  },
}
let filterKeys = Object.keys(filters);


textArea.setAttribute("cols", options.columnCount);


// event listeners
textArea.oninput = function (e) {
  if (!file.modified) {
    title.innerText = '* ' + title.innerText;
    file.modified = true;
  }

  textDisplay.innerHTML = "";
  textDisplay.appendChild(textFormat(textArea.value));
}

// Functions
function textFormat(text) {

  let formatted = document.createElement('div');

  let lines = text.split("\n");

  // TODO find auto carriace return lines

  // highlight lines
  for (let line of lines) {
    // create a pre
    let pre = document.createElement('pre');
    // create a span
    let span = document.createElement('span');
    let i = 0;
    while (i < line.length) {  // for each character of the line
      if (subStartsWith(line, '#', i)) {  // if it is a comment
        // append the span
        if (span.innerText.length > 0) {
          pre.appendChild(span);
          // create a new span
          span = document.createElement('span');
        }
        span.style.color = filters['#'].color;
        while (i < line.length && !filters['#'].end.includes(line[i])) {
          // check if it is a link
          if (subStartsWith(line, 'http://', i) || subStartsWith(line, 'https://', i)) {
            // append the span
            pre.appendChild(span);
            // create a new span
            span = document.createElement('span');
            span.style.color = filters['http://'].color;
            while (i < line.length && !filters['http://'].end.includes(line[i])) {
              span.innerText += line[i];
              i++;
            }
            pre.appendChild(span);
            // create a new span
            if (i < line.length) {
              span = document.createElement('span');
              span.style.color = filters['#'].color;
            }
          } else {
            span.innerText += line[i];
            i++;
          }
        }
        if (i < line.length)
          pre.appendChild(span);
      } else {
        // check if it is a link
        if (subStartsWith(line, 'http://', i) || subStartsWith(line, 'https://', i)) {
          // append the span
          if (span.innerText.length > 0) {
            pre.appendChild(span);
            // create a new span
            span = document.createElement('span');
          }
          span.style.color = filters['http://'].color;
          while (i < line.length && !filters['http://'].end.includes(line[i])) {
            span.innerText += line[i];
            i++;
          }
          if (i < line.length) span.innerText += line[i];
          pre.appendChild(span);
          // create a new span
          if (i < line.length) {
            span = document.createElement('span');
          }
        } else {
          span.innerText += line[i];
        }
      }
      i++;
    }

    // append the last span
    span.innerText += '\n';
    pre.appendChild(span);
    // append the pre to the formatted
    formatted.appendChild(pre);
  }
  return formatted;
}

function subStartsWith(string, substring, startIndex) {
  // exclude impossible cases
  if (substring.length === 0 || string.length - startIndex < substring.length || startIndex < 0) return false;
  // check if substring is at the start of string
  for (let i = startIndex; i < string.length && i - startIndex !== substring.length; i++)
    if (string[i] !== substring[i - startIndex])
      return false;
  // return true only when all the substring was found
  return true;
}


/*********************************************************************
 * 
 * Functions usable from outside
 * 
 ********************************************************************/
window.api.getFile((event, scope) => {
  // scope is a string like 'new-file', 'save-file', ...
  file.content = textArea.value;
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
