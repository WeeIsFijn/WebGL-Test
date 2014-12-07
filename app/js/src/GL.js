var GLTEST = GLTEST || function(){
	var gl;
	var shaderProgram;
	var pMatrix;
	var mvMatrix; // modelViewMatrix;
	var triRot=25;
	var triangle;
	var circle = [];
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

    for (var i = 0; i < 20; i++) {
    	circle.push( new Circle(gl, this) );
    	circle[i].setRadius(0.1);
    };

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

		
		pMatrix = mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		mat4.rotateZ(pMatrix, pMatrix, triRot/300);
		this.setMatrixUniforms();

		for( c in circle ){
			circle[c].resetMVMatrix();
			circle[c].translate(-6.0 + (12.0/circle.length*c), 0.0, -5.0 + 1.0*Math.cos(triRot/20+3.0*Math.PI/circle.length*c));
			circle[c].draw();
		}

		for( c in circle ){
			circle[c].resetMVMatrix();
			circle[c].translate(-6.0 + (12.0/circle.length*c), 1.0, -5.0 + 1.0*Math.cos(triRot/20+3.0*Math.PI/circle.length*c));
			circle[c].draw();
		}

		for( c in circle ){
			circle[c].resetMVMatrix();
			circle[c].translate(-6.0 + (12.0/circle.length*c), -1.0, -5.0 + 1.0*Math.cos(triRot/20+3.0*Math.PI/circle.length*c));
			circle[c].draw();
		}

		for( c in circle ){
			circle[c].resetMVMatrix();
			circle[c].translate(-6.0 + (12.0/circle.length*c), -2.0, -5.0 + 1.0*Math.cos(triRot/20+3.0*Math.PI/circle.length*c));
			circle[c].draw();
		}

		for( c in circle ){
			circle[c].resetMVMatrix();
			circle[c].translate(-6.0 + (12.0/circle.length*c), 2.0, -5.0 + 1.0*Math.cos(triRot/20+3.0*Math.PI/circle.length*c));
			circle[c].draw();
		}

	};

	container.tick = function() {
		GLTEST.animate();
		GLTEST.draw();

		requestAnimationFrame(GLTEST.tick);
	};

	return container;
}();

