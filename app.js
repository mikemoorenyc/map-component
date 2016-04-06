// tutorial1.js
var MapComponent = React.createClass({
  getInitialState: function() {
   return {
     currentlyEditing: false,
     points: [],
     categories: [
       {
         id: 1,
         name: 'Test 1',
         color: '#cc0000',
       },
       {
         id: 2,
         name: 'Test 2',
         color: '#ececec',
       },
       {
         id:3,
         name: 'Test 3',
         color: '#0000cc'
       }

     ]
   };
  },
  randomColor: function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  },
  idGenerator: function(items) {
    var newID = 1;
    if(items.length > 0) {
      var highNum = 0;

      $(items).each(function(index, e){
        if(e.id > highNum) {
          highNum = e.id;
        }
      });
      newID = highNum+1;
    }
    return newID;
  },
  addAPoint: function(e) {
    e.preventDefault();

    var currentPoints = this.state.points;
    var newPoints = currentPoints.concat([
      {
        id: this.idGenerator(currentPoints),
        title:'',
        editing: true,
        newPoint: true,
        cat: false
      }
    ]);
    this.setState({points: newPoints});
  },
  addACat: function(e) {

    e.preventDefault();
    var currentCats = this.state.categories;
    var newCats = currentCats.concat([
      {
        id: this.idGenerator(currentCats),
        name:'',
        color: this.randomColor(),
        editing: true,
        newCat: true
      }
    ]);
    this.setState({categories: newCats});

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

    this.setState({points: filteredPoints});
  },
  deleteCat: function(badid, saved) {

    if(saved === true) {
      if(this.state.categories.length < 2) {
        alert("You need to have at least one category.");
        return;
      }
      var cancel;
      $(this.state.points).each(function(index,e){
        if(e.cat == badid) {

          cancel = true;
        }
      });
      if(cancel) {
        alert("Sorry. You can't delete this category because some map points are using it. Delete those points or change their category.");
        return;
      }
      var confirmed = confirm("Are you sure you want to delete this category? This can't be undone.");
      if(!confirmed) {
        return;
      }

    }
    var currentCats = this.state.categories;
    var filteredPoints = currentCats.filter(function (el) {
                      return el.id !== badid;
                 });

    this.setState({categories: filteredPoints});
  },
  setCat: function(point) {

    var currentPoints = this.state.categories;
    $(currentPoints).each(function(index, e){
      if(e.id == point.id) {
        currentPoints[index] = point;
      }
    });
    this.setState({categories:currentPoints});
  },
  updatePoint: function(point) {

    var currentPoints = this.state.points;
    $(currentPoints).each(function(index, e){
      if(e.id == point.id) {
        currentPoints[index] = point;
      }
    });
    this.setState({points:currentPoints});
  },
  editSet: function(id, state) {
    var currentPoints = this.state.points;
    $(currentPoints).each(function(index, e){
      if(e.id == id) {
        currentPoints[index].editing = state;
      }
    });
    this.setState({points:currentPoints});
  },
  updateCat: function(newOrder) {
    this.setState({
      categories: newOrder
    });
  },
  sortPoints: function(newOrder) {
    this.setState({
      points: newOrder
    });
  },
  getCatColor: function(id) {
    var catName = '';
    $(this.state.categories).each(function(index,e){
      var cat = e;
      if(id ==e.id) {

        catName =  e.color;
      }
    }.bind(this));
    return catName;
  },
  getCatName: function(id) {
    var catName = '';
    $(this.state.categories).each(function(index,e){
      var cat = e;
      if(id ==e.id) {

        catName =  e.name;
      }
    }.bind(this));
    return catName;
  },
  render: function() {
    var scaffold;
    var editState = false;
    $(this.state.points.concat(this.state.categories)).each(function(index,e){
      if(e.editing == true) {
        editState = true;
      }
    });
    if(this.state.categories.length < 1) {
      scaffold = <div className="emptyState"><button onClick={this.addACat}>Click here to add your first category.</button></div>;
    } else {
      scaffold = <div className="clearfix">
                    <CatList updateCat={this.updateCat} deleteCat={this.deleteCat} newCat={this.addACat} editState={editState} saveCat={this.setCat} cat={this.state.categories}/>
                    <PointList savePoint={this.updatePoint} addAPoint={this.addAPoint} deletePoint={this.deletePoint} points={this.state.points} categories={this.state.categories} editState={editState} sortPoints={this.sortPoints} getCatColor={this.getCatColor} getCatName={this.getCatName}/>

                  </div>;
    }
    var serialized = JSON.stringify(this.state.points);
    var cat_serialized = JSON.stringify(this.state.categories);

    var mainClass = 'mapComponent';
    var addButton = <button onClick={this.addAPoint}>Add a point</button>;
    if(editState == true) {
      mainClass = 'mapComponent currently-editing';
      addButton = false;
    }
    //<PointList data={this.state.points} editBubble={this.editSet} deleteBubble={this.deleteAPoint} updateBubble={this.updatePoint} />
    //{addButton}
    return (
      <div className={mainClass}>
        <input type="hidden" name="map_data" id="map_data" value={serialized} />
        <input type="hidden" name="map_cats" id="map_cats" value={cat_serialized} />

        {scaffold}
      </div>
    );
  }
});



ReactDOM.render(
  <MapComponent />,
  document.getElementById('map-component')
);
