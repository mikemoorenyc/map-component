'use strict';

// tutorial1.js
var MapComponent = React.createClass({
  displayName: 'MapComponent',

  getInitialState: function getInitialState() {
    return {
      currentlyEditing: false,
      points: []
    };
  },
  addAPoint: function addAPoint(e) {
    e.preventDefault();

    var currentPoints = this.state.points;
    var newPoints = currentPoints.concat([{
      id: new Date(),
      title: '',
      editing: true,
      newPoint: true
    }]);
    this.setState({ points: newPoints });
  },
  deleteAPoint: function deleteAPoint(badid) {
    var currentPoints = this.state.points;
    var filteredPoints = currentPoints.filter(function (el) {
      return el.id !== badid;
    });

    this.setState({ points: filteredPoints });
  },
  updatePoint: function updatePoint(point) {

    var currentPoints = this.state.points;
    $(currentPoints).each(function (index, e) {
      if (e.id == point.id) {
        currentPoints[index] = point;
      }
    });
    this.setState({ points: currentPoints });
  },
  editSet: function editSet(id, state) {
    var currentPoints = this.state.points;
    $(currentPoints).each(function (index, e) {
      if (e.id == id) {
        currentPoints[index].editing = state;
      }
    });
    this.setState({ points: currentPoints });
  },
  render: function render() {
    var serialized = JSON.stringify(this.state.points);
    var editState = false;
    $(this.state.points).each(function (index, e) {
      if (e.editing == true) {
        editState = true;
      }
    });
    var mainClass = 'mapComponent';
    var addButton = React.createElement(
      'button',
      { onClick: this.addAPoint },
      'Add a point'
    );
    if (editState == true) {
      mainClass = 'mapComponent currently-editing';
      addButton = false;
    }
    return React.createElement(
      'div',
      { className: mainClass },
      React.createElement('input', { type: 'hidden', name: 'map_data', id: 'map_data', value: serialized }),
      React.createElement(PointList, { data: this.state.points, editBubble: this.editSet, deleteBubble: this.deleteAPoint, updateBubble: this.updatePoint }),
      addButton
    );
  }
});

var PointList = React.createClass({
  displayName: 'PointList',


  render: function render() {
    var pointNodes = this.props.data.map(function (point) {
      var formRender = false,
          savedPoint = false;
      var classpoint = 'pointHolder';
      if (point.editing == true) {
        formRender = React.createElement(PointForm, { cat: point.cat, title: point.title, lat: point.lat, lng: point.lng, editBubble: this.props.editBubble, newPoint: point.newPoint, id: point.id, onDelete: this.props.deleteBubble, saveNewPoint: this.props.updateBubble });
        classpoint = 'pointHolder currently-editing';
      }
      if (point.title != false) {
        savedPoint = React.createElement(Point, { editBubble: this.props.editBubble, cat: point.cat, title: point.title, id: point.id, editing: point.editing, newPoint: point.newPoint });
      }
      return React.createElement(
        'div',
        { key: point.id, className: classpoint },
        savedPoint,
        formRender
      );
    }.bind(this));
    return React.createElement(
      'div',
      { className: 'PointList' },
      pointNodes
    );
  }
});

