
import { createServer } from 'node:http';
import { writeFile, readFile } from 'node:fs';

let controllers = [
    {
        name: "sum",
        func: function (request, response) {
            let items = request.url.split("/");

            response.writeHead(200);
            response.write(
                (Number(items[2]) + Number(items[3])).toString()
            );
            response.end();
        }
    },
    {
        name: "createFile",
        func: function (request, response) {
            let items = request.url.split("/");

            writeFile(items[2], items[3], function (error) {
                if (error) {
                    console.log("error", error);
                    response.writeHead(500);
                    response.write("createFile error");
                    response.end();
                    
                }
                else{
                console.log("createFile done");

                response.writeHead(200);
                response.write("createFile done");
                response.end();
                }
            });
        }
    },
    {
      name: "readFile",
      func: function (request, response) {
          let items = request.url.split("/");

          readFile(items[2], "utf8", function (error, body) {
              if (error) {
                  console.log("error", error);

                  response.writeHead(500);
                  response.end("readFile error");
              } else {
                  console.log("readFile done");

                  response.writeHead(200);
                  response.end(body);
              }
          });
      }
    }
    // {
    //     name: "readFile",
    //     func: function (request, response) {
    //         let items = request.url.split("/");

    //         writeFile(items[2], function (error,body) {
    //             if (error) {
    //                 console.log("error", error);
    //                 response.writeHead(500);
    //                 response.write("readFIle error");
    //                 response.end();
                    
    //             }
    //             else{
    //             console.log("readFile done");

    //             response.writeHead(200);
    //             response.write(body);
    //             response.end();
    //             }
    //         });
    //     }
    // }
];

function serverCallback(request, response) {
    console.log("------------------------");
    console.log("url", request.url);

    let found = false;

    for (const controller of controllers) {
        if (request.url.startsWith('/' + controller.name)) {
            found = true;
            controller.func(request, response);
            break;
        }
    }

    if (!found) {
        response.writeHead(404);
        response.end("not found");
        console.log("not found.");
    }
}

let server = createServer(serverCallback);

server.listen(555, () => {
    console.log("Server running");
});
