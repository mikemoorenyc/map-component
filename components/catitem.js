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
  render: function() {
    var style = {
      border: '3px solid',
      'borderWidth': '0 0 0 3px',
      'borderColor': this.props.color
    }

    return (
      <div className="category-item" style={style}>
      {this.props.name}
      <div className="category-controls">
        <button onClick={this.editClick}>Edit</button>
        <button onClick={this.deleteClick}>Delete</button>
      </div>
      </div>
    )
  }
});
