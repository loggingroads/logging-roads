---
---
(function(){
  // extend app w/ map module
  $.extend(app, {
    projectAreas: {},
    projectGrids: {},
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
      this.map.on('zoomend', this.setVectorStrokeWidth);
      $('.toggle-full-screen').on('click', this.toggleFullScreen);
      $('.fb-share').on('click', this.fbShareDialogue);
      $('.twitter-share').on('click', this.twitterShareDialogue);

      // load project area(s) and task grid(s)
      this.loadTMProjectAreas();
      this.map.on('projectAreas-loaded', this.loadTMProjectGrid);
      this.map.on('taskGrids-loaded', this.setVectorStrokeWidth);


    },

    toggleFullScreen: function(e){
      e.preventDefault();
      e.stopPropagation();
      var $this = $(this);

      if($this.hasClass('has-full-screen')){
        app.setMapContainerHeight(520);
        $this.removeClass('has-full-screen');
        $this.html('<em>enlarge map</em>');
      }else{
        app.setMapContainerHeight(window.innerHeight);
        $this.addClass('has-full-screen');
        $this.html('<em>shrink map</em>');
      }
    },

    loadTMProjectAreas: function(){
      // // abort if pageConfig.project_areas is not defined
      // if(! pageConfig.project_areas){ return false; }
      // // make sure pageConfig.project_areas is an array
      // if(typeof pageConfig.project_areas === 'string'){
      //   pageConfig.project_areas = [pageConfig.project_areas];
      // }

      // sketchy way to determine if last country in loop
      var final_country;
      for(var country in pageConfig.tm_projects){
        final_country = country;
      }
      for(var country in pageConfig.tm_projects){
        // check if last iteraiton of loop
        var is_last = (country === final_country);

        // L.mapbox.featureLayer('http://tasks.hotosm.org/project/' + pageConfig.project_areas + '.json')
        app.projectAreas[country] = L.mapbox.featureLayer('{{site.baseurl}}/data/' + pageConfig.tm_projects[country]['project_area'])
                            .on('ready', function(){
                              this.setStyle({ className: 'project-area'})
                                  .addTo(app.map);

                              app.map.fire('projectArea-loaded');
                              if(is_last){ app.map.fire('projectAreas-loaded'); }
                            });
      }

    },

    loadTMProjectGrid: function(){
      // // abort if pageConfig.task_number is not defined
      // if(! pageConfig.task_number){ return false; }
      // // make sure pageConfig.task_number is an array
      // if(typeof pageConfig.task_number === 'number'){
      //   pageConfig.task_number = [pageConfig.task_number];
      // }

      // sketchy way to determine if last country in loop
      var final_country;
      for(var country in pageConfig.tm_projects){
        final_country = country;
      }
      for(var country in pageConfig.tm_projects){
        // check if last iteraiton of loop
        var is_last = (country === final_country),
            task_number = pageConfig.tm_projects[country]['task_number'],
            map_tooltip = $('#map-tooltip');

        // L.mapbox.featureLayer('http://tasks.hotosm.org/project/' + pageConfig.task_number + '/tasks.json')
        app.projectGrids[country] = L.mapbox.featureLayer('{{site.baseurl}}/data/osmtm_tasks_' + task_number + '.geojson')
                    .on('ready', function(e){
                      this.setFilter(function(feature){
                        // filter out all removed cells
                        return feature.properties['state'] !== -1;
                      })
                      .eachLayer(function(layer){
                        window.layer = layer;

                        var cell_state,
                            locked_state,
                            popupContent;

                        switch(layer.feature.properties['state']){
                          case 0:
                            cell_state = 'ready'; break;
                          case 1:
                            cell_state = 'invalidated'; break;
                          case 2:
                            cell_state = 'done'; break;
                          case 3:
                            cell_state = 'validated'; break;
                          case -1:
                            cell_state = 'removed'; break;
                        }

                        locked_state = layer.feature.properties['locked'] ? 'locked' : 'unlocked';

                        popupContent = {% include project-grid-popup.js %}

                        layer.setStyle({ className: 'project-grid state-' + cell_state + ' ' + locked_state });

                        layer.on('mouseover', function(e){
                          map_tooltip.html(popupContent);
                        });

                        layer.on('mouseout', function(e){
                          map_tooltip.html('');
                        });

                        layer.on('click', function(e){
                          // navigate to tasking manager.  url template: http://tasks.hotosm.org/project/{project_id}#task/{task_number}
                          window.open('http://tasks.hotosm.org/project/' + task_number + '#task/' + layer.feature['id']);
                        });
                      })
                      .addTo(app.map)
                      .bringToFront();

                      app.map.fire('taskGrid-loaded');
                      if(is_last){ app.map.fire('taskGrids-loaded'); }
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

    fitMapBoundsToVectorExtent: function(){
      // build L.latLngBounds object out of all countries' bounds
      var totalBounds = boundsArray.reduce(function(a,b){
        return a.extend(b.getBounds());
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
