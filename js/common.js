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
      tutorialBody.animate({height: '500px', opacity: 1}, 400, function(){
        // slide in first tutorial section
        $(this).find('section[data-index="1"]').animate({left: 0, opacity: 1, zIndex: 0}, 200)
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

    hideTutorialSections: function(){
      $('#tutorial section').css({left: -60, opacity: 0, zIndex: -1});
    }

  };

  window.app = app;

})();
