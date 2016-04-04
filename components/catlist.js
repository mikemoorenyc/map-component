var CatList = React.createClass({

  render: function() {

    //SET UP ADD A NEW
    var newCat = <div className="footer">
                    <button onClick={this.props.newCat}>Add a new category</button>
                  </div>;
    if(this.props.editState) {
      newCat = false;
    }

    var catList = false;

    if(this.props.cat.length > 0) {
      catList = this.props.cat.map(function(cat) {
        var saveCat = false,
            catForm = false,
            mainCat = 'categoryItem';
        if(cat.editing) {

          mainCat = 'categoryItem currently-editing';
          catForm = <CatForm name={cat.name} color={cat.color} id={cat.id} newPoint={cat.newCat} deleteCat={this.props.deleteCat} saveCat={this.props.saveCat}/>
        }
        if(cat.name && !cat.editing) {
          saveCat = <CatItem name={cat.name} color={cat.color} id={cat.id} deleteCat={this.props.deleteCat} saveCat={this.props.saveCat}/>
        }
        return (
          <div className={mainCat} key={cat.id} draggable={!this.props.editState}>
            {saveCat}
            {catForm}

          </div>
        );
      }.bind(this));
    }

    return (
      <div className='category-block' >
        {catList}
        {newCat}
      </div>
    )
  }
});
