Template.jobItemEdit.helpers({
  item: function() {
    if(this) {
      if(this._id) {
        var item = getPrepItem(this._id);
        if(item) {
          return item;
        }
      } 
    }
  }
});