"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var delay = 200;

function changeDir(){
    direction *= -1;
}

function initRotSquare(){
    canvas = document.getElementById( "rot-canvas" );
    gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
    if( !gl ){
        alert( "WebGL isn't available" );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
    gl.useProgram( program );

    var vertices = new Float32Array([
        0.5,  0.5, 0.2667, 0.8078, 0.9647,
        -0.5,  0.5, 0.5529, 0.2941, 0.7333,
        -0.5,  -0.5, 0.8, 0.6431, 0.8902,
        0.5, -0.5,  0.2392, 0.8824, 0.6784
    ]);

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, FSIZE*5, 0 );
    gl.enableVertexAttribArray( vPosition );

    var a_color = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false,FSIZE*5, FSIZE*2);
    gl.enableVertexAttribArray(a_color);

    thetaLoc = gl.getUniformLocation( program, "theta" );

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
    theta += direction * 0.1;
    if( theta > 2 * Math.PI )
        theta -= (2 * Math.PI);
    else if( theta < -2 * Math.PI )
        theta += ( 2 * Math.PI );

    gl.uniform1f( thetaLoc, theta );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    // update and render
    setTimeout( function (){ requestAnimFrame( renderSquare ); }, delay );
}