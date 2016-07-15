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
          //Hide loader
          if(!$('#loader').hasClass('hidden')){
            $('#loader').addClass('hidden');
          }
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
				cardMarkup = '<div class="ui card" "data-id={id}"><div class="image"><img src="{image}"></div><div class="content"><a class="header" href={url} target="_blank">{title}</a><div class="meta"><span class="date">{time}</span></div><div class="description">{description}</div></div><div class="extra content"><a href=http://{domain} target="_blank"><img class="ui avatar image " src={domainImg}>{domain}</a><a class="right floated"><i class="red heart disabled icon"></i>{score}</a><a class="right floated"><i class="comment orange disabled icon"></i>{comment}</a></div></div>';
        storyJSON.image = storyJSON.image|| 'app/placeholder.png';
			storyJSON.time = storyJSON.time? new Date(storyJSON.time*1000).toDateString():0;
			storyJSON.comment = storyJSON.descendants;
			storyJSON.domainImg = util.getFaviconUrl(storyJSON.url);
			storyJSON.domain = util.getDomain(storyJSON.url);
      storyJSON.description = storyJSON.description|| '';
      if(storyJSON.description.length>321){
        storyJSON.description.substr(0,321)+'...';
      }

			Object.keys(storyJSON).map(function (key) {
				var regx = new RegExp("{" + key + "}", 'g');
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
