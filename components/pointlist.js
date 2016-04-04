var PointList = React.createClass({
  getInitialState: function() {
    return {
      points: this.props.points
    }
  },
  componentWillReceiveProps: function(nextProps) {


    this.setState({
      points: nextProps.points
    });
  },
  render: function() {
    if(this.props.points < 1) {
      return (
        <button onClick={this.props.addAPoint} className="addPoint">Click here to add your first map point.</button>
      )
    }

    var addButton = <div className="footer">
                      <button onClick={this.props.addAPoint} className="addPoint">Add a new map point</button>
                    </div>;
    if(this.props.editState) {
      addButton = false;
    }
    //GROUP BY CATEGORY
    var grouped = [];


    $(this.props.categories).each(function(index,e){
      var cat = e;
      $(this.state.points).each(function(index,e){
        var point = e;

        if(point.cat == cat.id) {

          point.color = cat.color;

          grouped.push(point);
        }
      }.bind(this));
    }.bind(this));
    //ADD IN NEW ONE
    $(this.state.points).each(function(index,e){
      if(e.cat === false) {
        e.cat = this.props.categories[0].id;
        grouped.push(e);
      }
    }.bind(this));
    console.log(grouped);

    var pointList = grouped.map(function(cat) {

      var style = {
        borderLeft: '3px solid '+ cat.color

      }

      var saveCat = false,
          catForm = false,
          mainCat = 'pointItem';
      if(cat.editing) {
        style = {
          background: '#ececec'
        }
        mainCat = 'categoryItem currently-editing';
        catForm = <PointForm title={cat.title} newPoint={cat.newPoint} cat={cat.cat} id={cat.id} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} categories={this.props.categories}/>
      }
      if(cat.title && !cat.editing) {
        saveCat = <PointItem savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} id={cat.id} cat={cat.cat} lat={cat.lat} lng={cat.lng} title={cat.title} />
      }
      return (
        <div className={mainCat} key={cat.id} style={style}>
          {saveCat}
          {catForm}

        </div>
      );
    }.bind(this));



    return (
      <div className="points-component">
      {pointList}
      {addButton}
      </div>
    )
    /*
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
    }.bind(this));*/

  }
});
