// fetch navbar
function loadNavbar() {
    fetch('./navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => {
            console.error('There was a problem loading the navbar:', error);
        });
  }
  
  loadNavbar();
  
  // initialize step content
  const steps = {
    step1: {
        explanation: "Declare the triangle vertex array and create a vertex buffer object (VBO)\n\n"+
        "In this step, we define the triangle's vertex positions and store them in a VBO (Vertex Buffer Object).\n\n"+
        "VBO is a typed array stored in the GPU's memory, which improves rendering and WebGL performance. We initialise it using JavaScript Typed Array (Float32Array) and transfer the data to WebGL.\n\n"+
        "The vertex coordinates of the triangles are in NDC (Normalised Device Coordinates), which range from -1 to 1 and are used for WebGL clipping space.\n"+
        "(-1, 1) -> top left corner\n"+
        "(-1, -1) -> bottom left corner\n"+
        "(1, -1) -> bottom right corner\n"+
        "(1, 1) -> top right corner\n"+
        "(0, 0) -> screen centre\n\n"+
        "This buffer will be used in future steps to render the triangles.",
        "index.html": `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'/>
    <script src="main.js"></script>
  </head>
  <body style='margin: 0'>
    <canvas id='your_canvas'
            style='position: absolute; background-color: red;'></canvas>
  </body>
</html>`,
        "main.js":`function main() {
  var CANVAS = document.getElementById("your_canvas");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  var GL;
  try {
      GL = CANVAS.getContext("webgl", {antialias: false});
  } catch (e) {
      alert("WebGL context cannot be initialized");
      return false;
  }
  
  var shader_vertex_source=\`
  attribute vec2 position;
  void main(void) { 
  gl_Position = vec4(position, 0., 1.); 
  }\`;
  
  var compile_shader = function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
    alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
    return false;
    }
    return shader;
  };
  var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  
  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  
  /*========================= THE TRIANGLE ========================= */
  // Define the vertex positions of a triangle
  // POINTS:
  var triangle_vertex = [
      -1, -1, // first corner (index 0) : bottom left of the viewport
      1, -1,  // second corner (index 1): bottom right of the viewport
      1, 1,   // third corner (index 2): top right of the viewport
  ];

  var TRIANGLE_VERTEX = GL.createBuffer (); // Create a new buffer object to store the triangle's vertex data
  GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX); //Bind (Activate) this buffer

  GL.bufferData(GL.ARRAY_BUFFER,
  new Float32Array(triangle_vertex),
  GL.STATIC_DRAW);
  // Transfer the triangle vertex data to the buffer, specifying the usage mode as GL.STATIC_DRAW
  // GL.STATIC_DRAW means the data will not change frequently

}
window.addEventListener('load', main);`
    },
    step2: {
        explanation: "Declare the index array for the triangle and create the index buffer (EBO).\n\n"+
        "In this step, we define the index array for the triangle and store it in the index buffer (EBO).\n\n"+
        "The index array (also called the faces array) specifies how the vertices are connected to form the triangle, avoiding redundant vertex definitions. Using an index buffer reduces memory usage and improves rendering efficiency. The index data is converted to a Uint16Array and uploaded to WebGL for indexed rendering.\n\n\n"+
        "In creating a 2D triangle, the code segment related to the rasterizer has now completed.\n\nPlease return to the homepage and proceed to the next step.",
        "index.html": `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'/>
    <script src="main.js"></script>
  </head>
  <body style='margin: 0'>
    <canvas id='your_canvas'
            style='position: absolute; background-color: red;'></canvas>
  </body>
</html>`,
        "main.js":`function main() {
  var CANVAS = document.getElementById("your_canvas");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
  
  var GL;
  try {
      GL = CANVAS.getContext("webgl", {antialias: false});
  } catch (e) {
      alert("WebGL context cannot be initialized");
      return false;
  }
  
  var shader_vertex_source=\`
  attribute vec2 position;
  void main(void) { 
  gl_Position = vec4(position, 0., 1.);
  }\`;
  
  var compile_shader = function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
    alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
    return false;
    }
    return shader;
  };
  var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  
  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  
  // POINTS:
  var triangle_vertex = [
      -1, -1,
      1, -1,
      1, 1,
  ];

  var TRIANGLE_VERTEX = GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER,
  new Float32Array(triangle_vertex),
  GL.STATIC_DRAW);

  // FACES(Indices for the triangle):
  var triangle_faces = [0, 1, 2];
  /* Define the index array of the triangle, each number represents the index of a vertex
     0 -> the first vertex (bottom left) in the triangle_vertex array
     1 -> the second vertex (bottom right) in the triangle_vertex array
     2 -> the third vertex (top right) in the triangle_vertex array */
  var TRIANGLE_FACES = GL.createBuffer (); // Create a new buffer to store the triangle's indices

  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES); //Bind (Activate) this buffer
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangle_faces),
                GL.STATIC_DRAW);
  /* Transmits the indexed data to the GPU and specifies the usage mode as GL.STATIC_DRAW
     GL.ELEMENT_ARRAY_BUFFER indicates that the current operation is on the index buffer (EBO)
     Uint16Array is used to store unsigned 16-bit integer indices
     GL.STATIC_DRAW indicates that the data will not be modified frequently */

}
window.addEventListener('load', main);`
    }
  };
  
