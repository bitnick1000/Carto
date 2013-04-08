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

function drawCircle(ctx, x, y, radius) {
	var circle_gradient = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, radius);
	circle_gradient.addColorStop(0, "#fff");
	circle_gradient.addColorStop(1, "#cc0");
	ctx.fillStyle = circle_gradient;
	// ctx.fillStyle = "rgba(200,200,100,0.7)";
	// ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
}

function drawLine(context, x1, y1, x2, y2, thickness) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineWidth = thickness;
	context.strokeStyle = "#cfc";
	context.stroke();
}

function fillRect(context, x, y, width, height, color) {
	context.beginPath();
	context.rect(x, y, width, height);
	context.fillStyle = color;
	context.fill();
}

function fillCanvasBackground()
{
	var canvas = document.getElementById('canvas1');
	var ctx = canvas.getContext('2d');
	var width=100;
	var height=100;
	for (var y = 0; y < height; y += 16) {
		for (var x = 0; x < width; x += 16) {
			fillRect(ctx, x, y, 8, 8, "#cccccc");
		}
	}
	for (var y = 8; y < height; y += 16) {
		for (var x = 8; x < width; x += 16) {
			fillRect(ctx, x, y, 8, 8, "#cccccc");
		}
	}
	for (var y = 0; y < height; y += 16) {
		for (var x = 8; x < width; x += 16) {
			fillRect(ctx, x, y, 8, 8, "#ffffff");
		}
	}
	for (var y = 8; y < height; y += 16) {
		for (var x = 0; x < width; x += 16) {
			fillRect(ctx, x, y, 8, 8, "#ffffff");
		}
	}
}
$(function() {
	//alert('init');
	fillCanvasBackground();
});