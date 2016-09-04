function svg2gcode(svg, settings) {
  // clean off any preceding whitespace
  svg = svg.replace(/^[\n\r \t]/gm, '');
  settings = settings || {};
  settings.passes = settings.passes || 1;
  settings.materialWidth = settings.materialWidth || 6;
  settings.passWidth = settings.materialWidth/settings.passes;
  settings.scale = settings.scale || -1;
  settings.cutZ = settings.cutZ || -108; // cut z
  settings.safeZ = settings.safeZ || -106;   // safe z
  settings.feedRate = settings.feedRate || 1400;
  settings.seekRate = settings.seekRate || 1100;
  settings.bitWidth = settings.bitWidth || 1; // in mm
  settings.mode = settings.mode || "gcode";
  settings.position = settings.position || {x:0,y:0};
  settings.power = settings.power || 512;
  var
  scale=function(val) {
    return Math.floor(val * settings.scale);
  },
  paths = SVGReader.parse(svg, {}).allcolors,
  gcode,
  path;
  var idx = paths.length;
  
  while(idx--) {
    var subidx = paths[idx].length;
    var bounds = { x : Infinity , y : Infinity, x2 : -Infinity, y2: -Infinity, area : 0};

    // find lower and upper bounds
    while(subidx--) {
      if (paths[idx][subidx][0] < bounds.x) {
        bounds.x = paths[idx][subidx][0];
      }

      if (paths[idx][subidx][1] < bounds.y) {
        bounds.y = paths[idx][subidx][0];
      }

      if (paths[idx][subidx][0] > bounds.x2) {
        bounds.x2 = paths[idx][subidx][0];
      }
      if (paths[idx][subidx][1] > bounds.y2) {
        bounds.y2 = paths[idx][subidx][0];
      }
    }

    // calculate area
    bounds.area = (1 + bounds.x2 - bounds.x) * (1 + bounds.y2-bounds.y);
    paths[idx].bounds = bounds;
  }

  // cut the inside parts first
  paths.sort(function(a, b) {
    // sort by area
    return (a.bounds.area < b.bounds.area) ? -1 : 1;
  });
  if(settings.mode=="axidraw"){
    gcode = [];
  }else{
    gcode = [
      'G90'
    ];
  }
  function getLength(x,y){
    return Math.sqrt(x*x+y*y)*5000/settings.feedRate;
  }
  function getPulses(loc){
    return Math.floor(loc*10*settings.seekRate);
  }
  function getPulsesDist(loc){
    return Math.floor(loc*10*settings.seekRate)/10;
  }
  var prevPosition = {x:settings.position.x,y:settings.position.y};
  for (var pathIdx = 0, pathLength = paths.length; pathIdx < pathLength; pathIdx++) {
    path = paths[pathIdx];

    // seek to index 0
    if(settings.mode=="axidraw"){
        gcode.push(['xm',
          Math.max(10,Math.floor(getLength(path[0].x-prevPosition.x,path[0].y-prevPosition.y))),
          getPulses(getPulsesDist(path[0].x))-getPulses(getPulsesDist(prevPosition.x)),
          getPulses(getPulsesDist(path[0].y))-getPulses(getPulsesDist(prevPosition.y))
        ].join(','));
        gcode.push('sp,0');
	      gcode.push('se,1,'+settings.power);
        gcode.push(['xm',100,0,0].join(','));
        prevPosition.x = (path[0].x);
        prevPosition.y = (path[0].y);
        console.log("x:",path[0].x);
    }else{
      gcode.push(['G1',
        'X' + scale(path[0].x),
        'Y' + scale(path[0].y),
        'F' + settings.seekRate
      ].join(' '));
      gcode.push('M3 P200');
    }
    for (var p = settings.passWidth; p<=settings.materialWidth; p+=settings.passWidth) {

      // begin the cut by dropping the tool to the work
      //gcode.push(['G1',
      //  'Z' + (settings.cutZ + p),
      //  'F' + '200'
      //].join(' '));

      // keep track of the current path being cut, as we may need to reverse it
      var localPath = [];
      for (var segmentIdx=0, segmentLength = path.length; segmentIdx<segmentLength; segmentIdx++) {
        var segment = path[segmentIdx];

        var localSegment;
        
        if(settings.mode=="axidraw"){
          localSegment = ['xm',
            Math.max(10,Math.floor(getLength(segment.x-prevPosition.x,segment.y-prevPosition.y))),
            getPulses(getPulsesDist(segment.x))-getPulses(getPulsesDist(prevPosition.x)),
            getPulses(getPulsesDist(segment.y))-getPulses(getPulsesDist(prevPosition.y))
          ].join(',');
        }else{
          localSegment = ['G1',
              'X' + scale(segment.x),
              'Y' + scale(segment.y),
              'F' + settings.feedRate
            ].join(' ');
        }

        if(segment.x-prevPosition.x==0&&segment.y-prevPosition.y==0){
          continue;
        }
        if(segment.x==0&&segment.y==0){
          continue;
        }
        prevPosition.x = (segment.x);
        prevPosition.y = (segment.y);
        // feed through the material
        gcode.push(localSegment);
        localPath.push(localSegment);

        // if the path is not closed, reverse it, drop to the next cut depth and cut
        // this handles lines
        if (segmentIdx === segmentLength - 1 &&
            (segment.x !== path[0].x || segment.y !== path[0].y))
        {

          p+=settings.passWidth;
          if (p<settings.materialWidth) {
            // begin the cut by dropping the tool to the work
            // gcode.push(['G1',
            //   'Z' + (settings.cutZ + p),
            //   'F' + '200'
            // ].join(' '));

            Array.prototype.push.apply(gcode, localPath.reverse());
          }
        }
      }
    }
    if(settings.mode=="axidraw"){
	    gcode.push('sp,1');
	    gcode.push('se,0');
    }else{
	    gcode.push('M3 P0');
    }
  }

  if(settings.mode=="axidraw"){
	    gcode.push('sp,1');
	    gcode.push('se,0');
	    gcode.push('home');
  }else{
    // turn off the spindle
    gcode.push('M3 P0');
    // go home
    gcode.push('G1 X0 Y0 F'+ settings.seekRate);
  }
  return gcode.join('\n');
}
