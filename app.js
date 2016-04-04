// tutorial1.js
var MapComponent = React.createClass({
  getInitialState: function() {
   return {
     currentlyEditing: false,
     points: [],
     categories: []
   };
  },
  idGenerator(items) {
    var newID = 1;
    if(items.length > 0) {
      var highNum = 0;

      $(items).each(function(index, e){
        if(e.id > highNum) {
          highNum = e.id;
        }
      });
      newID = highNum+1;
    }
    return newID;
  },
  addAPoint: function(e) {
    e.preventDefault();

    var currentPoints = this.state.points;
    var newPoints = currentPoints.concat([
      {
        id: new Date(),
        title:'',
        editing: true,
        newPoint: true,
        cat: false
      }
    ]);
    this.setState({points: newPoints});
  },
  addACat: function(e) {

    e.preventDefault();
    var currentCats = this.state.categories;
    var newCats = currentCats.concat([
      {
        id: this.idGenerator(currentCats),
        name:'',
        color: '#cc0000',
        editing: true,
        newCat: true
      }
    ]);
    this.setState({categories: newCats});

  },
  deleteAPoint: function(badid) {
    var currentPoints = this.state.points;
    var filteredPoints = currentPoints.filter(function (el) {
                      return el.id !== badid;
                 });

    this.setState({points: filteredPoints});
  },
  deleteCat: function(badid, saved) {

    if(saved) {
      var cancel;
      $(this.state.points).each(function(index,e){
        if(e.catID == badid) {
          alert("Sorry. You can't delete this category because some map points are using it. Delete those points or change their category.");
          cancel = true;
        }
      });
      if(cancel) {
        return;
      }
      var confirmed = confirm("Are you sure you want to delete this category? This can't be undone.");
      if(!confirmed) {
        return;
      }
    }
    var currentCats = this.state.categories;
    var filteredPoints = currentCats.filter(function (el) {
                      return el.id !== badid;
                 });

    this.setState({categories: filteredPoints});
  },
  setCat: function(point) {

    var currentPoints = this.state.categories;
    $(currentPoints).each(function(index, e){
      if(e.id == point.id) {
        currentPoints[index] = point;
      }
    });
    this.setState({categories:currentPoints});
  },
  updatePoint: function(point) {

    var currentPoints = this.state.points;
    $(currentPoints).each(function(index, e){
      if(e.id == point.id) {
        currentPoints[index] = point;
      }
    });
    this.setState({points:currentPoints});
  },
  editSet: function(id, state) {
    var currentPoints = this.state.points;
    $(currentPoints).each(function(index, e){
      if(e.id == id) {
        currentPoints[index].editing = state;
      }
    });
    this.setState({points:currentPoints});
  },
  render: function() {
    var scaffold;
    var editState = false;
    $(this.state.points.concat(this.state.categories)).each(function(index,e){
      if(e.editing == true) {
        editState = true;
      }
    });
    if(this.state.categories.length < 1) {
      scaffold = <div className="emptyState"><button onClick={this.addACat}>Click here to add your first category.</button></div>;
    } else {
      scaffold = <div className="clearfix">

                    <CatList deleteCat={this.deleteCat} newCat={this.addACat} editState={editState} saveCat={this.setCat} cat={this.state.categories}/>
                  </div>;
    }
    var serialized = JSON.stringify(this.state.points);
    var cat_serialized = JSON.stringify(this.state.categories);

    var mainClass = 'mapComponent';
    var addButton = <button onClick={this.addAPoint}>Add a point</button>;
    if(editState == true) {
      mainClass = 'mapComponent currently-editing';
      addButton = false;
    }
    //<PointList data={this.state.points} editBubble={this.editSet} deleteBubble={this.deleteAPoint} updateBubble={this.updatePoint} />
    //{addButton}
    return (
      <div className={mainClass}>
        <input type="hidden" name="map_data" id="map_data" value={serialized} />
        <input type="hidden" name="map_cats" id="map_cats" value={cat_serialized} />

        {scaffold}
      </div>
    );
  }
});
/*
var PointList = React.createClass({

  render: function() {

    var unsorted = this.props.data;
    //CATEGORY GROUPING
    var grouped = [];
    $(mapCategories).each(function(index,e){
      var cat = e.slug;
      $(unsorted).each(function(index,e){
        if(e.cat == cat) {
          grouped.push(e);
        }
      });
    });
    //ADD IN NEW ONE
    $(unsorted).each(function(index,e){
      if(e.cat === false) {
        grouped.push(e);
      }
    });

    var pointNodes = grouped.map(function(point) {


    var pointNodes = this.props.data.map(function(point) {

      var formRender = false,
          savedPoint = false;
      var classpoint = 'pointHolder';
      if(point.editing == true) {
        formRender = <PointForm cat={point.cat} title={point.title} lat={point.lat} lng={point.lng} editBubble={this.props.editBubble} newPoint={point.newPoint} id={point.id} onDelete={this.props.deleteBubble} saveNewPoint={this.props.updateBubble}/>;
        classpoint = 'pointHolder currently-editing';
      }
      if(point.title !=false) {
        savedPoint = <Point editBubble={this.props.editBubble} cat={point.cat} title={point.title} id={point.id} editing={point.editing} newPoint={point.newPoint}/>;
      }
      return (
        <div key={point.id} className={classpoint}>
          {savedPoint}
          {formRender}
        </div>
      );
    }.bind(this));
    return (
      <div className="PointList">
        {pointNodes}
      </div>
    );
  }
});
*/


