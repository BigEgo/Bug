//point constructor
function Point(x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.add = function(other) {
	return new Point(this.x + other.x, this.y + other.y);
};
Point.prototype.isEqualTo = function(other) {
	return this.x == other.x && this.y == other.y;
};

//returns the string for the point value
Point.prototype.toString = function() {
	return "(" + this.x + "," + this.y + ")";
};
//distance between two points
Point.prototype.distance = function(point){
	return Math.sqrt(Math.pow(this.x-point.x,2)+Math.pow(this.y-point.y,2));
}

