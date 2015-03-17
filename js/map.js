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
        });
        var twitterButton = $('<a>',{
          class: 'twitter-share mapbox-icon mapbox-icon-twitter',
          href: '#'
        });
        controlHTML.append(fbButton, twitterButton);
        return controlHTML[0];
      }
      shareControl.addTo(this.map);

      L.control.scale({position: 'bottomleft', imperial: false }).addTo(this.map)

      // add page event listeners
      this.map.on('zoomend projectArea-loaded taskGrid-loaded', this.setVectorStrokeWidth);
      $('.toggle-full-screen').on('click', this.toggleFullScreen);
      $('.fb-share').on('click', this.fbShareDialogue);
      $('.twitter-share').on('click', this.twitterShareDialogue);

      // load project areas
      this.loadTMProjectAreas();
      // TODO: ensure project grid loads only once project areas is finished loading
      // this.map.on('taskGrid-loaded', this.loadTMProjectGrid())
      // TODO: rewrite deferred objects so that taskGrid-loaded and projectArea-loaded only fire at end of loop
      this.loadTMProjectGrid()

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
      // abort if pageConfig.project_areas is not defined
      if(! pageConfig.project_areas){ return false; }
      // make sure pageConfig.project_areas is an array
      if(typeof pageConfig.project_areas === 'string'){
        pageConfig.project_areas = [pageConfig.project_areas];
      }

      for(var i=0; i<pageConfig.project_areas.length; i++){
        // L.mapbox.featureLayer('http://tasks.hotosm.org/project/' + pageConfig.project_areas + '.json')
        L.mapbox.featureLayer('{{site.baseurl}}/data/' + pageConfig.project_areas[i])
                            .on('ready', function(){
                              this.setStyle({ className: 'project-area'})
                                  .addTo(app.map);

                              app.map.fire('projectArea-loaded');
                            });
      }

    },

    loadTMProjectGrid: function(){
      // abort if pageConfig.task_number is not defined
      if(! pageConfig.task_number){ return false; }
      // make sure pageConfig.task_number is an array
      if(typeof pageConfig.task_number === 'number'){
        pageConfig.task_number = [pageConfig.task_number];
      }

      for(var i=0; i<pageConfig.task_number.length; i++){
        var task_number = pageConfig.task_number[i];
        // L.mapbox.featureLayer('http://tasks.hotosm.org/project/' + pageConfig.task_number + '/tasks.json')
        L.mapbox.featureLayer('{{site.baseurl}}/data/osmtm_tasks_' + task_number + '.geojson')
                    .on('ready', function(e){
                      this.setFilter(function(feature){
                        // filter out all removed cells
                        return feature.properties['state'] !== -1;
                      })
                      .eachLayer(function(layer){
                        window.layer = layer;
                        var stateClass = 'state-' + layer.feature.properties['state'],
                            lockedClass = 'locked-' + layer.feature.properties['locked'],
                            popupContent = {% include project-grid-popup.js %}

                        layer.setStyle({ className: 'project-grid ' + stateClass + ' ' + lockedClass });

                        layer.bindPopup(popupContent, { className: 'project-grid-popup'} );

                        layer.on('mouseover', function(e){
                          e.layer.openPopup();
                        });

                        layer.on('mouseout', function(e){
                          e.layer.closePopup();
                        });

                        layer.on('click', function(e){
                          console.log('http://tasks.hotosm.org/project/' + task_number + '#task/' + layer.feature['id']);
                          // navigate to tasking manager.  url template: http://tasks.hotosm.org/project/920#task/60
                          // window.open('http://tasks.hotosm.org/project/' + task_number + '#task/' + layer.feature['id']);
                        });
                      })
                      .addTo(app.map)
                      .bringToFront();

                      app.map.fire('taskGrid-loaded');
                    });
      }

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
