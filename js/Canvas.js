function Canvas(id) {
	this.canvas = document.getElementById(id);
	this.context = this.canvas.getContext('2d');
	this.canvas.onselectstart = function() {
		return false;
	} // ie
	this.canvas.onmousedown = function() {
		return false;
	} // mozilla
}
Canvas.prototype.drawCircle = function(x, y, radius) {
	var circle_gradient = this.context.createRadialGradient(x - 3, y - 3, 1, x, y, radius);
	circle_gradient.addColorStop(0, "#fff");
	circle_gradient.addColorStop(1, "#cc0");
	this.context.fillStyle = circle_gradient;
	// this.context.fillStyle = "rgba(200,200,100,0.7)";
	// this.context.fillStyle = "red";
	this.context.beginPath();
	this.context.arc(x, y, radius, 0, Math.PI * 2, true);
	this.context.closePath();
	this.context.fill();
}
Canvas.prototype.drawLine = function(x1, y1, x2, y2, thickness) {
	this.context.beginPath();
	this.context.moveTo(x1, y1);
	this.context.lineTo(x2, y2);
	this.context.lineWidth = thickness;
	this.context.strokeStyle = "#cfc";
	this.context.stroke();
}
Canvas.prototype.drawRect = function(x, y, width, height, color) {
	this.context.beginPath();
	this.context.rect(x, y, width, height);
	this.context.strokeStyle = color;
	this.context.stroke();
}
Canvas.prototype.fillRect = function(x, y, width, height, color) {
	this.context.beginPath();
	this.context.rect(x, y, width, height);
	this.context.fillStyle = color;
	this.context.fill();
}
Canvas.prototype.clearAll = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}