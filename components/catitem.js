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
  luma: function(hex) {
    var c = hex.substring(1);      // strip #
var rgb = parseInt(c, 16);   // convert rrggbb to decimal
var r = (rgb >> 16) & 0xff;  // extract red
var g = (rgb >>  8) & 0xff;  // extract green
var b = (rgb >>  0) & 0xff;  // extract blue

var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  return luma;
  },
  render: function() {
    /*
    var rgb = this.hexToRgb(this.props.color);
    var style = {
      'backgroundColor': 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',.3)'
    }*/
    var handle = <div className="drag-handle">
                    <div className="icon">
                      <hr/>
                    </div>
                  </div>;
    if(this.props.canDrag == false) {
      handle = false;
    }
    var iconClass = 'icon';
    if(this.luma(this.props.color) > 200) {
      iconClass = 'icon dark';
    }
    return (
      <div className="category-item">
      <div className="category-title">{this.props.name}</div>
      {handle}
      <button onClick={this.editClick} className="edit-bubble" style={{backgroundColor: this.props.color}}>
        <span className={iconClass}>
        <svg  viewBox="0 0 528.899 528.899">

        	<path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z" fill="#FFFFFF"/>

        </svg>
        </span>

      </button>

      <div className="category-controls">
        <button onClick={this.editClick}>Edit</button>
        <button onClick={this.deleteClick}>Delete</button>
      </div>
      </div>
    )
  }
});
