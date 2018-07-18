var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./services/configuration')();
var fs = require('fs');
var db = null;


//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// To Parse the req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (config) {

    try {
        
        db = require("./services/dbconnect")(config);

        //Routes Configuration
        var routePath = "./routes/";
        fs.readdirSync(routePath).forEach(function (file) {
            if (file != ".DS_Store") {
                var route = "/api/" + file.split(".")[0];
                var routeDef = require("./routes/" + file)(express, db);
                app.use(route, routeDef);
                console.log("Route Enabled: " + route);
            }
        });


    } catch (err) {
        console.error(err);
    }

    try {
        var listener = app.listen(config.host.port, config.host.ip, (err) => {
            console.log(`Server running in ${listener.address().address} listening port on ${listener.address().port}`);
        });
    }
    catch (err) {
        console.error(err);
    }
}