var myMap = L.map('pointMap').setView([40.8796, -123.982], 19)


var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


var blueIcon = L.icon({
	iconSize: [10, 10],
	iconUrl: "assets/icons/grave_icon_blue.png"
})

var purpleIcon = L.icon({
	iconSize: [10, 10],
	iconUrl: "assets/icons/grave_icon_purple.png"
})

var goldIcon = L.icon({
	iconSize: [10, 10],
	iconUrl: "assets/icons/grave_icon_gold.png"
})

// Assign the correct icon based on the plot availability
function assignIcon(feature, layer)
{
	if (feature.properties.Status_Des == "Occupied")
		layer.setIcon(blueIcon);
	else if (feature.properties.Status_Des == "Available")
		layer.setIcon(goldIcon);
	else
		layer.setIcon(purpleIcon);
}

// Runs every time a feature is added to a geoJSON
function onEachFeature(feature, layer)
{
	// Create a tooltip to show the current plot availability
	layer.bindTooltip(feature.properties.Status_Des);
	
	assignIcon(feature, layer);
}


gravePoints = L.geoJSON(graveJSON, {
	// Run this function for every feature that is created
	onEachFeature: onEachFeature
}).addTo(myMap);

var mySearch = new L.Control.Search({
	layer: gravePoints,
	propertyName: 'Name',
	collapsed: false
}).addTo(myMap);
