var PointForm = React.createClass({
  /*
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
  */
  getInitialState: function() {
    console.log(this.props.cat);
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

    return {
      title: this.props.title,
      cat: this.props.cat,
      lat: lat,
      lng: lng
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
  cancelClick: function(e) {
    e.preventDefault();

    if(this.props.newPoint) {
      this.props.deletePoint(this.props.id);
    } else {
      this.props.savePoint({
        id: this.props.id,
        title: this.state.title,
        cat: this.state.cat,
        editing: false
      });
    }
  },
  updateTitle: function(e) {
      this.setState({title: e.target.value});
  },
  updateCat: function(e) {
    this.setState({cat: e.target.value});
  },
  publishClick: function(e) {

    e.preventDefault();
    this.props.savePoint({
      id: this.props.id,
      title: this.state.title,
      cat: this.state.cat,
      lat: this.state.lat,
      lng: this.state.lng,
      editing: false,
      newCat: false
    });
  },
  render: function() {
    var disabled = true;
    if(this.state.title) {
      disabled = false;
    }
    var publishCopy = 'Save';
    if(!this.props.newPoint) {
      publishCopy = 'Update';
    }
    return (
      <div className="point-form">
        <label>Point Name</label>
        <input type="text" value={this.state.title} onChange={this.updateTitle}/>
        <br/>
        <select defaultValue={this.state.cat} onChange={this.updateCat}>
        {
          this.props.categories.map(function (cat) {
            return (
              <option value={cat.id} key={cat.id} dangerouslySetInnerHTML={{__html:cat.name}}></option>
            )
          })
        }
        </select>
        <div id="map-container"></div>
        <div className="FormFooter">

          <button className="cancel" onClick={this.cancelClick}>Cancel</button>
          <button className="submit" onClick={this.publishClick} disabled={disabled}>{publishCopy}</button>
        </div>

      </div>
    )

  }
});
