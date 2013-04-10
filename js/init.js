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
Rect.prototype.contains = function(x, y) {
	var maxX = this.x + this.width;
	var maxY = this.y + this.height;
	if (this.x < x && x < maxX && this.y < y && y < maxY) {
		return true;
	} else {
		return false;
	}
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
	SELECT: 1,
	RECT: 2,
	select: {
		selectedIndex: -1
	},
	rect: {
		point: new Point(),
		ss: 0
	}
};
var carto = {
	shapes: [],
	selectedTool: Tools.RECT,
	drawShape: false,
};
var canvas = {
	bottom: new Canvas("bottom"),
	background: new Canvas("background"),
	layer1: new Canvas("layer1"),
	simulator: new Canvas("simulator"),
	temp: new Canvas("temp")
}

$(function() {
	fillCanvasBackground();
	onSelectedToolChanged();
	$("#tool_select").click(function(e) {
		carto.selectedTool = Tools.SELECT;
		onSelectedToolChanged();
	});
	$("#tool_rect").click(function(e) {
		carto.selectedTool = Tools.RECT;
		onSelectedToolChanged();
	});

	$("#temp").mousedown(function(e) {
		if (carto.selectedTool == Tools.RECT) {
			drawRect_onMouseDonw(e);
		}
	});
	$("#temp").click(function(e) {
		if (carto.selectedTool == Tools.SELECT) {
			var canvasPosition = $("#temp").offset();
			var mouseX = e.clientX - canvasPosition.left || 0;
			var mouseY = e.clientY - canvasPosition.top || 0;
			for (var i = 0; i < carto.shapes.length; i++) {
				if (carto.shapes[i].contains(mouseX, mouseY)) {
					 Tools.select.selectedIndex = i;
					$("#x").val(carto.shapes[i].x);
					$("#y").val(carto.shapes[i].y);
					$("#width").val(carto.shapes[i].width);
					$("#height").val(carto.shapes[i].height);
					//alert("contain");
				}
			}
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

function onSelectedToolChanged() {
	switch (carto.selectedTool) {
		case Tools.SELECT:
			$("#temp").css("cursor", "auto");
			break;
		case Tools.RECT:
			$("#temp").css("cursor", "crosshair");
			break;
		default:
			break;
	}
}

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
		canvas["temp"].drawRect(Tools.rect.point.x, Tools.rect.point.y, p.x - Tools.rect.point.x, p.y - Tools.rect.point.y, "#000000");
	}
}

function drawRect_onMouseDonw(e) {
	var canvasPosition = $("#temp").offset();
	var mouseX = e.clientX - canvasPosition.left || 0;
	var mouseY = e.clientY - canvasPosition.top || 0;
	Tools.rect.point = new Point(mouseX, mouseY);
	carto.drawShape = true;
}

function drawRect_onMouseUp(e) {
	var canvasPosition = $("#temp").offset();
	var mouseX = e.clientX - canvasPosition.left || 0;
	var mouseY = e.clientY - canvasPosition.top || 0;
	point2 = new Point(mouseX, mouseY);
	canvas["layer1"].drawRect(Tools.rect.point.x, Tools.rect.point.y, point2.x - Tools.rect.point.x, point2.y - Tools.rect.point.y, "#00ff00");
	carto.drawShape = false;
	canvas["temp"].clearAll();
	carto.shapes.push(new Rect(Tools.rect.point.x, Tools.rect.point.y, point2.x - Tools.rect.point.x, point2.y - Tools.rect.point.y));
	//alert(carto.shapes.length);
}