---
---
(function(){
  // create app module
  var app = {
    initCommon: function(){
      var mainbottom = $('.menu').offset().top;
      $(window).on('scroll',function(){
        stop = Math.round($(window).scrollTop());
        if (stop > mainbottom) {
          $('.menu').addClass('past-main');
        } else {
          $('.menu').removeClass('past-main');
        }
      });
    }

  };

  window.app = app;

})();
