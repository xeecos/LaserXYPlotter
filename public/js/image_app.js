var canvas_text = document.getElementById("canvas-text");
var context_text = canvas_text.getContext("2d");
var DOMURL = window.URL || window.webkitURL || window;
var platform = navigator.platform;
function performClick(elemId) {
   var elem = document.getElementById(elemId);
   if(elem && document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
   }
}

var img = new Image();
var outputSvg = "";
var originImg = new Image();
var canvas_svg = document.getElementById("canvas-svg");
var context_svg = canvas_svg.getContext("2d");
function fileSelect(e) {
    e = e || window.event;

    var file = this.files[0];
    var imageType = /image.*/;
    if (file.type.match(imageType)) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // Set the img src property using the data URL.
            originImg.src = reader.result;
            originImg.onload = function(){
                loadOriginImg(reader.result);
                $("#load-file").val("");
            }
        };
        reader.readAsDataURL(file); 
    }
}
document.getElementById('load-file').addEventListener('change', fileSelect, false);
function loadOriginImg(url){
    context_text.fillStyle = "rgba(255, 255, 255, 1)";
    context_text.fillRect(0, 0, canvas_text.width,canvas_text.height);
    context_text.drawImage(originImg,0,0);
    
    Potrace.setParameter({optcurve:false,opttolerance:1,turdsize:1});
    Potrace.loadImageFromUrl(url);
    Potrace.process(function(){
        outputSvg = Potrace.getSVG(1,"curve");
        var svg = new Blob([outputSvg.split('id="svg"').join('id="svg" width="'+canvas_text.width+'" height="'+canvas_text.height+'"')], {type: 'image/svg+xml;charset=utf-8'});
        var url = DOMURL.createObjectURL(svg);
        img.src = url;
    });
}
// onChanged();

