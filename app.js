// tutorial1.js
var MapComponent = React.createClass({
  getInitialState: function() {
   return {
     currentlyEditing: false,
     points: []
   };
  },
  addAPoint: function(e) {
    e.preventDefault();

    var currentPoints = this.state.points;
    var newPoints = currentPoints.concat([
      {
        id: new Date(),
        title:'',
        editing: true,
        newPoint: true
      }
    ]);
    this.setState({points: newPoints});
  },
  deleteAPoint: function(badid) {
    var currentPoints = this.state.points;
    var filteredPoints = currentPoints.filter(function (el) {
                      return el.id !== badid;
                 });

    this.setState({points: filteredPoints});
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
    var serialized = JSON.stringify(this.state.points);
    var editState = false;
    $(this.state.points).each(function(index,e){
      if(e.editing == true) {
        editState = true;
      }
    });
    var mainClass = 'mapComponent';
    var addButton = <button onClick={this.addAPoint}>Add a point</button>;
    if(editState == true) {
      mainClass = 'mapComponent currently-editing';
      addButton = false;
    }
    return (
      <div className={mainClass}>
        <input type="hidden" name="map_data" id="map_data" value={serialized} />
        <PointList data={this.state.points} editBubble={this.editSet} deleteBubble={this.deleteAPoint} updateBubble={this.updatePoint} />
        {addButton}
      </div>
    );
  }
});

var PointList = React.createClass({

  render: function() {
    var pointNodes = this.props.data.map(function(point) {
      var formRender = false,
          savedPoint = false;
      var classpoint = 'pointHolder';
      if(point.editing == true) {
        formRender = <PointForm title={point.title} editBubble={this.props.editBubble} newPoint={point.newPoint} id={point.id} onDelete={this.props.deleteBubble} saveNewPoint={this.props.updateBubble}/>;
        classpoint = 'pointHolder currently-editing';
      }
      if(point.title !=false) {
        savedPoint = <Point editBubble={this.props.editBubble} title={point.title} id={point.id} editing={point.editing} newPoint={point.newPoint}/>;
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



var PointForm = React.createClass({
  getInitialState: function() {
    return {
      title: this.props.title
    }
  },

  componentDidMount: function() {
    var $inner = $('<div style="width: 100%; height:500px"></div>').appendTo('#map-container');
    var center = new google.maps.LatLng(40.7067279,-74.0397625);
      var mapOptions = {
        zoom: 10,
        center: center,
        disableDefaultUI: true,
        zoomControl: true
      };

  var map = new google.maps.Map($inner[0],
  mapOptions);
  },
  componentWillUnmount: function() {
    $('#map-container > div').remove();
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
  subClick: function() {

      this.props.saveNewPoint(
        {
          title: this.state.title,
          id: this.props.id
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
    return (
      <div className="PointForm">
      <input type="text" value={this.state.title} onChange={this.titleChange} />
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

    return (
      <div className="Point">
      <div className="title">{this.props.title} <button className="edit" onClick={this.editSet}>Edit</button></div>

      </div>
    )
  }
});


ReactDOM.render(
  <MapComponent />,
  document.getElementById('map-component')
);
