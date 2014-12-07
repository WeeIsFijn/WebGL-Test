var Circle = function(gl, renderer) {
	this.gl = gl;
	this.renderer = renderer;

	this.mvMatrix = mat4.create();
	mat4.identity(this.mvMatrix);

	this.numberOfSamples = 96;
	this.radius = 1;

	this.initBuffers();

};

Circle.prototype.initBuffers = function(){
		// create new vertex buffer
		this.triangleVertexPositionBuffer = this.gl.createBuffer();

		// activate the new vertex buffer for editing
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);

		// define vertices
		var vertices = [];

		for (var i = this.numberOfSamples - 1; i >= 0; i--) {
			vertices.push( this.radius*Math.cos(i*2*Math.PI/this.numberOfSamples) );
			vertices.push( this.radius*Math.sin(i*2*Math.PI/this.numberOfSamples) );
			vertices.push( 0.0 );

			vertices.push( this.radius*Math.cos((i+1)*2*Math.PI/this.numberOfSamples) );
			vertices.push( this.radius*Math.sin((i+1)*2*Math.PI/this.numberOfSamples) );
			vertices.push( 0.0 );

			vertices.push( 0.0 );
			vertices.push( 0.0 );
			vertices.push( 0.0 );

		};

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

		this.triangleVertexPositionBuffer.itemSize = 3;
		this.triangleVertexPositionBuffer.numItems = 3*this.numberOfSamples;
};

Circle.prototype.draw = function(){
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
	this.gl.vertexAttribPointer(this.renderer.shaderProgram.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

	this.gl.uniformMatrix4fv(this.renderer.shaderProgram.mvMatrixUniform, false, this.mvMatrix);

	this.gl.drawArrays(this.gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);
};

Circle.prototype.deltaRotateZ = function(rad) {
	mat4.rotateZ(this.mvMatrix, this.mvMatrix, rad);
};

Circle.prototype.deltaTranslate = function(x, y, z) {
	mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(x, y, z) );
}

Circle.prototype.translate = function(x,y,z) {
	mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(x, y, z));
};

Circle.prototype.rotateZ = function(rad){
	mat4.rotateZ(this.mvMatrix, this.mvMatrix, rad);
};

Circle.prototype.resetMVMatrix = function() {
	mat4.identity(this.mvMatrix);
};

Circle.prototype.setRadius = function(r) {
	this.radius = r;
	this.initBuffers();
};