// current step and file
let currentStep = "step1";
let currentFile = "index.html";

// code mode map
const modeMap = {
  "index.html": "htmlmixed",
  "main.js": "javascript",
  "style.css": "css",
};

// Initialize CodeMirror
const editor = CodeMirror(document.getElementById("code-editor"), {
  mode: modeMap[currentFile] || "javascript",
  lineNumbers: true,
  theme: "default", 
  value: steps[currentStep][currentFile] || "",
});

// Resize codemirror
function resizeEditor() {
if (editor) {
    setTimeout(() => {
        editor.setSize("100%", "100%");
        editor.refresh();
    }, 50);
}
}

// Adjust the CodeMirror to ensure that it fits the window size
window.addEventListener("DOMContentLoaded", resizeEditor);
window.addEventListener("resize", resizeEditor);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
      resizeEditor();
  }
});

// File switch button
const fileButtons = document.querySelectorAll(".file-tab");
fileButtons.forEach(button => {
button.addEventListener("click", () => {

  steps[currentStep][currentFile] = editor.getValue();

  currentFile = button.dataset.file;
  fileButtons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");

  editor.setValue(steps[currentStep][currentFile] || "");
  editor.setOption("mode", modeMap[currentFile] || "javascript");
  editor.refresh();

  editor.clearHistory();
});
});

// Tab switch logic
const explanationDiv = document.getElementById("explanation");
const tabButtons = document.querySelectorAll(".tab-button");

window.addEventListener("DOMContentLoaded", () => {
  switchTab("step1");
});

function switchTab(step) {

steps[currentStep][currentFile] = editor.getValue();

currentStep = step;
tabButtons.forEach(btn => btn.classList.remove("active"));

const activeButton = document.querySelector(`.tab-button[data-step="${step}"]`);
if (activeButton) {
  activeButton.classList.add("active");
}

// ensure explanation updated
explanationDiv.innerHTML = (steps[step].explanation || "No explanation available.").replace(/\n/g, "<br>");

// Set new step's content in CodeMirror
editor.setValue(steps[step][currentFile] || "");
editor.setOption("mode", modeMap[currentFile] || "javascript");
// Clear history
editor.clearHistory();

// Update button states
updateButtonStates();
}

// bind step switch button
tabButtons.forEach(button => {
button.addEventListener("click", () => {
  const step = button.dataset.step;
  switchTab(step);
});
});

// Prev button
function prevTab() {
const currentIndex = parseInt(currentStep.replace("step", ""));
if (currentIndex > 1) {
  switchTab(`step${currentIndex - 1}`);
}
}

// Next button
function nextTab() {
const currentIndex = parseInt(currentStep.replace("step", ""));
if (currentIndex < Object.keys(steps).length) {
  switchTab(`step${currentIndex + 1}`);
}
}

