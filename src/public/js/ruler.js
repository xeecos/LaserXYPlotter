
var grid;

function init() {
	"use strict";
	/*global Ruler, document, window*/

	var canvas = document.getElementById('ruler'),
		ruler;

	
	ruler = new Ruler("ruler");
			
	ruler.render('#333', 'pixels', 100);

}

window.onload = init;