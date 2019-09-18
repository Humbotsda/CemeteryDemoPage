var home = {
  lat: 40.87955,
  lng: -123.9823,
  zoom: 19
};

// Create the map
var myMap = L.map("pointMap", {
  zoomSnap: 1,
  center: [home.lat, home.lng],
  zoom: home.zoom,
  preferCanvas: false
});

function addControls() {
  // Add home button
  L.easyButton(
    "fa-home",
    function(btn, map) {
      map.setView([home.lat, home.lng], home.zoom);
    },
    "Zoom To Home",
    { position: "topright" }
  ).addTo(myMap);

  // Reposition the zoom control
  myMap.zoomControl.setPosition("topright");

  // Add a fullscreen toggle
  myMap.addControl(new L.Control.Fullscreen({ position: "topright" }));

  // Add scale bar
  L.control.betterscale().addTo(myMap);
}

// Add the street basemap to the map
function addBasemap() {
  // Add basemap
  var tileCartoDBVoyager = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; \
						<a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 25,
    minZoom: 12
  }).addTo(myMap);

  return tileCartoDBVoyager;
}

// Add the orthophoto tileset to the map
function addOrtho() {
  // Add orthophoto tileset
  var tileOrtho = L.tileLayer("https://api.mapbox.com/v4/{tilesetId}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: 'Imagery © <a href="http://humbotsda.com">Humbots D&A</a>',
    maxZoom: 25,
    minZoom: 15,
    accessToken: "pk.eyJ1IjoiaXNpbG1lMSIsImEiOiJjanR3amZvOW8yOHVzM3ltc2x3b3BibmtwIn0.St3CYo8jaThhr_HrV1QXdQ",
    tilesetId: "isilme1.bhbathwp"
  }).addTo(myMap);

  return tileOrtho;
}

// Add grave point markers, popups, tooltips, and icons to the map
function addGravePoints() {
  // Assign the correct icon to grave plot points based on the plot availability
  function assignIcon(feature, layer) {
    if (feature.properties.Status_Des == "Occupied") layer.setIcon(blueIcon);
    else if (feature.properties.Status_Des == "Available") layer.setIcon(goldIcon);
    else layer.setIcon(purpleIcon);
  }

  // Assign the correct popup to the grave plot
  function assignPopup(feature, layer) {
    // Occupied plots get popups, others don't
    if (feature.properties.Status_Des == "Occupied")
      if (feature.properties.Name == "Hannes Becker")
        // Special video popup for Hannes Becker's grave with custom CSS class
        layer.bindPopup(videoPopupTemplate(feature), { className: "popupVideo" });
      // Build a popup table using a template
      else layer.bindPopup(popupTemplate(feature));
  }

  // Runs every time a feature is added to a geoJSON
  function onEachFeature(feature, layer) {
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
function addRoads() {
  // Load the cemetery roads from a JSON into the map
  var cemeteryRoads = L.geoJSON(roadJSON, {
    color: "white",
    opacity: 0.8,
    weight: 2
  }).addTo(myMap);

  return cemeteryRoads;
}

// Add legend to the map
function addLegend() {
  // Create a leaflet control for the legend
  var legend = L.control({
    position: "topleft"
  });

  // When the legend is added to the map...
  legend.onAdd = function(map) {
    // Create a div of class custom-legend
    this._div = L.DomUtil.create("div", "custom-legend");
    // Fill the div with the legend HTML
    this._div.innerHTML = `
							<div id='maplegend' class='leaflet-control-layerss'>
								<div class='legend-title'>Plot status
								</div>
								<div class='legend-scale'>
									<ul class='legend-labels'>
										<li><span style='background:rgb(68, 140, 203);opacity:1;'></span>Occupied</li>
										<li><span style='background:rgb(212, 198, 37);opacity:1;'></span>Available</li>
										<li><span style='background:rgb(203, 68, 109);opacity:1;'></span>Sold</li>
									</ul>
								</div>
							</div>
						`;
    return this._div;
  };

  legend.addTo(myMap);
}

// Add the search tool for grave points to the map
function addSearch() {
  var graveSearch = new L.Control.Search({
    layer: gravePoints,
    propertyName: "Name",
    collapsed: false,
    textPlaceholder: "Search by name...",
    geometry: "Polygon",
    // Accept the first suggested search when enter is hit
    firstTipSubmit: true,
    // Hide the circle marker when a grave is found
    marker: false,
    // Allow searching by partial matches (such as just last name)
    initial: false,

    // When a location is found, fly there slowly
    moveToLocation: function(latlng, title, map) {
      var zoom = 22;
      map.flyTo(latlng, zoom, { animate: true, duration: 1 });
    }
  }).addTo(myMap);

  // When a grave is searched for and found
  graveSearch.on("search:locationfound", function(e) {
    // Open its popup automatically
    e.layer.openPopup().openOn(myMap);
  });
}

// Add layer visibility controls to the map
function addLayerControl() {
  // Set up the layers for layer control
  var layerControl = {
    base_layers: {},
    overlays: {
      "Street basemap": tileCartoDBVoyager,
      Orthoimagery: tileOrtho,
      "Grave plots": gravePoints,
      "Cemetery roads": cemeteryRoads
    }
  };

  // Add the layer control to the map
  L.control
    .layers(layerControl.base_layers, layerControl.overlays, {
      autoZIndex: true,
      collapsed: false,
      position: "topleft"
    })
    .addTo(myMap);
}

// Control icon size and hide points when zoomed out
myMap.on("zoomend", function(e) {
  var currentZoom = myMap.getZoom();
  // Layer to hide when zoomed out too far
  var layer = gravePoints;
  // Minimum zoom at which the layer will still be visible
  var minimumZoom = 16;
  // Get all icons
  var elements = document.getElementsByClassName("leaflet-marker-icon");

  // Icon size at different zoom levels
  var zoomScale = {
    14: "0px",
    15: "4px",
    16: "3px",
    17: "4px",
    18: "5px",
    19: "7px",
    20: "9px",
    21: "10px",
    22: "11px",
    23: "12px",
    24: "13px",
    25: "14px"
  };

  // Change the size of all icons using zoomScale
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.width = zoomScale[currentZoom];
    elements[i].style.height = zoomScale[currentZoom];
    // Margins should be 1/2 of the size, and negative
    elements[i].style.marginLeft = `${(-1 * parseInt(zoomScale[currentZoom], 10)) / 2}px`;
    elements[i].style.marginTop = `${(-1 * parseInt(zoomScale[currentZoom], 10)) / 2}px`;
  }
});

addControls();
var gravePoints = addGravePoints();
var cemeteryRoads = addRoads();
var tileCartoDBVoyager = addBasemap();
var tileOrtho = addOrtho();

addSearch();
addLayerControl();
addLegend();
