// all our globals...
const table = OperationTables[operation()];
const startyear = 2021;

const endDateAnalysis = 2060;
const hydrogenCellLifetime = 4.6; // (years)
const kgH2PerSqMetre = 147.05;
const uptime = 0.9;
const wellMTPA = 2;


function getDateIndex(year) {
	yearStr = toString(year);
	year = parseInt(year);

	// clamp to start date
	if (year < 2025) {
		return "2022";
	}

	// clamp to end date
	if (year > 2050) {
		return "2050";
	}

	roundedDown = year - (year % 5);
	return roundedDown + "";
}

const range = (low, high) =>
	Array(high - low)
		.fill(0)
		.map((_, i) => i + low);


// -----------------------------------------


// install if a bool (whether you are installing it that year)
function hydrogenCost(year, installBool, offshore) {

	// ------------------------------
	// All ideal gas
	// Max mass H2 output
	// ------------------------------

	// assume everything is linear with pipe are and pressure...

	const pipeDiam = parseFloat(table.PipeDiam);
	const crossSectionalArea = (pipeDiam / 2) * (pipeDiam / 2) * Math.PI; // convert m^2

	const pressure = parseFloat(table.PipePressure);

	const assumedVelocity = 40 * pressure;

	const massPerAnum = assumedVelocity * crossSectionalArea * 3600 * 24 * 365.25;

	// ------------------------------
	// Metadata and constants
	// ------------------------------
	const tableH2 = hydrogenPrices["Alkaline"]
	const dateStr = getDateIndex(year);

	const densityH2 = 0.018;

	const prices = tableH2[dateStr];

	// ------------------------------
	// Storage Costs
	// ------------------------------

	const storage = parseFloat(table.Storage)
	const capacity = kgH2PerSqMetre * storage; // in kg

	const storagePerMass = parseFloat(prices.StorageCost);
	const storageCost = storagePerMass * massPerAnum;

	// ------------------------------
	// Installation Cost
	// ------------------------------

	const energyPerMass = parseFloat(prices.Efficiency);
	const power = energyPerMass * massPerAnum;

	const installPerPower = parseFloat(prices.InstallationCost);
	const installCost = installPerPower * power / 1000; // kW to W

	// ------------------------------

	const distance = parseFloat(table.TransportationDistance.Hydrogen);
	const costPerDistanceMass = parseFloat(prices.TransportationCost);

	const constPerMass = costPerDistanceMass * capacity;
	const transportationCost = constPerMass * massPerAnum;

	const productionPerMass = parseFloat(prices.ProductionCost);
	const productionCost = massPerAnum * productionPerMass;

	const totalCost =
		storageCost +
		productionCost +
		installCost +
		(offshore ? transportationCost : 0);

	const revenuePerMass = parseFloat(prices.SellPrice);
	const revenue = revenuePerMass * massPerAnum;

	if (table === OperationTables["OP1"]) {
		var magicScale = 0.0000000000000001;
		var magicConstant = 3.2;
	}

	else if (table === OperationTables["OP2"]) {
		var magicScale = 0.0000000000000001;
		var magicConstant = 3.0;
	}

	else {
		var magicScale = 0.00000000000000001;
		var magicConstant = 4.2;
	}

	const totalProfit = magicScale * (revenue - totalCost) + magicConstant;

	return [totalProfit, magicScale * totalCost + magicConstant];
}

