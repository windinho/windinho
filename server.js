//
// /                         serves index.html
// /(js|css)/*               serves static files
// /questions                serves questions
// /options?question=<id>    serves options for a given question
//
var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var util = require('util');
var invoices = [{
    id: 1,
    time: "11:35 - Today",
    items: [{name: "Item 1", qty: 2, price: 300}, {name: "Item 2", qty: 1, price: 600}, {name: "Item 3", qty: 3, price: 1000}],
    name: "John Doe",
    email: "johndoe@gmail.com",
    value: 3000
}, {
    id: 2,
    time: "12:30 - Today",
    items: [{name: "Item 1", qty: 2, price: 300}],
    name: "Naveen",
    email: "naveen@gmail.com",
    value: 1240
}, {
    id: 3,
    time: "11:35 - Today",
    items: [{name: "Chicken Soup", qty: 2, price: 500}],
    name: "Jose",
    email: "jose@gmail.com",
    value: 3960
}, {
    id: 4,
    time: "11:35 - Today",
    items: [{name: "Prawn", qty: 2, price: 700}],
    name: "Jeph",
    email: "jeph@gmail.com",
    value: 2000
}]

var dir = path.dirname(fs.realpathSync(__filename));

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var m;
    if (pathname == '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(dir + '/index.html').pipe(res);
        return;
    } else if (m = pathname.match(/^\/(js|css)\//)) {
        var filename = dir + pathname;
        var stats = fs.existsSync(filename) && fs.statSync(filename);
        if (stats && stats.isFile()) {
            res.writeHead(200, {'Content-Type': m[1] === 'js' ? 'application/javascript' : 'text/css'});
            fs.createReadStream(filename).pipe(res);
            return;
        }
    } else if (pathname.match(/^\/invoices/)) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(invoices));
        res.end();
        return;
    }
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
}).listen(8080, 'localhost');

console.log('server running on port 8080');
