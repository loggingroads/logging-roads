---
---
(function(){

  var app = {
    initCommon: function(){

      // set tutorial sections initial hide state
      this.hideTutorialSections();

      $('#tutorial .show-tutorial').one('click', this.showTutorial);
      $('#tutorial .close').on('click', this.hideTutorial);

    },

    showTutorial: function(e){
      e.preventDefault();
      e.stopPropagation();

      var showTutorial = $(this),
          sectionContainer = showTutorial.siblings('.section-container'),
          tutorialContainer = showTutorial.parent('#tutorial'),
          tutorialSection = sectionContainer.find('section');

      tutorialContainer.addClass('active');

      // hide showTutorial
      showTutorial.animate({opacity: 0}, 400);

      // expand sectionContainer and fade in
      sectionContainer.animate({height: '500px', opacity: 1}, 400, function(){
        // slide in first tutorial section
        $(this).find('section[data-index="1"]').animate({left: 0, opacity: 1, zIndex: 0}, 200)
      });
    },

    hideTutorial: function(e){
      e.preventDefault();
      e.stopPropagation();

      var $this = $(this),
          tutorialContainer = $this.parents('#tutorial'),
          sectionContainer = $this.parents('.section-container'),
          showTutorial = sectionContainer.siblings('.show-tutorial');

      tutorialContainer.removeClass('active');

      // show showTurorial
      showTutorial.animate({opacity: 1}, 400);

      // vertically collapse sectionContainer and fade out
      sectionContainer.animate({height: 0, opacity: 0}, 400, function(){
        // return all tutorial sections to initial hide states
        app.hideTutorialSections();
      })

      // re-bind click event handler on .show-tutorial
      showTutorial.one('click', app.showTutorial);
    },

    hideTutorialSections: function(){
      $('#tutorial section').css({left: -60, opacity: 0, zIndex: -1});
    }

  };

  window.app = app;

})();