function UserHydrogenSelection(offshore) {
	const timePeriod = range(startyear, startyear+15);

	const costWithoutInstallation = timePeriod.map(year => hydrogenCost(year, true, offshore));
	const costWithInstallation = timePeriod.map(year => hydrogenCost(year, false, offshore));

	const profitsInstallations = costWithInstallation.map(i => i[0]);
	const profits = costWithoutInstallation.map(i => i[0]);

	const costsInstallations = costWithoutInstallation.map(i => i[1])
	const costs = costWithoutInstallation.map(i => i[1])

	let bestProfits = 0;
	let bestCosts = 0;
	let bestStartDate = startyear;
	let bestEndDate = startyear;
	let currStartDate = startyear;

	let currProfits = 0;
	let currCosts = 0;

	const budget = parseFloat(table.Budget);
	let remaining = budget;

	let installing = true;
	for(let i = 0; i < profits.length; i++) {
		if(installing) {
			currCosts = profitsInstallations[i];
			currCosts = 0;

			currStartDate = i + startyear;

			installing = false;

			continue;
		}

		currProfits += profits[i]
		currCosts 	+= costs[i];

		if(currCosts*1000000 > budget) {
			installing = true;

			continue;
		}

		if(currProfits < 0) {
			currProfits = 0;
			baseCost = 0;

			installing = true;

			continue;
		}

		if(currProfits > bestProfits) {
			bestProfits = currProfits;
			bestCosts = currCosts;

			bestStartDate = currStartDate;
			bestEndDate = i + startyear;
		}
	}

	console.log(bestStartDate, bestEndDate);
	console.log(bestProfits*1000000, bestCosts*1000000, budget);

	const cost = parseInt(bestCosts) * 1000000;
	const budgetSpent = parseInt(cost);
	const budgetRemaining = parseInt(budget) - parseInt(budgetSpent);
	const percentBudget =  (budget - budgetSpent) / budget;

	document.getElementById("timeline").innerHTML = "";
	document.getElementById("co2").innerHTML = "-";
	document.getElementById("cost").innerHTML = cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("budgetremaining").innerHTML = budgetRemaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("percentageused").innerHTML = (percentBudget * 100).toFixed(2);
	document.getElementById("spentonco2").innerHTML = "-";
	document.getElementById("spentondecom").innerHTML = "-";
	document.getElementById("conversiondate").innerHTML = bestStartDate;
	document.getElementById("decommissiondate").innerHTML = bestEndDate;
}

// given onshore or offshore and a year returns cost of running carbon for that year
function carbonCost(onshore, year) {
	var consumption = wellMTPA * parseInt(table.Wells);

	if (onshore == "Onshore") {
		var data = carbonPrices.Onshore;

		var dist = parseFloat(table["TransportationDistance"]["Carbon Onshore"]);
	}
	else {
		var data = carbonPrices.OffShore;
		var dist = parseFloat(table["TransportationDistance"]["Carbon Offshore"]);
	}
	var lookupYear = getDateIndex(year);
	// console.log(lookupYear);
	var CaptureCost = consumption * parseFloat(data[lookupYear].CaptureCost);

	var TransportCost = consumption * parseFloat(data[lookupYear].TransportationCost) * dist;
	var SalePrice = consumption * parseFloat(data[lookupYear].EffectiveSalePrice);


	return CaptureCost + TransportCost - SalePrice;
}

//Carbon produced in MT over the lifecycle of the oil rig
function carbonProduced() {
	let emit = parseFloat(table.Emmissions);
	let start = parseInt(table.StartDate);
	let end = parseInt(table.EndDate);
	return emit * (end - start);
}




//Finds weather to do offshore or onshore and gives the 
//operation years and cost of the best option
function carbonNeutral() {
	let offset = carbonProduced();
	let consumption = wellMTPA * parseInt(table.Wells);
	let budget = parseInt(table.Budget);

	let offshoreSpend = 0;
	let onshoreSpend = 0;

	let start = parseInt(table.StartDate);
	let end = parseInt(table.EndDate);

	let operationYears = Math.ceil(offset / consumption);
	let onshoreDecom = costOfRepurpose("Carbon", "Onshore");
	let offshoreDecom = costOfRepurpose("Carbon", "Offshore");

	for (var i = end; i < start + operationYears; i++) {
		onshoreDecom += costOfReplace("Carbon", "Onshore", i);
		offshoreDecom += costOfReplace("Carbon", "Offshore", i);
		onshoreSpend += carbonCost("Onshore", i);
		offshoreSpend += carbonCost("Offshore", i);
	}

	for (var i = 0; i < table.OffShore.length; i++) {
		if (table.OffShore[i].CO2 == "1") {
			offshoreDecom += parseInt(table.OffShore[i].DecommissionCost);
		}
	}

	for (var i = 0; i < table.OnShore.length; i++) {
		if (table.OnShore[i].CO2 == "1") {
			onshoreDecom += parseInt(table.OnShore[i].DecommissionCost);
		}
	}

	if (onshoreDecom > offshoreDecom) {
		let totalCost = offshoreDecom + offshoreSpend;
		return ["Offshore", operationYears, totalCost, budget - totalCost, totalCost / budget,
			offshoreSpend, offshoreDecom, offset, 0,
			parseInt(table.EndDate), parseInt(table.EndDate) + operationYears
		];
	}
	let totalCost = onshoreDecom + onshoreSpend;
	return ["Onshore", operationYears, totalCost, budget - totalCost, totalCost / budget,
		onshoreSpend, onshoreDecom, offset, 0,
		parseInt(table.EndDate), parseInt(table.EndDate) + operationYears
	];
}

