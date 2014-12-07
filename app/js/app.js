var GLTEST = GLTEST || function(){
	var gl;
	var shaderProgram;
	var pMatrix;
	var mvMatrix; // modelViewMatrix;
	mvMatrix = mat4.create();

	container = {};

	container.webGLStart = function() {
		console.log('starting webGL');

		this.canvas = document.getElementById('GLCanvas');
		this.initGL(this.canvas);
		this.initShaders();
		this.initBuffers();

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    this.draw();


	};

	container.initGL = function( canvas ) {
		// TODO implement try-catch block here
		gl = canvas.getContext('experimental-webgl');
		gl.viewportWidth 	= canvas.width;
		gl.viewportHeight = canvas.height;
	};

	container.initBuffers = function() {
		// create new vertex buffer
		this.triangleVertexPositionBuffer = gl.createBuffer();

		// activate the new vertex buffer for editing
		gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);

		// define vertices
		var vertices = [
			0.0,	1.0,	0.0,
			-1.0,	-1.0,	0.0,
			1.0,	-1.0,	0.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		this.triangleVertexPositionBuffer.itemSize = 3;
		this.triangleVertexPositionBuffer.numItems = 3;

	};

	container.initShaders = function() {
		var fragmentShader = getShader(gl, 'shader-fs');
		var vertexShader = getShader(gl, 'shader-vs');

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		gl.useProgram(shaderProgram);

		pMatrix = mat4.create();
	};

	container.getShader = function( gl, id ) {
		var shaderScript = document.getElementById(id);
		if (!shaderScript) {
			return null;
		}

		// Read in the shader
		var str = '';
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType==3)
				str += k.textContent;
			k = k.nextSibling;
		}

		var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
          return null;
      }

      gl.shaderSource(shader, str);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(shader));
          return null;
      }

      return shader;
	};

	container.setMatrixUniforms = function(){

	};

	container.draw = function() {

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		p = mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(-1.5, 0.0, -7.0) );

		gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.setMatrixUniforms();

		gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
	};

	return container;
}();

