---
---
(function(){
  // extend app w/ map module
  $.extend(app, {
    projectAreas: {},
    projectGrids: {},
    tooltipIsOpen: false,
    initMap: function(){
      // set up map
      L.mapbox.accessToken = 'pk.eyJ1IjoiY3Jvd2Rjb3ZlciIsImEiOiI3akYtNERRIn0.uwBAdtR6Zk60Bp3vTKj-kg';
      this.map = L.mapbox.map('map', pageConfig.baseLayer, {
      // this.map = L.mapbox.map('map', undefined, {
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
      // $('.toggle-full-screen').on('click', this.toggleFullScreen);
      $('.fb-share').on('click', this.fbShareDialogue);
      $('.twitter-share').on('click', this.twitterShareDialogue);
      $('#map-sidebar .close').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        app.hideTooltip();
        app.tooltipIsOpen = false;
        app.resetMapView();
      });

      app.tooltipTemplate = Handlebars.compile($('#tooltip-template').html());

      // load project area(s) and task grid(s)
      // this.loadTMProjectAreas();
      // this.map.on('projectAreas-loaded', this.loadTMProjectGrid);
      this.loadTMProjectGrid();
      this.map.on('taskGrids-loaded', this.setVectorStrokeWidth);
      // this.map.on('taskGrids-loaded', this.fitMapBoundsToVector);

    },

    loadTMProjectAreas: function(){
      // load area geojsons for all projects in pageConfig.tm_projects
      // and fire 'projectAreas-loaded' event when all have resolved
        // NOT CURRENTLY IMPLEMENTED (as project areas are now baked into the tile layers themselves)
      var countryProjectPromises = $.map(pageConfig.tm_projects, function(projectObj, projectKey){
        var countryProjectPromise = $.Deferred();

        // L.mapbox.featureLayer('http://tasks.hotosm.org/project/' + pageConfig.project_areas + '.json')
        app.projectAreas[projectKey] = L.mapbox.featureLayer('{{site.baseurl}}/data/' + projectObj['project_area'])
          .on('ready', function(){
            this.setStyle({ className: 'project-area'})
                .addTo(app.map);

            console.log('project area loaded: ' + projectKey);
            countryProjectPromise.resolve();
            app.map.fire('projectArea-loaded');
          });

        return countryProjectPromise;
      });

      $.when.apply($, countryProjectPromises)
        // .then(function(){
        //   console.log('project areas loaded');
        // }).fail(function(){
        //   console.log('project areas failed to load');
        // })
        .always(function(){
          app.map.fire('projectAreas-loaded');
        });

    },

    loadTMProjectGrid: function(){
      // load grid geojsons for all projects in pageConfig.tm_projects
      // and fire 'projectGrids-loaded' event when all have resolved
      var countryGridPromises = $.map(pageConfig.tm_projects, function(projectObj, projectKey){
        var countryGridPromise = $.Deferred(),
            project_id = projectObj['project_id'];

        // app.projectGrids[projectKey] = L.mapbox.featureLayer('http://tasks.hotosm.org/project/' + pageConfig.project_areas + '/tasks.json')
        app.projectGrids[projectKey] = L.mapbox.featureLayer('{{site.baseurl}}/data/osm_tm_tasks_' + project_id + '.geojson')
          .on('ready', function(){
            this.setFilter(function(feature){
              // filter out all removed cells
              return feature.properties['state'] !== -1;
            })
            .eachLayer(function(layer){
              app.onEachProjectGridCell(layer, project_id);
            })
            .addTo(app.map);

            app.map.fire('taskGrid-loaded');
            countryGridPromise.resolve();

          });

        return countryGridPromise;
      });

      // fire event when all grids have loaded [for reference, see: http://stackoverflow.com/questions/18424712/how-to-loop-through-ajax-requests-inside-a-jquery-when-then-statment]
      $.when.apply($, countryGridPromises)
        // .then(function(){
        //   console.log('taskGrids loaded');
        // }).fail(function(){
        //   console.log('taskGrids failed to load');
        // })
        .always(function(){
          app.map.fire('taskGrids-loaded');
        });

    },

    onEachProjectGridCell: function(layer, project_id){
      // function called on each project grid cell, defined here for organization
      // tranform each layers' properties into more recognizable terms
      var gridStrokeColor = '#999',
          gridStrokeClickColor = '#F8842E',
          feature = layer.feature;

      feature.properties['locked'] = feature.properties['locked'] ? 'locked' : 'unlocked';
      feature['project_id'] = project_id;

      switch(feature.properties['state']){
        case 0:
          feature.properties['state'] = 'ready'; break;
        case 1:
          feature.properties['state'] = 'invalidated'; break;
        case 2:
          feature.properties['state'] = 'done'; break;
        case 3:
          feature.properties['state'] = 'validated'; break;
        case -1:
          feature.properties['state'] = 'removed'; break;
      }

      layer.setStyle({ 
        className: ['project-grid', feature.properties['state'], feature.properties['locked']].join(' '), 
        color: gridStrokeColor
      });

      layer.on('mouseover', function(e){
        this.bringToFront();
        if(! app.tooltipIsOpen ){
          app.tooltipHover(feature);
        }
      });

      layer.on('mouseout', function(e){
        if(! app.tooltipIsOpen ){
          app.hideTooltip();
        }
        if(this.feature.id !== app.tooltipIsOpen){
          this.bringToBack();
        }
      });

      layer.on('click', function(e){
        app.setGridStrokeColor(gridStrokeColor);
        layer.setStyle({ color: gridStrokeClickColor });  // match color to $primary variable
        this.bringToFront();
        app.tooltipClick(feature);
        app.tooltipIsOpen = layer.feature['id'];

        app.map.fitBounds(this.getBounds(), {
          animate: true,
          padding: [20,20]
        })
      });
    },

    tooltipHover: function(feature){
      // $('#map-tooltip').html(content);
      var tooltipContainer = $('#map-tooltip');
      var tooltipCompiled = app.tooltipTemplate({__teaser__ : feature });
      tooltipContainer.html( tooltipCompiled );
    },

    tooltipClick: function(feature){
      // $('#map-tooltip').html(content);
      var tooltipContainer = $('#map-tooltip');
      var tooltipCompiled = app.tooltipTemplate({__full__ : feature });
      tooltipContainer.html( tooltipCompiled);
    },

    hideTooltip: function(){
      $('#map-tooltip').html('');
    },

    setGridStrokeColor: function(color){
      $.each(app.projectGrids, function(key, idx){
        app.projectGrids[key].eachLayer(function(layer){
          layer.setStyle({ color: color });
        });
      });
    },

    resetMapView: function(){
      app.map.setView(pageConfig.center, pageConfig.zoom,{animate: true});
    },

    setVectorStrokeWidth: function(){
      var zoomLevel = app.map.getZoom();
      $('.leaflet-objects-pane path.project-grid').css('stroke-width', function(){
        if(zoomLevel <= 6){
          return 0.5;
        }else if(zoomLevel <= 8){
          return 1.4;
        }else{
          return 2;
        }
      });
    },

    fitMapBoundsToVector: function(){
      // build L.latLngBounds object out of all countries' bounds
      var boundsArray = $.map(app.projectGrids, function(value, index){
        return value.getBounds();
      });

      var totalBounds = boundsArray[0];
      for(var i = 1; i<boundsArray.length; i++){
        totalBounds.extend(boundsArray[i]);
      }

      // var totalBounds = boundsArray.reduce(function(a,b){
      //   return a.extend(b);
      // }, boundsArray[0]);

      app.map.fitBounds(totalBounds);
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
