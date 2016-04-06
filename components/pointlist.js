var PointList = React.createClass({
  render: function() {
    if(this.props.points < 1) {
      return (
        <div className="points-component empty-state">

          <img src="empty-map.png" height="100"/>
          <div className="copy">
            <h4>Get Started</h4>

            <p>Start adding points to your map.</p>
          </div>
          <button onClick={this.props.addAPoint} className="btn-class">Add first point</button>


        </div>
      )
    }

    var addButton = <div className="footer">
                      <button onClick={this.props.addAPoint} className="addPoint btn-class">new map point</button>
                    </div>;
    if(this.props.editState) {
      addButton = false;
    }
    //MAKE CATEGORY BLOCK ARRAY
    var categoryBlocks = [];
    $(this.props.categories).each(function(index,e){
      var category = e;
      var catObject = {
        id: category.id,
        points: []
      }
      var pointArray = []
      $(this.props.points).each(function(index,e){

        var point = e;

        if(point.cat == category.id) {

          point.color = category.color;
          pointArray.push(point);

        }
      }.bind(this));
      catObject.points = pointArray;
      //console.log(catObject);
      categoryBlocks.push(catObject);
    }.bind(this));

    var pointList = categoryBlocks.map(function(block){
      return <PointCategoryBlock categories={this.props.categories} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} points={block.points} id={block.id} key={block.id} categoryBlocks={categoryBlocks} updatePoints={this.props.sortPoints} getCatColor={this.props.getCatColor} getCatName={this.props.getCatName}/>
    }.bind(this))

    var newPointItem = false;
    $(this.props.points).each(function(index,e){
      if(e.cat === false) {
        newPointItem = <div className="pointItem currently-editing" ><PointForm title={e.title} lat={e.lat} lng={e.lng} newPoint={e.newPoint} cat={this.props.categories[0].id} catName={this.props.categories[0].name} id={e.id} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} categories={this.props.categories}/></div>
      }
    }.bind(this))



    return (
      <div className="points-component ">

      {pointList}
      {newPointItem}
      {addButton}

      </div>
    )


  }
});
