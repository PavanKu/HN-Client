/*global console, $*/
(function (window, document, undefined) {
	var topStoryOffset = 0,
			idsArr = [];

	$(document).ready(function () {

		$.getJSON("/top")
			.done(function (data) {
				idsArr = JSON.parse(data);
				for (; topStoryOffset < 20; topStoryOffset++) {
					util.fetchStoryCard(idsArr[topStoryOffset]);
				}
			})
			.fail(function (err) {
				console.error(err);
			});
	});

	$(window).scroll(function () {
		if ($(window).scrollTop() === ($(document).height() - $(window).height())) {
			var topLimit = (topStoryOffset + 20);
			for (; topStoryOffset < topLimit; topStoryOffset++) {
				util.fetchStoryCard(idsArr[topStoryOffset]);
			}
		}
	});

	var util = {
		fetchStoryCard: function (id) {
			$.getJSON("/item?id=" + id)
				.done(function (data) {
					console.log(data);
					util.addStoryCard(util.getMarkup(data));
				})
				.fail(function (err) {
					console.error(err);
				});
		},
		addStoryCard: function (storyMarkup) {
			$("#topStoriesList").append(storyMarkup);
		},
		getMarkup: function (story) {
			var storyJSON = story,
				cardMarkup = '<div class="ui card" "data-id={id}"><div class="image"><img src="{image}"></div><div class="content"><a class="header" href={url}>{title}</a><div class="meta"><span class="date">{time}</span></div><div class="description">{description}</div></div><div class="extra content"><img class="ui avatar image " src={domainImg}><a>{domain}</a><a class="right floated"><i class="heart icon"></i>{score}</a><a class="right floated"><i class="comment icon"></i>{comment}</a></div></div>';
			storyJSON.time = new Date(storyJSON.time).toUTCString();
			storyJSON.comment = storyJSON.kids ? storyJSON.kids.length : 0;
			storyJSON.domainImg = util.getFaviconUrl(storyJSON.url);
			storyJSON.domain = util.getDomain(storyJSON.url);

			Object.keys(storyJSON).map(function (key) {
				var regx = new RegExp("{" + key + "}");
				cardMarkup = cardMarkup.replace(regx, storyJSON[key]);
				return;
			});

			return cardMarkup;

		},
		getDomain: function (url) {
			return url.split("/")[2]
		},
		getFaviconUrl: function (url) {
			var service = "https://icons.duckduckgo.com/ip2/";
			return service + util.getDomain(url) + ".ico";
		}
	}

})(window, document, undefined);
