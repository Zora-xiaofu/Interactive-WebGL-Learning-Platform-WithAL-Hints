// Fetch navbar
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
        explanation: "Setting up the rendering loop.\n\nIn this step, we define the rendering function and launch it.",
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

  GL.linkProgram(SHADER_PROGRAM);
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  GL.enableVertexAttribArray(_position);
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

  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0); // clear the color
  /* The format is RGBA (Red, Green, Blue, Alpha).
    Here, (0.0, 0.0, 0.0, 0.0) means a transparent black background. */

  var animate = function() {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height); // Set the viewport to match the canvas size
    GL.clear(GL.COLOR_BUFFER_BIT); // Clear the color buffer before rendering

    // [ Place the drawing code here... ]

    GL.flush(); // Ensure that all WebGL commands are executed

    window.requestAnimationFrame(animate); 
    /* Calls the animate function again before the next screen refresh.
       Creates a loop for continuous rendering */
  };
  animate(); // Start the rendering loop

}
window.addEventListener('load', main);`
    },
    step2: {
      explanation: "Binding buffers and rendering the triangle.\n\nIn this step, we complete the rendering process by binding the vertex buffer (VBO) and index buffer (EBO) before drawing the triangle.\n\nFirst, we bind the vertex buffer and define how WebGL should interpret vertex data using 'vertexAttribPointer'. Next, we bind the index buffer, which stores vertex indices to efficiently connect vertices into a triangle. Finally, we call 'drawElements' to render the triangle using indexed drawing.\n\n Now! You can click the 'RUN' button and see the rendered triangle",
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

  GL.linkProgram(SHADER_PROGRAM);
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  GL.enableVertexAttribArray(_position);
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

  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  var animate = function() {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT);

    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX); // Bind the vertex buffer(VBO) to the ARRAY_BUFFER target
    GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4*2, 0); // Specify the data format and location
    /* Defines how vertex data is read from the buffer:
       _position: Attribute location in the vertex shader.
       2: Each vertex consists of 2 floating-point numbers (x, y).
       GL.FLOAT: The data type of each component is a 32-bit float.
       false: Do not normalize values.
       4*2: Stride (bytes per vertex) = 2 floats * 4 bytes per float.
       0: Offset in the buffer where the first vertex starts. */

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES); // Bind the index buffer (EBO) containing the triangle's face indices
    GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0); // Draw the triangle using indexed drawing
    /* Draw the triangle:
       GL.TRIANGLES: Interprets the indices as triangles.
       3: Number of indices to use (3 vertices form 1 triangle).
       GL.UNSIGNED_SHORT: Specifies that each index is a 16-bit unsigned integer.
       0: Offset in the element array buffer (EBO). */

    GL.flush();
    window.requestAnimationFrame(animate);
  };
  animate();
}
window.addEventListener('load', main);`
    },
    step3: {
      explanation: "Adding color to the triangle.\n\nIn this step, we modify the vertex and fragment shaders to support per-vertex colors. We introduce a new attribute 'color' in the vertex shader and pass it to the fragment shader using 'varying vColor'. In the fragment shader, we use this value to determine the final color of each pixel.\n\nWe also update the vertex buffer to store RGB color values alongside vertex positions. Using 'vertexAttribPointer', we specify how WebGL should read both position and color data from the buffer.\n\nAdditionally, we reset the canvas background color to white to improve contrast, making the colored triangle more visible.\n\nClick 'RUN' button to see the new rendered triangle!",
        "index.html": `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'/>
    <script src="main.js"></script>
  </head>
  <body style='margin: 0'>
    <canvas id='your_canvas'
            style='position: absolute; background-color: white;'></canvas>
    <!-- Reset the canvas background color to white to clearly see the rendered triangle details -->
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
  // adding new code for color attribute
  var shader_vertex_source=\`
  attribute vec2 position;

  attribute vec3 color; // add RGB color attribute
  varying vec3 vColor; // Pass color to fragment shader

  void main(void) { 
  gl_Position = vec4(position, 0., 1.);

  vColor = color; // Pass color value to the fragment shader

  }\`;

  // adding new code for determine the final color of each pixel
  var shader_fragment_source = \`
  precision mediump float;

  varying vec3 vColor; // Receive color from vertex shader

  void main(void) {

  gl_FragColor = vec4(vColor, 1.); // Output the color with full opacity

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
  GL.linkProgram(SHADER_PROGRAM);

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color"); // Get attribute locations for color
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

  GL.enableVertexAttribArray(_color); // Enable attributes so WebGL knows they will receive data
  GL.enableVertexAttribArray(_position);

  GL.useProgram(SHADER_PROGRAM);
  
  // POINTS:
  var triangle_vertex = [
      -1, -1, 
      0, 0, 1, // set first corner colour = blue
      1, -1, 
      1, 1, 0, // set second corner colour = yellow
      1, 1, 
      1, 0, 0, // set third corner colour = red
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

  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  var animate = function() {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT);
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);

    // Tell WebGL how to interpret the vertex position data
    GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4*(2+3), 0);
    /* Parameters:
       _position: Attribute location in the vertex shader.
       2: Each vertex consists of 2 floats (x, y).
       GL.FLOAT: The data type of each component (32-bit float).
       false: Do not normalize values.
       4 * (2+3): Stride (bytes per vertex) = (2 position + 3 color) * 4 bytes per float.
       0: Offset in the buffer where the first vertex starts. */

    // Tell WebGL how to interpret the vertex color data
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(2+3), 2*4);
    /* Parameters:
       _color: Attribute location in the vertex shader.
       3: Each vertex color consists of 3 floats (r, g, b).
       GL.FLOAT: The data type of each component (32-bit float).
       false: Do not normalize values.
       4 * (2+3): Stride (bytes per vertex) = (2 position + 3 color) * 4 bytes per float.
       2 * 4: Offset (bytes) where color data starts (after position data). */

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
    GL.flush();
    window.requestAnimationFrame(animate);
  };
  animate();
}
window.addEventListener('load', main);`
    },
    step4: {
      explanation: "Enabling Antialiasing for Smoother Rendering.\n\nIn this step, we enable antialiasing by passing the option `{antialias: true}` when creating the WebGL context.  Antialiasing helps smooth out jagged edges along the triangle's borders by blending colors at pixel boundaries.\n\nThis effect is particularly noticeable along diagonal edges. By turning on antialiasing, WebGL applies multisampling to improve visual quality.\n\n Run the program again and observe the difference, especially at the diagonal edges of the triangle!\n\n"+
      "This marks the END of output merging.\n\n Please return to the homepage and proceed to the final step.",

        "index.html": `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'/>
    <script src="main.js"></script>
  </head>
  <body style='margin: 0'>
    <canvas id='your_canvas'
            style='position: absolute; background-color: white;'></canvas>
  </body>
</html>`,
        "main.js":`function main() {
  var CANVAS = document.getElementById("your_canvas");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
  
  var GL;
  try {
      GL = CANVAS.getContext("webgl", {antialias: true}); // turn on the Antialiasing 
  } catch (e) {
      alert("WebGL context cannot be initialized");
      return false;
  }

  var shader_vertex_source=\`
  attribute vec2 position;
  attribute vec3 color;
  varying vec3 vColor;
  void main(void) { 
  gl_Position = vec4(position, 0., 1.); 
  vColor = color;
  }\`;

  var shader_fragment_source = \`
  precision mediump float;
  varying vec3 vColor;
  void main(void) {
  gl_FragColor = vec4(vColor, 1.);
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

  GL.linkProgram(SHADER_PROGRAM);

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);

  GL.useProgram(SHADER_PROGRAM);
  
  // POINTS:
  var triangle_vertex = [
      -1, -1, 
      0, 0, 1,
      1, -1, 
      1, 1, 0, 
      1, 1,
      1, 0, 0,
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

  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  var animate = function() {

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT);

    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);

    GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4*(2+3), 0);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(2+3), 2*4);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

    GL.flush();

    window.requestAnimationFrame(animate);
  };
  animate();
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

//Adjust the CodeMirror to ensure that it fits the window size
window.addEventListener("DOMContentLoaded", resizeEditor);
window.addEventListener("resize", resizeEditor);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
      resizeEditor();
  }
});

// file tab
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

// Tab switch
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

// bind tab switch button
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
