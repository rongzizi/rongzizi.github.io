"use strict";

var canvas;
var gl;

var numVertices = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;
//scale
var beta = [1, 1, 1];
var betaLoc;
/*var xBeta = 0.5;
var yBeta = 1.5;
var zBeta = 2.0;*/

var vertices = [
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    0.5,  0.5,  0.5,
    0.5, -0.5,  0.5,
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
    0.5,  0.5, -0.5,
    0.5, -0.5, -0.5
];

var vertexColors = [
    0.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0
];

var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
];

window.onload = function initCube(){
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if( !gl ){
        alert( "WebGL isn't available" );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable( gl.DEPTH_TEST );

    // load shaders and initialize attribute buffer
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var iBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexColors ), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );
    betaLoc = gl.getUniformLocation( program, "beta" );

    document.getElementById( "xbutton" ).onclick = function(){
        axis = xAxis;
    }

    document.getElementById( "ybutton" ).onclick = function(){
        axis = yAxis;
    }

    document.getElementById( "zbutton" ).onclick = function(){
        axis = zAxis;
    }
    document.getElementById("xScale").onchange = (event) => {
        beta[0] = event.target.value;
        console.log(event.target.value);
        console.log(beta[0]);
    }
    document.getElementById("yScale").onchange = (event) => {
        beta[1] = event.target.value;
        console.log(beta[1]);
    }
    document.getElementById("zScale").onchange = (event) => {
        beta[2] = event.target.value;
        console.log(beta[2]);
    }
    render();
}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    theta[ axis ] += 0.05;
    gl.uniform3fv( thetaLoc, theta );
    gl.uniform3fv( betaLoc, beta);

    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );

    requestAnimFrame( render );
}
