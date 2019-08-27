// Return a popup table using the input feature properties
function popupTemplate(feature)
{
    var name = feature.properties.Name;
    var birth = feature.properties.Birth;
    var death = feature.properties.Death;

    templateString = `
    <!DOCTYPE html>
    <html>
        <body>
            <table id="t01">
                <tr>
                    <td><b>Name</b></td>
                    <td>${name}</td>
                </tr>
                <tr>
                    <td><b>Birth year</b></td>
                    <td>${birth}</td>
                </tr>
                <tr>
                    <td><b>Death year</b></td>
                    <td>${death}</td>
                </tr>
            </table>
        </body>
    </html>
    `
    return templateString;
}

// Return a popup table using the input feature properties
function videoPopupTemplate(feature)
{
    var name = feature.properties.Name;
    var birth = feature.properties.Birth;
    var death = feature.properties.Death;

    templateString = `
    <!DOCTYPE html>
    <html>
        <body>
            <table id="t01">
                <tr>
                    <td colspan="2">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/wg3ywGdyCm8" frameborder="0" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                        </iframe>
                    </td>
                </tr>
                <tr>
                    <td><b>Name</b></td>
                    <td>${name}</td>
                </tr>
                <tr>
                    <td><b>Birth year</b></td>
                    <td>${birth}</td>
                </tr>
                <tr>
                    <td><b>Death year</b></td>
                    <td>${death}</td>
                </tr>
            </table>
        </body>
    </html>
    `
    return templateString;
}
