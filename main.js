
window.onload = function() {
  canvas = document.getElementById("canvas");

  var gl = canvas.getContext("webgl");

  var vertexSource = "attribute vec2 a_position;\n" +
  "uniform vec2 u_resolution;\n" +
  "void main() {\n" +
  "vec2 zeroToOne = a_position / u_resolution;\n" +
  "vec2 zeroToTwo = zeroToOne * 2.0;\n" +
  "vec2 clipSpace = zeroToTwo - 1.0;\n" +
  "gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n" +
  "}";

  var fragmentSource = "precision mediump float;\n" +
  "uniform vec4 u_color;\n" +
  "void main() {\n" +
  "gl_FragColor = u_color;\n" +
  "}";

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  var program = createProgram(gl, vertexShader, fragmentShader);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");

  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30
  ];

  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  setRectangle(gl, randInt(300), randInt(300), randInt(300), randInt(300));

  gl.enableVertexAttribArray(positionAttributeLocation);

  var size = 2,
    type = gl.FLOAT,
    normalize = false,
    stride = 0,
    offset = 0;

  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(program);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

  var primitiveType = gl.TRIANGLES,
    count = 6;

  gl.drawArrays(primitiveType, offset, count);

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log("ERROR: " + type + " " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log("ERROR: Program Creation: " + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  function randInt(range) {
    return Math.floor(Math.random() * range);
  }

  function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;

  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point
  // but so far we only have one buffer. If we had more than one
  // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}
};
