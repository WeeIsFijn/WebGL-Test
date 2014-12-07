var GLTEST = GLTEST || function(){
	var gl;
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

	};

	container.draw = function() {

	};

	return container;
}();

