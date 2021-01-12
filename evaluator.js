namespace("com.subnodal.subelements.evaluator", function(exports) {
    var lastEvaluatedCondition = true;

    function evalWithScope(expression, scope = {...window}) {
        with (scope) {
            return eval(expression);
        }
    }

    exports.evaluateExpression = function(expression, scope = {...window}) {
        return expression.replace(/{{(.*?)}}/g, function(a, b) {
            return evalWithScope(b, scope);
        });
    }

    exports.evaluateTree = function(rootNode = document.body, scopeVariables = {...window}) {
        var renderChildren = true;

        if (rootNode.nodeType == Node.TEXT_NODE) {
            if (rootNode.s_textContent != undefined && rootNode.textContent != rootNode.s_textContent) {
                rootNode.textContent = rootNode.s_textContent;
            } else {
                rootNode.s_textContent = rootNode.textContent;
            }

            if (rootNode.textContent.match(/{{(.*?)}}/g)) {
                rootNode.textContent = exports.evaluateExpression(rootNode.textContent, scopeVariables);
            }
        } else if (rootNode.nodeType != Node.COMMENT_NODE) {
            if (rootNode.getAttribute("s-ignore") == "yes" || rootNode.getAttribute("s-ignore") == "") {
                return;
            }

            for (var i = 0; i < rootNode.attributes.length; i++) {
                var attribute = rootNode.attributes[i];

                if (attribute.s_value != undefined && attribute.value != attribute.s_value) {
                    attribute.value = attribute.s_value;
                } else {
                    attribute.s_value = attribute.value;
                }

                if (attribute.value.match(/{{(.*?)}}/g)) {
                    attribute.value = exports.evaluateExpression(attribute.value, scopeVariables);
                }
            }

            if (rootNode.tagName == "S-IF") {
                var condition = rootNode.getAttribute("condition");

                if (condition == null) {
                    condition = "false";
                }

                if (rootNode.getAttribute("condition") == "true") {
                    rootNode.hidden = false;
                    lastEvaluatedCondition = true;
                    renderChildren = true;
                } else {
                    rootNode.hidden = true;
                    lastEvaluatedCondition = false;
                    renderChildren = false;
                }
            } else if (rootNode.tagName == "S-ELSEIF") {
                var condition = rootNode.getAttribute("condition");

                if (condition == null) {
                    condition = "false";
                }

                if (!lastEvaluatedCondition) {
                    if (rootNode.getAttribute("condition") == "true") {
                        rootNode.hidden = false;
                        lastEvaluatedCondition = true;
                        renderChildren = true;
                    } else {
                        rootNode.hidden = true;
                        lastEvaluatedCondition = false;
                        renderChildren = false;
                    }
                } else {
                    rootNode.hidden = true;
                    renderChildren = false;
                }
            } else if (rootNode.tagName == "S-ELSE") {
                if (!lastEvaluatedCondition) {
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

                if (
                    rootNode.s_start != exports.evaluateExpression(rootNode.getAttribute("start") || "", scopeVariables) ||
                    rootNode.s_stop != exports.evaluateExpression(rootNode.getAttribute("stop") || "", scopeVariables) ||
                    rootNode.s_step != exports.evaluateExpression(rootNode.getAttribute("step") || "", scopeVariables)
                ) {
                    rootNode.s_start = exports.evaluateExpression(rootNode.getAttribute("start") || "", scopeVariables);
                    rootNode.s_stop = exports.evaluateExpression(rootNode.getAttribute("stop") || "", scopeVariables);
                    rootNode.s_step = exports.evaluateExpression(rootNode.getAttribute("step") || "", scopeVariables);
                }

                rootNode.innerHTML = "";

                renderChildren = false;

                for (var i = Number(rootNode.s_start); i < Number(rootNode.s_stop); i += Number(rootNode.s_step) || 1) {
                    if (rootNode.getAttribute("var")) {
                        scopeVariables[rootNode.getAttribute("var")] = i;

                        rootNode.innerHTML += rootNode.s_innerHTML;

                        for (var j = 0; j < rootNode.childNodes.length; j++) {
                            exports.evaluateTree(rootNode.childNodes[j], scopeVariables);
                        }
                    }
                }
            } else if (rootNode.tagName == "S-SET") {
                scopeVariables[rootNode.getAttribute("var")] = exports.evaluateExpression(rootNode.getAttribute("value") || "", scopeVariables);
            }
        }

        if (renderChildren) {
            for (var i = 0; i < rootNode.childNodes.length; i++) {
                exports.evaluateTree(rootNode.childNodes[i], scopeVariables);
            }
        }
    };
});