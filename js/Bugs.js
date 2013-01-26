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
	this.prey = "";
	
};
KillerBug.prototype.character = "$";
creatureTypes.register(KillerBug);
KillerBug.prototype.act = function(surroundings){	
	var rand = randomElement(directions.names());
	return{
		type: "kill",
		direction : rand
	};
};

//lichen creature
function Lichen() {
    this.name = "Lichen";
    this.energy = 50;
};
Lichen.prototype.character = "*";
creatureTypes.register(Lichen);
Lichen.prototype.act = function(surroundings) {
    var emptySpace = findDirections(surroundings, " ");
    if (this.energy >= 130 && emptySpace.length > 0) {
        return {
            type : "reproduce",
            direction : randomElement(emptySpace)
        };
    } else if (this.energy < 200) {
        return {
            type : "photosynthese"
        };
    } else {
        return {
            type : "wait"
        };
    }
}; 


//lichen eater creature
function LichenEater () {
    this.name = "Lichen Eater";
    this.energy = 100;
    this.direction = "ne";
}
LichenEater.prototype.character = "c";
creatureTypes.register(LichenEater);
LichenEater.prototype.act = function (surroundings){
    var emptySpace = findDirections(surroundings, " ");
    var lichenNear = findDirections(surroundings, "*");
    if (this.energy >= 500 && emptySpace.length > 0){
        return {
            type: "reproduce",
            direction: randomElement(emptySpace)
        };        
    } else if (lichenNear.length > 2) {
        return {
            type: "eat",
            direction: randomElement(lichenNear)
        };
    } else if (emptySpace.length > 0){
        if (surroundings[this.direction] != " ")
              this.direction = randomElement(emptySpace);
        return {
            type: "move",
            direction: this.direction
        };
    } else {
        return {
            type: "wait"
        };
    }
}

function EaterKiller () {
    this.name = "Eater Killer";
    this.prey = "Lichen Eater";
    this.energy = 100;  
    this.lastLocation = undefined;
    this.stepsAtLocation = 0;
    this.direction = randomElement(directions.names());
}
EaterKiller.prototype.character = "Y";
creatureTypes.register(EaterKiller);
EaterKiller.prototype.act = function (surroundings){
    var rand = randomElement(directions.names());
    var emptySpace = findDirections(surroundings, " ");
    if (emptySpace.length===0){
        return { 
            type: "wait"
            }
    } else if (this.energy >=140) { 
        return { 
            type: "reproduce",
            direction: randomElement(emptySpace)
        };
    } else if (this.energy >= 80){
        return {
            type: "move",
            direction: rand
        };
         
    } else if (this.energy < 50){ 
        return{
            type: "kill",  
            direction: rand           
        };
    } else {
        return {
            type: "move",
            direction : rand
        };
    }
}


