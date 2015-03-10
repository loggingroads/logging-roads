---
---
(function(){
  // extend app w/ map module
  $.extend(app, {
    initMap: function(){
      // set up map
      L.mapbox.accessToken = 'pk.eyJ1IjoiY3Jvd2Rjb3ZlciIsImEiOiI3akYtNERRIn0.uwBAdtR6Zk60Bp3vTKj-kg';
      this.map = L.mapbox.map('map', pageConfig.baseLayer, {
        center: pageConfig.center,
        zoom: pageConfig.zoom,
        minZoom: 4,
        maxZoom: 18,
        scrollWheelZoom: false,
        zoomControl: false // we'll add it later
      });

      var shareControl = L.control({position: 'topleft'});
      // https://developers.facebook.com/docs/sharing/reference/share-dialog
      shareControl.onAdd = function(){
        var controlHTML = $('<div>', {
          class: 'leaflet-bar leaflet-control',
        });
        var fbButton = $('<a>',{
          class: 'fb-share mapbox-icon mapbox-icon-facebook',
          href: '#'
        })
        var twitterButton = $('<a>',{
          class: 'twitter-share mapbox-icon mapbox-icon-twitter',
          href: '#'
        })
        controlHTML.append(fbButton, twitterButton);
        return controlHTML[0];
      }

      $.extend(this.map, {
          // moabiLayers: {
          //   baseLayer: baseLayer,
          //   dataLayers: {}
          // },
          appControls: {
            zoom: L.control.zoom({position: 'topleft'}).addTo(this.map),
            scale: L.control.scale({position: 'bottomleft', imperial: false }).addTo(this.map),
            // legend: L.mapbox.legendControl().addLegend('<h3 class="center keyline-bottom">Legend</h3><div class="legend-contents"></div>').addTo(this.map),
            // grid: undefined,
            share: shareControl.addTo(this.map)
          }
      });

      // add page event listeners
      $('.toggle-full-screen').on('click', this.toggleFullScreen);
      $('.fb-share').on('click', this.fbShareDialogue);
      $('.twitter-share').on('click', this.twitterShareDialogue);

      if(pageConfig.project_areas){
        this.loadTMProjectAreas(pageConfig.project_areas)
      }
      if(pageConfig.task_number){
        this.loadTMProjectGrid(pageConfig.task_number);
      }
    },

    toggleFullScreen: function(e){
      e.preventDefault();
      e.stopPropagation();
      var $this = $(this);

      if($this.hasClass('has-full-screen')){
        app.setMapContainerHeight(400);
        $this.removeClass('has-full-screen');
        $this.html('<em>view full screen</em>');
      }else{
        app.setMapContainerHeight(window.innerHeight);
        $this.addClass('has-full-screen');
        $this.html('<em>shrink map</em>');
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

    },

    setMapContainerHeight: function(height){
      $('.map-container').height(height);
      app.map.invalidateSize({animate: true});
      // // transition time must match .map-container { transition: height <time>; } in map.css
      // window.setTimeout( function(){
      //   app.map.invalidateSize({animate: true});
      // }, 200);
    },

    fbShareDialogue: function(){
      var url = 'https://www.facebook.com/sharer/sharer.php?u=';
      url += encodeURIComponent(location.href);
      // url += '&p[title]=Moabi';
      window.open(url, 'fbshare', 'width=640,height=320');
    },

    twitterShareDialogue: function(){
      var url = 'http://twitter.com/share?'
      url += 'text=@MoabiMaps @globalforests Mapping the spread of logging roads in the Congo Basin:';
      url += '&url=' + encodeURIComponent(location.href);
      url += '&hashtags=LoggingRoads';
      window.open(url, 'twittershare', 'width=640,height=320');
    },

  });

})()
