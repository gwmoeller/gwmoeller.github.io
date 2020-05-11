var url = "https:api.guildwars2.com/v2/guild/32525C62-CE73-EA11-81AC-95DFE50946EB/treasury?access_token=6C82128E-774C-714A-B5E5-0ED0ECD1660DC1A2435C-2735-45D8-9A54-B710D22AB313";

$.getJSON(url, function(data){
	var obj = [];
    var count =[];
    var need = [];
    var rem = [];
    var string = [];
    
    //grabs item_id's
	$.each(data, function(index, element) {
		obj.push(element.item_id);
	});
	
	//grabs total desposited
	$.each(data, function(index, element) {
		count.push(element.count);
	});

	//iterates through and grabs need number
	$.each(data, function(index, element) {
		$.each(element.needed_by, function(v, g) {
			var num = need[index]
			if (v > 0) {
				num += parseInt(element.needed_by[v].count);
				need[index] = num;
			}
			else {
				need.push(parseInt(element.needed_by[v].count));
				var num = 0;
			}
		});
	});

	//math to see which item has a remaining balance
	$.each(data, function(index, element) {
		rem.push(need[index] - count[index]);
	});

	//creates string of items with a remaining balance strings
	//get item names
	$.each(data, function(index, element) {
		$.getJSON("https://api.guildwars2.com/v2/items/" + obj[index], function(item){
			if (rem[index] != 0) {
				string.push('<img src="' + item.icon + '">' +"<b>" + item.name + "</b>" + "<span> " + rem[index] + "</span>" + "<br/><br/>");
			}

			//string.sort();
			$('#test').html(string);
		});
	});
});
