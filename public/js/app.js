$(document).ready(onInit);
$(window).resize(onResized);
var stageW;
var stageH;
var canvasMinWidth;
var canvasMinHeight;
var canvas = new fabric.Canvas('canvas');
var contentWidth = 2100;
var contentHeight = 2970;
var jspanel;
canvas.setWidth(contentWidth);
canvas.setHeight(contentHeight);
fabric.util.addListener(document.getElementById('canvas-content'), 'scroll', function () {
    canvas.calcOffset();
});
function onInit(){
    $(window).resize();
    $("#canvas").load("svg/hello.svg",function(response, status, xhr){
            loadSvgFromString(response);
        });
}
function onResized(){
    stageW = $(window).width();
    stageH = $(window).height();

    var controlWidth = 400;
    canvasMinWidth = stageW - controlWidth;
    canvasMinHeight = stageH - 64;
    $("#content").width(stageW);
    $("#content").height(stageH);
    $("#canvas-panel").width(canvasMinWidth);
    $("#canvas-setting").width(canvasMinWidth);
    $("#canvas-info").width(canvasMinWidth);
    $("#canvas-panel").height(stageH);
    $("#control-panel").width(controlWidth);
    $("#control-panel").height(stageH);
    $("#canvas-content").width(canvasMinWidth);
    $("#canvas-content").height(canvasMinHeight);
    canvas.setZoom(Math.max(canvas.getZoom(),canvasMinWidth/contentWidth));
    var w = Math.max(contentWidth*canvas.getZoom(),canvasMinWidth)
    canvas.setWidth(w);
    canvas.setHeight(Math.floor(w*297/210));
    if(jspanel){
        jspanel.resize(stageW+"px", stageH+"px");
    }
}

function loadSvgFromString(svg){
    fabric.loadSVGFromString(svg, addedVectorFile);
}

function addFile(e)
{
    e = e || window.event;
    var files = this.files;
    for(var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onload = (function(file) {
            return function(e) {
                var svg = dxfToSvg(this.result);
                fabric.loadSVGFromString(svg, addedVectorFile);
            };
        })(f);
        reader.readAsText(f);
        $("#add-file").val("");
    }
}
function addedVectorFile(objects, options) {
    var obj = fabric.util.groupSVGElements(objects, options);
    canvas.add(obj)
    obj.setTop(canvasMinHeight/2-obj.height/2);
    obj.setLeft(canvasMinWidth/2-obj.width/2);
    obj.setCoords();
    canvas.renderAll();
}
function openTextLayer(){
    jspanel = $.jsPanel({
        theme:"DarkSlateGray filledlight",
        draggable:false,
        resizable:false,
        contentSize: {width: stageW,height:stageH-40},
        headerTitle:"添加文字",
        headerControls: { controls: 'closeonly' },
        contentIframe: {
            src: 'addText.html',
            style:  {'border': '10px solid transparent'},
            width:  '100%',
            height: '100%'
        }
    });
}
function openImageLayer(){
    jspanel = $.jsPanel({
        theme:"DarkSlateGray filledlight",
        draggable:false,
        resizable:false,
        contentSize: {width: stageW,height:stageH-40},
        headerTitle:"添加文字",
        headerControls: { controls: 'closeonly' },
        contentIframe: {
            src: 'image.html',
            style:  {'border': '10px solid transparent'},
            width:  '100%',
            height: '100%'
        }
    });
}
function closePanel(){
    jspanel.close();
    jspanel = null;
}
$("#add-file").on("change",addFile);

$("#zoom-out").on("click",function(){
    var offset = canvas.calcOffset()._offset;
    var perW = (canvasMinWidth/2-offset.left)/canvas.width;
    var perH = (canvasMinHeight/2-offset.top)/canvas.height;
    canvas.setZoom(Math.max(canvas.getZoom()-0.25,canvasMinWidth/contentWidth));
    var w = Math.max(contentWidth*canvas.getZoom(),canvasMinWidth)
    canvas.setWidth(w);
    canvas.setHeight(Math.floor(w*297/210));
    canvas.calcOffset();
    $('#canvas-content').scrollTo({ left:perW*canvas.width-canvasMinWidth/2,top:perH*canvas.height-canvasMinHeight/2+32},0);
})

