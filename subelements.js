namespace("com.subnodal.subelements", function(exports) {
    exports.VERSION = "1.0.0";
    exports.VERNUM = 0;

    exports.NO_REPEAT = -1;

    exports.rootElement = null;
    exports.scope = window;

    exports.render = function() {
        require("com.subnodal.subelements.evaluator").evaluateTree(exports.rootElement, exports.scope);
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
    
            if (options.scope != undefined) {
                exports.scope = options.scope;
            }

            if (options.repeat != exports.NO_REPEAT) {
                setInterval(exports.render, options.repeat || 0);
            } else {
                exports.render();
            }
        });
    };
});