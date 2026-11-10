import { createServer } from 'node:http';

function framework() {

    let controllers = [];

    let app = {

        get: function(path, func) {
            controllers.push({
                method: 'GET',
                name: path,
                func: func
            });
        },

        post: function(path, func) {
            controllers.push({
                method: 'POST',
                name: path,
                func: func
            });
        },

        listen: function(port, userCallback) {

            function serverCallback(request, response) {

                console.log("---------------------------------------------");
                console.log("(framework) method:", request.method);
                console.log("(framework) url:", request.url);

                let data = "";

                request.on("data", function(part) {
                    data += part;
                });

                request.on("end", function() {

                    console.log("(framework) data:", data);

                    // Convert request body to JavaScript object
                    try {
                        if (data.trim() !== "") {
                            request.data = JSON.parse(data);
                        } else {
                            request.data = {};
                        }
                    } catch (error) {
                        response.statusCode = 400;
                        response.end("Invalid JSON");
                        return;
                    }

                    request.myKey = 'salam!';

                    let found = false;

                    for (let item of controllers) {

                        if (
                            request.method === item.method &&
                            request.url.startsWith('/' + item.name)
                        ) {

                            console.log("(framework) controller:", item.name);

                            found = true;

                            item.func(request, response);

                            break;
                        }
                    }

                    if (!found) {
                        response.statusCode = 404;
                        response.end("Path not found");
                    }

                });

            }

            let server = createServer(serverCallback);

            server.listen(port, userCallback);

        }

    };

    return app;

}

export {
    framework
};