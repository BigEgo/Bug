//running
function paint() {
    window.getLastTR = function () {
        return currentRow;
    }
    var text = terrarium.toDom();    
    var docfrag = document.createDocumentFragment();
    var table = document.createElement("table");         
    var currentRow = undefined;
    text.forEach(function(e,v) {        
        if (e===">"){                      
            var tr = document.createElement("tr");
            tr.setAttribute("id", "row"+v);            
            table.appendChild(tr);
            currentRow = "row"+v;
        } else {
            var td = document.createElement("td");
           // var lastRow = document.getElementById(lastTR);
            td.textContent = e;
            td.setAttribute("id", v);
            table.appendChild(td);
        }
        
    })
    docfrag.appendChild(table);
    //creates a 2new span and appends the String blueprint
    var span1 = document.getElementById("one");
    var newSpan = document.createElement("span");
    var parent = span1.parentNode;

    //uses replace child to refresh itself at every interval
    newSpan.appendChild(docfrag);
    newSpan.setAttribute("id", "one");
    parent.replaceChild(newSpan, span1);
    

	//stats
	var statsDiv = document.getElementById("stats");
	var statsSpan = document.createElement("span");
	var statsParent = statsDiv.parentNode;
	var statsFrag = document.createDocumentFragment();
	var stats = getStats(terrarium).sort();
	var currentTime = new Date().getTime();
    var time = timer();
    var timeFrag = document.createElement("li");
    var stepsFrag = document.createElement("li");          

    stats.forEach(function(e, i) {
        var table = document.createElement("li");
        table.textContent = e.name + ": " + e.count;
        statsFrag.appendChild(table);
    });
    
    timeFrag.textContent = "Time Elapsed: " + ((time[0] || 0)/1000).toFixed(1) + " seconds.";
    stepsFrag.textContent = "Steps Taken: " + (time[1] || 0);
    statsFrag.appendChild(stepsFrag);
    statsFrag.appendChild(timeFrag);
    statsSpan.appendChild(statsFrag);
    statsSpan.setAttribute("id", "stats");
    statsParent.replaceChild(statsSpan, statsDiv);
 
 
	//step for moving the terrarium through time
	terrarium.step();
}

