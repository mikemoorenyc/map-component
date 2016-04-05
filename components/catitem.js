var CatItem = React.createClass({

  deleteClick: function() {
    this.props.deleteCat(this.props.id, true);
  },
  editClick: function() {
    this.props.saveCat({
      id:this.props.id,
      name: this.props.name,
      color: this.props.color,
      editing:true
    })
  },
  hexToRgb: function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  },
  render: function() {
    var rgb = this.hexToRgb(this.props.color);
    var style = {
      'backgroundColor': 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',.3)'
    }
    var handle = <div className="handle"></div>;
    if(this.props.canDrag == false) {
      handle = false;
    }

    return (
      <div className="category-item" style={style}>
      {this.props.name}
      {handle}
      <div className="category-controls">
        <button onClick={this.editClick}>Edit</button>
        <button onClick={this.deleteClick}>Delete</button>
      </div>
      </div>
    )
  }
});
