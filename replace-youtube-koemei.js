(function() {
  this.KoemeiYoutubePlayerReplace = function() {
    var defaults = {
      token: null,
      DOMAIN:'https://koemei.com',
      VALID_YOUTUBE_DOMAINS: ["youtube.com", "youtu.be", "youtube-nocookie.com"]
    }

    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }
  }

  // Public Methods
  KoemeiYoutubePlayerReplace.prototype.init = function() {
    if (!validateToken.call(this)) {
      error('Invalid Token');
      return false;
    }

    run.call(this);
  }

  // Private Methods
  function validateToken () {
    return this.options.token && this.options.token != '';
  }

  function run() {
    var iframes = document.body.getElementsByTagName('iframe');
    for (var l in iframes) {
      processIFrame.call(iframes[l], this.options);
    }

  }

  function processIFrame(options) {
    if (!this.nodeName || this.nodeName !== 'IFRAME') return false;

    src = this.getAttribute('src');

    // skip non youtube iframes
    if (!containsOneOf(src, options.VALID_YOUTUBE_DOMAINS)) return false;

    // extract youtube video id
    var videoId = extractVideoId(src);

    getEmbed.call(this, options, videoId);
  }

  function getEmbed(options, videoId) {
    // get koemei file id from youtube id
    var url = options.DOMAIN + '/api/search/files/youtube/?youtubeId=%FILE_ID%&token=%TOKEN%';

    url = url.replace('%TOKEN%', options.token);
    url = url.replace('%FILE_ID%', videoId);

    var _this = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(url));
    xhr.onload = function() {
      if (xhr.status === 200) {
        var res = xhr.responseText;
        if (!res || res === '') return;

        res = JSON.parse(res);
        // replace iframe with embed code
        if (res._id) {
          _this.outerHTML = generateKoemeiEmbed(options, res._id);
        }

      } else {
        error('Request failed.  Returned status of ' + xhr.status);
      }
    };
    xhr.send();
  }

  // generate Koemei embed code
  function generateKoemeiEmbed(options, id) {
    var template = '<iframe width="600" height="700" style="border: none;" src="' + options.DOMAIN + '/widget/files/%FILE_ID%?token=%TOKEN%&show-back=false"></iframe>';

    template = template.replace('%TOKEN%', options.token);
    template = template.replace('%FILE_ID%', id);

    return template;
  }

  // function to extract youtube video id
  function extractVideoId(src) {
    return src.substring(src.indexOf("embed/") + 6, src.indexOf("?"));
  }


  // Utils
  function containsOneOf(str, collection) {
    for (var i in collection) {
      var item = collection[i];
      if (str.indexOf(item) > -1) return true;
    }

    return false;
  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  function error(message) {
    if (window.console) {
      window.console.error(message);
    }
  };

}());
