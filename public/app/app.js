(function (w, d, undefined) {
	$(document).ready(function () {
		var nextUrl = '';

		//Fetch HN Posts
		$.getJSON("/getStories", function (stories) {
			console.log(stories);
			var markUp = "";
			stories.forEach(function (story) {
				if (!story.next) {
					markUp += '<div class="item"><img class="ui avatar image" src="' + getFavicon(story.url) + '"><div class="content"><a href="' + story.url + '" class="header">' + story.title + '</a><div class="description"></div></div></div>';

					$("#topList").html(markUp);
				} else {
					nextUrl = story.next;
				}
			});
		});

		$("#nextBtn").click(function () {
			$.getJSON(nextUrl, function (stories) {
				var markUp = "";
				stories.forEach(function (story) {
					if (!story.next) {
						markUp += '<div class="item"><img class="ui avatar image" src="' + getFavicon(story.url) + '"><div class="content"><a href="' + story.url + '" class="header">' + story.title + '</a><div class="description"></div></div></div>';

						$("#topList").html(markUp);
					} else {
						nextUrl = story.next;
					}
				});
			});
		});

		function getFavicon(url) {
			var service = "http://favicon.yandex.net/favicon/";
			var domain = url.split("/")[2] || "";

			return service + domain;
		}
	});
})(window, document, undefined);