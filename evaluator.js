namespace("com.subnodal.subelements.evaluator", function(exports) {
    exports.evaluateTree = function(rootNode = document.body) {
        if (rootNode.nodeType == Node.TEXT_NODE) {
            if (rootNode.s_textContent != undefined && rootNode.textContent != rootNode.s_textContent) {
                rootNode.textContent = rootNode.s_textContent;
            } else {
                rootNode.s_textContent = rootNode.textContent;
            }

            if (rootNode.textContent.match(/{{(.*?)}}/g)) {
                rootNode.textContent = rootNode.textContent.replace(/{{(.*?)}}/g, function(a, b) {
                    return eval.apply(window, [b]);
                });
            }
        } else {
            for (var i = 0; i < rootNode.attributes.length; i++) {
                var attribute = rootNode.attributes[i];

                if (attribute.s_value != undefined && attribute.value != attribute.s_value) {
                    attribute.value = attribute.s_value;
                } else {
                    attribute.s_value = attribute.value;
                }

                if (attribute.value.match(/{{(.*?)}}/g)) {
                    attribute.value = attribute.value.replace(/{{(.*?)}}/g, function(a, b) {
                        return eval.apply(window, [b]);
                    });
                }
            }
        }

        for (var i = 0; i < rootNode.childNodes.length; i++) {
            exports.evaluateTree(rootNode.childNodes[i]);
        }
    };
});