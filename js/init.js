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
	point1: undefined,
	point2: undefined,
	selectedTool: Tools.RECT,
	drawShape: false,
	ss: "0"
};

$(function() {
	//alert('init');
	var bottom = new Canvas("bottom");
	var temp = new Canvas("temp");

	//carto.selectedTool=new int(10);
	// alert("selectedTool " + carto.selectedTool);
	// alert("ss " + carto.ss);

	// alert(carto.selectedTool);
	// alert("RECT "+Tools.RECT);
	if (carto.selectedTool == Tools.RECT) {
		$("#top").css("cursor", "crosshair");
	}

	//bottom.canvas.onselectstart=function(){return false;}
	//bottom.sayHi('sdf');
	fillCanvasBackground();
	temp.fillRect(0, 0, 500, 500, "#ff00ff");
	temp.clearAll();
	//var canvas = document.getElementById('bottom');
	//var ctx = canvas.getContext('2d');
	$("#top").mousedown(function(e) {
		var canvasPosition = $(this).offset();
		var mouseX = e.clientX - canvasPosition.left || 0;
		var mouseY = e.clientY - canvasPosition.top || 0;
		//alert('mousedown');
		point1 = new Point(mouseX, mouseY);
		carto.drawShape = true;
		//point1=p1;
	});
	$("#top").mousemove(function(e) {
		var canvasPosition = $(this).offset();
		var mouseX = e.clientX - canvasPosition.left || 0;
		var mouseY = e.clientY - canvasPosition.top || 0;
		//alert('mousedown');
		var p = new Point(mouseX, mouseY);
		if (carto.drawShape) {
			temp.clearAll();
			temp.drawRect(point1.x, point1.y, p.x - point1.x, p.y - point1.y, "#000000");
		}
	});
	$("#top").mouseup(function(e) {
		var canvasPosition = $(this).offset();
		2
		var mouseX = e.clientX - canvasPosition.left || 0;
		var mouseY = e.clientY - canvasPosition.top || 0;
		point2 = new Point(mouseX, mouseY);
		//fillRect(ctx,point1.x,point1.y,point2.x-point1.x,point2.y-point1.y,"#00ff00");
		bottom.drawRect(point1.x, point1.y, point2.x - point1.x, point2.y - point1.y, "#00ff00");
		carto.drawShape = false;
		temp.clearAll();
		//alert('mouseup');
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