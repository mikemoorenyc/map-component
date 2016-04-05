var PointList = React.createClass({
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
      return <PointCategoryBlock categories={this.props.categories} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} points={block.points} id={block.id} key={block.id} categoryBlocks={categoryBlocks} updatePoints={this.props.sortPoints}/>
    }.bind(this))
    //GROUP BY CATEGORY
    /*
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
        catForm = <PointForm title={cat.title} lat={cat.lat} lng={cat.lng} newPoint={cat.newPoint} cat={cat.cat} id={cat.id} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} categories={this.props.categories}/>
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
    */
    var newPointItem = false;
    $(this.props.points).each(function(index,e){
      if(e.cat === false) {
        newPointItem = <div className="pointItem currently-editing" style={{background: '#ececec'}}><PointForm title={e.title} lat={e.lat} lng={e.lng} newPoint={e.newPoint} cat={this.props.categories[0].id} id={e.id} savePoint={this.props.savePoint} deletePoint={this.props.deletePoint} categories={this.props.categories}/></div>
      }
    }.bind(this))



    return (
      <div className="points-component">
      {pointList}
      {newPointItem}
      {addButton}
      </div>
    )


  }
});
