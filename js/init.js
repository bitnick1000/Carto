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
	SIMULATE: 3,
	select: {
		selectedIndex: -1
	},
	rect: {
		point: new Point(),
		ss: 0
	},
	simulate: {
		world: undefined,
		looping: false
	}
};
var carto = {
	shapes: [],
	selectedTool: Tools.RECT,
	drawShape: false,
};
var canvas = {
	bottom: new Canvas("bottom"),
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
	$("#tool_simulate").click(function(e) {
		//alert("simulate begin");
		carto.selectedTool = Tools.SIMULATE;
		onSelectedToolChanged();
		Tools["simulate"].world = createWorld();
		for (var i = 0; i < carto.shapes.length; i++) {
			if (carto.shapes[i] instanceof Rect) {
				createRect(Tools["simulate"].world, carto.shapes[i].x, carto.shapes[i].y, carto.shapes[i].width, carto.shapes[i].height, 0);
			}
		}
		// createRect(Tools["simulate"].world, 270, 250, 250, 25, 0);
		// createRect(Tools["simulate"].world, 500, 250, 65, 15, -10);
		// createRect(Tools["simulate"].world, 600, 225, 80, 15, -20);
		// createRect(Tools["simulate"].world, 1100, 250, 100, 15, 0);
		//createRect(Tools["simulate"].world, carto.shapes[0].x, carto.shapes[0].y, carto.shapes[0].width, carto.shapes[0].height, 0);
		//car = createCarAt(80, 180);
		if (Tools["simulate"].looping == false) {
			step();
			Tools["simulate"].looping = true;
		}
	});

	$("#temp").mousedown(function(e) {
		//alert("#temp mousedown");
		if (carto.selectedTool == Tools.RECT) {
			console.log("drawRect_onMouseDonw");
			drawRect_onMouseDonw(e);
		}
	});

	$("#temp").click(function(e) {
		//alert("#temp click");
		var canvasPosition = $("#temp").offset();
		var x = e.clientX - canvasPosition.left || 0;
		var y = e.clientY - canvasPosition.top || 0;
		if (carto.selectedTool == Tools.SELECT) {

			for (var i = 0; i < carto.shapes.length; i++) {
				if (carto.shapes[i].contains(x, y)) {
					Tools.select.selectedIndex = i;
					$("#x").val(carto.shapes[i].x);
					$("#y").val(carto.shapes[i].y);
					$("#width").val(carto.shapes[i].width);
					$("#height").val(carto.shapes[i].height);
					//alert("contain");
				}
			}
		} else if (carto.selectedTool == Tools.SIMULATE) {
			createWheel(Tools["simulate"].world, x, y);
		}
	});
	$("#temp").mousemove(function(e) {
		if (carto.selectedTool == Tools.RECT) {
			console.log("drawRect_onMouseMove");
			drawRect_onMouseMove(e);
		}

	});
	$("#temp").mouseup(function(e) {
		if (carto.selectedTool == Tools.RECT) {
			console.log("drawRect_onMouseUp");
			drawRect_onMouseUp(e);
		}
	});
	$(document).keydown(function(e) {
		switch (e.keyCode) {
			case 88:
				// x key to apply force towards right
				//alert("x");
				var force = new b2Vec2(10000000, 0);
				car.ApplyForce(force, car.GetCenterPosition());
				break;
			case 90:
				// z key to apply force towards left
				// alert("z");
				var force = new b2Vec2(-10000000, 0);
				car.ApplyForce(force, car.GetCenterPosition());
				break;
		}
	});
	$(window).resize(function() {
		onResize();
	});
	onResize();

	// var img = new Image();
	// img.src = "images/rect.png";
	var img = document.getElementById("image1");
	img.src="images/rect.png";
	// img.onload = function() {
	// 	canvas = document.getElementById("background");
	// 	context = canvas.getContext('2d');
	// 	context.drawImage(img, 0, 0, 500, 500);
	// }
});

function onSelectedToolChanged() {
	switch (carto.selectedTool) {
		case Tools.SELECT:
			$("#temp").css("cursor", "auto");
			break;
		case Tools.RECT:
			$("#temp").css("cursor", "crosshair");
			//$("#layer1").css("display", "block");
			$("#simulator").css("display", "none");
			break;
		case Tools.SIMULATE:
			//alert("sss");
			$("#temp").css("cursor", "auto");
			//$("#layer1").css("display", "none");
			$("#simulator").css("display", "block");
			//$("#bottom").css("display", "none");
			break;
		default:
			break;
	}
}

