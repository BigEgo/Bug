function clone(object) {
	function OneShotConstructor() {
	}
	OneShotConstructor.prototype = object;
	return new OneShotConstructor();
}

function LifeLikeTerrarium(plan) {
	Terrarium.call(this, plan);
}

LifeLikeTerrarium.prototype = clone(Terrarium.prototype);
LifeLikeTerrarium.prototype.constructor = LifeLikeTerrarium; 


LifeLikeTerrarium.prototype.processCreature = function(creature) {    
 	var surroundings = this.listSurroundings(creature.point);
	var action = creature.object.act(surroundings);
	var target = undefined;
	var valueAtTarget = undefined;
	if (action.direction && directions.contains(action.direction)) {
		var direction = directions.lookup(action.direction);
		var maybe = creature.point.add(direction);
		if (this.grid.isInside(maybe)) {
			target = maybe;
			valueAtTarget = this.grid.valueAt(target);
		}
	}

	if (action.type == "move") {
		if (target && !valueAtTarget) {
			this.grid.moveValue(creature.point, target);
			creature.point = target;
			creature.object.energy -= 1;
		}
	} else if (action.type == "eat") {
		if (valueAtTarget && valueAtTarget.energy) {
			this.grid.setValueAt(target, undefined);
			creature.object.energy += valueAtTarget.energy;
		}
	} else if (action.type == "photosynthese") {
		creature.object.energy += 20;
	} else if (action.type == "reproduce") {
		if (target && !valueAtTarget) {
			var species = characterFromElement(creature.object);
			var baby = elementFromCharacter(species);
			creature.object.energy /= 2;
			if (creature.object.energy > 0)
				this.grid.setValueAt(target, baby);
		}
	} else if (action.type == "wait") {
		creature.object.energy -= 2;
	} else if (action.type == "kill"){
            //kill action for the @ bug. determines proximity to other bugs with distance formula.                   
            var currentLocation = creature.point;
            var stepsAtLocation = creature.object.stepsAtLocation;
            var nearest = this.nearestTarget(currentLocation, creature.object.prey);   
            if (nearest !== undefined) {                                          
                //if any creature comes near the killer bug, it will eat the bug and consume its soul to reproduce itself
                if (nearest.distance<2){               
                    creature.object.energy += nearest.energy;      
                    this.grid.removeValue(nearest.point);
                }
                //if the creature stays still at the same location for more than x steps, it will move in a random direction to attempt to be unstuck
                if(creature.object.stepsAtLocation > 2 && nearest.object !== undefined){
                    var to = currentLocation.add(directions.lookup(action.direction));
                    if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined)
                    this.grid.moveValue(currentLocation, to);
                    creature.object.stepsAtLocation++;              
                }
                
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
                            //moves in y direction if x is blocked
                            } else if (this.grid.valueAt(currentLocation.add(new Point(0, yDirection))) == undefined) {
                                this.grid.moveValue(currentLocation, currentLocation.add(new Point(0, yDirection)));
                            }                             
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
                }
                
                
                //reference previous location in the creature object
                if (creature.object.stepsAtLocation > 5){
                    creature.object.stepsAtLocation = 0;
                }
                creature.object.lastLocation = currentLocation;
                creature.object.energy -= 1;
               
        //throws error if the actions is unsupported
        } else {
		throw new Error("Unsupported action: " + action.type);
	}

	if (creature.object.energy <= 0){	   
	    if (creature.object.name == "Eater Killer"){	        
	        var rand = Math.ceil(Math.random()*10);
	        if (rand === 1){
	             console.log(creature.object.name + " spawns two monsters!");
                this.grid.setValueAt(creature.point, elementFromCharacter("c"));
            } else{ 
                this.grid.setValueAt(creature.point, undefined);
            }
        } else {
		   this.grid.setValueAt(creature.point, undefined);
		}
		
	}	
}; 

function findDirections(surroundings, wanted) {
    var found = [];    
    directions.each(function(name) {
        if (surroundings[name] == wanted) {
            found.push(name);
        }
    });
    return found;

}


