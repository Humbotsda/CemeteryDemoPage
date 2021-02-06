// Return a popup table using the input feature properties
function popupTemplate(feature) {
    const name = feature.properties.Name;
    const birth = feature.properties.Birth;
    const death = feature.properties.Death;
    const ancestryLink = returnAncestryLink(name);

    templateString = `
    <div class="popup">
        <header class = "popup-header">
            <div class="popup-name">${name}</div>
            <div class="popup-years">${birth} - ${death}</div>
            <hr />
        </header>
        
        <div class="popup-contents">
            ${ancestryLink}
        </div>
    </div>
`;

    const popup = L.popup({ autoPan: true, autoClose: false, keepInView: false, closeOnClick: false }).setContent(templateString)

    return popup
}

// Return a popup table using the input feature properties
function videoPopupTemplate(feature) {
    const name = feature.properties.Name;
    const birth = feature.properties.Birth;
    const death = feature.properties.Death;
    const ancestryLink = returnAncestryLink(name);

    templateString = `
        <div class="popup">
            <div class="popup-media">
                <iframe width="300" height="200" src="https://www.youtube.com/embed/wg3ywGdyCm8" frameborder="0" 
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
            </div>

            <header class = "popup-header">
                <div class="popup-name">${name}</div>
                <div class="popup-years">${birth} - ${death}</div>
                <hr />
            </header>
            
            <div class="popup-contents">
                ${ancestryLink}
            </div>
        </div>
    `;

    const popup = L.popup({ autoPan: true, autoClose: false, keepInView: false, closeOnClick: false }).setContent(templateString)

    return popup
}

// Build and return an html button for an ancestry search link
function returnAncestryLink(name) {
    let firstName, lastName;
    //  Try splitting the name into first and last
    try {
        firstName = name.split(" ")[0];
    } catch (err) {
        // Leave the names empty if they aren't found
        firstName = "";
    }
    try {
        lastName = name.split(" ")[1];
    } catch (err) {
        lastName = "";
    }

    linkTemplate = `
            <a href="https://www.ancestry.com/search/?name=${firstName}_${lastName}" target="_blank">
                <button>Find ${name} on Ancestry.com</button>
            </a>
    `

    return linkTemplate
}