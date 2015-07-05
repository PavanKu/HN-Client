var express = require("express");
var path = require("path");
var fs = require("fs");
var https = require("https");
var client = require("./client");

var app = express();
var HN_baseurl = "https://hacker-news.firebaseio.com/v0/";
var topStoryUrl = HN_baseurl + "topstories.json";
var itemUrl = HN_baseurl + "item/";

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
	fs.readFile("index.html", function (err, data) {
		if (err) return;

		res.send(data.toString());
	});
});

app.get("/getTopStories", function(req, res){

	
	client.get(topStoryUrl, function(err, data){
		if(err) return;
		
		app.locals.topStoryIds = data;
		app.locals.topStoryOffset = 0;
		
		res.json(app.locals.topStoryIds.slice(app.locals.topStoryOffset,app.locals.topStoryOffset + 19));
		app.locals.topStoryOffset += 20;
		res.end();

//
//		var getIteamUrl = "http://localhost:3000/getItems?offset=0&count=15";
//		client.get(getIteamUrl,function(err, data){
//			if(err) return;
//
//			res.json(data);
//			res.end();
//		});
	});
});

app.get("/getNextTopStories", function(req, res){

	res.json(app.locals.topStoryIds.slice(app.locals.topStoryOffset,app.locals.topStoryOffset +19));
	app.locals.topStoryOffset += 20;
	res.end();
});

app.get("/getItem", function(req, res){
	var itemId = req.query.id;

	client.get([itemUrl, itemId, ".json"].join(""), function(err, data){
		if(err) return;

		res.json(data);
		res.end();
	});
});

app.get("/getItems", function(req, res){
	console.log("Fetching Items");
	var offset = req.query.offset;
	var count = req.query.count;
	var ticker = 0;
	var storyData = [];
	
	console.log("offset: ", offset, "count: ", count);
	for(var i=offset; i<offset+count; i++){
		var storyId = app.locals.topStoryIds[i];
		if(!storyId) break;
		var itemUrl = [HN_baseurl, "item/", storyId, ".json"].join("");
		
		client.get(itemUrl, function(err, data){
			if(err) return;
			
			storyData.push(data);
			ticker +=1;
			
			if(ticker >= count){
				var nextUrl = '/getItems?offset='+i+'&count=10'
				storyData.push({
					next: nextUrl
				});
				res.json(storyData);
				res.end();
			}
		});
	}
});

app.listen(Number(process.argv[2]));
