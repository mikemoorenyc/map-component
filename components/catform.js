var CatForm =  React.createClass({
  getInitialState: function() {
    return {
      name: this.props.name,
      id: this.props.id,
      color: this.props.color
    }
  },
  changeName: function(e) {
      this.setState({name: e.target.value});
  },
  changeColor: function(e) {

  },
  componentDidMount: function() {
    $("#color-picker").spectrum({
      preferredFormat: "hex",
      showInput: true
    });

    $("#color-picker").on('change.spectrum', function(e, tinycolor) {

      this.setState({
        color: tinycolor.toHexString(tinycolor)
      })

    }.bind(this));
  },
  componentWillUnmount: function() {
    $("#color-picker").off('change.spectrum');
    $("#color-picker").spectrum("destroy");
  },
  cancelClick: function(e) {
    e.preventDefault();

    if(this.props.newPoint) {
      this.props.deleteCat(this.props.id);
    } else {
      this.props.saveCat({
        id: this.props.id,
        name: this.props.name,
        color: this.props.color,
        editing: false
      })
    }
  },
  publishClick: function(e) {
    e.preventDefault();
    this.props.saveCat({
      id: this.props.id,
      name: this.state.name,
      color: this.state.color,
      editing: false,
      newCat: false
    });
  },
  render: function() {
    var disabled = true;
    if(this.state.name && this.state.color) {
      disabled = false;
    }
    var publishCopy = 'Save';
    if(!this.props.newPoint) {
      publishCopy = 'Update';
    }
    return (
      <div className="category-form">
        <label>Category Name</label>
        <input type="text" value={this.state.name} onChange={this.changeName}/>
        <input type="text" id="color-picker" onChange={this.changeColor} value={this.state.color} />
        <div className="sub-form-footer">
          <button className="cancel-button" onClick={this.cancelClick}>Cancel</button>
          <button className="publish-button" onClick={this.publishClick} disabled={disabled}>{publishCopy}</button>
        </div>
      </div>
    );
  }

});
