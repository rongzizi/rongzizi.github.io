"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var delay = 200;

var u_rotate;
var u_scale;

var a = 1;
var b = 1;

function changeDir(){
    direction *= -1;
}

function initRotSquare(){
    canvas = document.getElementById( "rot-canvas" );
    gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
    if( !gl ){
        alert( "WebGL isn't available" );
    }

    var triangleData = new Float32Array([
        0.0, 0.75, 0.25, 0.25, 0.25,    //头部
        0.0, 0.5, 0.25, 0.25, 0.25,
        0.15, 0.55, 0.25, 0.25, 0.25,
        0.25, 0.66, 0.25, 0.25, 0.25,
        0.25, 0.85, 0.25, 0.25, 0.25,
        0.125, 0.95, 0.25, 0.25, 0.25,
        0.0, 0.98, 0.25, 0.25, 0.25,
        -0.125, 0.95, 0.25, 0.25, 0.25,
        -0.25, 0.85, 0.25, 0.25, 0.25,
        -0.25, 0.66, 0.25, 0.25, 0.25,
        -0.15, 0.55, 0.25, 0.25, 0.25,
        0.0, 0.5, 0.25, 0.25, 0.25,

        0.0, 0.5, 0.31, 0.58, 0.8,      //身体
        -0.5, -0.25, 0.31, 0.58, 0.8,
        0.5, -0.25, 0.31, 0.58, 0.8,

        0.33, 0.0, 0.98, 0.92, 0.843,       //手
        0.65, 0.2, 0.98, 0.92, 0.843,
        0.6, 0.25, 0.98, 0.92, 0.843,
        0.27, 0.098, 0.98, 0.92, 0.843,

        -0.1, -0.25, 0.98, 0.92, 0.843,     //左脚
        -0.25, -0.25, 0.98, 0.92, 0.843,
        -0.25, -0.75, 0.98, 0.92, 0.843,
        -0.1, -0.75, 0.98, 0.92, 0.843,

        0.1, -0.25, 0.98, 0.92, 0.843,      //右脚
        0.25, -0.25, 0.98, 0.92, 0.843,
        0.25, -0.75, 0.98, 0.92, 0.843,
        0.1, -0.75, 0.98, 0.92, 0.843,


    ]);
    var FSIZE = triangleData.BYTES_PER_ELEMENT;
    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, triangleData, gl.STATIC_DRAW );

    // Associate external shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, FSIZE*5, 0 );
    gl.enableVertexAttribArray( vPosition );

    var a_color = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2);
    gl.enableVertexAttribArray(a_color);

    u_rotate = gl.getUniformLocation(program, "u_rotate");
    u_scale = gl.getUniformLocation(program, "u_scale");

    document.getElementById( "controls" ).onclick = function( event ){
        switch( event.target.index ){
            case 0:
                direction *= -1;
                break;
            case 1:
                delay /= 2.0;
                break;
            case 2:
                delay *= 2.0;
                break;
        }
    };
    renderSquare();
}

function renderSquare(){
    gl.clear( gl.COLOR_BUFFER_BIT );

    // set uniform values
    theta += direction * 3;
    a -= 0.01;
    b -= 0.01;
    gl.uniformMatrix4fv(u_scale, false, scaleMatrix(a,b,0.0));
    gl.uniformMatrix4fv(u_rotate, false, rotateMatrix(theta));

    // gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 12)
    gl.drawArrays(gl.TRIANGLES, 12, 3);
    gl.drawArrays(gl.TRIANGLE_FAN, 15, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 19, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 23, 4);

    // update and render
    count = setTimeout( function (){ requestAnimFrame( renderSquare ); }, delay );
}
var count;
function pause(){
    clearTimeout(count);
}
function scaleMatrix(x, y, z){    //缩放
    return new Float32Array([
        x, 0.0, 0.0, 0.0,
        0.0, y, 0.0, 0.0,
        0.0, 0.0, z, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}
function rotateMatrix(angle){ //旋转矩阵
    var sinB = Math.sin(angle / 180.0 * Math.PI);
    var cosB = Math.cos(angle / 180.0 * Math.PI);

    return new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}
