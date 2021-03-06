/**
 * Video Thumbs, by uppfinnarn.
 * 
 * Turns video embed codes into static thumbnails until clicked.
 * 
 * By modifying the embeds themselves, graceful degradation is ensured in
 * events where the script fails to load, and bots with JS disabled will still
 * see the embeds normally.
 */

(function($) {
  'use strict';
  
  function thumbURL(type, id, override, options) {
    if (type == 'youtube') {
      var filename = (options.maxres ? (override || 'maxresdefault') : 'sddefault') + '.jpg';
      return 'https://img.youtube.com/vi/' + id + '/' + filename;
    }
  }
  
  $.fn.videoThumbs = function(options) {
    options = $.extend({
      maxres: false,        // Load a max-resolution thumbnail?
    }, options);
    
    this.find('iframe').each(function(i, iframe) {
      var src = iframe.src;
      
      var type = null;
      var id = null;
      
      // Extract video ID from Youtube embeds
      var match = src.match(/youtube.com\/embed\/([^?]*)/);
      if (match) {
        type = 'youtube';
        id = match[1];
        
        // Abort for playlist embeds; we can't determine the thumbnail for those
        if (id.indexOf('videoseries') == 0) {
          return;
        }
      }
      
      // If the embed is of an unknown type, do nothing
      if (!type) {
        return;
      }
      
      // Check for element properties
      var thumbOverride = iframe.dataset.thumb;
      
      // Stop the iframe from loading, store the URL as data-src, then hide it
      iframe.dataset.src = src;
      iframe.src = 'about:blank';
      iframe.style.display = 'none';
      
      // Find the container
      var container = iframe.parentNode;
      
      // Make a static, clickable thumbnail
      var link = document.createElement('a');
      link.className = 'video-thumb';
      if (options.maxres) {
        link.className += ' video-thumb-maxres';
      }
      link.style.backgroundImage = "url('" + thumbURL(type, id, thumbOverride, options) + "')";
      
      var html = [];
      html.push("<span class='title'>" + (iframe.dataset.title || '') + "</span>");
      html.push("<div class='play'><span><i class='fa fa-youtube-play'></i></span></div>");
      link.innerHTML = html.join('');
      
      container.appendChild(link);
      
      // Make the link play the video when clicked
      $(link).click(function() {
        link.style.display = 'none';
        iframe.style.display = '';
        
        var src = iframe.dataset.src;
        src += src.indexOf('?') == -1 ? '?' : '&';
        src += 'autoplay=1';
        iframe.src = src;
      });
    });
    return this;
  };
})(jQuery);
