'use strict';

/*
* Written by Laurens / Razpudding
* Possible improvements:
* Rewrite to functional programming
* Make code dynamic and tie it to an html form that allows user to uplad a file and specifiy how it should be manipulated
*/

//Define and switch sources using line below
var source = "http://codepen.io/Razpudding/pen/OMdEzE.js";

//Define a function for the type of data we'll be parsing (csv, ";" delimited)
var dsv = d3.dsv(";", "text/plain");

var parsedCSV,
	outputArray = [],
	keys = [],
	extraKeys = [],
	interviews = [],
	seasons = ["Dry Season", "Wet Season", ".z"],
	outputSeasons = ["Dry", "Wet", ".z"];

var columns = ["A8a_Crop_Rotation", "A8b_planting_date", "A8c_harvest_date", "A8d_area_planted_m2", "A8e_number_polybags", "A8f_yield_kg", "A8g_pricekg_Rp", "A8h_price_contract_Rp", "A8i_seed_generation", "A_8j_rented_owned", "A_8k_rentedfee_Rp", "A8l_rentedfee_year_Rp", "A8m_soil_condition", "A8n_weather_condition"];

var baseColumns = 14,
	intColumn = 3,
	seasColumn = 7,

var maxesArray = new Array(seasons.length);
for (var i = 0; i < maxesArray.length; i++) {
	maxesArray[i] = 0;
}

//Call this function with the right data source and manipulate its contents
d3.text(source, function(error, data) {
	parsedCSV = dsv.parseRows(data); //parse the csv rows
	//console.table(parsedCSV)
	keys = parsedCSV[0];
	//console.log("keys: ");
	//console.log(keys);

	var intId, seasonId;

	for (var r = 1;  r < parsedCSV.length; r++) {
		//Check if there isnt something wrong with the data
		try {
			intId = parsedCSV[r][intColumn];
		} catch (err) {
			console.log("errrr: " + err.message);
		}
		seasonId = seasons.indexOf(parsedCSV[r][seasColumn]);
		
		//Create an empty array for each intId and then a subarray for each seasonId
		if (!outputArray[intId]) {
			outputArray[intId] = [];
		}
		if (!outputArray[intId][seasonId]) {
			outputArray[intId][seasonId] = [];
		}
		
		//For eacht int-season combi, make an object holding all the relevant info for that combi
		outputArray[intId][seasonId].push({
			ID_Holding: parsedCSV[r][keys.indexOf("ID_Holding")],
			_04_InterventionProgramme: parsedCSV[r][keys.indexOf("_04_InterventionProgramme")],
			_05_InterventionCrop: parsedCSV[r][keys.indexOf("_05_InterventionCrop")],
			ID_Interview: parsedCSV[r][keys.indexOf("ID_Interview")],
			BaseEndLine: parsedCSV[r][keys.indexOf("BaseEndLine")],
			ID_A8: parsedCSV[r][keys.indexOf("ID_A8")],
			ID_A8_Old: parsedCSV[r][keys.indexOf("ID_A8_Old")],

			A8a_Crop_Rotation: parsedCSV[r][keys.indexOf("A8a_Crop_Rotation")],
			A8b_planting_date: parsedCSV[r][keys.indexOf("A8b_planting_date")],
			A8c_harvest_date: parsedCSV[r][keys.indexOf("A8c_harvest_date")],
			A8d_area_planted_m2: parsedCSV[r][keys.indexOf("A8d_area_planted_m2")],
			A8e_number_polybags: parsedCSV[r][keys.indexOf("A8e_number_polybags")],
			A8f_yield_kg: parsedCSV[r][keys.indexOf("A8f_yield_kg")],
			A8g_pricekg_Rp: parsedCSV[r][keys.indexOf("A8g_pricekg_Rp")],
			A8h_price_contract_Rp: parsedCSV[r][keys.indexOf("A8h_price_contract_Rp")],
			A8i_seed_generation: parsedCSV[r][keys.indexOf("A8i_seed_generation")],
			A8j_rented_owned: parsedCSV[r][keys.indexOf("A8j_rented_owned")],
			A8k_rentedfee_Rp: parsedCSV[r][keys.indexOf("A8k_rentedfee_Rp")],
			A8l_rentedfee_1year_Rp: parsedCSV[r][keys.indexOf("A8l_rentedfee_1year_Rp")],
			A8m_soil_condition: parsedCSV[r][keys.indexOf("A8m_soil_condition")],
			A8n_weather_condition: parsedCSV[r][keys.indexOf("A8n_weather_condition")],
		});
		
		//Check if the current interview has the most crops for this seasonId
		maxesArray[seasonId] = Math.max(maxesArray[seasonId], outputArray[intId][seasonId].length);
		if (interviews.indexOf(outputArray[intId][seasonId][0].ID_Interview) == -1) {
			interviews.push(outputArray[intId][seasonId][0].ID_Interview);
		}
	}
	// console.log("interviews: ");
	// console.table(interviews);

	// console.log("maxes: ");
	//console.table(maxesArray);
	
	//tableThis();
	console.log("csv is outputting: " + csvThis());
	tableThis();
});

function csvThis() {
	var outputString = "";

	//Building the header string with all the new column types
	// For each of the three seasons (well there is a third of undefined actually)
	for (var season in outputSeasons) {
		for (var max = 0; max < maxesArray[season]; max++) {
			for (var c in columns) {
				extraKeys.push(outputSeasons[season] + max + "_" + columns[c]);
			}
		}
	}
	console.log("extraKeys \n" + extraKeys);
	//Add the extra keys to the original keys array
	keys.splice.apply(keys, [seasColumn, 0].concat(extraKeys));
	//Build the first line of the outputstring by concating all the keys
	for (var key in keys) {
		outputString += (keys[key] + ";");
	}
	outputString += "\n";

	//start building a line
	var l;
	for (var i in interviews) {
		if (outputArray[interviews[i]] != null) {
			//console.log("found interview: \n" + outputArray[interviews[i]]);

			l = '';
			var leadSixAdded = false; //check if the first 6 columns have already been added for this combo
			for (var s in seasons) {
				//Check if this interview has this season
				if (outputArray[interviews[i]][s] != null) {
					//Add the first 7 key values
					for (key in outputArray[interviews[i]][s][0]) {
						//TODO: replace with a setting
						if (key == "A8a_Crop_Rotation") {
							break;
						}
						if (!leadSixAdded) {
							l += outputArray[interviews[i]][s][0][key] + ";";
						}
					}
					leadSixAdded = true;
					break;
				}
			}
			for (var s in seasons) {
				//Add the rest of the keys
				if (outputArray[interviews[i]][s]) {
					for (var item in outputArray[interviews[i]][s]) {
						var counter = 0;
						for (key in outputArray[interviews[i]][s][item]) {
							if (counter > 6) {
								l += outputArray[interviews[i]][s][item][key] + ';';
							}
							counter++;
						}

					}
					//console.log("max should be" + maxesArray[s][f]);
					//console.log("max is" + outputArray[i][s][f].length);  
					//Add ";" for each missing input-key combi
					var dif = maxesArray[seasons.indexOf(seasons[s])] - outputArray[interviews[i]][s].length;
					if (dif > 0) {
						for (var x = 0; x < dif; x++) {
							l += (";".repeat(baseColumns));
						}
					}
				} else {

					var dif = maxesArray[s];
					//console.log("entire input type missing: "+ dif);
					for (var x = 0; x < dif; x++) {
						l += (";".repeat(baseColumns));
					}
				}
			}
			outputString += (l + "\n");
		}
	}
	return outputString;
}

function tableThis() {
	console.log("tabling....");
}
