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

var home = {
	lat: 40.87955,
	lng: -123.9823,
	zoom: 19
} 

// Create the map
var myMap = L.map('pointMap').setView([home.lat, home.lng], home.zoom)


function addControls()
{
	// Add home button
	L.easyButton('fa-home', function(btn, map){
		map.setView([home.lat, home.lng], home.zoom);
		},'Zoom To Home', {position:'topright'}).addTo(myMap);
		
	// Reposition the zoom control
	myMap.zoomControl.setPosition('topright');
		
	// Add a fullscreen toggle
	myMap.addControl(new L.Control.Fullscreen({position: 'topright'}));
}

// Add the street basemap to the map
function addBasemap()
{
	// Add basemap
	var tileCartoDBVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; \
						<a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 25,
			minZoom: 12
		}).addTo(myMap);

	// Add orthophoto tileset
	var tileOrtho = L.tileLayer('https://api.mapbox.com/v4/{tilesetId}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Imagery © <a href="http://humbotsda.com">Humbots D&A</a>',
		maxZoom: 25,
		minZoom: 15,
		accessToken: 'pk.eyJ1IjoiaXNpbG1lMSIsImEiOiJjanR3amZvOW8yOHVzM3ltc2x3b3BibmtwIn0.St3CYo8jaThhr_HrV1QXdQ',
		tilesetId: 'isilme1.bhbathwp'
		}).addTo(myMap);

	return tileCartoDBVoyager;
}

// Add the orthophoto tileset to the map
function addOrtho()
{
	// Add orthophoto tileset
	var tileOrtho = L.tileLayer('https://api.mapbox.com/v4/{tilesetId}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Imagery © <a href="http://humbotsda.com">Humbots D&A</a>',
		maxZoom: 25,
		minZoom: 15,
		accessToken: 'pk.eyJ1IjoiaXNpbG1lMSIsImEiOiJjanR3amZvOW8yOHVzM3ltc2x3b3BibmtwIn0.St3CYo8jaThhr_HrV1QXdQ',
		tilesetId: 'isilme1.bhbathwp'
		}).addTo(myMap);

	return tileOrtho;
}

// Add grave point markers, popups, tooltips, and icons to the map
function addGravePoints()
{
	// Assign the correct icon to grave plot points based on the plot availability
	function assignIcon(feature, layer)
	{
		if (feature.properties.Status_Des == "Occupied")
			layer.setIcon(blueIcon);
		else if (feature.properties.Status_Des == "Available")
			layer.setIcon(goldIcon);
		else
			layer.setIcon(purpleIcon);
	}

	// Assign the correct popup to the grave plot
	function assignPopup(feature, layer)
	{
		// Occupied plots get popups, others don't
		if (feature.properties.Status_Des == "Occupied")
			// Build a popup table using a template
			layer.bindPopup(popupTemplate(feature));
	}

	// Runs every time a feature is added to a geoJSON
	function onEachFeature(feature, layer)
	{
		// Create a tooltip to show the current plot availability
		layer.bindTooltip(feature.properties.Status_Des);
		
		// Assign the correct popup
		assignPopup(feature, layer);

		// Assign the correct icon
		assignIcon(feature, layer);
	}

	// Load all grave plot points from a JSON into the map
	var gravePoints = L.geoJSON(graveJSON, {
		// Run this function for every feature that is created
		onEachFeature: onEachFeature
	}).addTo(myMap);

	return gravePoints;
}

// Add roads to the map
function addRoads()
{
	// Load the cemetery roads from a JSON into the map
	var cemeteryRoads = L.geoJSON(roadJSON, {
		color: "white",
		opacity: 0.8,
		weight: 2
	}).addTo(myMap);

	return cemeteryRoads;
}

// Add the search tool for grave points to the map
function addSearch()
{
	var graveSearch = new L.Control.Search({
		layer: gravePoints,
		propertyName: 'Name',
		collapsed: false,
		textPlaceholder: 'Search by name...',
		// When a location is found, fly there slowly
		moveToLocation: function(latlng, title, map) {
			var zoom =  22 
				map.flyTo(latlng, zoom, {animate: true, duration: 3});
		}
	}).addTo(myMap);
	
	// When a grave is searched for and found
	graveSearch.on('search:locationfound', function(e)
	{
		// Open its popup automatically
		e.layer.openPopup().openOn(myMap);
	})
}

// Add layer visibility controls to the map
function addLayerControl()
{
	// Set up the layers for layer control
	var layerControl = {
		base_layers: {},
		overlays: {
			"Street basemap" : tileCartoDBVoyager,
			"Orthoimagery" : tileOrtho,
			"Grave plots" : gravePoints,
			"Cemetery roads" : cemeteryRoads
		}
	}

	// Add the layer control to the map
	L.control.layers(
		layerControl.base_layers,
		layerControl.overlays,
		{
			"autoZIndex": true,
			"collapsed": false,
			"position": "topleft"
		}
	).addTo(myMap);
}


addControls();
var gravePoints = addGravePoints();
var cemeteryRoads = addRoads();
var tileCartoDBVoyager = addBasemap();
var tileOrtho = addOrtho();
addSearch();
addLayerControl();
addLegend();