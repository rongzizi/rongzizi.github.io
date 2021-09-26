"use strict";

var gl;
var points;

window.onload = function init(){
    var canvas = document.getElementById( "triangle-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if( !gl ){
        alert( "WebGL isn't available" );
    }

    // Three Vertices
    var vertices = [
        -1.0, -1.0,
        0.0,  1.0,
        1.0, -1.0,
        /*0.0, -1.0,
        1.0, -1.0,
        1.0,  1.0,
        0.0, -1.0,
        1.0,  1.0,
        0.0,  1.0*/
        /*-0.5, -0.5,
        0.0, 0.5,
        0.5, -0.5*/
    ];
    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    // Associate external shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
    // main();
}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    // gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    // gl.drawArrays( gl.TRIANGLE_FAN, 3, 6 );
}
//任务b：绘制四边形
function main() {
    gl = document.getElementById("rectangle-canvas");
    points = gl.getContext("2d");
    points.fillStyle = 'rgba(0,0,255,1.0)';
    points.fillRect(100,100,300,200);
}