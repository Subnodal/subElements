namespace("com.subnodal.subelements.requests", function(exports) {
    exports.make = function(method, url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.onload = function() {
                if (xhr.status == 200) {
                    resolve(xhr.response, xhr.status);
                } else {
                    reject({
                        code: xhr.status,
                        message: xhr.response
                    });
                }
            };

            xhr.open(method, url, true);
            xhr.send();
        });
    };

    exports.get = function(url) {
        return exports.make("GET", url);
    };

    exports.getJson = function(url) {
        return new Promise(function(resolve, reject) {
            exports.get(url).then(function(data, status) {
                try {
                    resolve(JSON.parse(data), status);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        reject({
                            code: status,
                            message: "Syntax error when parsing JSON"
                        });
                    } else {
                        throw e;
                    }
                }
            }).catch(function(error) {
                reject(error);
            });
        });
    };
});