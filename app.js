var express = require("express"); //basic web server
var http = require("http"); //access to http
var path = require("path");
var mongoDB = require("mongodb").Db; //MongoDB database
var mongoServer = require("mongodb").Server; //MongoDb Server reference
var ObjectID = require("mongodb").ObjectID;

var app = express(); //puts together web server and stores it in var named (app)
var server = http.createServer(app); //creates HTTP server; passes in the app var

var self = this;
this.db = new mongoDB("godiva", new mongoServer("localhost", 27017, {
	auto_reconnect: true}, {}));

app.use(express.static('static'));

var whatToReturn = function(request, resource) {
	resource.sendFile(__dirname + "/index.html");
};

app.get("/", whatToReturn);

app.get("/slaa", function(request, resource) {
	resource.set("Content-Type", "application/json");

	self.db.open(function() {

		self.db.collection("SLAAinfo", function(error, collection) {

			collection.find().toArray(function(e, results) {

				var totalArray = [ ];

				for (i = 0; i < results.length; i++) {
					totalArray.push(results[i]);
				}

				resource.send(totalArray);

			});
		});
	});
});


var serverReady = function () {
	console.log("YUPYUPYUP");
};

server.listen(9001, serverReady);

console.log(__dirname);