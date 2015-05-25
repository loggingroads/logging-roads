---
---
(function(){
  // extend app w/ map module
  $.extend(app, {
    osmHistoryBaseURL: 'http://ec2-54-242-150-21.compute-1.amazonaws.com/logging/',
    initLeaderboard: function(){
      // see mapoff sample site: http://mapgive.state.gov/events/mapoff/results/
      // user_list.json
        // nodes/ways/relations/changesets per user
      // ways_per_tag.json
        // ways per changeset
      // user.json
        // geojson of user's edits (malformed?)

      // nice to have
        // user contributions over time
        // total contributions over time

      this.loadContributors();

    },

    loadContributors: function(){
      $.getJSON(app.osmHistoryBaseURL + 'user_list.json', function(data){
        // this can be removed if we know that the osm-history sends the data sorted
        data = data.sort(function(a,b){
          return (b.nodes + b.ways) - (a.nodes + a.ways);
        })

        // limit the length of the leaderboard?
        // data.slice(0,15);


        // construct panel tab buttons
        var editorsContainer = $('#top-editors'),
            panelContainer = $('<div class="tabs-content">'),
            rowsPerPanel = 10,
            panelCount = Math.ceil(data.length / rowsPerPanel);

        var editorsPanelTabs = $('<ul class="tabs text-center" data-tab>');
        for(var panelIdx = 1; panelIdx <= panelCount; panelIdx++){
          var tabButton = $('<li class="tab-title">'),
              tabButtonLink = $('<a href="#panel' + panelIdx + '">' + panelIdx + '</a>');

          if(panelIdx === 1) tabButton.addClass('active');
          tabButton.append( tabButtonLink );
          editorsPanelTabs.append( tabButton );
        }

        panelContainer.appendTo(editorsContainer);
        editorsPanelTabs.appendTo(editorsContainer);

        // holy lord this is messy
        $.each(data, function(idx, editor){
          var panelNumber = Math.ceil(idx / rowsPerPanel);
          if(idx % rowsPerPanel === 0){
            // construct panels
            var panel = $('<div class="content" id="panel' + (panelNumber + 1) + '">');
            if(idx === 0) panel.addClass('active');
            app.addRowTo(panel, editor);
            panel.appendTo( panelContainer );
          }else{
            // append to existing panel
            app.addRowTo( $('div#panel' + panelNumber), editor );
          }
        });

        // silly to have to call this again, but must run at the end of the getJSON call
        $(document).foundation();
      });

    },

    addRowTo: function(panel, editor){
      var row = $('<li class="top-editor clearfix">').appendTo( panel ),
          userNameLink = $('<a href="#">')
                           .text(editor.user)
                           .on('click', app.loadContributorGeoJSON);
          
      row.append( $('<span class="small-6 columns">').html(userNameLink) );
      row.append( $('<span class="small-2 columns text-right">').text(editor.nodes + editor.ways) );
      row.append( $('<span class="small-2 columns text-right">').text(editor.nodes) );
      row.append( $('<span class="small-2 columns text-right">').text(editor.ways) );
    },

    loadContributorGeoJSON: function(e){
      e.preventDefault();
      e.stopPropagation();

      var userName = this.text;

      $('html, body').animate({ scrollTop: $('#map-container').offset().top }, app.ANIMATION.scroll);

      $.getJSON(app.osmHistoryBaseURL + 'user_list_with_geometry/' + userName + '.json', function(data){

        var geojson = L.mapbox.featureLayer(data).setStyle({
          className: 'user-edits'
          // color: '#7AE0FD',
          // lineCap: 'round',
          // opacity: 1,
          // weight: 3
        });
        app.map.fitBounds(geojson.getBounds()).addLayer(geojson);
      });
    }

  });

})()
