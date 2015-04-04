---
---
(function(){

  var app = {
    initCommon: function(){

      // set tutorial sections initial hide state
      this.hideTutorialSections();

      $('#tutorial .tutorial-head').one('click', this.showTurorial);
      $('#tutorial .close').on('click', this.hideTutorial);

    },

    showTurorial: function(e){
      e.preventDefault();
      e.stopPropagation();

      var tutorialHead = $(this),
          tutorialBody = tutorialHead.siblings('.tutorial-body'),
          tutorialContainer = tutorialHead.parent('#tutorial'),
          tutorialSection = tutorialBody.find('section');

      tutorialContainer.addClass('active');

      // hide tutorialHead
      tutorialHead.animate({opacity: 0}, 400);

      // expand tutorialBody and fade in
      tutorialBody.animate({height: '500px', opacity: 1}, 600, function(){
        app.showTurorialSection(1, this);
      });
    },

    hideTutorial: function(e){
      e.preventDefault();
      e.stopPropagation();

      var $this = $(this),
          tutorialContainer = $this.parents('#tutorial'),
          tutorialBody = $this.parents('.tutorial-body'),
          tutorialHead = tutorialBody.siblings('.tutorial-head');

      tutorialContainer.removeClass('active');

      // show showTurorial
      tutorialHead.animate({opacity: 1}, 400);

      // vertically collapse tutorialBody and fade out
      tutorialBody.animate({height: 0, opacity: 0}, 400, function(){
        // return all tutorial sections to initial hide states
        app.hideTutorialSections();
      })

      // re-bind click event handler on .tutorial-head
      tutorialHead.one('click', app.showTurorial);
    },

    showTurorialSection: function(idx, context){
      var section = $(context).find('section[data-index="' + idx + '"]'),
          title = section.find('.section-title'),
          body = section.find('.section-body'),
          image = section.find('.section-image');

      section.css({zIndex: 0});
      title.add(body).animate({left: 0, opacity: 1}, 100);
    },

    hideTutorialSections: function(){
      var sections = $('#tutorial section'),
          title = sections.find('.section-title'),
          body = sections.find('.section-body'),
          image = sections.find('.section-image');

      sections.css({zIndex: -1});
      title.add(body).css({left: -30, opacity: 0});
    }

  };

  window.app = app;

})();
