var subElements = require("com.subnodal.subelements");
var core = require("com.subnodal.subelements.core");
var requests = require("com.subnodal.subelements.requests");

var i = 0;

Promise.all([
    requests.getJson("locale/en_GB.json"),
    requests.getJson("locale/fr_FR.json"),
    requests.getJson("locale/ar_EG.json"),
    requests.getJson("locale/zh_CN.json")
]).then(function(resources) {
    subElements.init({
        languageResources: {
            "en_GB": resources[0],
            "fr_FR": resources[1],
            "ar_EG": resources[2],
            "zh_CN": resources[3]
        },
        localeCode: core.parameter("lang") || undefined,
        fallbackLocaleCode: "en_GB"
    });
});

setInterval(function() {
    i++;

    subElements.render();
}, 1000);