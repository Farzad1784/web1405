import {createServer} from "http";

function main(reqouste, respose ) {
    console.log("===================");
    console.log("url :", reqouste.url);
    
    let parts = reqouste.url.split("/");
    
    
    let num1 = Number(parts[1]);
    let num2 = Number(parts[2]);
    let sum = num1 + num2;


    respose.writeHead(200, {"content-type": "text/plain; charset=utf-8"});
    respose.end(String(sum));


}

let server = createServer(main);
server.listen(555);