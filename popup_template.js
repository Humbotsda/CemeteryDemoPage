// Return a popup table using the feature properties
function popupTemplate(name, birth, death)
{
    templateString = `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                table {{
                    width:100%;
                }}
                table, th, td {{
                    border: 1px solid black;
                    border-collapse: collapse;
                }}
                th, td {{
                    padding: 5px;
                    text-align: left;
                }}
                table#t01 tr:nth-child(odd) {{
                    background-color: #eee;
                }}
                table#t01 tr:nth-child(even) {{
                background-color:#fff;
                }}
            </style>
        </head>
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
