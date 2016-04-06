var PointItem = React.createClass({

  deleteClick: function() {
    this.props.deletePoint(this.props.id, true);
  },
  editClick: function() {
    this.props.savePoint({
      id:this.props.id,
      title: this.props.title,
      lat: this.props.lat,
      lng: this.props.lng,
      cat: this.props.cat,
      editing:true
    })
  },
  render: function() {
    var handle = <div className="drag-handle">
                    <div className="icon">
                      <hr/>
                    </div>
                  </div>;
    if(this.props.canDrag == false) {
      handle = false;
    }

    return (
      <div className="point-item"style={{borderLeft: '3px solid '+this.props.color}}>
      {this.props.title}
      {handle}
      <div className="category-controls">
        <button onClick={this.editClick}>Edit</button>
        <button onClick={this.deleteClick}>Delete</button>
      </div>
      </div>
    )
  }
});
