var PointsComponent = React.createClass({
  getInitialState: function() {
      return {
        points: INITIALPOINTS,
        categories: INITIALCATEGORIES,
        disabled: false,
        editing: false
      }
  },

  updatePoints: function(newPoints) {
    var editing = false;
    $(newPoints).each(function(index,e){
      if(e.editing == true) {
        editing = true;
      }
    }.bind(this));

    $(APP).trigger('receiveFromPoints', [newPoints, editing]);
    this.setState({points: newPoints, editing: editing});
  },
  componentDidMount: function(){
    $(APP).on('receiveFromCategories', function(event, newCategories, editing){
      this.setState({
        editing: editing,
        categories: newCategories
      })
    }.bind(this));
  },
  componentWillUnmount: function(){
    $(APP).off('receiveFromCategories');
  },
  addAPoint: function(e) {
    e.preventDefault();

    var currentPoints = this.state.points;
    var newPoints = currentPoints.concat([
      {
        id: idGenerator(currentPoints),
        title:'',
        editing: true,
        newPoint: true,
        cat: false
      }
    ]);

    this.updatePoints(newPoints);
  },
  setPoint: function(point) {

    var currentPoints = this.state.points;
    $(currentPoints).each(function(index, e){
      if(e.id == point.id) {
        currentPoints[index] = point;
      }
    });
    this.updatePoints(currentPoints);
  },
  deletePoint: function(badid, saved) {
    if(saved) {
      var confirmed = confirm("Are you sure you want to delete this map point? This can't be undone.");
      if(!confirmed) {
        return;
      }
    }
    var currentCats = this.state.points;
    var filteredPoints = currentCats.filter(function (el) {
                      return el.id !== badid;
                 });

    this.updatePoints(filteredPoints);
  },
  getCatInfo: function(id,value) {
    var catName = '';
    $(this.state.categories).each(function(index,e){
      var cat = e;
      if(id ==e.id) {

        catName =  e[value];
      }
    }.bind(this));
    return catName;
  },

  render: function(){
    if(this.state.points < 1) {

      return (
        <div className="points-component empty-state">

          <img src="empty-map.png" height="100"/>
          <div className="copy">
            <h4>Get Started</h4>

            <p>Start adding points to your map.</p>
          </div>
          <button onClick={this.addAPoint} className="btn-class" disabled={this.state.editing}>Add first point</button>


        </div>
      )
    }
    //NON-EMPTY
    var addButton = <div className="footer">
                      <button onClick={this.addAPoint} className="addPoint btn-class">add map point</button>
                    </div>;
    if(this.state.editing) {
      addButton = false;
    }

    //CATEGORY BLOCKS
    var categoryBlocks = [];
    $(this.state.categories).each(function(index,e){
      var category = e;
      var catObject = {
        id: category.id,
        points: []
      }
      var pointArray = []
      $(this.state.points).each(function(index,e){

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
      if(block.points.length > 0) {
        return <PointCategoryBlock categories={this.state.categories} savePoint={this.setPoint} deletePoint={this.deletePoint} points={block.points} id={block.id} key={block.id} categoryBlocks={categoryBlocks} updatePoints={this.updatePoints} getCatInfo={this.getCatInfo} editState={this.state.editing}/>
      }

    }.bind(this))

    //NEW POINT ITEM
    var newPointItem = false;
    $(this.state.points).each(function(index,e){
      if(e.cat === false) {
        newPointItem = <div className="pointItem currently-editing" ><PointForm title={e.title} lat={e.lat} lng={e.lng} newPoint={e.newPoint} cat={this.state.categories[0].id} id={e.id} savePoint={this.setPoint} deletePoint={this.deletePoint} categories={this.state.categories}/></div>
      }
    }.bind(this));
    var serialized = JSON.stringify(this.state.points);
    return (

      <div className="points-component " data-editing={this.state.editing}>
      <input type="hidden" name="map_data" id="map_data" value={serialized} />
      {pointList}
      {newPointItem}
      {addButton}

      </div>
    )
  }





});
