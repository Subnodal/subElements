var subElements = require("com.subnodal.subelements");

var i = 0;

subElements.init();

setInterval(function() {
    i++;

    subElements.render();
}, 1000);