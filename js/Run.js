//running




var thePlan = ["############################",
			   "#*            Y           *#",
			   "#            *             #",
			   "#          #####           #",
			   "##        *#   #    ##     #",
			   "###        #*  #     #     #",
			   "#          #####     #     #",
			   "#   ####                c  #",
			   "#   ##*                    #",
			   "#   #                  #####",
			   "# * #       *             *#",
			   "############################"]; 
					   


/*
var thePlan = ["############################",
               "#                     ######",
               "#    ***                **##",
               "#   *##**         **  c  *##",
               "#    ***     c    ##**    *#",
               "#                 ##***   *#",
               "#                 ##**    *#",
               "#           #*            *#",
               "#*          #**           *#",
               "#***        ##**    Y    **#",
               "#*****     ###***       *###",
               "############################"];*/

               
//var terrarium = new Terrarium(thePlan);                       
var terrarium = new LifeLikeTerrarium(thePlan);

function paint() {

	var testText = terrarium.toDom().split("\n"); 
	var docfrag = document.createDocumentFragment();

	testText.forEach(function(e) {
		var li = document.createElement("li");

		li.textContent = e.replace(/,/g, "");
		docfrag.appendChild(li);
	})
	//creates a 2new span and appends the String blueprint
	var span1 = document.getElementById("one");
	var newSpan = document.createElement("span");
	var parent = span1.parentNode;

	//uses replace child to refresh itself at every interval
	newSpan.appendChild(docfrag);
	newSpan.setAttribute("id", "one");
	parent.replaceChild(newSpan, span1);
	terrarium.step();
}

