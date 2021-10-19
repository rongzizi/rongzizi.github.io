"use strict";

var canvas;
var gl;
var vertices=[];
var colorData=[];

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
    //=====================头部：圆形的绘制======================
    var N = 100;
    var circleData = [0.0, 0.75];
    var r = 0.25;
    colorData = [0.25, 0.25, 0.25];
    for(var i=0; i<= N; i++){
        var theta = i * 2 * Math.PI / N;
        var x = r * Math.sin(theta) ;
        var y = r * Math.cos(theta) + 0.75;
        circleData.push(x, y);
        colorData.push(0.25, 0.25, 0.25);
    }
    function body(){
        //三角形（身体）
        circleData.push(0.0, 0.5);
        circleData.push(-0.5, -0.25);
        circleData.push(0.5, -0.25);
        for(var u =0; u<3;u++){
            colorData.push(0.31, 0.58, 0.8);
        }
        //手
        circleData.push( 0.33, 0.0);
        circleData.push(0.65, 0.2);
        circleData.push(0.6, 0.25);
        circleData.push(0.27, 0.098);
        //左脚
        circleData.push(-0.1, -0.25);
        circleData.push(-0.25, -0.25);
        circleData.push(-0.25, -0.75);
        circleData.push(-0.1, -0.75);
        //右脚
        circleData.push(0.1, -0.25);
        circleData.push(0.25, -0.25);
        circleData.push(0.25, -0.75);
        circleData.push(0.1, -0.75);

        for(var v=0; v<12;v++)
            colorData.push(0.98, 0.92, 0.843);
    }
    body();

    vertices = new Float32Array(circleData);

    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate external shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    var a_color = gl.getAttribLocation(program, "a_color");
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);
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
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 102 );
    console.log(vertices.length/2);
    gl.drawArrays( gl.TRIANGLE_FAN, 102, 3);
    gl.drawArrays(gl.TRIANGLE_FAN, 105, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 109, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 113, 4);

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