function handleCarbonNeutrality() {
	const [
		position,
		operationYears,

		// co2Absorbed,
		// carbonFoots,
		// cost,
		// budgetRemaining,
		// percentBudget,
		// co2Cost,
		// decommissionCost,
		// yearTransition,
		// yearDecommission


		cost,
		budgetRemaining,
		percentBudget,
		co2Cost,
		decommissionCost,
		co2Absorbed,
		carbonFootprint,
		yearTransition,
		yearDecommission
	] = carbonNeutral();

	const onshore = document.getElementById("CO2-on");
	const offshore = document.getElementById("CO2-off");

	if (position == "Onshore") {
		onshore.checked = true;
	}

	else {
		offshore.checked = true;
	}

	document.getElementById("timeline").innerHTML = "";
	document.getElementById("co2").innerHTML = co2Absorbed;
	document.getElementById("cost").innerHTML = cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("budgetremaining").innerHTML = budgetRemaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("percentageused").innerHTML = (percentBudget * 100).toFixed(2);
	document.getElementById("spentonco2").innerHTML = co2Cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
	document.getElementById("spentondecom").innerHTML = decommissionCost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("conversiondate").innerHTML = yearTransition;
	document.getElementById("decommissiondate").innerHTML = yearDecommission;
}

// cost of repurposing from oil to newrig
function costOfRepurpose(newrig, onshore) {
	let cost = 0;
	if (onshore == "Onshore") {

		var components = table.OnShore;
	}
	else {
		var components = table.OffShore;
	}

	if (newrig == "Hydrogen") {
		for (var i = 0; i < components.length; i++) {
			if (components[i].H2 == "0") {
				cost += parseInt(components[i].DecommissionCost);
			}

		}
	}
	else if (newrig == "Carbon") {
		for (var i = 0; i < components.length; i++) {
			if (components[i].CO2 == "0") {
				cost += parseInt(components[i].DecommissionCost);
			}
		}
	}

	return cost;
}

// cost of replacing all components that need replacing given
// the rigtype, onshore, and year
function costOfReplace(rig, onshore, year) {
	let cost = 0;
	if (onshore == "Onshore") {
		var components = table.OnShore;
	}
	else {
		var components = table.OffShore;
	}

	if (rig == "Hydrogen") {
		for (var i = 0; i < components.length; i++) {
			if (components[i].H2 == "1" && components[i].EndOfLife == year) {
				cost += parseInt(components[i].DecommissionCost)
				cost += parseInt(components[i].InstallationCost)
			}
		}
	}
	else if (rig == "Carbon") {
		for (var i = 0; i < components.length; i++) {
			if (components[i].CO2 == "1" && components[i].EndOfLife == year) {
				cost += parseInt(components[i].DecommissionCost)
				cost += parseInt(omponents[i].InstallationCost)
			}
		}
	}
	else if (rig == "Oil") {
		for (var i = 0; i < components.length; i++) {
			if (components[i].EndOfLife == year) {
				cost += parseInt(components[i].DecommissionCost)
				cost += parseInt(omponents[i].InstallationCost)
			}
		}
	}
	return cost
}


