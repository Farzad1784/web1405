import { createServer } from "http";
import { writeFile } from "fs/promises";

let controllers = [
    {
        name: "createFile",
        func: async function (request, response) {

            let items = request.url.split("/");

            let filename = items[2];
            let content = items.slice(3).join("/");

            try {
                await writeFile(filename, content, "utf8");

                response.writeHead(200, {
                    "Content-Type": "text/plain; charset=utf-8"
                });

                response.end("createFile done");
            } catch (error) {
                response.writeHead(500, {
                    "Content-Type": "text/plain; charset=utf-8"
                });

                response.end("Error creating file");
            }
        }
    }
];

async function servercallback(request, response) {
    console.log("------------------------");
    console.log("url", request.url);

    let found = false;

    for (let i = 0; i < controllers.length; i++) {
        if (request.url.startsWith("/" + controllers[i].name + "/")) {
            found = true;
            await controllers[i].func(request, response);
            break;
        }
    }

    if (!found) {
        response.writeHead(404);
        response.end("command not found");
    }
}

let server = createServer(servercallback);

server.listen(555);