$("#zoom-in").on("click",function(){
    var offset = canvas.calcOffset()._offset;
    var perW = (canvasMinWidth/2-offset.left)/canvas.width;
    var perH = (canvasMinHeight/2-offset.top)/canvas.height;
    canvas.setZoom(Math.min(canvas.getZoom()+0.25,2))
    var w = Math.max(contentWidth*canvas.getZoom(),canvasMinWidth)
    canvas.setWidth(w);
    canvas.setHeight(Math.floor(w*297/210));
    canvas.calcOffset();
    if(canvas.getZoom()>1.5){
        $('#canvas-content').scrollTo({ left:perW*canvas.width-canvasMinWidth/2,top:perH*canvas.height-canvasMinHeight/2+32},0);
    }
})
$(document).on("click",function(){
    var codes = getCurrentCodes();
    $("#codes-console").html(codes);
    var area = getCurrentArea();
    $("#working-area").html("x="+area.left+"mm y="+area.top+"mm 宽="+Math.floor((area.right-area.left)*100)/100+"mm 高="+Math.floor((area.bottom-area.top)*100)/100+"mm");
})
$(document).keyup(function (event) {
    if(event.keyCode==8||event.keyCode==46){
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();

        if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function(object) {
            canvas.remove(object);
            });
        }
        else if (activeObject) {
            canvas.remove(activeObject);
        }
    }
});

$("#tabs").tabs({
  activate: function( event, ui ) {
      $(ui.newTab).addClass("active");
      $(ui.oldTab).removeClass("active");
  }
});

var workingStatus = "idle";
var connectionId = -1;
var _codes = [];
var _totalCodesLength = 0;
var _startTime;
var _mode = "gcode";
$("#start-bt").on("click",startMachine);
$("#serialport").on("click",refreshSerialPort);

$("#move-up").on("click",function(){
    sendGCode("G91\n");
    sendGCode("G1 X0 Y-5\n");
    sendGCode("G90\n");
});
$("#move-down").on("click",function(){
    sendGCode("G91\n");
    sendGCode("G1 X0 Y5\n");
    sendGCode("G90\n");
});
$("#move-left").on("click",function(){
    sendGCode("G91\n");
    sendGCode("G1 X-5 Y0\n");
    sendGCode("G90\n");
});
$("#move-right").on("click",function(){
    sendGCode("G91\n");
    sendGCode("G1 X5 Y0\n");
    sendGCode("G90\n");
});
$("#set-zero").on("click",function(){
    sendGCode("G92 X0 Y0 Z0\n");
    sendGCode("G90\n");
});
$("#go-zero").on("click",function(){
      sendGCode("G90\n");
      sendGCode("G1 X0 Y0\n");
});
$("#preview-area").on("click",function(){
    var area = getCurrentArea();
    _codes = [];
    _codes.push("G90\n");
    _codes.push("G1 X"+area.left+" Y"+area.top+" F2000\n");
    _codes.push("G1 X"+area.right+" Y"+area.top+"\n");
    _codes.push("G1 X"+area.right+" Y"+area.bottom+"\n");
    _codes.push("G1 X"+area.left+" Y"+area.bottom+"\n");
    _codes.push("G1 X"+area.left+" Y"+area.top+"\n");

    workingStatus = "running";
    sendNext();
    $("#start-bt").html("暂停");
})
var laserStatus = false;
$("#switch-laser").on("click",function() {
	laserStatus = !laserStatus;
    sendGCode("M3 P"+(laserStatus==true?2:0)+"\n");  
    $("#switch-laser").html(laserStatus?"激光关闭/抬笔":"激光开启/落笔");
});
function getCurrentCodes(){
    var svg = canvas.toSVG();
    var speed = $("#speed option:selected" ).val();
    var codes = svg2gcode(svg, {
          scale : 0.1,
          feedRate:speed,
          seekRate:speed,
          mode:_mode,
          power:240,
          rotate:$("#rotate option:selected").val()=='y'
        })
    $("#working-count").html(canvas.complexity());
    return codes;
}
function getCurrentArea(){
    var arr = getCurrentCodes().split('\n');
    var xMax = 0;
    var xMin = 10000;
    var yMax = 0;
    var yMin = 10000;
    var cx = 0;
    var cy = 0;
    for(var i=0;i<arr.length;i++){
        if(_mode=="gcode"){
            if(arr[i].indexOf('G1 ')>-1&&arr[i].indexOf('G1 X0 Y0')==-1){
                var xx = arr[i].split('X')[1].split(' ')[0]*1;
                var yy = arr[i].split('Y')[1].split(' ')[0]*1;
                if(xx>xMax){
                    xMax = xx;
                }
                if(yy>yMax){
                    yMax = yy;
                }
                if(xx<xMin){
                    xMin = xx;
                }
                if(yy<yMin){
                    yMin = yy;
                }
            }
        }else{
            if(arr[i].indexOf("xm")>-1){
                var pos = arr[i].split(',');
                var xx = pos[2]*0.1;
                var yy = pos[3]*0.1;
                cx += xx;
                cy += yy;
                if(cx>xMax){
                    xMax = cx;
                }
                if(cy>yMax){
                    yMax = cy;
                }
                if(cx<xMin){
                    xMin = cx;
                }
                if(cy<yMin){
                    yMin = cy;
                }
            }
        }
    }
    yMin = Math.floor(yMin*100)/100;
    yMax = Math.floor(yMax*100)/100;
    xMin = Math.floor(xMin*100)/100;
    xMax = Math.floor(xMax*100)/100;
    return {top:yMin,left:xMin,right:xMax,bottom:yMax};
}
function startMachine(){
    if(connectionId==-1){
    // return;
    }
    if(workingStatus=="idle"){
        workingStatus = "running";
        var codes = getCurrentCodes();
        _codes = codes.split("\n");
        _totalCodesLength = _codes.length;
        _startTime = new Date().getTime();
        sendNext();
        $("#start-bt").html("暂停");
    }else if(workingStatus=="pausing"){
        workingStatus = "running";
        sendNext();
        $("#start-bt").html("暂停");
    }else if(workingStatus=="running"){
        workingStatus = "pausing";
        $("#start-bt").html("继续");
    }
}
function sendNext(){
  if(_codes.length>0){
    var cmd = _codes.shift();
    $("#working-time").html(Math.floor((new Date().getTime()-_startTime)/1000));
    if(cmd=="home"){
      goZero();
      workingStatus = "idle";
      $("#start-bt").html("开始");
      $("#working-percent").html("100");
    }else{
      $("#working-percent").html(""+Math.floor((_totalCodesLength-_codes.length)/_totalCodesLength*100));
      if(_mode=="gcode"){
          sendGCode(cmd+"\n");
      }else{
        if(cmd.indexOf("xm,")>-1){
            var p = cmd.split(",");
            _position.x += Math.floor(p[2]);
            _position.y += Math.floor(p[3]);
            sendGCode(cmd+"\n");
            if(workingStatus == "running"){
                setTimeout(sendNext,p[1]);
            }
        }else{
            sendGCode(cmd+"\n");
            if(workingStatus == "running"){
                setTimeout(sendNext,100);
            }
        }
      }
    }
  }else{
      workingStatus = "idle";
      $("#start-bt").html("开始");
  }
}
function goZero(){

}
function sendGCode(cmd){
  if(connectionId!=-1){
	  chrome.serial.send(connectionId, convertStringToArrayBuffer(cmd), function(result){});
  }
}