function onResize() {
	var width = $(window).width() - $("#left_tool_container").width() - $("#right_tool_container").width() - 80;
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
		// var canvas = document.getElementById("background");
		// var context = this.canvas.getContext('2d');
		// 		context.clearRect(0, 0, canvas.width, canvas.height);

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

function createWorld() {
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-4000, -4000);
	worldAABB.maxVertex.Set(4000, 4000);
	var gravity = new b2Vec2(0, 300);
	var doSleep = false;
	var world = new b2World(worldAABB, gravity, doSleep);
	return world;
}

function drawShape(shape, context) {
	//console.log("drawShape");
	context.strokeStyle = '#000000';
	context.beginPath();
	switch (shape.m_type) {
		case b2Shape.e_circleShape:
			{
				var circle = shape;
				var pos = circle.m_position;
				var r = circle.m_radius;
				var segments = 16.0;
				var theta = 0.0;
				var dtheta = 2.0 * Math.PI / segments;
				// draw circle
				context.moveTo(pos.x + r, pos.y);
				for (var i = 0; i < segments; i++) {
					var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
					var v = b2Math.AddVV(pos, d);
					context.lineTo(v.x, v.y);
					theta += dtheta;
				}
				context.lineTo(pos.x + r, pos.y);

				// draw radius
				context.moveTo(pos.x, pos.y);
				var ax = circle.m_R.col1;
				var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
				context.lineTo(pos2.x, pos2.y);
			}
			break;
		case b2Shape.e_polyShape:
			{
				var poly = shape;
				var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
				context.moveTo(tV.x, tV.y);
				for (var i = 0; i < poly.m_vertexCount; i++) {
					var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
					context.lineTo(v.x, v.y);
				}
				context.lineTo(tV.x, tV.y);
			}
			break;
	}
	context.stroke();
}

function drawWorld(world, context) {
	//console.log("drawWorld");
	for (var b = world.m_bodyList; b != null; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}


function step() {
	if (Tools["simulate"].world != undefined) {
		console.log("step");
		Tools["simulate"].world.Step(1.0 / 60, 1);
		canvas["simulator"].clearAll();
		drawWorld(Tools["simulate"].world, canvas["simulator"].context);
		setTimeout(step, 10);
	}
}

function createRect(world, x, y, width, height, rotation) {
	width /= 2;
	height /= 2;
	x += width;
	y += height;
	//box shape definition
	var shape = new b2BoxDef();
	//shape.density = 1.0;
	shape.extents.Set(width, height);
	shape.restitution = 0.4;
	//body definition with the given shape we just created.
	var body = new b2BodyDef();
	body.AddShape(shape);
	body.position.Set(x, y);
	body.rotation = rotation * Math.PI / 180;
	var ret = world.CreateBody(body);

	return ret;
}

function createWheel(world, x, y) {
	// wheel circle definition
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 10;
	ballSd.restitution = 0.4;
	ballSd.friction = 4.3;
	// body definition
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x, y);
	return world.CreateBody(ballBd);
}

function createCarAt(x, y) {
	// the car box definition
	var boxSd = new b2BoxDef();

	boxSd.density = 1.0;
	boxSd.friction = 1.5;
	boxSd.restitution = 0.4;
	boxSd.extents.Set(40, 20);
	// the car body definition
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x, y);
	var carBody = Tools["simulate"].world.CreateBody(boxBd);
	// creating the wheels
	var wheelBody1 = createWheel(Tools["simulate"].world, x - 25, y + 20);
	var wheelBody2 = createWheel(Tools["simulate"].world, x + 25, y + 20);
	// create a joint to connect left wheel with the car body
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x - 25, y + 20);
	jointDef.body1 = carBody;
	jointDef.body2 = wheelBody1;
	Tools["simulate"].world.CreateJoint(jointDef);
	// create a joint to connect right wheel with the car body
	var jointDef = new b2RevoluteJointDef();
	jointDef.anchorPoint.Set(x + 25, y + 20);
	jointDef.body1 = carBody;
	jointDef.body2 = wheelBody2;
	Tools["simulate"].world.CreateJoint(jointDef);
	return carBody;
}