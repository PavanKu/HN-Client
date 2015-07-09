(function (w, d, undefined) {
	$(document).ready(function () {

		//Fetch HN Posts
		$.getJSON("/getTopStories")
			.done(function (stories) {
				console.log(stories);
				for (var i = 0; i < stories.length; i++) {
					var storyId = stories[i];
					$.getJSON("/getItem?id=" + storyId)
						.done(function (story) {
							console.log(story);
							$("#topStoriesList").append(getCardMarkup(story));
						});
				}
			});

		function getCardMarkup(story) {
			story.kids = story.kids || [];
			var cardMarkup = '<div class="ui card"><div class="image"><img src="http://www.semantic-ui.com/images/avatar2/large/kristy.png">\
							  </div><div class="content"><a class="header" href="'+story.url+'">'+story.title+'</a>\
								<div class="meta"><span class="date">Joined in 2013</span></div><div class="description">Kristy is an art director living in New York.</div></div><div class="extra content"><img class="ui image mini avatar" src="'+getFavicon(story.url)+'"><a class="right floated"><i class="comment icon"></i>'+story.kids.length+' comments</a></div></div>';

			return cardMarkup;
		}

		function getFavicon(url) {
//						var service = "https://logo.clearbit.com/";
//						var service = "http://favicon.yandex.net/favicon/";
			var service = "//icons.duckduckgo.com/ip2/"
			var domain = url.split("/")[2] || "";

			return service + domain + ".ico";
		}
	});
})(window, document, undefined);
