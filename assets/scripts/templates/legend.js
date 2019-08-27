// Add the legend HTML into the main HTML
function addLegend()
{
    document.write(
    `
        <!doctype html>
        <html lang="en">
        <div id='maplegend' class='maplegend'>

        <div class='legend-title'>Plot status</div>
        <div class='legend-scale'>
        <ul class='legend-labels'>
            <li><span style='background:rgb(68, 140, 203);opacity:1;'></span>Occupied</li>
            <li><span style='background:rgb(212, 198, 37);opacity:1;'></span>Available</li>
            <li><span style='background:rgb(203, 68, 109);opacity:1;'></span>Sold</li>
        </ul>
        </div>
        </div>

        </body>
        </html>

        <style type='text/css'>
        .maplegend {
            position: absolute; 

            height: auto; 

            width: auto; 
            z-index:999; 
            border-style: solid;
            border-color: rgba(0,0,0,0.2); 
            border-width: 2px; 
            background-color: rgba(255, 255, 255, 1); 
            border-radius:5px; 
            padding: 5px; 
            font-size:14px; 
            top: 160px; 
            left: 10px;
        }
        .maplegend .legend-title {
            font-family: sans-serif;
            text-align: left;
            margin-bottom: 5px;
            margin-left: 10px;
            font-weight: regular;
            font-size: 100%;
            }
        .maplegend .legend-scale ul {
            margin: 0;
            margin-bottom: 5px;
            padding: 0;
            float: left;
            list-style: none;
            }
        .maplegend .legend-scale ul li {
            font-family: sans-serif;
            font-size: 9pt;
            list-style: none;
            margin-left: 10px;
            line-height: 18px;
            margin-bottom: 2px;
            }
        .maplegend ul.legend-labels li span {
            display: block;
            float: left;
            height: 16px;
            width: 30px;
            margin-right: 5px;
            margin-left: 0px;
            border: 1px solid #999;
            }
        .maplegend .legend-source {
            font-size: 80%;
            color: #777;
            clear: both;
            }
        .maplegend a {
            color: #777;
            }
        </style>`
    )
}