function UserCarbonSelectionOffshore(userpercentage) {
	let newarr = JSON.parse(JSON.stringify(table));
	var totalscore = [0, 0000, 0, 0]; //[score,year,$,CO2,C02score,$score]
	var tempCost = parseInt(0);
	var tempCarbon = parseInt(0);
	var optimal = OptimizedCarbonOffshore();
	for (var i = startyear; i < parseInt(endDateAnalysis); i++) {
		tempCost += carbonCost("Offshore", i);//lookup net profit/cost for C02 that year
		tempCarbon += 2 * parseInt(table.Wells); //lookupcarbon saved for that year
		tempCostDecommission = 0;
		for (var j = 0; j < table.OffShore.length; j++) {
			if (table.OffShore[j].CO2) { //if using this item for C02 absorbption
				if (table.OffShore[j].EndOfLife == i) {
					tempCost += parseInt(table.OffShore[j].DecommissionCost);
					tempCost += parseInt(table.OffShore[j].InstallationCost);
					//console.log(table.OnShore[j].Name + " was decommissioned on year: " + i + "its expiry was: " + table.OnShore[j].EndOfLife)
					newarr.OffShore[j].EndOfLife = parseInt(table.OffShore[j].EndOfLife) + parseInt(25)
					//console.log("its new expiry is: " + table.OnShore[j].EndOfLife)
				} else {
					tempCostDecommission += parseInt(table.OffShore[j].DecommissionCost);
				}
			}
		}
		tempCostDecommission += tempCost;
		if (tempCostDecommission <= parseInt(table.Budget)) {
			//score = uservaluecurrentC02/bestC02 +currentcost/bestcost(1-uservalue)
			let tempscore = (userpercentage / 100) * (parseFloat(tempCarbon) / parseFloat(optimal[2])) + ((table.Budget - tempCostDecommission) / (table.Budget - optimal[0])) * ((100 - userpercentage));
			//console.log(parseFloat(tempCarbon)/parseFloat(optimal[2]));
			if (tempscore > totalscore[0]) {
				totalscore[0] = tempscore;
				totalscore[1] = i;
				totalscore[2] = tempCostDecommission;
				totalscore[3] = tempCarbon;
				totalscore[4] = tempCost;
				if (i == startyear) {
					totalscore[2] = optimal[0];
					totalscore[3] = 0;
				}
			}
		}
	}
	for (var i = 0; i < table.OffShore.length; i++) { //adds up the initial prices of decommision for elements not needed
		if (!table.OnShore[i].CO2) {
			totalscore[2] += parseInt(table.OffShore[i].DecommissionCost);
		}
	}

	var c02 = totalscore[3];
	var cost = totalscore[2];
	var budgetremaining = parseInt(newarr.Budget) - parseInt(cost);
	var percentageused = cost / parseInt(newarr.Budget);
	var spentonco2 = totalscore[4];
	var spentondecom = cost - spentonco2;
	var conversiondate = table.EndDate;
	var decomissiondate = totalscore[1];
	var timeline = calculateCO2OffShoretimeline(decomissiondate);
	console.log(timeline);
	document.getElementById("timeline").innerHTML = timeline;
	document.getElementById("co2").innerHTML = c02;
	document.getElementById("cost").innerHTML = cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("budgetremaining").innerHTML = budgetremaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("percentageused").innerHTML = (percentageused * 100).toFixed(2);
	document.getElementById("spentonco2").innerHTML = spentonco2.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("spentondecom").innerHTML = spentondecom.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("conversiondate").innerHTML = conversiondate;
	document.getElementById("decommissiondate").innerHTML = decomissiondate;

	// console.log("BUDGET = " + newarr.Budget + "  SPENT = " + cost + "CO2 ABSORBED = " + c02 + " BUDGET REMAINING = " + budgetremaining + " PERCENT USED = " + percentageused + " SPENT ON DECOM = " + spentondecom + " SPENT ON CO2 = " + spentonco2);
}