function convertStringToArrayBuffer(str) {
	var buf=new ArrayBuffer(str.length);
	var bufView=new Uint8Array(buf);
	for (var i=0; i<str.length; i++) {
		bufView[i]=str.charCodeAt(i);
	}
	return buf;
}
function onConnect(){
	if($("#connectBt").html()=="断开连接"){
        chrome.serial.disconnect(connectionId,function(result){
            connectionId = -1;
            $("#connectBt").html("连接");
        });
		return;
	}
    var port = $("#serialport option:selected" ).val();
    if(port){
        chrome.serial.connect(port, {bitrate: 115200},  function(connectionInfo) {
            connectionId = connectionInfo.connectionId;
            $("#connectBt").html("断开连接");
        });
    }
}
function onMode(){
    if(_mode=="gcode"){
        _mode = "axidraw"
        $("#mode-bt").html("Axidraw模式");
    }else{
        _mode = "gcode";
        $("#mode-bt").html("GCode模式");
    }
}
chrome.serial.onReceive.addListener(onReceiveCallback);
function onSend(){
  sendGCode($("#commandSend").val()+"\n");
}
var buffer = "";
function onReceiveCallback(res){
    var str = String.fromCharCode.apply(null, new Uint8Array(res.data));
    buffer+=str;
	if(str.toLowerCase().indexOf("\n")>-1){
        if(buffer.toLowerCase().indexOf("ok")>-1){
            if(_mode=="gcode"){
                if(workingStatus=="running"){
                    sendNext();
                }
            }
            buffer = "";
        }
    }
};
function refreshSerialPort(){
    $("#serialport").empty();
    chrome.serial.getDevices(function(ports){
        for(var i=0;i<ports.length;i++){
            if(ports[i].path.toLowerCase().indexOf("bluetooth")>-1||ports[i].path.toLowerCase().indexOf("cu.")>-1){
                continue;
            }
            var op = $('<option></option>').attr('value',ports[i].path).text(ports[i].path);
            $("#serialport").append(op);
        }
    });  
}
refreshSerialPort();