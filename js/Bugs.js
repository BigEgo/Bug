//registering new bugs
//directions for bugs to move in
var directions = new Dictionary({
	"n" : new Point(0, -1),
	"ne" : new Point(1, -1),
	"e" : new Point(1, 0),
	"se" : new Point(1, 1),
	"s" : new Point(0, 1),
	"sw" : new Point(-1, 1),
	"w" : new Point(-1, 0),
	"nw" : new Point(-1, -1)
});

var creatureTypes = new Dictionary();
creatureTypes.register = function(constructor) {
	this.store(constructor.prototype.character, constructor);
};

//random value as a direction 
function randomElement(array) {
	if (array.length === 0) {
		throw new Error("the array is empty yo");
	}
	return array[Math.floor(Math.random() * array.length)];
}


//Bugs type
//stupid bug only moves south
function StupidBug() {
	this.name = "Stupid Bug";
};
StupidBug.prototype.character = "o";
creatureTypes.register(StupidBug);
StupidBug.prototype.act = function(surroundings) {
	return {
		type : "move",
		direction : "s"
	};
};


//bouncing bug toggles directions
function BouncingBug() {
	this.name = "Bouncing Bug";
};
BouncingBug.prototype.character = "!";
creatureTypes.register(BouncingBug);
BouncingBug.prototype.act = function(surroundings) {
	if (surroundings[this.direction] != " "){
		result = "";
		//
		switch(this.direction){
			case "n":  result = "s";  break;
			case "s":  result = "n";  break;
			case "w":  result = "e";  break;
			case "e":  result = "w";  break;
			case "ne": result = "se"; break;
			case "se": result = "ne"; break;
			case "nw": result = "sw"; break;
			case "sw": result = "nw"; break;
			default:   result = "n";    break;
		}
		this.direction = result;
	}
	return {
		type : "move",
		direction : this.direction
	};
};


//drunk bug picks a random direction from the array 
function DrunkBug() {
	this.name = "Drunk Bug";
};
DrunkBug.prototype.character = "~";
creatureTypes.register(DrunkBug);
DrunkBug.prototype.act = function(surroundings) {
	var rand = randomElement(directions.names());
	return {
		type : "move",
		direction : rand
	};
};


//kills other bugs!
function KillerBug(){
	this.name = "Killer Bug";
	this.lastLocation = undefined;
	this.stepsAtLocation = 0;
	
};
KillerBug.prototype.character = "*";
creatureTypes.register(KillerBug);
KillerBug.prototype.act = function(surroundings){	
	var rand = randomElement(directions.names());
	return{
		type: "kill",
		direction : rand
	};
};
