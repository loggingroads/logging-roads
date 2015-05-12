---
---
(function(){

  var app = {
    WINDOW: {
      height: null,
      width: null
    },

    ANIMATION: {
      slide: 500,
      scroll: 400
    },

    initCommon: function(){
      this.resizeWindow();

      // initialize tutorial in hide state
      $('#tutorial .tutorial-page').each(function(idx){
        app.hideTutorialPage($(this));
      });

      $('button.scroll-to').on('click', function(e){
        var destElementId = $(this).data('scroll'),
            destElement = $('#' + destElementId);
        $('html, body').animate({ scrollTop: destElement.offset().top }, app.ANIMATION.scroll);
      });

      $('#tutorial .tutorial-page').waypoint(app.scrollPastWaypoint, {
        offset: '25%'
      });

      $(window).on('resize', this.resizeWindow);

    },

    resizeWindow: function(){
      app.WINDOW.height = $(window).height();
      app.WINDOW.width = $(window).width();

      $('header.header-home').add('#tutorial .tutorial-page')
                  .css({ height: app.WINDOW.height });
    },

    scrollPastWaypoint: function(dir){
      app.hideTutorialPage($('#tutorial .tutorial-page.active'));

      if(dir === 'down'){
        app.showTutorialPage($(this.element));
      }else if(dir === 'up'){
        app.showTutorialPage($(this.element).prev());
      }
    },

    showTutorialPage: function(page){
      var body = page.find('.tutorial-body'),
          image = page.find('.tutorial-image');

      // page.addClass('active').css({opacity: 1});
      page.addClass('active');
      image.animate({opacity: 1}, app.ANIMATION.slide/2, function(){
        body.animate({top: '50%', opacity: 1}, app.ANIMATION.slide);
      });
    },

    hideTutorialPage: function(page){
      var body = page.find('.tutorial-body'),
          image = page.find('.tutorial-image');

      // page.removeClass('active').css({opacity: 0.9});
      page.removeClass('active');
      image.animate({opacity: 0}, app.ANIMATION.slide/2, function(){
        body.animate({top: '55%', opacity: 0}, app.ANIMATION.slide);
      });
    },

  };

  window.app = app;

})();
