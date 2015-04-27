---
---
(function(){
  // extend app w/ map module
  $.extend(app, {
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
      var maxContributorCount = 15;

      $.getJSON('{{site.baseurl}}/data/user_list.json', function(data){
        var editorsContainer = $('#top-editors');

        // this can be removed if we know that the osm-history sends the data sorted
        data = data.sort(function(a,b){
          return (b.nodes + b.ways) - (a.nodes + a.ways);
        }).slice(0,maxContributorCount);

        $.each(data, function(idx, editor){
          var row = $('<li class="clearfix">').appendTo( editorsContainer ),
              userNameLink = $('<a href="#">')
                               .text(editor.user)
                               .on('click', app.loadContributorGeoJSON);
              
          row.append( $('<span class="large-6 columns">').html(userNameLink) );
          row.append( $('<span class="large-2 columns text-right">').text(editor.nodes + editor.ways) );
          row.append( $('<span class="large-2 columns text-right">').text(editor.nodes) );
          row.append( $('<span class="large-2 columns text-right">').text(editor.ways) );
        });
      });

    },

    loadContributorGeoJSON: function(e){
      e.preventDefault();
      e.stopPropagation();

      $('html, body').animate({ scrollTop: $('#map-container').offset().top }, app.ANIMATION.scroll);

      $.getJSON('{{site.baseurl}}/data/Agrigorian.json', function(data){

        var geojson = L.mapbox.featureLayer(data).setStyle({
          color: '#7AE0FD',
          lineCap: 'round',
          opacity: 0.4,
          weight: 2
        });
        app.map.fitBounds(geojson.getBounds()).addLayer(geojson);
      });
    }

  });

})()
