/*global require, process */

var express = require("express"),
	path = require("path"),
	fs = require("fs"),
	cheerio = require("cheerio"),
	request = require("request");

var app = express(),
	hn_api = {
		base: "https://hacker-news.firebaseio.com/v0/",
		top: "topstories.json",
		new: "newstories.json"
	};

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
	fs.readFile("index.html", function (err, data) {
		if (err) {
			return;
		}

		res.send(data.toString());
	});
});

app.get("/item", function (req, res) {
	var id = req.query.id,
		story_url = hn_api.base + "item/" + id + ".json";

	request({
		uri: story_url
	}, function (error, response, body) {

		if (error) {
			console.error(error);
			return;
		}
		var storyJSON = JSON.parse(body);
		console.log(storyJSON.url)
//		res.json(storyJSON);
		request({
			uri: storyJSON.url
		}, function(error, response, body){
			try{
				var $ = cheerio.load(body);
				var fbDescription = $("meta[property=\"og:description\"]");
				storyJSON.description = $(fbDescription).attr("content");

				var fbImage = $("meta[property=\"og:image\"]");
//				var firstImg = $("img").get(0);
				storyJSON.image = $(fbImage).attr("content");// || $(firstImg).attr("src");

				res.json(storyJSON);

			} catch(err){
				console.error(err);
			}
		});
	});
});

app.get("/top", function (req, res) {
	request({
		uri: hn_api.base + hn_api.top
	}, function (error, response, body) {
		if (error) {
			console.error(error);
			return;
		}
		res.jsonp(body);
	});
});

app.get("/new", function (req, res) {
	request({
		uri: hn_api.base + hn_api.new
	}, function (error, response, body) {
		if (error) {
			console.error(error);
			return;
		}
		res.jsonp(body);
	});
});

app.listen(Number(process.argv[2]));
