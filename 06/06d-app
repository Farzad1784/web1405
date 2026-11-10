import { get } from 'node:http';
import { framework }  from './06a-framework.js';
import { writeFile, readFile, unlink, rmdir} from 'node:fs';
const app = framework();
const port = 555;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('sum', function(request, response){
    let items = request.url.split("/");
    response.writeHead(200);
    response.write((Number(items[2]) + Number(items[3])).toString());
    response.end();
});

app.get('createFile', function (request, response){
    let items = request.url.split("/");

    writeFile(items[2], items[3], function(error){
        if(error){
            console.log('error', error);
            response.writeHead(500);
            response.write("createFile error");
            response.end();
        }
        else{
            console.log(3);
            console.log("createFile done");

            response.writeHead(200);
            response.write("createFile done");
            response.end();
            console.log(4);
        }                
    });
});

app.get('readFile', function (request, response){
    let items = request.url.split("/");

    readFile(items[2], function(error, body){
        if(error){
            response.writeHead(500);
            response.write("readFile error");
            response.end();
        }
        else{
            console.log("readFile done");

            response.writeHead(200);
            response.write(body);
            response.end();
        }                
    });
});

app.get('deleteFile', function(request, response){
    let items = request.url.split("/");

    unlink(items[2], function(error){
        if(error){
            console.log("deleteFile error", error);

            response.writeHead(500);
            response.write("deleteFile error");
            response.end();
        }
        else{
            console.log("deleteFile done");

            response.writeHead(200);
            response.write("deleteFile done");
            response.end();
        }
    });
});

app.get('delete', function(request, response){
    let items = request.url.split("/");

    unlink(items[2], function(error){
        if(error){
            console.log("deleteFile error", error);
            if(error.code === 'EPERM'){
                rmdir(items[2], function(error){
                    if(error){
                        console.log("delete error", error);

                        response.writeHead(500);
                        response.write("delete error");
                        response.end();
                    }
                    else{
                        console.log("delete done (folder)");

                        response.writeHead(200);
                        response.write("delete done");
                        response.end();
                    }
                });
            }
        }
        else{
            console.log("delete done (file)");

            response.writeHead(200);
            response.write("delete done");
            response.end();
        }
    });

});
app.get('signup', function(request, response) {

    readFile('db.json', function(error, fileData) {

        let users = [];

        if (error) {
            if (error.code !== 'ENOENT') {
                response.writeHead(500);
                response.end("Error reading db.json");
                return;
            }
        }
        else {
            try {
                users = JSON.parse(fileData.toString());

                if (!Array.isArray(users)) {
                    response.writeHead(500);
                    response.end("Invalid database structure");
                    return;
                }

            } catch (error) {
                response.writeHead(500);
                response.end("Invalid JSON data");
                return;
            }
        }

        // Generate unique ID
        let userId;

        do {
            userId = getRandomInt(100000, 999999);
        } while (users.some(x => x.id === userId));

        // Add ID to user
        request.data.id = userId;

        console.log("request.data:", request.data);

        users.push(request.data);

        console.log("newData:", users);

        writeFile('db.json', JSON.stringify(users, null, 2), function(error) {

            if (error) {
                console.log("error writing db.json", error);

                response.writeHead(500);
                response.end("signup error");
            }
            else {
                console.log("signup done");

                response.writeHead(201);
                response.end("signup done");
            }

        });

    });

});

app.get('getUser', function(request, response) {

    let items = request.url.split("/");
    let userId = items[2];

    readFile('db.json', function(error, fileData) {

        if (error) {
            console.log("error reading db.json", error);

            response.writeHead(500);
            response.end("Error reading db.json");
            return;
        }

        try {

            fileData = fileData.toString();
            fileData = JSON.parse(fileData);

            let found = false;

            for (let x of fileData) {

                if (x.id == userId) {

                    response.writeHead(200, {
                        'Content-Type': 'application/json'
                    });

                    response.end(JSON.stringify(x));

                    found = true;
                    break;
                }
            }

            if (!found) {
                response.writeHead(404);
                response.end("User not found");
            }

        } catch (error) {

            response.writeHead(500);
            response.end("Invalid JSON data");

        }

    });

});


app.get('deleteUser', function(request, response) {

    let items = request.url.split("/");
    let userId = items[2];

    readFile('db.json', function(error, fileData) {

        if (error) {
            response.writeHead(500);
            response.end("Error reading db.json");
            return;
        }

        try {

            fileData = JSON.parse(fileData.toString());

            let newData = [];
            let found = false;

            for (let x of fileData) {

                if (x.id == userId) {
                    found = true;
                }
                else {
                    newData.push(x);
                }

            }

            if (!found) {
                response.writeHead(404);
                response.end("User not found");
                return;
            }

            writeFile('db.json', JSON.stringify(newData, null, 2), function(error) {

                if (error) {
                    response.writeHead(500);
                    response.end("Error deleting user");
                    return;
                }

                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                response.end("User deleted successfully!");

            });

        }
        catch (error) {

            response.writeHead(500);
            response.end("Invalid JSON data");

        }

    });

});
app.listen(port, function(){
  console.log('app listening on port: ', port);
});