var PointForm = React.createClass({
  displayName: 'PointForm',

  getInitialState: function getInitialState() {
    if (!this.props.lat) {
      var lat = 40.7067279;
    } else {
      var lat = this.props.lat;
    }
    if (!this.props.lng) {
      var lng = -74.0397625;
    } else {
      var lng = this.props.lng;
    }
    if (!this.props.cat) {
      var cat = 'retail';
    } else {
      var cat = this.props.cat;
    }
    return {
      title: this.props.title,
      lat: lat,
      lng: lng,
      cat: cat
    };
  },

  componentDidMount: function componentDidMount() {
    var initialCenter = new google.maps.LatLng(this.state.lat, this.state.lng);
    $('#map-container').append($('#theMap'));
    google.maps.event.trigger(map, 'resize');
    map.setCenter(initialCenter);
    map.setZoom(13);
    marker.setPosition(initialCenter);

    //SET MARKER DRAG LISTENER\
    google.maps.event.addListener(marker, 'dragend', function () {
      this.updateCenter(marker.getPosition().lat(), marker.getPosition().lng());
    }.bind(this));

    //ON MAP CLICK
    google.maps.event.addListener(map, 'click', function (event) {

      this.updateCenter(event.latLng.lat(), event.latLng.lng());
    }.bind(this));

    //Places search
    searchBox.addListener('places_changed', function () {
      $('#search-input').val('');
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      var point = places[0];
      this.updateCenter(point.geometry.location.lat(), point.geometry.location.lng());
    }.bind(this));
  },
  updateCenter: function updateCenter(lat, lng) {
    map.panTo({
      lat: lat,
      lng: lng
    });
    marker.setPosition({
      lat: lat,
      lng: lng
    });
    this.setState({
      lat: lat,
      lng: lng
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    google.maps.event.clearListeners(marker, 'dragend');
    google.maps.event.clearListeners(searchBox, 'places_changed');
    google.maps.event.clearListeners(map, 'click');
    $("#gmap-container").append($('#theMap'));
  },
  cancelClick: function cancelClick() {
    if (this.props.newPoint == true) {
      this.props.onDelete(this.props.id);
    } else {
      this.props.editBubble(this.props.id, false);
    }
  },
  titleChange: function titleChange(e) {
    this.setState({ title: e.target.value });
  },
  catChange: function catChange(e) {
    this.setState({ cat: e.target.value });
  },
  subClick: function subClick() {

    this.props.saveNewPoint({
      title: this.state.title,
      id: this.props.id,
      lat: this.state.lat,
      lng: this.state.lng,
      cat: this.state.cat
    });
  },
  deleteClick: function deleteClick() {
    var verify = confirm("Are you sure you want to delete this point? This can't be undone.");
    if (verify) {
      this.props.onDelete(this.props.id);
    }
  },
  render: function render() {
    var deleteState,
        disabledState,
        pubText = 'Save';

    if (this.props.newPoint != true) {
      deleteState = React.createElement(
        'button',
        { onClick: this.deleteClick },
        'Delete this point'
      );
      pubText = 'Update';
    }

    if (this.state.title == false) {
      disabledState = true;
    }
    var catOpts = mapCategories.map(function (cat) {
      return React.createElement('option', { value: cat.slug, key: cat.slug, dangerouslySetInnerHTML: { __html: cat.title } });
    }.bind(this));
    return React.createElement(
      'div',
      { className: 'PointForm' },
      React.createElement('input', { type: 'text', value: this.state.title, onChange: this.titleChange }),
      React.createElement('br', null),
      React.createElement(
        'select',
        { defaultValue: this.props.cat, onChange: this.catChange },
        catOpts
      ),
      React.createElement('div', { id: 'map-container' }),
      React.createElement(
        'div',
        { className: 'FormFooter' },
        deleteState,
        React.createElement(
          'button',
          { className: 'cancel', onClick: this.cancelClick },
          'Cancel'
        ),
        React.createElement(
          'button',
          { className: 'submit', onClick: this.subClick, disabled: disabledState },
          pubText
        )
      )
    );
  }
});

var Point = React.createClass({
  displayName: 'Point',

  editSet: function editSet() {
    this.props.editBubble(this.props.id, true);
  },
  render: function render() {
    var theColor = 'transparent';

    $(mapCategories).each(function (index, e) {
      if (this.props.cat == e.slug) {
        theColor = e.color;
      }
    }.bind(this));
    return React.createElement(
      'div',
      { className: 'Point', style: { background: theColor } },
      React.createElement(
        'div',
        { className: 'title' },
        this.props.title,
        ' ',
        React.createElement(
          'button',
          { className: 'edit', onClick: this.editSet },
          'Edit'
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(MapComponent, null), document.getElementById('map-component'));