// Update button states
function updateButtonStates() {
const currentIndex = parseInt(currentStep.replace("step", ""));
document.querySelector('.Prev-Next[onclick="prevTab()"]').disabled = currentIndex === 1;
document.querySelector('.Prev-Next[onclick="nextTab()"]').disabled = currentIndex === Object.keys(steps).length;
}

// Run button
document.getElementById("run").addEventListener("click", () => {

steps[currentStep][currentFile] = editor.getValue();

const htmlCode = steps[currentStep]["index.html"];
const jsCode = steps[currentStep]["main.js"];

const outputDiv = document.getElementById("output");
outputDiv.innerHTML = "";
const consoleDiv = document.getElementById("console");
consoleDiv.textContent = "";

const jsBlob = new Blob([jsCode], { type: "application/javascript" });
const jsBlobUrl = URL.createObjectURL(jsBlob);

const modifiedHtml = htmlCode.replace(
  /<script\b[^>]*?\bsrc=["']main\.js["'][^>]*?>\s*<\/script>/gi,
  `<script src="${jsBlobUrl}"></script>`
);

const htmlBlob = new Blob([modifiedHtml], { type: "text/html" });
const htmlBlobUrl = URL.createObjectURL(htmlBlob);

const iframe = document.createElement("iframe");
outputDiv.appendChild(iframe);
iframe.src = htmlBlobUrl;

iframe.onload = () => {
  const iframeWindow = iframe.contentWindow;
  const iframeDocument = iframeWindow.document;

  // catch console.log
  iframeWindow.console.log = function (...args) {
    let logMessage = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg) : arg)).join(" ");
    consoleDiv.textContent += `[Log] ${logMessage}\n`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    console.info("[Log]", ...args);
  };

  // catch console.error
  iframeWindow.console.error = function (...args) {
    let errorMessage = args.map(arg => {
        if (arg instanceof Error) {
            return `${arg.name}: ${arg.message}\nStackTrace: ${arg.stack}`;
        }
        return typeof arg === "object" ? JSON.stringify(arg) : arg;
    }).join(" ");

    consoleDiv.textContent += `[Error] ${errorMessage}\n`;
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    console.error("[Error]", ...args);
  };

  // catch window.onerror
  iframeWindow.onerror = function (message, source, lineno, colno, error) {
    let errorMessage = `[Error] ${message} at ${source}:${lineno}:${colno}`;
    if (error && error.stack) {
        errorMessage += `\nStackTrace: ${error.stack}`;
    }
    consoleDiv.textContent += errorMessage + "\n";
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    console.error("[Global Error]", errorMessage);
  };

  // catch Promise error
  iframeWindow.addEventListener("unhandledrejection", event => {
      let errorMessage = `[Unhandled Promise Rejection] ${event.reason}`;
      if (event.reason instanceof Error) {
          errorMessage += `\nStackTrace: ${event.reason.stack}`;
      }
      consoleDiv.textContent += errorMessage + "\n";
      consoleDiv.scrollTop = consoleDiv.scrollHeight;
      console.error("[Unhandled Promise Rejection]", event.reason);
  });

  // catch script error
  iframeWindow.addEventListener("error", event => {
    if (event.target.tagName === "SCRIPT") {
        consoleDiv.textContent += `[Script Error] ${event.message} at ${event.filename}:${event.lineno}:${event.colno}\n`;
    }
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
  }, true);

  // condition to run js code
  if (jsCode.trim() !== "") {
      try {
          iframeWindow.eval(jsCode);
      } catch (e) {
          consoleDiv.textContent += `[Eval Error] ${e.name}: ${e.message}\nStackTrace: ${e.stack}\n`;
          consoleDiv.scrollTop = consoleDiv.scrollHeight;
          console.error(`[Eval Error] ${e.name}: ${e.message}`, e.stack);
      }
  }
};
});

// Clear button
document.querySelector(".clean").addEventListener("click", () => {
const outputDiv = document.getElementById("output");
const consoleDiv = document.getElementById("console");
outputDiv.innerHTML = "Output result...";
consoleDiv.textContent = "Error console...";
});
