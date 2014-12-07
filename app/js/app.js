var Triangle = function(gl, renderer) {
	this.gl = gl;
	this.renderer = renderer;

	this.mvMatrix = mat4.create();
	mat4.identity(this.mvMatrix);

	this.initBuffers();

};

Triangle.prototype.initBuffers = function(){
// create new vertex buffer
		this.triangleVertexPositionBuffer = this.gl.createBuffer();

		// activate the new vertex buffer for editing
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);

		// define vertices
		var vertices = [
			0.0,	1.0,	0.0,
			-1.0,	-1.0,	0.0,
			1.0,	-1.0,	0.0
		];

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

		this.triangleVertexPositionBuffer.itemSize = 3;
		this.triangleVertexPositionBuffer.numItems = 3;
};

Triangle.prototype.draw = function(){
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
	this.gl.vertexAttribPointer(this.renderer.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

	this.gl.uniformMatrix4fv(this.renderer.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

	this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
};

Triangle.prototype.deltaRotateZ = function(rad) {
	mat4.rotateZ(this.mvMatrix, this.mvMatrix, rad);
};

Triangle.prototype.deltaTranslate = function(x, y, z) {
	mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(x, y, z) );
}

Triangle.prototype.translate = function(x,y,z) {
	mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(x, y, z));
};

Triangle.prototype.rotateZ = function(rad){
	mat4.rotateZ(this.mvMatrix, this.mvMatrix, rad);
};

Triangle.prototype.resetMVMatrix = function() {
	mat4.identity(this.mvMatrix);
}






;var GLTEST = GLTEST || function(){
	var gl;
	var shaderProgram;
	var pMatrix;
	var mvMatrix; // modelViewMatrix;
	var triRot=25;
	var triangle;
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

    triangle = new Triangle(gl, this);
    triangle2 = new Triangle(gl, this);
    triangle3 = new Triangle(gl, this);
    triangle4 = new Triangle(gl, this);

    this.tick(this);


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
		var fragmentShader = this.getShader(gl, 'shader-fs');
		var vertexShader = this.getShader(gl, 'shader-vs');

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		gl.useProgram(shaderProgram);

		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');

		this.shaderProgram = shaderProgram;
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
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	};


	var rSpeed = 0.05;
	var prevTime = 0;
	var fps = 0;
	var elapsed = 0;
	container.animate = function(){
		var curTime = new Date().getTime();
		if(prevTime!=0){
			elapsed = curTime - prevTime;

			triRot += rSpeed * elapsed;


		}
		prevTime = curTime;
	};

	container.draw = function() {

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		p = mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		
		this.setMatrixUniforms();


		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(1.5, 0.0, -7.0) );

		triangle.resetMVMatrix();
		triangle.translate(1.5, 0.0, -7.0);
		triangle.rotateZ(Math.PI*triRot/180);
		triangle.draw(gl, this);

		triangle2.resetMVMatrix();
		triangle2.translate(-1.5, 0.0, -7.0);
		triangle2.rotateZ(Math.PI*triRot/180);
		triangle2.draw(gl, this);

		triangle3.resetMVMatrix();
		triangle3.translate(1.5, 0.0, -6.0);
		triangle3.rotateZ(-Math.PI*triRot/180);
		triangle3.draw(gl, this);

		triangle4.resetMVMatrix();
		triangle4.translate(-1.5, 0.0, -6.0);
		triangle4.rotateZ(-Math.PI*triRot/180);
		triangle4.draw(gl, this);
	};

	container.tick = function() {
		GLTEST.animate();
		GLTEST.draw();

		requestAnimationFrame(GLTEST.tick);
	};

	return container;
}();

