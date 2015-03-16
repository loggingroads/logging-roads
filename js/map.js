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
        scrollWheelZoom: false
      });

      // build leaflet share and scale controls
      var shareControl = L.control({position: 'topleft'});
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
      shareControl.addTo(this.map);

      L.control.scale({position: 'bottomleft', imperial: false }).addTo(this.map)

      // size vector stroke width by zoom level
      this.map.on('zoomend projectArea-loaded taskGrid-loaded', function(e){
        app.setVectorStrokeWidth();
      });

      // add page event listeners
      $('.toggle-full-screen').on('click', this.toggleFullScreen);
      $('.fb-share').on('click', this.fbShareDialogue);
      $('.twitter-share').on('click', this.twitterShareDialogue);

      // load project areas
      this.loadTMProjectAreas();
      this.loadTMProjectGrid();

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

    loadTMProjectAreas: function(){
      var projectArea = L.mapbox.featureLayer('{{site.baseurl}}/data/' + pageConfig.project_areas)
                          .on('ready', function(){
                            this.setStyle({ className: 'project-area'})
                                       .addTo(app.map);

                            app.map.fire('projectArea-loaded');
                          });
    },

    loadTMProjectGrid: function(){
      var taskGrid = L.mapbox.featureLayer('{{site.baseurl}}/data/osmtm_tasks_' + pageConfig.task_number + '.geojson')
                  .on('ready', function(){
                    this.setFilter(function(feature){
                      // filter out all removed cells
                      return feature.properties['state'] !== -1;
                    })
                    .eachLayer(function(layer){
                      var stateClass = 'state-' + layer.feature.properties['state'],
                          lockedClass = 'locked-' + layer.feature.properties['locked'];
                      layer.setStyle({ className: 'project-grid ' + stateClass + ' ' + lockedClass });
                    })
                    .addTo(app.map);

                    app.map.fire('taskGrid-loaded');
                  });

    },

    setVectorStrokeWidth: function(){
      var zoomLevel = app.map.getZoom();
      $('.leaflet-objects-pane path.project-area').css('stroke-width', function(){
        if(zoomLevel <= 6){
          return 0.4;
        }else if(zoomLevel <= 8){
          return 1;
        }else{
          return 2;
        }
      });

      $('.leaflet-objects-pane path.project-grid').css('stroke-width', function(){
        if(zoomLevel <= 6){
          return 0.8;
        }else if(zoomLevel <= 8){
          return 2;
        }else{
          return 4;
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
      // https://developers.facebook.com/docs/sharing/reference/share-dialog
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
