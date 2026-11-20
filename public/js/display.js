// load navbar
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
  
  // Initialization step content
  const steps = {
    step1: {
      explanation: "All done!\n\n"+"This is the correct full code.\n\n"+"Feel free to delete it and try writing it yourself!\n\n"+
      "Need a hint?\n"+"Click the [HINT] button above to receive helpful guidance.\n\n"+
      "! IMPORTANT:\n"+
      "Make sure to click the [RUN] button first to ensure GPT reads your latest code version.\n\n"+
      "Scoring system:\n"+"Each hint costs 10 points, with a minimum score of 0.\n"+
      "You only have 10 hints —if your code still doesn't work after using them all, try refreshing the page to view the correct full code.\n\n"+
      "Try it and see how far you can go on your own!",
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
    }
  };
  
// Current steps and files
let currentStep = "step1";
let currentFile = "index.html"; 

// modemap
const modeMap = {
  "index.html": "htmlmixed",
  "main.js": "javascript",
  "style.css": "css",
};

// initialized CodeMirror
const editor = CodeMirror(document.getElementById("code-editor"), {
  mode: modeMap[currentFile] || "javascript",
  lineNumbers: true,
  theme: "default",
  value: steps[currentStep][currentFile] || "",
});

// function for resize the code mirror
function resizeEditor() {
  if (editor) {
      setTimeout(() => {
          editor.setSize("100%", "100%");
          editor.refresh();
      }, 50);
  }
}

//Adjust CodeMirror to ensure that the window suitable
window.addEventListener("DOMContentLoaded", resizeEditor);
window.addEventListener("resize", resizeEditor);
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        resizeEditor();
    }
});

const explanationDiv = document.getElementById("explanation");
window.addEventListener("DOMContentLoaded", () => {
  if (explanationDiv) {
      explanationDiv.innerHTML = steps["step1"].explanation.replace(/\n/g, "<br>");
  } else {
      console.error("Error: #explanation div not found.");
  }
});

// File-tab 
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

// run button
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

// clear button
document.querySelector(".clean").addEventListener("click", () => {
  const outputDiv = document.getElementById("output");
  const consoleDiv = document.getElementById("console");
  outputDiv.innerHTML = "Output result...";
  consoleDiv.textContent = "Error console...";
});

// Score 
window.addEventListener("DOMContentLoaded", () => {

  let score = 100;
  const scoreElement = document.getElementById("score-value");

  document.querySelector(".hint").addEventListener("click", () => {
      if (score > 0) {
          score -= 10;
          if (score < 0) score = 0;
          scoreElement.textContent = score;
      }
  });
});

// Count variables to record the number of times the Hint button is clicked
let hintClickCount = 0;

// Predefined explanation text (the first two clicks not call GPT)
const hintMessages = [
    `WebGL Rendering Pipeline Explanation

The rendering process of WebGL mainly consists of the following stages: Vertex Processing -> Rasterization -> Fragment Processing -> Output Merging -> Displaying.

1. Vertex Processing (Vertex Processor)
This stage processes raw vertex data (Raw Vertices & Primitives), including position, color, normals, and other attributes.
It is controlled by the Vertex Shader, which can perform coordinate transformations, lighting calculations, and color computations.
Example: In WebGL, you can define a vertex position using attribute vec2 position; and transform it in the shader.

2. Rasterization (Rasterizer)
This stage converts 3D coordinates into 2D pixel coordinates and determines which pixels need to be filled.
It is responsible for breaking geometric primitives (such as triangles) into fragments, where each fragment corresponds to a pixel location.
Example: In WebGL, all objects are ultimately represented as triangles, and the rasterizer determines how pixels are filled within them.

3. Fragment Processing (Fragment Processor)
This stage processes each fragment's color and texture information using the Fragment Shader.
It can apply texture mapping, lighting calculations, color blending, and shadow effects.
Example: You can use gl_FragColor = vec4(vColor, 1.0); in the fragment shader to define the final color of each fragment.

4. Output Merging (Output Merging)
This stage combines all processed fragments into the final framebuffer, preparing them for display.
Operations include depth testing, blending, and anti-aliasing to ensure smooth rendering.
Example: If anti-aliasing is enabled (antialias: true), WebGL smooths the edges of rendered objects at this stage.

5. Final Display (Display)
The processed pixel data is sent to the screen for rendering, producing the final visible image.
Example: In your CANVAS, you can see a triangle with a smooth color gradient.`,


`Detailed Explanation of Each Stage in the WebGL Rendering Pipeline


1. Vertex Processing (Vertex Shader)
Purpose: Processes raw vertex data such as position, color, and texture coordinates.
Key Operations:
Transformations: Converts object coordinates into screen coordinates using model-view and projection matrices.
Lighting Calculations: Computes per-vertex lighting effects (if applicable).
Color Interpolation: Passes vertex colors to the next stage.

Example (WebGL GLSL Code):
\`\`\`
attribute vec2 position;
attribute vec3 color;
varying vec3 vColor;

void main(void) {
    gl_Position = vec4(position, 0.0, 1.0); // Convert vertex position
    vColor = color; // Pass color to fragment shader
}
\`\`\`
Output: Transformed vertices and their attributes, ready for rasterization.


2. Rasterization (Rasterizer)
Purpose: Converts transformed vertex data into fragments (potential pixels).
Key Operations:
Primitive Assembly: Forms triangles from vertices.
Clipping & Culling: Removes unnecessary parts outside the viewing area.
Interpolation: Computes pixel-level attributes based on vertex attributes.
Example: If a triangle has three colored vertices (red, blue, yellow), rasterization calculates intermediate colors for pixels inside the triangle.
Output: A collection of fragments, each representing a pixel on the screen.


3. Fragment Processing (Fragment Shader)
Purpose: Determines the final color of each fragment (potential pixel).
Key Operations:
Texture Mapping: Applies textures to fragments.
Lighting Effects: Computes per-fragment lighting effects.
Alpha Blending: Handles transparency effects.

Example (WebGL GLSL Code):
\`\`\`
precision mediump float;
varying vec3 vColor;

void main(void) {
    gl_FragColor = vec4(vColor, 1.0); // Assign color to pixel
}
\`\`\`
Output: Processed fragments with computed colors, ready for merging.


4. Output Merging (Framebuffer Operations)
Purpose: Combines all fragments and applies final rendering effects.
Key Operations:
Depth Testing: Ensures correct visibility by discarding hidden fragments.
Blending: Combines overlapping fragments (useful for transparency effects).
Anti-Aliasing: Smooths edges of shapes.

Example: Enabling anti-aliasing in WebGL:
\`\`\`
var gl = canvas.getContext("webgl", { antialias: true });
\`\`\`
Output: A completed frame ready for display.


5. Final Display (Rendering to Screen)
Purpose: Converts the processed pixel data into an image on the screen.
Key Operations:
Framebuffer Swap: Replaces the previous frame with the new one.
V-Sync Handling: Synchronizes rendering with the display refresh rate.
Example: The final rendered triangle appears in the CANVAS.
`,
];

