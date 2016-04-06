var PointCategoryBlock = React.createClass({

  mixins: [SortableMixin],
  sortableOptions: {
    ref: 'catBlock',
    model: 'points',
    animation: 100,
    //filter: ".currently-editing",
    draggable: '.pointItem'
  },
  handleSort: function(evt, target) {
    var cats = this.state.points;
    $(cats).each(function(index,e){
      if(e.order === evt.oldIndex ) {
        cats[index].order = evt.newIndex;
      }
    });
    cats.sort(function compare(a,b) {
      if (a.order < b.order)
        return -1;
      else if (a.order > b.order)
        return 1;
      else
        return 0;
    });
    this.setState({
      points: cats
    });
    var newCategoryBlocks = this.props.categoryBlocks
    $(newCategoryBlocks).each(function(index,e){
      if(this.props.id == e.id) {
        newCategoryBlocks[index] = {
          id: e.id,
          points: cats
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
    points: this.ordered(this.props.points),
    id: this.props.id
  }
},
ordered: function(points) {
  var ordered = [];
  $(points).each(function(index,e){
    e.order = index;
    ordered.push(e);
  });
  return ordered;
},
componentWillReceiveProps: function(nextProps) {


  this.setState({
    points: this.ordered(nextProps.points)
  });
},

render: function() {

  if(this.state.points.length < 1) {
    var hider = {display:'none'};
  }
  var theList = this.state.points.map(function(point){


    var saveCat = false,
        catForm = false,
        mainCat = 'pointItem item-'+this.props.id;
    if(point.editing) {

      mainCat = 'pointItem currently-editing item-'+this.props.id;
      catForm = <PointForm title={point.title} lat={point.lat} lng={point.lng} newPoint={point.newPoint} cat={point.cat} id={point.id} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} categories={this.props.categories}/>
    }
    if(point.title && !point.editing) {
      saveCat = <PointItem color={this.props.getCatColor(this.props.id)} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} id={point.id} cat={point.cat} lat={point.lat} lng={point.lng} title={point.title} />
    }
    return (
      <div className={mainCat} key={point.id}>
        {saveCat}
        {catForm}

      </div>
    );
  }.bind(this));
  return(
    <div className="category-block" style={hider}>
    <h4 className="cat-heading" dangerouslySetInnerHTML={{__html:this.props.getCatName(this.props.id)}}></h4>
    {theList}
    </div>
  )
}

});