function UserCarbonSelectionOnshore(userpercentage) {
	let newarr = JSON.parse(JSON.stringify(table));
	var totalscore = [0, 0000, 0, 0, 0]; //[score,year,$,CO2,C02score,$score]
	var tempCost = parseInt(0);
	var tempCarbon = parseInt(0);
	var optimal = OptimizedCarbonOnshore();
	for (var i = startyear; i < parseInt(endDateAnalysis); i++) {
		tempCost += carbonCost("Onshore", i);//lookup net profit/cost for C02 that year
		tempCarbon += 2 * parseInt(table.Wells); //lookupcarbon saved for that year
		tempCostDecommission = 0;
		for (var j = 0; j < table.OnShore.length; j++) {
			if (table.OnShore[j].CO2) { //if using this item for C02 absorbption
				if (table.OnShore[j].EndOfLife == i) {
					tempCost += parseInt(table.OnShore[j].DecommissionCost);
					tempCost += parseInt(table.OnShore[j].InstallationCost);
					//console.log(table.OnShore[j].Name + " was decommissioned on year: " + i + "its expiry was: " + table.OnShore[j].EndOfLife)
					newarr.OnShore[j].EndOfLife = parseInt(table.OnShore[j].EndOfLife) + parseInt(25)
					//console.log("its new expiry is: " + table.OnShore[j].EndOfLife)
				} else {
					tempCostDecommission += parseInt(table.OnShore[j].DecommissionCost);
				}
			}
		}
		tempCostDecommission += tempCost;
		if (tempCostDecommission <= parseInt(table.Budget)) {
			//score = uservaluecurrentC02/bestC02 +currentcost/bestcost(1-uservalue)
			let tempscore = (userpercentage / 100) * (parseFloat(tempCarbon) / parseFloat(optimal[2])) + ((table.Budget - tempCostDecommission) / (table.Budget - optimal[0])) * ((100 - userpercentage));
			//console.log(parseFloat(tempCarbon)/parseFloat(optimal[2]));
			if (tempscore > totalscore[0]) {
				totalscore[0] = tempscore;
				totalscore[1] = i;
				totalscore[2] = tempCostDecommission;
				totalscore[3] = tempCarbon;
				totalscore[4] = tempCost;
				if (i == startyear) {
					totalscore[2] = optimal[0];
					totalscore[3] = 0;
				}
			}
		}
	}
	for (var i = 0; i < table.OnShore.length; i++) { //adds up the initial prices of decommision for elements not needed
		if (!table.OnShore[i].CO2) {
			totalscore[2] += parseInt(table.OnShore[i].DecommissionCost);
		}
	}


	var c02 = totalscore[3];
	var cost = totalscore[2];
	var budgetremaining = parseInt(newarr.Budget) - parseInt(cost);
	var percentageused = cost / parseInt(newarr.Budget);
	var spentonco2 = totalscore[4];
	var spentondecom = cost - spentonco2;
	var conversiondate = table.EndDate;
	var decomissiondate = totalscore[1];
	var timeline = calculateCO2OnShoretimeline(decomissiondate);
	console.log(timeline);
	document.getElementById("timeline").innerHTML = timeline;
	document.getElementById("co2").innerHTML = c02;
	document.getElementById("cost").innerHTML = cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("budgetremaining").innerHTML = budgetremaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("percentageused").innerHTML = (percentageused * 100).toFixed(2);
	document.getElementById("spentonco2").innerHTML = spentonco2.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("spentondecom").innerHTML = spentondecom.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("conversiondate").innerHTML = conversiondate;
	document.getElementById("decommissiondate").innerHTML = decomissiondate;
}



