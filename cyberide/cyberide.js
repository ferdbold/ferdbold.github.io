
var Cyberide = function() {
	this.content = [];
};

/** STATIC PROPERTIES */

Cyberide.prototype.name = 'Cybéride';

/** METHODS */

Cyberide.prototype.init = function() {
	FB.getLoginStatus(this.onStatusChange.bind(this));
};

Cyberide.prototype.onStatusChange = function(response) {
	if (response.status === 'connected') {
		console.log('Connected');
		this.loadContent();
	} else {
		FB.login(this.onLogin.bind(this), {scope: 'user_posts, user_photos'});
	}
};

Cyberide.prototype.onLogin = function(response) {
	console.log(response);
	if (response.authResponse) {
		console.log('Connected');
		this.loadContent();
	} else {
		console.error('Failed to connect, try again.');
	}
};

Cyberide.prototype.loadContent = function() {
	FB.api('/me', 'get', {}, function(response) {
		$('#name')
			.text(response.name)
			.removeClass('hidden');
	}.bind(this));

	FB.api('/me/photos', 'get', {fields: 'source', limit: '500'}, function(response) {
		for (var i = 0; i < response.data.length; i++) {
			this.content.push($('<img class="fb-image fb-content hidden" src="' + response.data[i].source +'">'));
			$('#painting').append(this.content[i]);
		}

		FB.api('/me/posts', 'get', {limit: '500'}, function(response) {
			for (var i = 0; i < response.data.length; i++) {
				if (!response.data[i].message) continue;
				this.content.push($('<div class="fb-post fb-content hidden">' + response.data[i].message + '</div>'));
				$('#painting').append(this.content[i]);
			}

			this.animateContent();
		}.bind(this));
	}.bind(this));
};

Cyberide.prototype.animateContent = function() {
	for (var i = 0; i < this.content.length; i++) {
		var order = Math.random();

		this.content[i]
			.offset({
				left: Math.floor(Math.random() * 600) + window.innerWidth/2 - 300,
				top: Math.floor(Math.random() * (window.innerHeight-350)) + 240
			})
			.css({
				'transition-duration': (order * 100 + 5) + 's',
				'z-index': Math.floor(order * 1000)
			})
			.removeClass('hidden')
			.addClass('fb-content-moving')
			.offset({
				left: Math.floor(Math.random() * 600) + window.innerWidth/2 - 300,
				top: Math.floor(Math.random() * (window.innerHeight-350)) + 240
			});
	}
};

/** INITIALIZATION */

window.app = new Cyberide();
