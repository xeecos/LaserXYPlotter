$(document).ready(onInit);
$(window).resize(onResized);
var stageW;
var stageH;
var canvas = new fabric.Canvas('canvas');
var c,container;
function onInit(){
    console.log("init");
    c = $('#canvas');
    var ct = c.get(0).getContext('2d');
    container = $(c).parent();

    $(window).resize();
    setTimeout(function(){
        $("#canvas").load("svg/box.svg",function(response, status, xhr){
            loadSvgFromString(response);
        });
    },1000);
}
function onResized(){
    stageW = $(window).width();
    stageH = $(window).height();

    var controlWidth = 400;
    var canvasWidth = stageW - controlWidth;

    $("#content").width(stageW);
    $("#content").height(stageH);
    $("#canvas-panel").width(canvasWidth);
    $("#control-panel").width(controlWidth);
    $("#canvas-panel").height(stageH);
    $("#control-panel").height(stageH);
    $("#canvas-content").height(stageH-64);
    canvas.setWidth(canvasWidth); 
    canvas.setHeight(stageH-64);
}

function loadSvgFromString(svg){
    fabric.loadSVGFromString(svg, function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).centerObject(obj).renderAll();
        obj.setCoords();
    });
}