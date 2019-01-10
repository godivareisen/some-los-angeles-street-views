var http = require("http");
var request = require("request");
var cheerio = require("cheerio");
var mongoDB = require("mongodb").Db; //MongoDB database
var mongoServer = require("mongodb").Server; //MongoDb Server reference
var ObjectID = require("mongodb").ObjectID;

var collectionURLs = [
	"http://www.getty.edu/art/collection/search/?pg=1&view=grid&query=YTo1OntzOjU6InF1ZXJ5IjtzOjk6ImVkIHJ1c2NoYSI7czo1OiJ0aXRsZSI7czoyNzoic29tZSBsb3MgYW5nZWxlcyBhcGFydG1lbnRzIjtzOjE3OiJfZGF0ZV9yYW5nZV9iZWdhbiI7czo1OiItNTAwMCI7czoxNzoiX2RhdGVfcmFuZ2VfZW5kZWQiO3M6NDoiMjAxNCI7czo0OiJzb3J0IjtzOjY6Ii1zY29yZSI7fQ%3D%3D",

	"http://www.getty.edu/art/collection/search/?pg=2&view=grid&query=YTo1OntzOjU6InF1ZXJ5IjtzOjk6ImVkIHJ1c2NoYSI7czo1OiJ0aXRsZSI7czoyNzoic29tZSBsb3MgYW5nZWxlcyBhcGFydG1lbnRzIjtzOjE3OiJfZGF0ZV9yYW5nZV9iZWdhbiI7czo1OiItNTAwMCI7czoxNzoiX2RhdGVfcmFuZ2VfZW5kZWQiO3M6NDoiMjAxNCI7czo0OiJzb3J0IjtzOjY6Ii1zY29yZSI7fQ%3D%3D"
];


function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

for (i = 0; i < collectionURLs.length; i++) {

	download(collectionURLs[i], function(data) {
	  if (data) {

	  	var self = this;

		this.db = new mongoDB("godiva", new mongoServer("localhost", 27017, {
		auto_reconnect: true}, {}));

		var titleArray = [ ];
		var imageArray = [ ];

	    var $ = cheerio.load(data);

	    $("figcaption h5").each(function(i, e) {
	    	var imageTitles = $(e).text();
	    	titleArray.push(imageTitles);

	    	// console.log(imageTitles);
	      	});

	    $("figure div").each(function(i, e) {
	    	var imageURLstrings = $(e).css("background-image"),
	    	reg = /url\((.*)\)/,
	    	extractedImageURLs = reg.exec(imageURLstrings)[1];
	    	imageArray.push(extractedImageURLs);

	    	// console.log(extractedImageURLs);
	    	});

	    console.log("done");
	    // console.log(titleArray);
	    // console.log(imageArray);

	    var infoSet = [ ];

	    for (i = 0; i < titleArray.length && i < imageArray.length; i++) {

	    	infoSet.push({
	    		"title": titleArray[i],
	    		"imageURL": imageArray[i]
	    	});
	    }

	    console.log(infoSet);

	    self.db.open(function() {
	    	self.db.collection("SLAAinfo", function(error, collection) {
	    		collection.insert(infoSet);
	    	});
	    });

	  }

	  else console.log("error");

	});
	
}