/*
    subElements

    Copyright (C) Subnodal Technologies. All Rights Reserved.

    https://subnodal.com
    Licenced by the Subnodal Open-Source Licence, which can be found at LICENCE.md.
*/

namespace("com.subnodal.subelements.core", function(exports) {
    exports.parameter = function(key, url = window.location.href) {
        return decodeURIComponent((new RegExp(`[?|&]${key}=([^&;]+?)(&|#|;|$)`).exec(new URL(url).search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
    };

    exports.generateKey = function(length = 16, digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_") {
        var key = "";

        for (var i = 0; i < length; i++) {
            key += digits.charAt(Math.floor(Math.random() * digits.length));
        }

        return key;
    };
});