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