// Predefined different GPT tasks. GPT parses different contents after each click
const gptPrompts = [
    "Simply explain the process of creating a 2D triangle in WebGL.",
    "To create the colored 2D triangle, give the instructions for the code written.",
    "Provide a detailed step-by-step guide for creating a 2D triangle with a smooth color gradient in WebGL",
    "Analyze the provided index.html and main.js files and identify potential errors or missing components preventing correct rendering.",
    "Explain why the triangle might not be displaying correctly and suggest debugging steps.",
    "Provide a fix for any identified issues in the WebGL program to ensure the triangle renders with a smooth color gradient.",
    "Identify any issues in this code and write the correct code."
];

// HTML escape function
function escapeHtml(html) {
  return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

// Hint button 
document.querySelector(".hint").addEventListener("click", async () => {
  hintClickCount++;

  // first 2 clicks
  if (hintClickCount <= hintMessages.length) {
      document.getElementById("explanation").innerHTML = hintMessages[hintClickCount - 1].replace(/\n/g, "<br>");
      return;
  }

  if (hintClickCount >= 10) {
    document.getElementById("explanation").innerHTML = `
    <strong>You've reached the ultimate final boss of numbers: ZERO!</strong><br><br>
    You have used up all the GPT parsing! If you still have problems, please:<br>
    1. Check the logic of your code carefully.<br>
    2. Try to analyse the WebGL rendering process from scratch.<br>
    3. Refresh this webpage to see the correct code.<br><br>
    <em>If you need more help, refer to the official WebGL documentation or tutorials.</em>
    `;
    return;
 }

  const htmlCode = steps["step1"]["index.html"];
  const jsCode = steps["step1"]["main.js"];

  let gptIndex = hintClickCount - hintMessages.length - 1;

  if (gptIndex >= gptPrompts.length) {
      gptIndex = gptPrompts.length - 1;
  }

  const currentPrompt = `Hint: ${gptPrompts[gptIndex].toLowerCase()}`;

  const userPrompt = `
  This code is designed to teach beginners how to use WebGL. 
  The goal of this code is to render a 2D triangle with a smooth color gradient on an HTML CANVAS element using WebGL.  
  It is implemented using two files: index.html and main.js 

  When providing HTML content, always wrap it in Markdown code blocks ( \`\`\`html ... \`\`\` ) 
  to ensure it is displayed correctly.

  Here is the current **index.html**:
  \`\`\`html
  ${htmlCode}
  \`\`\`

  Here is the current **main.js**:
  \`\`\`javascript
  ${jsCode}
  \`\`\`

  Your task is:
  ${gptPrompts[gptIndex]}
  `;

  // Requesting GPT-4 parsing from the server, notice
  document.getElementById("explanation").innerHTML = "Requesting GPT-4 parsing from the server, please wait...";

  try {
      // sending request to server.js
      const response = await fetch("/api/gpt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userPrompt }) 
      });
      const data = await response.json();

      if (data.error) {
          document.getElementById("explanation").innerHTML = `${currentPrompt}<br>API error: ${data.error}`;
          console.error("Backend API error:", data.error);
          return;
      }

      if (!data.text) {
        document.getElementById("explanation").innerHTML = `${currentPrompt}<br>The server returned invalid data, please check the backend API.`;
        console.error("Backend API returned invalid data:", data);
        return;
      }

      // escape HTML code to prevent parsing errors
      document.getElementById("explanation").innerHTML = `
      <strong>${currentPrompt}</strong><br><br>
      <pre><code>${escapeHtml(data.text)}</code></pre><br><br>
      <em> GPT response completed.</em>
`;

  } catch (error) {
      document.getElementById("explanation").innerHTML = `${currentPrompt}<br>Error: ${error.message}`;
      console.error("Failed to request the backend API:", error);
  }
});
