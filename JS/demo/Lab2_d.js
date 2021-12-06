"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;
var thetaLoc;


var points = [];

var numTimesToSubdivide =prompt("Please enter your number","");
var angle =prompt("Please enter theta","");
 var theta=angle/360*Math.PI*2*1;


window.onload = function initTriangles(){
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}
	// configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	

	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		-0.5, -0.5,  0,
		 0,  0.5,  0,
		 0.5, -0.5,  0
	];

	var u = vec3.create();
	vec3.set( u, -0.5, -0.5, 0 );
	// var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	var v = vec3.create();
	vec3.set( v, 0, 0.5, 0 );
	// var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	var w = vec3.create();
	vec3.set( w, 0.5, -0.5, 0 );
	// var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
	divideTriangle( u, v, w, numTimesToSubdivide );

	
	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
    thetaLoc = gl.getUniformLocation(program, "theta");
	renderTriangles();
};

function triangle( a, b, c ){
	var k;
	points.push( a[0], a[1], a[2] );
	points.push( b[0], b[1], b[2] );
	points.push( c[0], c[1], c[2] );
	for( k = 0; k < 3; k++ )
		points.push( a[k] );
	for( k = 0; k < 3; k++ )
		points.push( b[k] );
	for( k = 0; k < 3; k++ )
		points.push( c[k] );
}

function divideTriangle( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		--count;

		// three new triangles
		divideTriangle( a, ab, ca, count );
		divideTriangle( b, bc, ab, count );
		divideTriangle( c, ca, bc, count );
		divideTriangle( ab, bc, ca,count );
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.uniform1f( thetaLoc, theta );
	gl.drawArrays( gl.LINES, 0, points.length/3 );
}