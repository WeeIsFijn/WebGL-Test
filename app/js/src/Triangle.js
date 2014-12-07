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






