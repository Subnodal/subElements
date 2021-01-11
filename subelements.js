namespace("com.subnodal.subelements", function(exports) {
    exports.NO_REPEAT = -1;

    exports.render = function() {
        require("com.subnodal.subelements.evaluator").evaluateTree();
    };

    exports.init = function(options) {
        options = options || {};

        if (options.repeat != exports.NO_REPEAT) {
            setInterval(exports.render, options.repeat || 0);
        } else {
            exports.render();
        }
    };
});