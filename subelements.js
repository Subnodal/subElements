namespace("com.subnodal.subelements", function(exports) {
    var evaluator = require("com.subnodal.subelements.evaluator");
    var l10n = require("com.subnodal.subelements.l10n");

    exports.VERSION = "1.0.0";
    exports.VERNUM = 0;

    exports.NO_REPEAT = -1;

    exports.rootElement = null;
    exports.scope = null;

    exports.render = function(element = exports.rootElement) {
        document.body.hidden = false;

        evaluator.evaluateTree(element, exports.scope);
    };

    exports.ready = function(callback) {
        if (document.readyState == "complete") {
            callback();
        } else {
            addEventListener("load", callback);
        }
    };

    exports.init = function(options) {
        options = options || {};

        l10n.loadLanguageResources(options.languageResources || l10n.languageResources);
        l10n.switchToLocale(options.localeCode || l10n.getSystemLocale());
        l10n.setFallbackLocale(options.fallbackLocaleCode || l10n.getSystemLocale());

        exports.ready(function() {
            if (!exports.silent) {
                console.log(
                    `%c{%csubElements%c}%c\nhttps://github.com/Subnodal/subElements | V${exports.VERSION} | Ready!`,
                    `font-size: 1.5em; font-family: "Overpass Mono", monospace;`,
                    `font-size: 1.5em; font-weight: bold;`,
                    `font-size: 1.5em; font-weight: normal;`,
                    ``
                );
            }

            exports.rootElement = options.rootElement || document.body;
            exports.scope = options.scope || window;

            if (options.textDirection == undefined || options.textDirection == "auto") {
                document.body.setAttribute("dir", l10n.getLocaleTextDirection());
            } else {
                document.body.setAttribute("dir", options.textDirection);
            }

            exports.render();
        });
    };
});