// Return a popup table using the input feature properties
function popupTemplate(feature) {
    const name = feature.properties.Name;
    const birth = feature.properties.Birth;
    const death = feature.properties.Death;
    const ancestryLink = returnAncestryLink(name);

    templateString = `
        <div class="popup-contents">
            <table class="popup-table">
                <tr>
                    <th>Name</th>
                    <td>${name}</td>
                </tr>
                <tr>
                    <th>Birth year</th>
                    <td>${birth}</td>
                </tr>
                <tr>
                    <th>Death year</th>
                    <td>${death}</td>
                </tr>
                ${ancestryLink}
            </table>
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
        <div class="popup-contents">
            <table class="popup-table">
                <tr>
                    <td colspan="2">
                        <iframe width="300" height="200" src="https://www.youtube.com/embed/wg3ywGdyCm8" frameborder="0" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                        </iframe>
                    </td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>${name}</td>
                </tr>
                <tr>
                    <th>Birth year</th>
                    <td>${birth}</td>
                </tr>
                <tr>
                    <th>Death year</th>
                    <td>${death}</td>
                </tr>
                ${ancestryLink}
            </table>
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
    <tr class="table-button-row">            
        <td colspan="2">
            <a href="https://www.ancestry.com/search/?name=${firstName}_${lastName}" target="_blank">
                <button>Find ${name} on Ancestry.com</button>
            </a>
        </td>
    </tr>`

    return linkTemplate
}