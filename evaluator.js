namespace("com.subnodal.subelements.evaluator", function(exports) {
    exports.evaluateTree = function(rootNode = document.body, scopeVariables = {...window}) {
        var renderChildren = true;

        // if (scopeVariables.j) {
        //     console.log(scopeVariables.j);
        // }

        if (rootNode.nodeType == Node.TEXT_NODE) {
            if (rootNode.s_textContent != undefined && rootNode.textContent != rootNode.s_textContent) {
                rootNode.textContent = rootNode.s_textContent;
            } else {
                rootNode.s_textContent = rootNode.textContent;
            }

            if (rootNode.textContent.match(/{{(.*?)}}/g)) {
                rootNode.textContent = rootNode.textContent.replace(/{{(.*?)}}/g, function(a, b) {
                    with (scopeVariables) {
                        return eval(b);
                    }
                });
            }
        } else if (rootNode.nodeType != Node.COMMENT_NODE) {
            for (var i = 0; i < rootNode.attributes.length; i++) {
                var attribute = rootNode.attributes[i];

                if (attribute.s_value != undefined && attribute.value != attribute.s_value) {
                    attribute.value = attribute.s_value;
                } else {
                    attribute.s_value = attribute.value;
                }

                if (attribute.value.match(/{{(.*?)}}/g)) {
                    attribute.value = attribute.value.replace(/{{(.*?)}}/g, function(a, b) {
                        with (scopeVariables) {
                            return eval(b);
                        }
                    });
                }
            }

            if (rootNode.tagName == "S-IF") {
                var condition = rootNode.getAttribute("condition");

                if (condition == null) {
                    condition = "false";
                }

                if (rootNode.getAttribute("condition") == "true") {
                    rootNode.hidden = false;
                    renderChildren = true;
                } else {
                    rootNode.hidden = true;
                    renderChildren = false;
                }
            } else if (rootNode.tagName == "S-FOR") {
                if (rootNode.s_innerHTML == undefined) {
                    rootNode.s_innerHTML = rootNode.innerHTML;
                }

                rootNode.innerHTML = "";

                renderChildren = false;

                for (var i = Number(rootNode.getAttribute("start")); i < Number(rootNode.getAttribute("stop")); i += rootNode.getAttribute("step") || 1) {
                    if (rootNode.getAttribute("var")) {
                        scopeVariables[rootNode.getAttribute("var")] = i;

                        rootNode.innerHTML += rootNode.s_innerHTML;

                        for (var j = 0; j < rootNode.childNodes.length; j++) {
                            exports.evaluateTree(rootNode.childNodes[j], scopeVariables);
                        }
                    }
                }
            }
        }

        if (renderChildren) {
            for (var i = 0; i < rootNode.childNodes.length; i++) {
                exports.evaluateTree(rootNode.childNodes[i], scopeVariables);
            }
        }
    };
});