var PointForm = React.createClass({
  getInitialState: function() {
    if(!(this.props.lat)) {
      var lat = 40.7067279;
    } else {
      var lat = this.props.lat;
    }
    if(!(this.props.lng)) {
      var lng = -74.0397625;
    } else {
      var lng = this.props.lng;
    }
    if(!(this.props.cat)) {
      var cat = 'retail';
    } else {
      var cat = this.props.cat;
    }
    return {
      title: this.props.title,
      lat: lat,
      lng: lng,
      cat: cat
    }
  },

  componentDidMount: function() {
    var initialCenter = new google.maps.LatLng(this.state.lat,this.state.lng);
    $('#map-container').append($('#theMap'));
    google.maps.event.trigger(map,'resize');
    map.setCenter(initialCenter);
    map.setZoom(13);
    marker.setPosition(initialCenter);

    //SET MARKER DRAG LISTENER\
    google.maps.event.addListener(marker, 'dragend', function() {
      this.updateCenter(marker.getPosition().lat(),marker.getPosition().lng());
    }.bind(this) );

    //ON MAP CLICK
    google.maps.event.addListener(map, 'click', function(event) {

      this.updateCenter(event.latLng.lat(),event.latLng.lng());
    }.bind(this));

    //Places search
    searchBox.addListener('places_changed', function() {
      $('#search-input').val('');
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      var point = places[0];
      this.updateCenter(point.geometry.location.lat(), point.geometry.location.lng());
    }.bind(this));
  },
  updateCenter(lat,lng) {
    map.panTo({
      lat:lat,
      lng:lng
    });
    marker.setPosition({
      lat:lat,
      lng:lng
    });
    this.setState({
      lat: lat,
      lng: lng
    })
  },
  componentWillUnmount: function() {
    google.maps.event.clearListeners(marker, 'dragend');
    google.maps.event.clearListeners(searchBox, 'places_changed');
    google.maps.event.clearListeners(map, 'click');
    $("#gmap-container").append($('#theMap'));
  },
  cancelClick: function() {
    if(this.props.newPoint == true) {
      this.props.onDelete(this.props.id);
    } else {
      this.props.editBubble(this.props.id, false);
    }
  },
  titleChange: function(e) {
    this.setState({title: e.target.value});
  },
  catChange: function(e) {
    this.setState({cat: e.target.value});
  },
  subClick: function() {

      this.props.saveNewPoint(
        {
          title: this.state.title,
          id: this.props.id,
          lat: this.state.lat,
          lng: this.state.lng,
          cat: this.state.cat
        }
      );

  },
  deleteClick: function(){
    var verify = confirm("Are you sure you want to delete this point? This can't be undone.");
    if(verify) {
      this.props.onDelete(this.props.id);
    }
  },
  render: function() {
    var deleteState,
        disabledState,
        pubText = 'Save';

    if(this.props.newPoint != true) {
      deleteState = <button onClick={this.deleteClick}>Delete this point</button>;
      pubText = 'Update';
    }

    if(this.state.title == false) {
      disabledState =true;
    }
    var catOpts= mapCategories.map(function(cat) {
      return (
        <option value={cat.slug} key={cat.slug} dangerouslySetInnerHTML={{__html:cat.title}}></option>
      );
    }.bind(this));
    return (
      <div className="PointForm">
      <input type="text" value={this.state.title} onChange={this.titleChange} />
      <br />
      <select defaultValue={this.props.cat} onChange={this.catChange}>
      {catOpts}
      </select>
      <div id="map-container"></div>
      <div className="FormFooter">
        {deleteState}
        <button className="cancel" onClick={this.cancelClick}>Cancel</button>
        <button className="submit" onClick={this.subClick} disabled={disabledState}>{pubText}</button>
      </div>
      </div>

    );
  }
});

var Point = React.createClass({
  editSet: function() {
    this.props.editBubble(this.props.id, true);
  },
  render: function() {
    var theColor = 'transparent';

    $(mapCategories).each(function(index,e){
      if(this.props.cat == e.slug) {
         theColor = e.color;
      }
    }.bind(this));
    return (
      <div className="Point" style={{background: theColor}}>
      <div className="title">{this.props.title} <button className="edit" onClick={this.editSet}>Edit</button></div>

      </div>
    )
  }
});


ReactDOM.render(
  <MapComponent />,
  document.getElementById('map-component')
);
