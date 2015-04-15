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

      d3.json('{{site.baseurl}}/data/user_list.json', function(err, data){
        if(err) return console.log(err);
        
        var editorsContainer = d3.select('#top-editors');

        data = data.sort(function(a,b){
          return (b.nodes + b.ways) - (a.nodes + a.ways);
        }).slice(0,maxContributorCount);

        $.each(data, function(idx, editor){
          var row = editorsContainer.append('li').attr('class', 'clearfix');
          // row.append('span').attr('class', 'large-1 columns').text(idx);
          row.append('span').attr('class', 'large-6 columns')
            .append('a').text(editor.user).attr('href', '#')
            .on('click', app.loadContributorGeoJSON);
          row.append('span').text((editor.nodes + editor.ways)).attr('class', 'large-2 columns text-right');
          row.append('span').text(editor.nodes).attr('class', 'large-2 columns text-right');
          row.append('span').text(editor.ways).attr('class', 'large-2 columns text-right');
        });

      });
    },

    loadContributorGeoJSON: function(d, i){
      d3.event.preventDefault();
      d3.event.stopPropagation();

      var userName = this.text;

      console.log('load geoJSON edits for user: ' + userName);
      d3.json('{{site.baseurl}}/data/Agrigorian.json', function(err, data){
        if(err) return console.log(err);

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
