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
        explanation: "Declaring the fragment shader.\n\n"+
        "The fragment shader determines the color of each pixel in the rendered triangle.\n\n"+
        "In this step, the fragment shader outputs a solid black color (RGBA: 0, 0, 0, 1), ensuring that the rendered shape appears black.\n\n"+
        "This code snippet is inserted after declaring the vertex shader.",
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

  // Define the fragment shader
  var shader_fragment_source = \`

  precision mediump float; 
  // Set the precision of the floating point number (mediump means medium precision)

  void main(void) {
  gl_FragColor = vec4(0., 0., 0., 1.); 
  // Set the fragment color to black (RGBA: 0,0,0,1)
  //Note: vec4() requires float(floating point number), so should be 0.(float) instead of 0(int)

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

  // FACES:
  var triangle_faces = [0, 1, 2];
  var TRIANGLE_FACES = GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangle_faces),
                GL.STATIC_DRAW);
}
window.addEventListener('load', main);`
    },
    step2: {
        explanation: "We compile the fragment shader.",
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

  var shader_fragment_source = \`
  precision mediump float;
  void main(void) {
  gl_FragColor = vec4(0., 0., 0., 1.);
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

  //Compile the fragment shader
  var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
  
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

  // FACES:
  var triangle_faces = [0, 1, 2];
  var TRIANGLE_FACES = GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangle_faces),
                GL.STATIC_DRAW);
}
window.addEventListener('load', main);`
    },
    step3: {
        explanation: "In this step, we attach the compiled fragment shader to the shader program.\n\n"+
        "The fragment shader determines the final color of each pixel in the rendered triangle. It works together with the vertex shader to form a complete shader program, which will be used for rendering in WebGL.",
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

  var shader_fragment_source = \`
  precision mediump float;
  void main(void) {
  gl_FragColor = vec4(0., 0., 0., 1.); 
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
  var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
  
  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);

  // Attach the fragment shader to the shader program
  GL.attachShader(SHADER_PROGRAM, shader_fragment);
  
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

  // FACES:
  var triangle_faces = [0, 1, 2];
  var TRIANGLE_FACES = GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangle_faces),
                GL.STATIC_DRAW);
}
window.addEventListener('load', main);`
    },
    step4: {
        explanation: "Link the Shader Program and Enabling the Vertex Attribute.\n\n"+
        "In this step, we link the shader program, combining the vertex and fragment shaders into a single program that WebGL can use for rendering.\n\n"+
        "We then retrieve the location of the 'position' attribute from the vertex shader and enable it so that WebGL knows it will receive vertex data.\n\n"+
        "Finally, we activate the shader program, making it ready for use in rendering operations.\n\n\n"+
        "In creating a 2D triangle, the code segment related to the fragment processor has now completed.\n\nPlease return to the homepage and proceed to the next step.",
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

  var shader_fragment_source = \`
  precision mediump float;
  void main(void) {
  gl_FragColor = vec4(0., 0., 0., 1.);
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
  var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
  
  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  // Link the shader program 
  GL.linkProgram(SHADER_PROGRAM);
  /* The vertex and fragment shaders are now linked into a single program
   that WebGL can use for rendering. */
  // Get the location of the 'position' attribute
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  // Enable the vertex attribute array for 'position' 
  GL.enableVertexAttribArray(_position);
  // Use the linked shader program for rendering
  GL.useProgram(SHADER_PROGRAM);
  
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

  // FACES:
  var triangle_faces = [0, 1, 2];
  var TRIANGLE_FACES = GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangle_faces),
                GL.STATIC_DRAW);
}
window.addEventListener('load', main);`
    }
  };
  
// Current step and file
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


// Package adjusts CodeMirror
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

// file-tab
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

// Tab switches
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

// make sure explanation updated
explanationDiv.innerHTML = (steps[step].explanation || "No explanation available.").replace(/\n/g, "<br>");

// Set new step's content in CodeMirror
editor.setValue(steps[step][currentFile] || "");
editor.setOption("mode", modeMap[currentFile] || "javascript");
// Clear history
editor.clearHistory();

updateButtonStates();
}

// bind switch tab button 
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

// update button
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

// clear output and error console
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

  // condition for run js code
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

