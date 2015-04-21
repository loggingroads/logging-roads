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

      // set tutorial sections initial hide state
      this.hideTutorialPages();

      $('header .view-tutorial').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        app.showTutorial();
      });
      $('header .view-map').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('html, body').animate({ scrollTop: $('.map-container').offset().top }, app.ANIMATION.scroll);
      });
      $('section.tutorial .advance-section').on('click', this.advanceTutorialSections);
      $(window).on('resize', this.resizeWindow);

    },

    resizeWindow: function(){
      app.WINDOW.height = $(window).height();
      app.WINDOW.width = $(window).width();

      $('section').add('header.header-home').add('.tutorial .tutorial-page')
                  .css({ height: app.WINDOW.height });
    },

    showTutorial: function(){
      var tutorial = $('section.tutorial'),
          tutorialContainer = tutorial.find('.tutorial-container');

      tutorial.addClass('active');

      // scroll to tutorial
      $('html, body').animate({ scrollTop: tutorial.offset().top }, app.ANIMATION.scroll);

      tutorial.animate({height: app.WINDOW.height, opacity: 1}, app.ANIMATION.scroll, function(){
        app.showTutorialPage(1);
      })

    },

    hideTutorial: function(){
      var tutorial = $('section.tutorial'),
          tutorialContainer = tutorial.find('.tutorial-container');

      // vertically collapse tutorialBody and fade out
      tutorial.animate({height: 0, opacity: 0}, app.ANIMATION.slide, function(){
        tutorial.removeClass('active');
        app.hideTutorialPages();
      });
    },

    showTutorialPage: function(idx){
      var page = $('section.tutorial .tutorial-page[data-index="' + idx + '"]'),
          title = page.find('.section-title'),
          body = page.find('.section-body'),
          image = page.find('.section-image'),
          navBox = $('section.tutorial .tutorial-nav .box[data-index="' + idx + '"]');

      page.css({zIndex: 0}).addClass('active');
      image.css({zIndex: 0, opacity: 1});
      title.add(body).animate({bottom: 0, opacity: 1}, 400);
      navBox.addClass('active');
    },

    hideTutorialPages: function(){
      var pages = $('section.tutorial .tutorial-page'),
          title = pages.find('.section-title'),
          body = pages.find('.section-body'),
          image = pages.find('.section-image');

      pages.css({zIndex: -1}).removeClass('active');
      image.css({zIndex: -1, opacity: 0});
      title.add(body).css({bottom: -60, opacity: 0});

      // deactivate tutorial nav boxes
      $('section.tutorial .tutorial-nav .box.active').removeClass('active');
    },

    advanceTutorialSections: function(e){
      var arrowContainer = $(this),
          dir = arrowContainer.attr('data-dir'),
          tutorialPages = $('section.tutorial .tutorial-page'),
          pagesCount = tutorialPages.length,
          currentPage = tutorialPages.filter('.active'),
          currentPageIdx = parseInt(currentPage.attr('data-index')),
          title = currentPage.find('.section-title'),
          body = currentPage.find('.section-body'),
          image = currentPage.find('.section-image');

      if(dir === 'next' && currentPageIdx === pagesCount){
        // if on the last slide, advance to map
        // $('html, body').animate({ scrollTop: $('.map-container').offset().top }, app.ANIMATION.scroll);
        app.hideTutorial();
      }else if(dir === 'prev' && currentPageIdx === 1){
        // if on the first slide, hide tutorial
        app.hideTutorial();
        $('html, body').animate({ scrollTop: 0 }, app.ANIMATION.scroll);
      }else if(dir === 'next'){
        var newPageIdx = currentPageIdx + 1,
            animationDir = 1;
      }else if(dir === 'prev'){
        var newPageIdx = currentPageIdx - 1,
            animationDir = -1;
      }else{
        return false;
      }

      var newPage = tutorialPages.filter('[data-index="' + newPageIdx + '"]'),
          newTitle = newPage.find('.section-title'),
          newBody = newPage.find('.section-body'),
          newImage = newPage.find('.section-image');

      title.add(body).animate({bottom: 60 * animationDir, opacity: 0}, app.ANIMATION.scroll, function(){
        image.css({zIndex: -1, opacity: 0});
        newImage.css({zIndex: 0, opacity: 1});
        currentPage.css({zIndex: -1}).removeClass('active');
        newPage.css({zIndex: 0}).addClass('active');
        newTitle.add(newBody).animate({bottom: 0, opacity: 1}, app.ANIMATION.scroll, function(){
          app.advanceTutorialNav(currentPageIdx, newPageIdx);
        });
      });

    },

    advanceTutorialNav: function(oldIdx, newIdx){
      var nav = $('section.tutorial .tutorial-nav');
      nav.find('.box[data-index="' + oldIdx + '"]').removeClass('active');
      nav.find('.box[data-index="' + newIdx + '"]').addClass('active');
    }

  };

  window.app = app;

})();
