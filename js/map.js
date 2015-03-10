---
---
(function(){
  // extend app w/ map module
  $.extend(app, {
    initMap: function(){
      L.mapbox.accessToken = 'pk.eyJ1IjoiY3Jvd2Rjb3ZlciIsImEiOiI3akYtNERRIn0.uwBAdtR6Zk60Bp3vTKj-kg';
      this.map = L.mapbox.map('map', pageConfig.baseLayer, {
        center: [0.08, 25.2],
        zoom: 5,
        scrollWheelZoom: false
      });

      L.control.fullscreen().addTo(this.map);

      if(pageConfig.project_areas){
        this.loadTMProjectAreas(pageConfig.project_areas)
      }
      if(pageConfig.task_number){
        this.loadTMProjectGrid(pageConfig.task_number);
      }

    },

    loadTMProjectAreas: function(geojsonFile){
      if(! pageConfig.task_number){ return false; }
      var filePath = '{{site.baseurl}}/data/' + geojsonFile;

      var projectAreaJSON = $.getJSON(filePath, function(projectAreaJSON){
        var projectAreaJSON = L.geoJson(projectAreaJSON, {
          style: function(feature){
            return { className: 'project-area' };
          }
        }).addTo(app.map);
      });
    },

    loadTMProjectGrid: function(task_number){
      var taskURL = 'http://tasks.hotosm.org/project/' + task_number + '/tasks.json'
      var addGridToolTip = function(feature, layer){
        // to do
        return;
      };

      $.ajax({
        url: taskURL,
        // jsonp: 'callback',
        dataType: 'jsonp',
        success: function(grid){
          console.log(pageConfig.task_number, 'successfully loaded');

          app.taskGrid = L.geoJson(grid, {
            style: function(feature){
              return { className: 'project-grid' };
            },
            onEachFeature: app.addGridToolTip
          }).addTo(app.map);
        }
      });

    }

  });

})()
