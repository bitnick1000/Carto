function Circle(x, y, radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;
}

function Line(startPoint, endPoint, thickness) {
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	this.thickness = thickness;
}

function Rect(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}


function fillCanvasBackground() {
	var bottom = new Canvas("bottom");
	//var canvas = document.getElementById('bottom');
	//var ctx = canvas.getContext('2d');
	var width = bottom.canvas.width;
	var height = bottom.canvas.height;
	for (var y = 0; y < height; y += 16) {
		for (var x = 0; x < width; x += 16) {
			bottom.fillRect(x, y, 8, 8, "#cccccc");
		}
	}
	for (var y = 8; y < height; y += 16) {
		for (var x = 8; x < width; x += 16) {
			bottom.fillRect(x, y, 8, 8, "#cccccc");
		}
	}
	for (var y = 0; y < height; y += 16) {
		for (var x = 8; x < width; x += 16) {
			bottom.fillRect(x, y, 8, 8, "#ffffff");
		}
	}
	for (var y = 8; y < height; y += 16) {
		for (var x = 0; x < width; x += 16) {
			bottom.fillRect(x, y, 8, 8, "#ffffff");
		}
	}
}
var Tools = {
	NULL: 0,
	RECT: 1,
	ss: 0
};
var carto = {
	point1: new Point(),
	point2: undefined,
	selectedTool: Tools.RECT,
	drawShape: false,
	ss: "0"
};
var canvas={
	bottom:new Canvas("bottom"),
	background:new Canvas("background"),
	layer1:new Canvas("layer1"),
	simulator:new Canvas("simulator"),
	temp:new Canvas("temp")
}

$(function() {
	if (carto.selectedTool == Tools.RECT) {
		$("#temp").css("cursor", "crosshair");
	}
	fillCanvasBackground();
	$("#temp").mousedown(function(e) {
		if (carto.selectedTool == Tools.RECT) {
			//alert('down');
			drawRect_onMouseDonw(e);
		}
	});
	$("#temp").mousemove(function(e) {
		if (carto.selectedTool == Tools.RECT) {
			drawRect_onMouseMove(e);
		}

	});
	$("#temp").mouseup(function(e) {
		if (carto.selectedTool == Tools.RECT) {
			drawRect_onMouseUp(e);
		}
	});
	$(window).resize(function() {
		refreshCanvasPos();
	});
	refreshCanvasPos();
});

function refreshCanvasPos() {
	var width = $(window).width() - 250;
	$('#panel_container').css("width", width.toString() + "px");

	var x = $('#panel_container').offset().left;
	var y = $('#panel_container').offset().top;

	var containerWidth = $('#panel_container').width();
	var containerHeight = $('#panel_container').height();

	canvasWidth = $("#bottom").width();
	canvasHeight = $("#bottom").height();

	canvasX = x + (containerWidth - canvasWidth) / 2;
	canvasY = y + (containerHeight - canvasHeight) / 2;

	console.log("x:" + x);
	console.log("y:" + y);
	console.log("containerWidth:" + containerWidth);
	console.log("canvasWidth:" + canvasWidth);

	$("canvas").css("left", canvasX.toString() + "px");
	$("canvas").css("top", canvasY.toString() + "px");
}

function drawRect_onMouseMove(e) {
	var canvasPosition = $("#temp").offset();
	var mouseX = e.clientX - canvasPosition.left || 0;
	var mouseY = e.clientY - canvasPosition.top || 0;
	var p = new Point(mouseX, mouseY);
	if (carto.drawShape) {
		canvas["temp"].clearAll();
		canvas["temp"].drawRect(carto.point1.x, carto.point1.y, p.x - carto.point1.x, p.y - carto.point1.y, "#000000");
	}
}

function drawRect_onMouseDonw(e) {
	var canvasPosition = $("#temp").offset();
	var mouseX = e.clientX - canvasPosition.left || 0;
	var mouseY = e.clientY - canvasPosition.top || 0;
	carto.point1 = new Point(mouseX, mouseY);
	carto.drawShape = true;
}

function drawRect_onMouseUp(e) {
	var canvasPosition = $("#temp").offset();
	var mouseX = e.clientX - canvasPosition.left || 0;
	var mouseY = e.clientY - canvasPosition.top || 0;
	point2 = new Point(mouseX, mouseY);
	canvas["layer1"].drawRect(carto.point1.x, carto.point1.y, point2.x - carto.point1.x, point2.y - carto.point1.y, "#00ff00");
	carto.drawShape = false;
	canvas["temp"].clearAll();
}