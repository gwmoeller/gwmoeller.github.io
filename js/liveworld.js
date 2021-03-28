/*
	Filename: treasury.js
	Author: Gage Moeller
	Topic: JavaScript
	Description: Get JSON files and build a live represention of WvW map regaring Borlis Pass

	LINE 67 TO ADD GUILD TAGS TO OBJECTIVES!!!!
*/

url = "https://api.guildwars2.com/v2/wvw/objectives";
url2 = "https://api.guildwars2.com/v2/wvw/matches?world=1002";
url3 = "https://api.guildwars2.com/v2/worlds?ids="
url4 = "https://api.guildwars2.com/v2/guild/"

var WorldObjectives = "";

//Grabs ids of all objectives and feeds it over to buildMap();
function getObjectives() {
	var str = "";

	$.when($.getJSON(url)).done(function(data1)  {
		$.each(data1, function(index, element) {
			str += element + ",";
		})

		buildMap(str);
	});
}

// Makes single JSON request to grab all id values.
function buildMap(value) {
	$.when($.getJSON(url + "?ids=" + value),).done(function(data1) {
		var ebgStr = "";

		$.each(data1, function(index, element) {
			if(element.map_type == "Center") {
				if(element.marker != undefined) {
					ebgStr += "<div class=\"objective\" id=\"" + element.id + "\"><img class=\"size\" id=\"" + element.name + "\" style=\"\" src=\"" + element.marker + "\"></img><p id=\"guild-tag\"></p></div>";
				}
				else {
					if(element.type == "Mercenary") {
						ebgStr += "<div class=\"objective\" id=\"" + element.id + "\"><img class=\"size\" id=\"" + element.name + "\" style=\"\" src=\"https://wiki.guildwars2.com/images/thumb/4/40/Event_poleaxes.png/20px-Event_poleaxes.png\"></img><p id=\"guild-tag\"></p></div>"
					}
					else {
						ebgStr += "<div class=\"objective\" id=\"" + element.id + "\"><img class=\"size\" id=\"" + element.name + "\" style=\"\" src=\"https://wiki.guildwars2.com/images/thumb/d/d2/Waypoint_%28map_icon%29.png/32px-Waypoint_%28map_icon%29.png\"></img><p id=\"guild-tag\"></p></div>";
					}
				}
			}
		})

		$('#ebg').html(ebgStr);
		placeObj();
		liveFunction();
	})
}


// Serves to update the map ever 100000 units swapping background colors of objectives
var built = false;

function liveFunction() {
	$.when($.getJSON(url2)).done(function(data1) {

		var guildNum = 0;

		$.each(data1.maps[0].objectives, function(index, element) {
			var curr = (document.getElementById(element.id));

			if(curr != null ) {
				curr.children[0].attributes[2].value = "background-color: dark" + element.owner + "; border: 1px solid #111111"
				
				if(element.claimed_by != undefined) {
					$.getJSON(url4 + element.claimed_by, function(data){
						curr.children[1].textContent = "[" + data.tag + "]";
					})
				}
				else {
					curr.children[1].textContent = "";
				}
			}
		})


		if(built == false) {
			var worldStr = "";
			var legend = "";

			console.log(data1.all_worlds);

			$.each(data1.all_worlds, function(index, element) {
				if(element.includes(1002)) {
					worldStr += 1002 + ",";
				}
				else {
					worldStr += element[1] + ",";
				}
			});

			var count = 0;

			$.when($.getJSON(url3 + worldStr)).done(function(data2) {
				$.each(data1.worlds, function(index, element) {
					legend += "<div class=\"world\" id=\"" + element + "\"><span class=\"legend-brick\" style=\"background-color: dark" + index + "\"></span><h5 class=\"legend-text\">" + data2[count].name + "</h5></div>"
					count++;
				})

				$('.legend').html(legend);
			})

			built = true;
		}
	})
}

