//terrarium constructor
function Terrarium(plan) {
	var grid = new Grid(plan[0].length, plan.length);
	for (var y = 0; y < plan.length; y++) {
		var line = plan[y];
		for (var x = 0; x < line.length; x++) {
			grid.setValueAt(new Point(x, y), elementFromCharacter(line.charAt(x)));
		}
	}
	this.grid = grid;
};

//returns the grid to a string;
Terrarium.prototype.toString = function() {
	var characters = [],
		endOfLine = this.grid.width - 1;
	this.grid.each(function(point, value) {
		characters.push(characterFromElement(value));
		if (point.x == endOfLine) {
			characters.push("\n");
		}
	});
	return characters.join(" ");
};

//returns the grid to a HTML friendly format
Terrarium.prototype.toBrowser = function() {
  var characters = [" "],
  	  endOfLine = this.grid.width-1;
  this.grid.each(
  	function(point, value){
  		characters.push(characterForBrowser(value));
  		if (point.x == endOfLine){
  			characters.push("<br>");
  		}
  	}
  );
  return characters.join("&nbsp;");
};

//returns a string grid for friendly for DOM purposes
Terrarium.prototype.toDom = function() {
  var characters = [""],
  	  endOfLine = this.grid.width-1;
  this.grid.each(
  	function(point, value){
  		characters.push(characterForDom(value));
  		if(point.x == endOfLine){
  			characters.push("\n");
  		}
  	}
  );
  return String(characters.join(" "));
};

//find active creatures and returns an array 
Terrarium.prototype.listActingCreatures = function() {
	var found = [];
	//loops through the grid and return values that stores an object
	this.grid.each(function(point, value) {
		if (value != undefined && value.act)
			found.push({
				object : value,
				point : point
			});
	});
	return found;
};

//list surrounding around the creature
Terrarium.prototype.listSurroundings = function(center) {
	var result = {},
		grid = this.grid;
	//loops through directions list and use coords to determine objects around a center point
	directions.each(function(name, direction) {
		var place = center.add(direction);
		if (grid.isInside(place)){
			result[name] = characterFromElement(grid.valueAt(place));	
		} else {
			result[name] = "#";
		}
	});
	return result;
};

//process the creature and assign actions
Terrarium.prototype.processCreature = function(creature) {
	var surroundings = this.listSurroundings(creature.point),
		action = creature.object.act(surroundings);
	if (action.type == "move" && directions.contains(action.direction)) {
		//looks for the move prototype from the bugs and moves in direction specified
		var to = creature.point.add(directions.lookup(action.direction));
		if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined)
			this.grid.moveValue(creature.point, to);
	} else if (action.type == "kill"){
			//kill action for the @ bug. determines proximity to other bugs with distance formula.
			var currentLocation = creature.point,
				stepsAtLocation = creature.object.stepsAtLocation;
				nearest = {distance: 999};
			//loops through the active creatures and pushes the one nearest to killer bug (distance formula).
			this.forEach(
					this.listActingCreatures(), 
					function(x){
						if(x.object!==creature.object && x.object.name !== "Killer Bug"){
							if(currentLocation.distance(x.point) <= nearest.distance)
								nearest = {
									object: x,
									point: x.point,
									distance: currentLocation.distance(x.point),
									name: x.object.name
								};
						}								
				});			
			
			//if any creature comes near the killer bug, it will eat the bug and consume its soul to reproduce itself
			if (nearest.distance<=1){
				var nearestPoint = nearest.point;
				console.log(nearest.name + " got eaten");
				this.grid.removeValue(nearest.point);
				this.grid.setValueAt(nearestPoint, elementFromCharacter(creature.object.character));
			}
			//if the creature stays still at the same location for more than x steps, it will move in a random direction to attempt to be unstuck
			if(creature.object.stepsAtLocation > 2 && nearest.object !== undefined){
				var to = currentLocation.add(directions.lookup(action.direction));
				if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined)
				this.grid.moveValue(currentLocation, to);
				creature.object.stepsAtLocation++;				
				console.log('shift random');
			}
			if(nearest.object !== undefined){
				//if there's a creature to eat, @ will seek them out
				//directions is determined by the differences in x and y values
				var xDifference = currentLocation.x - nearest.point.x,
					yDifference = currentLocation.y - nearest.point.y,
					xDirection = null,
					yDirection = null;		
				//determine if the x and y should be added or subtracted				
				if (xDifference > 0){
					xDirection = -1;				
				} else if (xDifference < 0){
					xDirection = 1;
				} else {
					xDirection = 0;
				}
				if (yDifference > 0){
					yDirection =-1;
				} else if (yDifference < 0){
					yDirection = 1;
				} else {
					yDirection = 0;
				}				
				var to = currentLocation.add(new Point(xDirection, yDirection));	
				
				//move the creature if it's inside the grid
				if (this.grid.isInside(to)){
					//moves if the to location is empty
					if (this.grid.valueAt(to)==undefined){
						this.grid.moveValue(currentLocation, to);
					} else {
						//moves if x is empty but y is blocked
						if (this.grid.valueAt(currentLocation.add(new Point(xDirection, 0))) == undefined) {
							this.grid.moveValue(currentLocation, currentLocation.add(new Point(xDirection, 0)));
							console.log("Shift x");
						//moves in y direction if x is blocked						} else if (this.grid.valueAt(currentLocation.add(new Point(0, yDirection))) == undefined) {
							this.grid.moveValue(currentLocation, currentLocation.add(new Point(0, yDirection)));
							console.log("Shift Y");
						} 
						/*else if (this.grid.valueAt(currentLocation.add(new Point(0, yDirection))) != undefined
									&& this.grid.valueAt(currentLocation.add(new Point(xDirection, 0))) != undefined
									&& this.grid.valueAt(currentLocation.add(new Point(-xDirection, yDirection))) == undefined) {
										this.grid.moveValue(currentLocation, currentLocation.add(new Point(-xDirection, yDirection)));
										console.log("shift backwards");
									} */
					}
				}
						
			} else {
				var to = currentLocation.add(directions.lookup(action.direction));
				if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined)
				this.grid.moveValue(currentLocation, to);
			}
			
			//determines how many steps the creature has been stationary for.
			if (creature.object.lastLocation != undefined && currentLocation.x == creature.object.lastLocation.x && currentLocation.y == creature.object.lastLocation.y){
				creature.object.stepsAtLocation++;
				console.log(creature.object.name + " stayed at: "+ currentLocation + "for " + creature.object.stepsAtLocation + " steps.");
			}
			
			
			//reference previous location in the creature object
			if (creature.object.stepsAtLocation > 5){
				creature.object.stepsAtLocation = 0;
			}
			creature.object.lastLocation = currentLocation;
			
			
		//throws error if the actions is unsupported
		} else {
		throw new Error("Unsupported action: " + action.type);
	}
};

//loops through objects and perform an action
Terrarium.prototype.forEach = function(object, action){
	for(var x in object){
			action(object[x]);
	}
	
};
//making the grid refresh walk
Terrarium.prototype.step = function() {
	this.forEach(this.listActingCreatures(), bind(this.processCreature, this));
	// if (this.onStep)
		// this.onStep();
};

/*
 old ported code that is not relevant
 ///starting the set interval
Terrarium.prototype.start = function() {
	if (!this.running)
		this.running = setInterval(bind(this.step, this), 500);
};
//stoping the interval

Terrarium.prototype.stop = function() {
	if (this.running) {
		clearInterval(this.running);
		this.running = null;
	}
};
 */