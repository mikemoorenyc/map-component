var PointCategoryBlock = React.createClass({

  mixins: [SortableMixin],
  sortableOptions: {
    ref: 'pointBlock',
    model: 'points',
    animation: 100,
    handle: '.drag-handle'
  },

  handleStart: function() {
    this.setState({dragging:true})
  },
  handleEnd: function() {
    this.setState({dragging:false})
  },
  handleSort: function(evt, target) {

    var oldPoints = this.state.points;
    var newPoints = [];
    $(oldPoints).each(function(index,e){
      var point = e;
      if(point == undefined) {

        return;
      }
      if(point.order == evt.oldIndex) {
        point.order = evt.newIndex;
      }
      newPoints.push(point);

    });
    newPoints.sort(function compare(a,b) {
      if (a.order < b.order)
        return -1;
      else if (a.order > b.order)
        return 1;
      else
        return 0;
    });

    this.setState({points: newPoints});

    var newCategoryBlocks = this.props.categoryBlocks
    $(newCategoryBlocks).each(function(index,e){
      if(this.props.id == e.id) {
        newCategoryBlocks[index] = {
          id: e.id,
          points: newPoints
        }
      }
    }.bind(this));
    var serializeit = [];
    $(newCategoryBlocks).each(function(index,e){
      var points = e.points;
      serializeit = serializeit.concat(points)
    });
    this.props.updatePoints(serializeit);



  },
getInitialState: function(){
  return {
    points: orderer(this.props.points),
    id: this.props.id,
    dragging: false
  }
},

componentWillReceiveProps: function(nextProps) {


  this.setState({
    points: orderer(nextProps.points)
  });


},

render: function() {
  if(this.state.points.length < 1) {
    var hider = {display:'none'};
  }

  var draggable = !this.props.editState;
  if(this.state.points.length < 2) {
    draggable = false;
  }
  var theList = this.state.points.map(function(point){

    if(point == undefined) {
      return;
    }
    var saveCat = false,
        catForm = false,
        mainCat = 'pointItem item-'+this.props.id;


    if(point.editing) {

      mainCat = 'pointItem currently-editing item-'+this.props.id;
      catForm = <PointForm title={point.title} lat={point.lat} lng={point.lng} newPoint={point.newPoint} cat={point.cat} id={point.id} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} categories={this.props.categories}/>
    }
    if(point.title && !point.editing) {
      saveCat = <PointItem color={this.props.getCatInfo(this.props.id, 'color')} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} id={point.id} cat={point.cat} lat={point.lat} lng={point.lng} title={point.title} canDrag={draggable}/>
    }
    return (
      <div className={mainCat} key={point.id}>
        {saveCat}
        {catForm}

      </div>
    );
  }.bind(this));
  return(
    <div className="category-block" style={hider} data-dragging={this.state.dragging}>
    <h4 className="cat-heading" dangerouslySetInnerHTML={{__html:this.props.getCatInfo(this.props.id, 'name')}}></h4>
    <div ref="pointBlock">
    {theList}
    </div>
    </div>
  )
}

});
