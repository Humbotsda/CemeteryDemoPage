var myMap = L.map('pointMap').setView([40.8796, -123.982], 19)


var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Runs every time a feature is added to a geoJSON
function onEachFeature(feature, layer)
{
	// Create a tooltip to show the current plot availability
	layer.bindTooltip(feature.properties.Status_Des);
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
