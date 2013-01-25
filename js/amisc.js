//misc
//returns element from grid characters

var wall = {};
wall.character = "#";


function elementFromCharacter(character) {
	if (character == " "){
		return undefined;
	}
	else if (character == "#")
		return wall;
	else if (creatureTypes.contains(character))
		return new (creatureTypes.lookup(character))();
}

//returns character (string form) from element on grid
function characterFromElement(element) {
	if (element == undefined)
		return " ";
	else
		return element.character;
}

function characterForBrowser(element){
	if(element == undefined){
		return "&nbsp;&nbsp;";
	}
	else return element.character;
}
function characterForDom(element){
	if(element == undefined){
		return "_";
	}
	else return element.character;
}
//dependencies
//partial function
function bind(func, object) {
	return function() {
		return func.apply(object, arguments);
	};
}

//returns stats
function getStats(object, func){
   var data = func.apply(object, this);
   var rawStats = [];
   var names = [];
   var stats = [];
   for (var x in data){      
       var s = String(data[x].object.constructor).split(" ")[1].split("(")[0];          
       rawStats.push(s);      
       if (names.indexOf(s) === -1){
            names.push(s);
            }
    }
    for (i=0; i<names.length; i++){
        var count = 0;
        index = rawStats.indexOf(names[i]);
        while (index !== -1){
            count++;
            index = rawStats.indexOf(names[i], index + 1);            
        }
        stats.push({name: names[i], count: count});

    }
    console.log(stats);
    return stats;
  
}

function getStats(object){
   var data = (object.listActingCreatures());
   var rawStats = [];
   var names = [];
   var stats = [];
   for (var x in data){      
       var s = data[x].object.name; 
       // var s = String(data[x].object.constructor).split(" ")[1].split("(")[0];          
       rawStats.push(s);      
       if (names.indexOf(s) === -1){
            names.push(s);
            }
    }
     
    names = names.sort(function(a,b){return a.length-b.length});
    for (i=0; i<names.length; i++){
        var count = 0;
        index = rawStats.indexOf(names[i]);
        while (index !== -1){
            count++;
            index = rawStats.indexOf(names[i], index + 1);            
        }
        stats.push({name: names[i], count: count});

    }
    return stats;
  
};Hello





