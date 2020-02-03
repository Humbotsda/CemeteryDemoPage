// Run a test ES6 function and return true if it runs successfully
function check() {
    "use strict";

    try { eval("var foo = (x)=>x+1"); }
    catch (e) { return false; }
    return true;
}

// If the browser fails to execute the ES6 code
if (!check()) {
    alert('Your browser does not support modern Javascript ES6. Features of this site will not work. To use this site, please switch to a modern, compatible browser such as Chrome, Firefox, or Edge.')
}