$("#outline").on('change',onChanged);
$("#centerline").on('change',onChanged);
$("#threshold").on('change',onChanged);
function insertSVG(){
    parent.loadSvgFromString(outputSvg);
    parent.closePanel();
}
img.onload = onChanged;
function onChanged() {
    var outline = $("#outline").prop('checked');
    var centerline = $("#centerline").prop('checked');
    context_svg.clearRect(0, 0, canvas_svg.width, canvas_svg.height);
    context_svg.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(img.src);

    var imgData = context_svg.getImageData(0,0,canvas_svg.width,canvas_svg.height);

    var pixels = context_text.getImageData(0,0,canvas_text.width,canvas_text.height);
    var origins = [];
    
    var edges = [];
    var threshold = $("#threshold").val();
    for(var i=0;i<canvas_text.width;i++){
        for(var j=0;j<canvas_text.height;j++){
            var index = (i*canvas_text.height+j);
            edges[index] = imgData.data[index*4+3]>threshold;
            origins[index] = pixels.data[index*4]<threshold?1:0;
        }
    }
    var outputs = [];
    function calc8connected ( f ) {
        var n = 0;
        for( var i = 0; i < 4; i++ ) {
            var k = 2*i + 1;
            n += ( !f[k] - !f[k] * !f[k+1] * !f[k+2] );
        }
        return n;
    }
    function hilditchCondition6 ( f ) {
        for ( var i = 1; i < 9; i++ ) {
            if ( f[i] == -1 ) {
                var tmp = f[i];
                f[i] = 0;
                var connect8  = calc8connected(f);
                f[i] = tmp;
                if ( connect8 != 1 ) {
                    f[i] = tmp;
                    return false;
                }
            }
        }
        return true;
    }
    var DUMMY_MINUS_ONE = 128;
    function hilditchConditions (  width,  height,  x,  y ) {
        var f = [];
        f[4] = origins[( y - 1 ) * width + ( x - 1 ) ];
        f[3] = origins[( y - 1 ) * width + ( x     ) ];
        f[2] = origins[( y - 1 ) * width + ( x + 1 ) ];
        f[5] = origins[( y     ) * width + ( x - 1 ) ];
        f[0] = origins[ ( y     ) * width + ( x     ) ];
        f[1] = origins[( y     ) * width + ( x + 1 ) ];
        f[6] = origins[ ( y + 1 ) * width + ( x - 1 ) ];
        f[7] = origins[ ( y + 1 ) * width + ( x     ) ];
        f[8] = origins[ ( y + 1 ) * width + ( x + 1 ) ];
        f[9] = f[1];
        // replace -1 <-> DUMMY_MINUS_ONE value
        for ( var i = 0; i < 10; i++ )
            if ( f[i] == DUMMY_MINUS_ONE )
                f[i] = -1;
        // condition1
        if ( f[0] == 0 )
            return false;
        // condition2
        var b = 0;
        for ( var i = 0; i < 4; i++ ) {
            var k = 2*i + 1;
            b += ( 1 - Math.abs( f[k] ) );
        }
        if ( !( b >= 1 ) )
            return false;
        // condition3
        var e = 0;
        for ( var i = 1; i < 9; i++ )
            e += Math.abs( f[i] );
        if ( !( e >= 2 ) )
            return false;
        // condition4
        var iso = 0;
        for ( var i = 1; i < 9; i++ )
            if ( f[i] == 1 )
                iso++;
        if ( !( iso >= 1 ) )
            return false;
        // condition5
        if ( calc8connected ( f ) != 1 )
            return false;
        // condition6
        if ( !hilditchCondition6 ( f ) )
            return false;
        return true;
    }
    function hilditchThinning ( width, height ) {
        var counter = 0;
        // thinning
        for ( var y = 1; y < height - 1; y++ ) {
            for ( var x = 1; x < width - 1; x++ ) {
                if ( hilditchConditions ( width, height, x, y ) ) {
                    origins[width * y + x] = DUMMY_MINUS_ONE;
                    counter++;
                }
            }
        }
        // replace -1 into 0
        for ( var y = 0; y < height; y++ )
            for ( var x = 0; x < width; x++ )
                origins [ width * y + x ] = origins[width * y + x] == DUMMY_MINUS_ONE ? 0 : origins[width * y + x];
        return counter;
    }

    imgData = context_svg.getImageData(0,0,canvas_svg.width,canvas_svg.height);
    var cc = 0
    while( 1 ) {
        if(cc>100){
            break;
        }
        if( !hilditchThinning ( canvas_svg.width, canvas_svg.height ) )
            break;
    }

    for(var i=0;i<canvas_svg.width;i++){
        for(var j=0;j<canvas_svg.height;j++){
            var index = (i*canvas_svg.height+j);
            imgData.data[index*4+3] = 0;
            if(centerline&&origins[index]>0){
                //imgData.data[index*4+3] = 255;
            }else if(outline&&edges[index]>0){
                imgData.data[index*4+3] = 255;
            }
        }
    }
    function findNext(x,y,first){
        var r = 3;
        var cx = 0;
        var cy = 0;
        var minR = 100;
        for(var i=-r;i<=r;i++){
            for(var j=-r;j<=r;j++){
                if(i==0&&j==0){
                    continue;
                }
                var index = ((y+j)*canvas_svg.width+(x+i));
                if(origins[index]>0){
                    var dist = i*i+j*j;
                    if(dist<minR){
                        minR = dist;
                        cx = i;
                        cy = j;
                    }
                }
            }
        }
        if(cx!=0||cy!=0){
            var index = ((y+cy)*canvas_svg.width+(x+cx));
            origins[index] = 0;
            if(first){
                svgPath += "<path d=\"M"+x+" "+y+" L"+(cx+x)+" "+(cy+y);
                context_svg.moveTo(x,y);
            }else{
                svgPath +=" L"+(cx+x)+" "+(cy+y);
            }
            context_svg.lineTo(cx+x,cy+y);
            findNext(x+cx,y+cy,false);
        }else{
            if(!first){
                svgPath+="\"  stroke=\"black\" stroke-width=\"1\" fill=\"none\" />"
            }
        }
    }
    context_svg.beginPath();
    context_svg.lineWidth = "1";
    context_svg.strokeStyle = "red";
    if(centerline){
        var svgPath = outline?"":"<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">";
        for(var k=0;k<1;k++)
        for(var i=0;i<canvas_svg.width;i++){
            for(var j=0;j<canvas_svg.height;j++){
                var index = (j*canvas_svg.width+i);
                if(origins[index]>0){
                    findNext(i,j,true);
                }
            }
        }
        svgPath += outline?"":"</svg>";
    }
    outputSvg = outline?outputSvg.split("</svg>").join(svgPath)+"</svg>":svgPath;
    context_svg.putImageData(imgData,0,0);
    context_svg.stroke();
}