(function(){
var app = {
  init: function(){
    var mainbottom = $('.menu').offset().top;
    $(window).on('scroll',function(){
      stop = Math.round($(window).scrollTop());
      if (stop > mainbottom) {
        $('.menu').addClass('past-main');
      } else {
        $('.menu').removeClass('past-main');
      }
    });

    // map functions
    if(pageConfig){
      this.buildMap();
      this.loadTaskGeoJSON();
    }
  },

  buildMap: function(){
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3Jvd2Rjb3ZlciIsImEiOiI3akYtNERRIn0.uwBAdtR6Zk60Bp3vTKj-kg';
    this.map = L.mapbox.map('map', pageConfig.baseLayer, {
      center: [0.08, 25.2],
      zoom: 5,
      scrollWheelZoom: false
    });

    L.control.fullscreen().addTo(this.map);

  },

  loadTaskGeoJSON: function(){
    if(! pageConfig.task_number){ return false; }
    var taskURL = 'http://tasks.hotosm.org/project/' + pageConfig.task_number + '/tasks.json'

    $.ajax({
      url: taskURL,
      // jsonp: 'callback',
      dataType: 'jsonp',
      success: function(grid){
        console.log(pageConfig.task_number, 'successfully loaded');

        app.taskGrid = L.geoJson(grid, {
          style: app.styleGrid,
          onEachFeature: app.addGridToolTip
        }).addTo(app.map);
      }
    });

  },

  styleGrid: function(feature){
    return {
      color: '#ccc',
      weight: 1,
      fillColor: '#ff9700'
    };
  },

  addGridToolTip: function(feature, layer){
    // to do
    return;
  }

};

app.init();

})()
