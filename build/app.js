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
        formRender = React.createElement(PointForm, { title: point.title, editBubble: this.props.editBubble, newPoint: point.newPoint, id: point.id, onDelete: this.props.deleteBubble, saveNewPoint: this.props.updateBubble });
        classpoint = 'pointHolder currently-editing';
      }
      if (point.title != false) {
        savedPoint = React.createElement(Point, { editBubble: this.props.editBubble, title: point.title, id: point.id, editing: point.editing, newPoint: point.newPoint });
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
    return {
      title: this.props.title
    };
  },

  componentDidMount: function componentDidMount() {
    var $inner = $('<div style="width: 100%; height:500px"></div>').appendTo('#map-container');
    var center = new google.maps.LatLng(40.7067279, -74.0397625);
    var mapOptions = {
      zoom: 10,
      center: center,
      disableDefaultUI: true,
      zoomControl: true
    };

    var map = new google.maps.Map($inner[0], mapOptions);
  },
  componentWillUnmount: function componentWillUnmount() {
    $('#map-container > div').remove();
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
  subClick: function subClick() {

    this.props.saveNewPoint({
      title: this.state.title,
      id: this.props.id
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
    return React.createElement(
      'div',
      { className: 'PointForm' },
      React.createElement('input', { type: 'text', value: this.state.title, onChange: this.titleChange }),
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

    return React.createElement(
      'div',
      { className: 'Point' },
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