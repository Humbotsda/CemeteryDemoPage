const home = {
  lat: 40.87955,
  lng: -123.9823,
  zoom: 19
};

// Create the map
const myMap = L.map("pointMap", {
  zoomSnap: 1,
  center: [home.lat, home.lng],
  zoom: home.zoom,
  preferCanvas: false
});

// Add controls to the map
function addControls() {
  // Add home button
  L.easyButton(
    "fa-home",
    function (btn, map) {
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

// Create the basemap
function createBasemap() {
  // Add basemap
  const tileCartoDBVoyager = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; \
						<a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 25,
    minZoom: 12
  })

  return tileCartoDBVoyager;
}

// Add the orthophoto tileset to the map
function createOrtho() {
  // Add orthophoto tileset
  const tileOrtho = L.tileLayer("https://api.mapbox.com/v4/{tilesetId}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: 'Imagery © <a href="http://humbotsda.com">Humbots D&A</a>',
    maxZoom: 25,
    minZoom: 15,
    accessToken: "pk.eyJ1IjoiaXNpbG1lMSIsImEiOiJjanR3amZvOW8yOHVzM3ltc2x3b3BibmtwIn0.St3CYo8jaThhr_HrV1QXdQ",
    tilesetId: "isilme1.bhbathwp"
  });

  return tileOrtho;
}

// Create and return unoccupied grave point markers, popups, tooltips, and icons to the map
function createUnoccupiedGravePoints() {
  // Assign the correct icon to grave plot points based on the plot availability
  function assignIcon(feature, layer) {
    if (feature.properties.Status_Des == "Available") layer.setIcon(goldIcon);
    else if (feature.properties.Status_Des == "Sold") layer.setIcon(purpleIcon);
  }

  // Runs every time a feature is added to a geoJSON
  function onEachFeature(feature, layer) {
    // Create a tooltip to show the current plot availability
    layer.bindTooltip(feature.properties.Status_Des);

    // Assign the correct icon
    assignIcon(feature, layer);
  }

  // Load all grave plot points from a JSON into the map
  const unoccupiedGravePoints = L.geoJSON(graveJSON, {
    filter: function (feature) { return feature.properties.Status_Des != "Occupied" },
    // Run this function for every feature that is created
    onEachFeature: onEachFeature
  });

  return unoccupiedGravePoints;
}

// Create and return occupied grave point markers, popups, tooltips, and icons to the map
function createOccupiedGravePoints() {
  // Assign the correct popup to the grave plot
  function assignPopup(feature, layer) {
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
    layer.setIcon(blueIcon);
  }

  // Load all grave plot points from a JSON into the map
  const occupiedGravePoints = L.geoJSON(graveJSON, {
    filter: function (feature) { return feature.properties.Status_Des === "Occupied" },
    // Run this function for every feature that is created
    onEachFeature: onEachFeature
  });

  return occupiedGravePoints;
}

// Create roads layer
function createRoads() {
  // Load the cemetery roads from a JSON into the map
  const cemeteryRoads = L.geoJSON(roadJSON, {
    color: "white",
    opacity: 0.8,
    weight: 2
  });

  return cemeteryRoads;
}

// Add legend to the map
function addLegend() {
  // Create a leaflet control for the legend
  const legend = L.control({
    position: "topleft"
  });

  // When the legend is added to the map...
  legend.onAdd = function (map) {
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

// Create and return the search tool for grave points to the map
function createSearch() {
  const graveSearch = new L.Control.Search({
    layer: occupiedGravePoints,
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

    // When a grave is found in search, fly there slowly
    moveToLocation: function (latlng, title, map) {
      // Final zoom level to end at
      const zoomTo = 22;

      // Automatically open the popup for that layer
      latlng.layer.openPopup();

      // Get the pixel coords of the latlng point at the final zoom level
      let popupAnchorPoint = map.project(latlng, zoom);

      // Get the height of the popup in pixels
      let popupHeight = latlng.layer._popup._container.clientHeight;

      // Shift the pixel coords up half the popup height to center the popup in the window
      popupAnchorPoint.y -= popupHeight / 2;

      // Convert the pixel coords back to latlong at the correct zoom, then zoom to them
      map.flyTo(map.unproject(popupAnchorPoint, zoomTo), zoomTo, { animate: true, duration: 1 });
    }
  }).addTo(myMap);

  return graveSearch
}

// Create and return layer visibility controls
function createLayerControl() {
  // Set up the layers for layer control
  const layerControlOptions = {
    base_layers: {},
    overlays: {
      "Street basemap": tileCartoDBVoyager,
      "Orthoimagery": tileOrtho,
      "Grave points": gravePoints,
      "Cemetery roads": cemeteryRoads,
    }
  };

  // Add the layer control to the map
  const layerControl = L.control
    .layers(layerControlOptions.base_layers, layerControlOptions.overlays, {
      autoZIndex: true,
      collapsed: false,
      position: "topleft"
    });

  return layerControl;
}

// Set grave icon scale based on zoom level
function scaleIcons(zoomLevel) {
  // Get all icons
  let elements = document.getElementsByClassName("leaflet-marker-icon");

  // Icon size at different zoom levels
  const zoomScale = {
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
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = zoomScale[zoomLevel];
    elements[i].style.height = zoomScale[zoomLevel];
    // Margins should be 1/2 of the size, and negative
    elements[i].style.marginLeft = `${(-1 * parseInt(zoomScale[zoomLevel], 10)) / 2}px`;
    elements[i].style.marginTop = `${(-1 * parseInt(zoomScale[zoomLevel], 10)) / 2}px`;
  }

}

// Auto open the popup closest to the user's position from a given layer
function openClosestPopup(layer) {
  // Max distance to from map center to open popup (in meters)
  const maxSearchDistance = 2;
  const closestPoint = leafletKnn(layer).nearest(myMap.getCenter(), 1, maxSearchDistance)[0].layer
  closestPoint.openPopup();
}

// Control icon size and auto open popups on zoom
myMap.on("zoomend", function (e) {
  let currentZoom = myMap.getZoom();
  scaleIcons(currentZoom);

  // Zoom level where popups are automatically opened
  const popupZoom = 25;

  // Auto open popups when zoomed in enough
  if (currentZoom >= popupZoom) {
    openClosestPopup(occupiedGravePoints);
  }
});

let occupiedGravePoints = createOccupiedGravePoints();
let unoccupiedGravePoints = createUnoccupiedGravePoints();
let gravePoints = L.layerGroup([occupiedGravePoints, unoccupiedGravePoints]).addTo(myMap);
let cemeteryRoads = createRoads().addTo(myMap);
let tileCartoDBVoyager = createBasemap().addTo(myMap);
let tileOrtho = createOrtho().addTo(myMap);

let searchTool = createSearch().addTo(myMap);
let layerControl = createLayerControl().addTo(myMap);
addControls();
addLegend();