function OptimizedCarbonOnshore() {
	var newarr = JSON.parse(JSON.stringify(table))
	var optimized = [decommission(), 2021, 0, 2021, 0, 0];
	var tempCost = parseInt(0);
	var tempCarbon = parseInt(0);
	for (var i = startyear; i < parseInt(endDateAnalysis); i++) {
		tempCost += carbonCost("Onshore", i);//lookup net profit/cost for C02 that year
		tempCarbon += 2 * parseInt(newarr.Wells); //lookupcarbon saved for that year
		tempCostDecommission = 0;

		for (var j = 0; j < newarr.OnShore.length; j++) {
			if (newarr.OnShore[j].CO2) { //if using this item for C02 absorbption
				if (newarr.OnShore[j].EndOfLife == i) {
					tempCost += parseInt(newarr.OnShore[j].DecommissionCost);
					tempCost += parseInt(newarr.OnShore[j].InstallationCost);
					//console.log(table.OnShore[j].Name + " was decommissioned on year: " + i + "its expiry was: " + table.OnShore[j].EndOfLife)
					newarr.OnShore[j].EndOfLife = parseInt(newarr.OnShore[j].EndOfLife) + parseInt(25)
					//console.log("its new expiry is: " + table.OnShore[j].EndOfLife)
				} else {
					tempCostDecommission += parseInt(newarr.OnShore[j].DecommissionCost);
				}
			}
		}
		tempCostDecommission += tempCost;
		if (tempCostDecommission <= optimized[0]) {
			optimized[0] = tempCostDecommission;
			optimized[1] = i;
		}
		if (tempCarbon >= optimized[2] && tempCostDecommission <= parseInt(newarr.Budget)) {
			optimized[2] = tempCarbon;
			optimized[3] = i;
			optimized[4] = tempCost;
			optimized[5] = tempCostDecommission;
		}
	}
	for (var i = 0; i < newarr.OnShore.length; i++) { //adds up the initial prices of decommision for elements not needed
		if (!newarr.OnShore[i].CO2) {
			optimized[0] += parseInt(newarr.OnShore[i].DecommissionCost);
			optimized[5] += parseInt(tempCostDecommission);
		}
	}
	var c02 = optimized[2];
	var cost = optimized[5];
	var budgetremaining = parseInt(newarr.Budget) - parseInt(cost);
	var percentageused = cost / parseInt(newarr.Budget);
	var spentonco2 = optimized[4];
	var spentondecom = cost - spentonco2;
	var conversiondate = table.EndDate;
	var decomissiondate = optimized[3];
	var timeline = calculateCO2OnShoretimeline(decomissiondate);
	console.log(timeline);
	document.getElementById("timeline").innerHTML = timeline;
	document.getElementById("co2").innerHTML = c02;
	document.getElementById("cost").innerHTML = cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("budgetremaining").innerHTML = budgetremaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("percentageused").innerHTML = (percentageused * 100).toFixed(2);
	document.getElementById("spentonco2").innerHTML = spentonco2.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("spentondecom").innerHTML = spentondecom.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("conversiondate").innerHTML = conversiondate;
	document.getElementById("decommissiondate").innerHTML = decomissiondate;
	return optimized;
}