// Moves objectives as need based on screen width
function placeObj() {
	var change = $(document).width();

	// var browserZoomLevel = Math.round(window.devicePixelRatio * 100)
	// console.log(browserZoomLevel/100)

	/* Formula below breaks at 250% zoom 
		
		At 90% elements are drawn towards the center of document.
		It might be possilbe to use the zoom level calculate above to fix output of map

		ie zoom-level * variable = addition to intended output
	*/

	const a = .00011786337
	const b = 1.8432633
	var c = -13.849899 - change;

	console.log(change)

	var eq = ((-b + Math.sqrt(Math.pow(b, 2) - (4*a*c)))/(2*a));

	worldObjectives = document.getElementsByClassName('objective');

	$.each(worldObjectives, function(index, element) {
		switch(element.attributes[1].value) {
			case "38-11":
				$("#38-11").css({"left": eq - 345});
				break;
			case "38-123":
				$("#38-123").css({"left": eq - 205});
				break;
			case "38-1":
				$("#38-1").css({"left": eq + 40});
				break;
			case "38-15":
				$("#38-15").css({"left": eq + 225});
				break;
			case "38-124":
				$("#38-124").css({"left": eq - 10});
				break;
			case "38-3":
				$("#38-3").css({"left": eq - 295});
				break;
			case "38-17":
				$("#38-17").css({"left": eq - 105});
				break;
			case "38-7":
				$("#38-7").css({"left": eq + 115});
				break;
			case "38-125":
				$("#38-125").css({"left": eq + 190});
				break;
			case "38-126":
				$("#38-126").css({"left": eq + 30});
				break;
			case "38-9":
				$("#38-9").css({"left": eq});
				break;
			case "38-5":
				$("#38-5").css({"left": eq + 185});
				break;
			case "38-21":
				$("#38-21").css({"left": eq + 175});
				break;
			case "38-20":
				$("#38-20").css({"left": eq + 120});
				break;
			case "38-14":
				$("#38-14").css({"left": eq - 95});
				break;
			case "38-13":
				$("#38-13").css({"left": eq - 230});
				break;
			case "38-6":
				$("#38-6").css({"left": eq - 225});
				break;
			case "38-2":
				$("#38-2").css({"left": eq + 270});
				break;
			case "38-12":
				$("#38-12").css({"left": eq - 190});
				break;
			case "38-16":
				$("#38-16").css({"left": eq + 70});
				break;
			case "38-22":
				$("#38-22").css({"left": eq + 319});
				break;
			case "38-19":
				$("#38-19").css({"left": eq + 120});
				break;
			case "38-4":
				$("#38-4").css({"left": eq - 130});
				break;
			case "38-8":
				$("#38-8").css({"left": eq + 275});
				break;
			case "38-10":
				$("#38-10").css({"left": eq - 300});
				break;
			case "38-130":
				$("#38-130").css({"left": eq + 365});
				break;
			case "38-18":
				$("#38-18").css({"left": eq - 120});
				break;
			case "38-131":
				$("#38-131").css({"left": eq - 440});
				break;
		}
	})
}

/*
	Toggles Banner for viewing (helps with phone viewing to get that sucker outta the way)
*/
function toggleHero(value) {
	if(value == "0") {
		$('#collapse-hero').attr('value', '1');
		$('#collapse-hero').html('Show Banner');
		$(".hero-text2 > h1, h4").css({"opacity": "0", "transition": "all .5s ease-out"});
		$("#collapse-hero").animate({left: '0px'});
	}
	else {
		$('#collapse-hero').attr('value', '0');
		$('#collapse-hero').html('Hide Banner');
		$(".hero-text2 > h1, h4").css({"opacity": "1", "transition": "all .5s ease-out"});
		$("#collapse-hero").animate({left: '70%'});
	}
}

window.onresize = placeObj;
window.onload=getObjectives();
setInterval(liveFunction,10000);