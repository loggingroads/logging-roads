---
---
(function(){

  var app = {
    initCommon: function(){
      // set header height
      this.sizeHeader();

      // set tutorial sections initial hide state
      this.hideTutorialSections($('#tutorial .tutorial-body')[0]);

      $('#tutorial .tutorial-head').one('click', this.showTurorial);
      $('#tutorial .close').on('click', this.hideTutorial);
      $('#tutorial .advance-section').on('click', this.advanceTutorialSections);
      $(window).on('resize', this.sizeHeader);

    },

    sizeHeader: function(e){
      $('.header.header-home').height(function(){
        return $(window).height() - $('#tutorial').outerHeight();
      })
    },

    showTurorial: function(e){
      e.preventDefault();
      e.stopPropagation();

      var tutorialHead = $(this),
          tutorialBody = tutorialHead.siblings('.tutorial-body'),
          tutorialContainer = tutorialHead.parent('#tutorial'),
          tutorialSection = tutorialBody.find('section'),
          slideAnimationDuration = 600;

      tutorialContainer.addClass('active');

      // scroll to tutorial, leaving offset on top for magellan header
      $('html, body').animate({
        scrollTop: tutorialContainer.offset().top - $('.menu').outerHeight()
      }, slideAnimationDuration);

      // expand tutorialBody and fade in
      tutorialBody.animate({height: '500px', opacity: 1}, slideAnimationDuration, function(){
        app.showTurorialSection(1, this);
      });

      // hide tutorialHead
      tutorialHead.animate({opacity: 0}, 400);

    },

    hideTutorial: function(e){
      e.preventDefault();
      e.stopPropagation();

      var $this = $(this),
          tutorialContainer = $this.parents('#tutorial'),
          tutorialBody = $this.parents('.tutorial-body'),
          tutorialHead = tutorialBody.siblings('.tutorial-head'),
          slideAnimationDuration = 600;

      tutorialContainer.removeClass('active');

      // scroll to top
      $('html, body').animate({ scrollTop: 0 }, slideAnimationDuration);

      // vertically collapse tutorialBody and fade out
      tutorialBody.animate({height: 0, opacity: 0}, slideAnimationDuration, function(){
        // return all tutorial sections to initial hide states
        app.hideTutorialSections(tutorialBody);
      });

      // show .tutorial-head
      tutorialHead.animate({opacity: 1}, 400);

      // re-bind click event handler on .tutorial-head
      tutorialHead.one('click', app.showTurorial);
    },

    showTurorialSection: function(idx, context){
      var section = $(context).find('section[data-index="' + idx + '"]'),
          title = section.find('.section-title'),
          body = section.find('.section-body'),
          image = section.find('.section-image');

      section.css({zIndex: 0}).addClass('active');
      image.css({zIndex: 0, opacity: 1});
      title.add(body).animate({bottom: 0, opacity: 1}, 400);
    },

    hideTutorialSections: function(context){
      var sections = $(context).find('section'),
          title = sections.find('.section-title'),
          body = sections.find('.section-body'),
          image = sections.find('.section-image');

      sections.css({zIndex: -1}).removeClass('active');
      image.css({zIndex: -1, opacity: 0});
      title.add(body).css({bottom: -60, opacity: 0});
    },

    advanceTutorialSections: function(e){
      var $this = $(this),
          dir = $this.attr('data-dir'),
          sections = $this.parents('.tutorial-body').find('section'),
          sectionCount = sections.length,
          section = sections.filter('.active'),
          sectionIdx = parseInt(section.attr('data-index')),
          title = section.find('.section-title'),
          body = section.find('.section-body'),
          image = section.find('.section-image');

      if(dir === 'next' && sectionIdx !== sectionCount){
        var newSectionIdx = sectionIdx + 1,
            animationDir = 1;
      }else if(dir === 'prev' && sectionIdx !== 1){
        var newSectionIdx = sectionIdx - 1,
            animationDir = -1;
      }else{
        return false;
      }

      var newSection = sections.filter('[data-index="' + newSectionIdx + '"]'),
          newTitle = newSection.find('.section-title'),
          newBody = newSection.find('.section-body'),
          newImage = newSection.find('.section-image');

      title.add(body).animate({bottom: 60 * animationDir, opacity: 0}, 400, function(){
        section.css({zIndex: -1}).removeClass('active');
        image.css({zIndex: -1, opacity: 0});
        newImage.css({zIndex: 0, opacity: 1});
        newSection.css({zIndex: 0}).addClass('active');
        newTitle.add(newBody).animate({bottom: 0, opacity: 1}, 400);
      });

    }

  };

  window.app = app;

})();
