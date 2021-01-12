namespace("com.subnodal.subelements.evaluator", function(exports) {
    var l10n = require("com.subnodal.subelements.l10n");

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

    exports.evaluateTree = function(rootNode = document.body, scopeVariables = {...window}, translate = true) {
        var renderChildren = true;

        document.body.setAttribute("lang", l10n.getLocaleCode().length > 5 ? l10n.getLocaleCode().replace(/_/g, "-") : l10n.getLocaleCode().substring(0, 2));
        document.body.setAttribute("dir", l10n.getLocaleTextDirection());

        if (rootNode.nodeType == Node.TEXT_NODE) {
            if (rootNode.s_textContent != undefined && rootNode.textContent != rootNode.s_textContent && rootNode.textContent) {
                rootNode.textContent = rootNode.s_textContent;
            } else {
                rootNode.s_textContent = rootNode.textContent;
            }

            if (rootNode.textContent.match(/{{(.*?)}}/g)) {
                rootNode.textContent = exports.evaluateExpression(rootNode.textContent, scopeVariables);
            }
            
            if (
                translate && (
                    rootNode.parentElement.getAttribute("translate") == "yes" ||
                    rootNode.parentElement.getAttribute("translate") == ""
                )
            ) {
                var rawArguments = rootNode.textContent.trim().split("|").slice(1);
                var argumentsObject = {};

                for (var i = 0; i < rawArguments.length; i++) {
                    var argumentsKey, argumentsValue;

                    if (rawArguments[i].split(":").length > 1) {
                        argumentsKey = rawArguments[i].split(":")[0];
                        argumentsValue = rawArguments[i].split(":").slice(1).join(":");
                    } else {
                        argumentsKey = i;
                        argumentsValue = rawArguments[i];
                    }

                    if (!isNaN(argumentsValue)) {
                        argumentsValue = Number(argumentsValue);
                    }

                    argumentsObject[argumentsKey] = argumentsValue;
                }

                rootNode.textContent = l10n.translate(rootNode.textContent.trim().split("|")[0], argumentsObject);
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

                if (condition == "true") {
                    rootNode.hidden = false;
                    lastEvaluatedCondition = true;
                    renderChildren = true;
                } else {
                    rootNode.hidden = true;
                    lastEvaluatedCondition = false;
                    renderChildren = false;
                }
            } else if (rootNode.tagName == "S-ELSEIF") {
                var condition = evalWithScope(rootNode.getAttribute("condition"));

                if (condition == null) {
                    condition = "false";
                }

                if (!lastEvaluatedCondition) {
                    if (condition == "true") {
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
                    rootNode.s_start != evalWithScope(rootNode.getAttribute("start") || "", scopeVariables) ||
                    rootNode.s_stop != evalWithScope(rootNode.getAttribute("stop") || "", scopeVariables) ||
                    rootNode.s_step != evalWithScope(rootNode.getAttribute("step") || "", scopeVariables)
                ) {
                    rootNode.s_start = evalWithScope(rootNode.getAttribute("start") || "", scopeVariables);
                    rootNode.s_stop = evalWithScope(rootNode.getAttribute("stop") || "", scopeVariables);
                    rootNode.s_step = evalWithScope(rootNode.getAttribute("step") || "", scopeVariables);
                }

                rootNode.innerHTML = "";
                renderChildren = false;

                var lastChildNodeLength = 0;

                for (var i = Number(rootNode.s_start); i < Number(rootNode.s_stop); i += Number(rootNode.s_step) || 1) {
                    if (rootNode.getAttribute("var")) {
                        scopeVariables[rootNode.getAttribute("var")] = i;
                    }

                    rootNode.innerHTML += rootNode.s_innerHTML;

                    for (var j = lastChildNodeLength; j < rootNode.childNodes.length; j++) {
                        exports.evaluateTree(rootNode.childNodes[j], scopeVariables, false);
                    }

                    lastChildNodeLength = rootNode.childNodes.length;
                }
            } else if (rootNode.tagName == "S-EACH") {
                if (rootNode.s_innerHTML == undefined) {
                    rootNode.s_innerHTML = rootNode.innerHTML;
                }

                if (rootNode.s_in != evalWithScope(rootNode.getAttribute("in") || "", scopeVariables)) {
                    rootNode.s_in = evalWithScope(rootNode.getAttribute("in") || "", scopeVariables);
                }

                rootNode.innerHTML = "";
                renderChildren = false;

                var lastChildNodeLength = 0;

                for (var i = 0; i < Object.keys(rootNode.s_in).length; i++) {
                    if (rootNode.getAttribute("itervar")) {
                        scopeVariables[rootNode.getAttribute("itervar")] = i;
                    }

                    if (rootNode.getAttribute("keyvar")) {
                        scopeVariables[rootNode.getAttribute("keyvar")] = Object.keys(rootNode.s_in)[i];
                    }

                    if (rootNode.getAttribute("valuevar")) {
                        scopeVariables[rootNode.getAttribute("valuevar")] = rootNode.s_in[Object.keys(rootNode.s_in)[i]];
                    }

                    rootNode.innerHTML += rootNode.s_innerHTML;

                    for (var j = lastChildNodeLength; j < rootNode.childNodes.length; j++) {
                        exports.evaluateTree(rootNode.childNodes[j], scopeVariables, false);
                    }

                    lastChildNodeLength = rootNode.childNodes.length;
                }
            } else if (rootNode.tagName == "S-SET") {
                scopeVariables[rootNode.getAttribute("var")] = evalWithScope(rootNode.getAttribute("value") || "", scopeVariables);
            }
        }

        if (renderChildren) {
            for (var i = 0; i < rootNode.childNodes.length; i++) {
                exports.evaluateTree(rootNode.childNodes[i], scopeVariables);
            }
        }
    };
});