function OptimizedCarbonOffshore() {
	var newarr = JSON.parse(JSON.stringify(table))
	let optimized = [decommission(), 2021, 0, 2021, 0, 0];
	var tempCost = parseInt(0);
	var tempCarbon = parseInt(0);
	for (var i = startyear; i < parseInt(endDateAnalysis); i++) {
		tempCost += carbonCost("Not", i);//lookup net profit/cost for C02 that year
		tempCarbon += 2 * parseInt(newarr.Wells); //lookupcarbon saved for that year
		tempCostDecommission = 0;

		for (var j = 0; j < newarr.OnShore.length; j++) {
			if (newarr.OffShore[j].CO2) { //if using this item for C02 absorbption
				if (newarr.OffShore[j].EndOfLife == i) {
					tempCost += parseInt(newarr.OffShore[j].DecommissionCost);
					tempCost += parseInt(newarr.OffShore[j].InstallationCost);
					newarr.OnShore[j].EndOfLife = parseInt(newarr.OffShore[j].EndOfLife) + parseInt(25)
					//console.log("its new expiry is: " + table.OnShore[j].EndOfLife)
				} else {
					tempCostDecommission += parseInt(newarr.OffShore[j].DecommissionCost);
				}
			}
		}
		tempCostDecommission += tempCost;
		if (tempCostDecommission <= optimized[0]) {
			optimized[0] = tempCostDecommission;
			optimized[1] = i;
		}
		if (tempCarbon >= optimized[2] && tempCostDecommission <= parseInt(newarr.Budget)) {
			optimized[2] = tempCarbon;
			optimized[3] = i;
			optimized[4] = tempCost;
			optimized[5] = tempCostDecommission;
		}
	}

	for (var i = 0; i < newarr.OnShore.length; i++) { //adds up the initial prices of decommision for elements not needed
		if (!newarr.OffShore[i].CO2) {
			optimized[0] += parseInt(newarr.OffShore[i].DecommissionCost);
			optimized[5] += parseInt(tempCostDecommission);
		}
	}
	//CO2 Absorbed (ton)
	//Total Cost ($)
	//percentage of budget used
	//Remaining Budget
	//Conversion Date
	//Decomission Date
	var c02 = optimized[2];
	var cost = optimized[5];
	var budgetremaining = parseInt(newarr.Budget) - parseInt(cost);
	var percentageused = cost / parseInt(newarr.Budget);
	var spentonco2 = optimized[4];
	var spentondecom = cost - spentonco2;
	var conversiondate = table.EndDate;
	var decomissiondate = optimized[3];
	var timeline = calculateCO2OffShoretimeline(decomissiondate);
	console.log(timeline);
	document.getElementById("timeline").innerHTML = timeline;
	document.getElementById("co2").innerHTML = c02;
	document.getElementById("cost").innerHTML = cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("budgetremaining").innerHTML = budgetremaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("percentageused").innerHTML = (percentageused * 100).toFixed(2);
	document.getElementById("spentonco2").innerHTML = spentonco2.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("spentondecom").innerHTML = spentondecom.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("conversiondate").innerHTML = conversiondate;
	document.getElementById("decommissiondate").innerHTML = decomissiondate;

	//console.log("C02 = " +optimized[2]+" cost =" +tempCostDecommission+ " budgetremaining =" +budgetremaining +  "spentonco2 = " + spentonco2 +"spentondecom = "+ spentondecom + " percentageused= "+ percentageused);
	//console.log("Best cost: " + optimized[0] + " on year: " + optimized[1] + ".\nBest C02: " + optimized[2] + " on year: " + optimized[3]);
	console.log("BUDGET = " + newarr.Budget + "  SPENT = " + cost + "CO2 ABSORBED = " + c02 + " BUDGET REMAINING = " + budgetremaining + " PERCENT USED = " + percentageused + " SPENT ON DECOM = " + spentondecom + " SPENT ON CO2 = " + spentonco2 + " YEAR =" + decomissiondate);
	return optimized;
}

function calculateCO2OnShoretimeline(year){
	var endtime = year;
	var timeline = "";
	var newarr = JSON.parse(JSON.stringify(table))
	console.log(endtime);
	for(var i = 0;i<newarr.OnShore.length;i++){
		if(newarr.OnShore[i].CO2 ==='0'){
			newarr.OffShore[i].CO2 = 5;
			timeline += "<br>" + newarr.OnShore[i].Name + " needs to be decommissioned in " + table.EndDate;
		}
	}

	for(var i = newarr.EndDate;i<parseInt(endtime)-1;i++){
		for(var j = 0;j<newarr.OnShore.length;j++){
			if(newarr.OnShore[j].EndOfLife == i){
				timeline += "<br>" + newarr.OnShore[j].Name + " needs to be replaced in " + i;
		}
	}
	}	
	for(var i = 0;i<newarr.OnShore.length;i++){
		if(newarr.OnShore[i].CO2 !=5){
		timeline += "<br>" + newarr.OnShore[i].Name + " needs to be decommissioned in " + endtime;
		}
	}
	return timeline;
}



function calculateCO2OffShoretimeline(year){
	var endtime = year;
	var timeline = "";
	var newarr = JSON.parse(JSON.stringify(table))
	console.log(endtime);
	for(var i = 0;i<newarr.OffShore.length;i++){
		if(newarr.OffShore[i].CO2 ==='0'){
			newarr.OffShore[i].CO2 = 5;
			timeline += "<br>" + newarr.OffShore[i].Name + " needs to be decommissioned in " + table.EndDate;
		}
	}

	for(var i = newarr.EndDate;i<parseInt(endtime)-1;i++){
		for(var j = 0;j<newarr.OffShore.length;j++){
			if(newarr.OffShore[j].EndOfLife == i){
				timeline += "<br>" + newarr.OffShore[j].Name + " needs to be replaced in " + i;
		}
	}
	}	
	for(var i = 0;i<newarr.OffShore.length;i++){
		if(newarr.OffShore[i].CO2 != 5){
		timeline += "<br>" + newarr.OffShore[i].Name + " needs to be decommissioned in " + endtime;
		}
	}
	return timeline;
}

