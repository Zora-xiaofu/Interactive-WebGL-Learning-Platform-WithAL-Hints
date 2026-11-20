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
      explanation: "We will use WebGL to draw a 2D color triangle.\n"+
                    "First, let's create a default html structure.",
      "index.html": `<!DOCTYPE html>
<!-- Declare the HTML5 document type -->
<html>
<!-- The root element of an HTML document. All webpage content is inside this tag -->
  <head>
  <!-- The head section contains metadata, the page title, CSS styles and JavaScript references -->
    <meta charset='utf-8'/>
    <!-- Specifies the character encoding as UTF-8 -->
  </head>
  <!-- Close the head section -->
  <body style='margin: 0'>
  <!-- Body section shows the visible content of the webpage -->
  <!-- style='margin: 0' removes the default margin of the page, ensuring the content is close to the edge of the browser -->
  </body>
  <!-- Close the body section -->
</html>
<!-- Close the HTML document -->`
  },
  step2: {
      explanation: "We insert a script from the main.js file.",
      "index.html": `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'/>
    <script src="main.js"></script> <!-- insert from the main.js file -->
    <!-- Load an external JavaScript file named "main.js" -->
    <!-- The 'src' attribute specifies the file path -->
  </head>
  <body style='margin: 0'>
  </body>
</html>`,
      "main.js": `alert("hello world"); // Test if the script is working`
  },
  step3: {
      explanation: "Add a canvas and set its background color.\n\n"+
      "In this step, we will introduce an HTML5 canvas element and ensure that it covers the entire browser window.\n\n"+
      "The canvas background color is set to red, and JavaScript dynamically resizes it to match the viewport.",
      "index.html": `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'/>
    <script src="main.js"></script>
  </head>
  <body style='margin: 0'>
    <!-- Creates canvas for drawing -->
    <canvas id='your_canvas'
            style='position: absolute; background-color: red;'></canvas>
    <!-- 'id="your_canvas"' allows JavaScript to reference and manipulate the canvas -->
    <!-- The <canvas> element provides a space where we can draw graphics dynamically using JavaScript -->
    <!-- 'position: absolute' ensures the canvas stays fixed and doesn't move with surrounding elements. -->
    <!-- 'background-color: red' sets the initial background color to red -->
  </body>
</html>`,
      "main.js": `// This function runs when the page loads and initializes the canvas
function main() {
  var CANVAS = document.getElementById("your_canvas"); // Retrieve the <canvas> element using its ID
  //Set the canvas width and height to match the browser window size
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
}
window.addEventListener('load', main); //Call the main function after this page loaded`
  },
  step4: {
    explanation: "We create a WebGL context on the HTML5 canvas to enable 3D graphics rendering.\n\n"+
    "In JavaScript, the CANVAS supports two drawing methods:\n"+
    "1. Canvas 2D API (getContext('2d')) -- for simple 2D drawing\n"+
    "2. WebGL API (getContext('webgl')) -- for 3D drawing\n\n"+
    "Tips:\n"+
    "Only one drawing mode can be selected for a CANVAS, so 2D and WebGL cannot be used at the same time.\n"+
    "Once a WebGL context (getContext('webgl')) has been bound, it cannot be switched to 2D or another context.\n\n"+
    "Here, we have selected 'webgl', so the CANVAS can only be used for WebGL drawing",
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
    "main.js": `function main() {
  var CANVAS = document.getElementById("your_canvas");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
  /*========================= GET WEBGL CONTEXT ========================= */
  var GL;
  try {
    GL = CANVAS.getContext("webgl", {antialias: false});
    //"webgl" means use the WebGL API for 3D rendering
  } catch (e) {
    //If the browser does not support WebGL, the code triggers the catch statement
    alert("WebGL context cannot be initialized");
    return false;
  }
}
window.addEventListener('load', main);`
  },
  step5: {
  explanation: "We define the vertex shader written in GLSL.\n\n"+
  "The vertex shader is responsible for transforming vertex positions into WebGL's clipping space (-1 to 1).",
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
  "main.js": `function main() {
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

  /*========================= SHADERS ========================= */
  // Declare the vertex shader written in GLSL
  var shader_vertex_source = \`

  attribute vec2 position; // Define the variable 'position', which represents the 2D coordinates (x, y) of the vertex

  void main(void) {

    gl_Position = vec4(position, 0.0, 1.0);
    /* Convert 2D vertex coordinates to 4D homogeneous coordinates and assign to 'gl_Position'
       position.xy -> x, y coordinates (input 2D vertex)
       0.0 -> z coordinate, default is 0.0 (no z value is needed for 2D)
       1.0 -> w component, kept at 1.0 to ensure correct projection (transformations of homogeneous coordinates)
       Map 2D coordinates to the clipping space of WebGL (-1 ~ 1) */

  }\`;
}
window.addEventListener('load', main);
`
  },
  step6: {
  explanation: "Compile the vertex shader",
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
  "main.js": `function main() {
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

  // Function for compile the shader
  var compile_shader = function(source, type, typeString) {
    var shader = GL.createShader(type); // Create a new shader object based on the given type (GL.VERTEX_SHADER or GL.FRAGMENT_SHADER)
    GL.shaderSource(shader, source); // Attach the source code (GLSL) to the shader object
    GL.compileShader(shader); // Compile the shader source code
    //Check whether the shader compiles successfully
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };
  // vertex shader compilation
  var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
}
window.addEventListener('load', main);`
  },
  step7: {
  explanation: "Creating a WebGL Shader Program and Attaching the Vertex Shader.\n\n"+
  "In this step, we create a WebGL shader program to store and manage shaders, then attach vertex shader to this program.\n\n"+
  "Tips:\n"+
  "A shader program requires both the vertex shader and the fragment shader before it can be used for rendering.\n\n\n"+
  "In creating a colored 2D triangle, the code segment related to the vertex processor has now completed.\n\nPlease return to the homepage and proceed to the next step.",
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
  "main.js": `function main() {
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

  // Create a WebGL program object to store shaders
  var SHADER_PROGRAM = GL.createProgram();
  // Attach the vertex shader to the shader program
  GL.attachShader(SHADER_PROGRAM, shader_vertex);

}
window.addEventListener('load', main);`
  }
};

// current step and file
let currentStep = "step1";
let currentFile = "index.html";

// code mode mapping
const modeMap = {
  "index.html": "htmlmixed",
  "main.js": "javascript",
  "style.css": "css",
};

// initialize CodeMirror
const editor = CodeMirror(document.getElementById("code-editor"), {
  mode: modeMap[currentFile] || "javascript",
  lineNumbers: true,
  theme: "default", 
  value: steps[currentStep][currentFile] || "",
});

// resize codemirror
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

// file tab button
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

// update button states
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