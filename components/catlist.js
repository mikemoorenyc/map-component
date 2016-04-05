var CatList = React.createClass({
  mixins: [SortableMixin],
  sortableOptions: {
    ref: 'catList',
    model: 'categoryList',
  //  filter: ".currently-editing"
    handle: '.drag-handle',
    animation: 100,

  },
  handleStart: function() {
    this.setState({dragging:true})
  },
  handleEnd: function() {
    this.setState({dragging:false})
  },
  handleSort: function(evt, target) {
    var cats = this.state.categoryList;
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
      categoryList: cats
    });
    this.props.updateCat(cats);



  },
  componentWillReceiveProps: function(nextProps) {

    var ordered = [];
    $(nextProps.cat).each(function(index,e) {
      e.order = index;
      ordered.push(e);
    });
    this.setState({
      categoryList: ordered
    });
  },
  getInitialState: function() {
    var ordered = [];
    $(this.props.cat).each(function(index,e) {
      e.order = index;
      ordered.push(e);
    });
    return {
      categoryList: ordered,
      dragging: false
    }
  },
  render: function() {

    //SET UP ADD A NEW
    var newCat = <div className="footer">
                    <button onClick={this.props.newCat} className="btn-class">Add category</button>
                  </div>;
    if(this.props.editState) {
      newCat = false;
    }

    var catList = false;

    if(this.state.categoryList.length > 0) {
      var draggable = !this.props.editState;
      if(this.props.cat.length < 2) {
        draggable = false;
      }
      catList = this.state.categoryList.map(function(cat) {
        var saveCat = false,
            catForm = false,
            mainCat = 'categoryItem';
        if(cat.editing) {

          mainCat = 'categoryItem currently-editing';
          catForm = <CatForm name={cat.name} color={cat.color} id={cat.id} newPoint={cat.newCat} deleteCat={this.props.deleteCat} saveCat={this.props.saveCat}/>
        }
        if(cat.name && !cat.editing) {
          saveCat = <CatItem canDrag={draggable} name={cat.name} color={cat.color} id={cat.id} deleteCat={this.props.deleteCat} saveCat={this.props.saveCat}/>
        }
        return (
          <div className={mainCat} key={cat.id} >
            {saveCat}
            {catForm}

          </div>
        );
      }.bind(this));
    }

    return (
      <div className='category-component' data-dragging={this.state.dragging}>
        <h4>Categories</h4>
        <div className="category-list" ref="catList">
          {catList}
        </div>

        {newCat}
      </div>
    )
  }
});