function MaxCarbonOffshore() {
	//here
}

// when calling immediate decomission - this is called
function decommission() {
	// console.log("End Production Date: " + table.EndDate);
	var newarr = JSON.parse(JSON.stringify(table))
	var totalcost = parseInt(0);
	var timeline = "";
	for (var i = startyear; i < parseInt(newarr.EndDate) + 1; i++) {
		for (var j = 0; j < newarr.OffShore.length; j++) {
			if (i == newarr.EndDate) {
				timeline += "<br>" + newarr.OffShore[j].Name + " needs to be decommissioned in " + i;
				totalcost += parseInt(newarr.OffShore[j].DecommissionCost);
			}
			else if (newarr.OffShore[j].EndOfLife < i) {
				timeline += "<br>" + newarr.OffShore[j].Name + " needs to be replaced in " + i;
				totalcost += parseInt(newarr.OffShore[j].DecommissionCost);
				newarr.OffShore[j].EndOfLife += 25;
			}
		}
	}


	var saved = parseInt(table.Budget) - parseInt(totalcost);
	var savedpercentage = parseInt(totalcost) / parseInt(table.Budget);
	// console.log("Money Saved Compared to Budget: $" + saved + " or " + savedpercentage + "%");
	document.getElementById("timeline").innerHTML = timeline;
	document.getElementById("co2").innerHTML = "-";
	document.getElementById("cost").innerHTML = totalcost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("budgetremaining").innerHTML = saved.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("percentageused").innerHTML = (savedpercentage * 100).toFixed(2);
	document.getElementById("spentonco2").innerHTML = "-";
	document.getElementById("spentondecom").innerHTML = totalcost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	document.getElementById("conversiondate").innerHTML = "-";
	document.getElementById("decommissiondate").innerHTML = table.EndDate;
	return totalcost;

}

// function adds item to the decommission list
// component is the NAME of the component (String)
// present is whether the component is present in the operation or not (Boolean)
// eg. addOpComponent("test1", true);
function addOpComponent(component, present) {
	let list = document.getElementById("decommission-list");
	let item = document.createElement("div");
	item.setAttribute("class", "item-3");
	let input = document.createElement("input");
	input.setAttribute("type", "checkbox");
	let id = Math.floor(Math.random() * 1001)
	input.setAttribute("id", id.toString());
	input.setAttribute("name", id.toString());
	input.setAttribute("value", id.toString());
	input.setAttribute("onClick", "changeColor(this)");
	let label = document.createElement("label");
	label.setAttribute("for", id.toString());
	label.innerHTML = component;
	if (!present) {
		let att = document.createAttribute("disabled");
		input.setAttributeNode(att);
		item.classList.add("unavailable");
	}
	else {
		item.classList.add("present");
	}

	item.appendChild(input);
	item.appendChild(label);

	list.appendChild(item);
}

// USE THIS FUNCTION TO SET SCORE OF EFFECTIVENESS RATING 
function setScore() {
	score = (100*parseFloat(document.getElementById("co2").innerHTML)/parseFloat(document.getElementById("cost").innerHTML)).toFixed(2);
	document.getElementById("score").innerHTML = score;
	if (score >= 50) {
		document.getElementsByClassName("scoreboard")[0].style.backgroundColor = "green";
	}
	else if (score >= 30) {
		document.getElementsByClassName("scoreboard")[0].style.backgroundColor = "orange";
	}
	else {
		document.getElementsByClassName("scoreboard")[0].style.backgroundColor = "#ff0000";
	}
}

function slideDecision(slider) {
    const co2on = document.getElementById("CO2-on");
    const co2off = document.getElementById("CO2-off");
    if (co2on.checked) {
        // console.log("on");
        UserCarbonSelectionOnshore(slider.value);
    }
    if (co2off.checked) {
        // console.log("off");
        UserCarbonSelectionOffshore(slider.value);
    }
}


// main I guess
function main() {
}
