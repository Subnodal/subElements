/*
    subElements

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

namespace("com.subnodal.subelements.l10n", function(exports) {
    const DEFAULT_FORMATTING_LOCALE = "en_GB";

    var warnedStrings = [];

    function warnString(string, message) {
        if (!(warnedStrings.includes(string))) {
            console.warn(message);

            warnedStrings.push(string);
        }
    }

    exports.languageResources = {};

    exports.localeCode = null;
    exports.fallbackLocaleCode = null;

    exports.loadLanguageResource = function(localeCode, data) {
        exports.languageResources[localeCode] = data;
    };

    exports.loadLanguageResources = function(resources) {
        exports.languageResources = resources;
    };

    exports.switchToLocale = function(localeCode) {
        exports.localeCode = localeCode;
    };

    exports.getLocaleCode = function() {
        return exports.localeCode;
    };

    exports.setFallbackLocale = function(localeCode) {
        exports.fallbackLocaleCode = localeCode;
    };

    exports.getSystemLocale = function() {
        var rawSystemLocale = navigator.language;
        
        if (navigator.languages != undefined) {
            rawSystemLocale = navigator.languages[0];
        }

        return rawSystemLocale.split("-")[0] + "_" + rawSystemLocale.split("-")[1];
    };

    exports.formatValue = function(data, options = {}, localeCode = exports.localeCode) {
        if (typeof(data) == "number") {
            return Number(data).toLocaleString((localeCode || DEFAULT_FORMATTING_LOCALE).replace(/_/g, "-"), options);
        } else if (data instanceof Date) {
            return data.toLocaleString((localeCode || DEFAULT_FORMATTING_LOCALE).replace(/_/g, "-"), options);
        } else {
            return data;
        }
    };

    exports.getLanguageResourceCodes = function() {
        return Object.keys(exports.languageResources);
    };

    exports.getLocaleName = function(localeCode = exports.localeCode, short = false) {
        if (short) {
            return exports.languageResources[localeCode].nameShort || exports.languageResources[localeCode].name;
        }

        return exports.languageResources[localeCode].name;
    };

    exports.getLocaleTextDirection = function(localeCode = exports.localeCode) {
        if (exports.languageResources[localeCode] != undefined) {
            return exports.languageResources[localeCode].textDirection;
        }

        if (exports.languageResources[exports.fallbackLocaleCode] != undefined) {
            return exports.languageResources[exports.fallbackLocaleCode].textDirection;
        }
        
        return "ltr";
    };

    exports.translate = function(string, arguments, formatValues = true, formatValueOptions = {}, localeCode = exports.localeCode) {
        if (typeof(arguments) != "object") {
            arguments = [arguments];
        }

        var translatedString = "";

        if (exports.languageResources[localeCode] != undefined && exports.languageResources[localeCode].strings[string] != undefined) {
            translatedString = exports.languageResources[localeCode].strings[string];
        } else if (exports.languageResources[exports.fallbackLocaleCode] != undefined) {
            warnString(string, `Fallback locale is in use to translate string "${string}"`);

            translatedString = exports.languageResources[exports.fallbackLocaleCode].strings[string];
        } else {
            throw new ReferenceError("Tried to use fallback locale, but fallback locale does not exist");
        }

        if (translatedString != undefined) {
            var foundTranslation = null;

            if (typeof(translatedString) == "object") {
                for (var rule in rules) {
                    var ruleTemplate = rule;

                    for (var argument in arguments) {
                        var argumentReplacement = arguments[argument];

                        if (formatValues) {
                            argumentReplacement = exports.formatValue(argumentReplacement, formatValueOptions, localeCode);
                        }

                        argumentReplacement = argumentReplacement
                            .replace(/\\/g, "\\\\")
                            .replace(/`/g, "\\`")
                        ;

                        rule = rule.replace(new RegExp("\\{" + argument + "\\}", "g"), "`" + argumentReplacement + "`");

                        if (eval(rule)) {
                            foundTranslation = rules[ruleTemplate];
                        }
                    }
                }
            } else {
                foundTranslation = translatedString;
            }

            if (foundTranslation != null) {
                for (var argument in arguments) {
                    if (formatValues) {
                        arguments[argument] = exports.formatValue(arguments[argument], formatValueOptions, localeCode);
                    }

                    foundTranslation = foundTranslation.replace(new RegExp("\\{" + argument + "\\}", "g"), arguments[argument]);
                }

                return foundTranslation;
            } else {
                warnString(string, `String "${string}" has no precise translation`);
            }
        } else {
            warnString(string, `String "${string}" has no translation`);
        }
    };
});