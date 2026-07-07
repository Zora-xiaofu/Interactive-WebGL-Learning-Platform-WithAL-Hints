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
  
// synchronize steps code
function syncCodeFrom(stepSource, stepTargets) {
    stepTargets.forEach(step => {
        steps[step]["index.html"] = steps[stepSource]["index.html"];
        steps[step]["main.js"] = steps[stepSource]["main.js"];
    });
}

  // initialize step content
  const steps = {
    step1: {
        explanation: `<h3>Test Yourself</h3>
        <p><strong>Congratulations!</strong> You have completed all the steps to create a 2D Triangle through the WebGL rendering pipeline.</p>
  <p> Now, let's try the following <span style="color: #ff6b6b; font-weight: bold;">small exercises</span> to strengthen your understanding of each stage.</p>
  <p style="color: gray;"><em>Tip: You can find the answers in the previous tutorial steps or by making small modifications to the provided code.</em>
  </p>
  `,
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
    
    /*========================= GET WEBGL CONTEXT ========================= */
    var GL;
    try {
        GL = CANVAS.getContext("webgl", {antialias: true}); // turn on the Antialiasing 
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }
    
    /*========================= SHADERS ========================= */
    var shader_vertex_source=\`
    attribute vec2 position; // the position of the point
    attribute vec3 color;  // the color of the point
    varying vec3 vColor;
    void main(void) { // pre-built function
    gl_Position = vec4(position, 0., 1.); // 0. is the z, and 1 is w
    vColor = color;
    }\`;
  
    var shader_fragment_source = \`
    precision mediump float;
    varying vec3 vColor;
    void main(void) {
    gl_FragColor = vec4(vColor, 1.);// black color
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
    
    /*========================= THE TRIANGLE ========================= */
    // POINTS:
    var triangle_vertex = [
        -1, -1, // first corner (ind 0) : bottom left of the viewport
        0, 0, 1, // set first corner colour = blue
        1, -1, // (ind 1) bottom right of the viewport
        1, 1, 0, // set second corner colour = yellow
        1, 1,  // (ind 2) top right of the viewport
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
  
    /*========================= DRAWING ========================= */
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

    },
    step2: {
      explanation:`<h3>Exercise 1</h3>
      <p><strong>Question:</strong> What is the purpose of the <code>attribute</code> variable in the Vertex Shader?</p>
      <button class="exercise-hint-button" onclick="toggleHint('hint1')">Show Hint</button>
      <p></p>
      <p id="hint1" style="display:none; color: gray;">The <code>attribute</code> variable receives data from JavaScript buffers, usually vertex positions or colors.</p>`,
   
        "index.html": "",
        "main.js": ""
    },
    step3: {
      explanation: `<h3>Exercise 2</h3>
    <p><strong>Question:</strong> Why do we use Index Buffer (EBO) in the Rasterizer stage?</p>
    <button class="exercise-hint-button" onclick="toggleHint('hint2')">Show Hint</button>
    <p></p>
    <p id="hint2" style="display:none; color: gray;">The index buffer avoids duplicate vertices and reduces memory usage.</p>`,
        "index.html": "",
        "main.js": ""
    },
    step4: {
    explanation: `<h3>Exercise 3</h3>
    <p><strong>Question:</strong> What is the purpose of <code>precision mediump float;</code> in Fragment Shader?</p>
    <button class="exercise-hint-button" onclick="toggleHint('hint3')">Show Hint</button>
    <p></p>
    <p id="hint3" style="display:none; color: gray;">It sets the precision level for floating-point numbers in fragment shader calculations.</p>`,
    "index.html": "",
    "main.js": ""
    },
    step5: {
    explanation: `<h3>Exercise 4</h3>
    <p><strong>Question:</strong> Try changing the color of the three vertices to purple, green and many other colors.</p>
    <button class="exercise-hint-button" onclick="toggleHint('hint4')">Show Hint</button>
    <p></p>
    <p id="hint4" style="display:none; color: gray;">Modify the color data in the vertex buffer.</p>`,
    "index.html": "",
    "main.js": ""
    },
    step6: {
    explanation: `<h3>Exercise 5</h3>
    <p>Try modifying the positions of the triangle's three vertices and observe how the rendering result changes. For example:</p>
    <pre style="background:#f9f9f9;padding:10px;border-radius:5px;">
    var triangle_vertex = [
    -0.5, -0.5, 
    0, 0, 1, //blue
    0.5, -0.5, 
    1, 1, 0, //yellow
    0, 0.5, 
    1, 0, 0, //red
    ];
    </pre>
    <p><strong>Question:</strong> What is the valid range of vertex positions in WebGL? What happens if the position exceeds this range?</p>
    <button class="exercise-hint-button" onclick="toggleHint('hint6')">Show Hint</button>
    <p></p>
    <p id="hint6" style="display:none; color: gray;">The valid range of vertex positions in WebGL is from -1 to 1 (Normalized Device Coordinates). If the coordinates exceed this range, the vertices will be clipped and not displayed on the screen.</p>`,
    "index.html": "",
    "main.js": ""
    },
    step7: {
    explanation: `<h3>Exercise 6 (Challenge)</h3>
    <p><strong>Question:</strong> Modify the code to render a <span style="color:#ff6b6b;font-weight:bold;">pentagon</span> instead of a triangle.</p>
    <p><strong>You need to:</strong></p>
    <p>1. Add <strong>5 vertex positions</strong> and <strong>colors</strong>.</p>
    <p>2. Update the <strong>index buffer</strong> to define the faces of the pentagon.</p>
    <p>For example: <code>[0,1,2, 0,2,3, 0,3,4]</code></p>
    <button class="exercise-hint-button" onclick="toggleHint('hint7')">Show Hint</button>
    <p id="hint7" style="display:none; color: gray;">
        <strong>To render a pentagon, you need to:</strong>

        1. Define 5 vertices, each with:
            <strong>Position (x, y)</strong>: Try to arrange them evenly around a circle or as a closed shape.
            <strong>Color (r, g, b)</strong>: Assign a unique color to each vertex.

        2. Define the index buffer to split the pentagon into 3 triangles:
            Example: <code>[0,1,2, 0,2,3, 0,3,4]</code>
            This tells WebGL to connect vertices (0,1,2), (0,2,3), and (0,3,4) to form the full pentagon.
    </p>`,
    "index.html": "",
    "main.js": ""
    }  
  };
  
// synchronize steps code
window.addEventListener("DOMContentLoaded", () => {
    syncCodeFrom("step1", ["step2", "step3", "step4","step5","step6","step7"]);
    switchTab("step1"); 
});
// toggle hint function
function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    if (hint.style.display === "none") {
      hint.style.display = "block";
    } else {
      hint.style.display = "none";
    }
  }

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
