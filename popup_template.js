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
