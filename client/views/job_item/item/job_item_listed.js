Template.jobItemListed.helpers({
  costPerPortion: function() {
    var id = null;
    if(this) {
      if(this.id) {
        id = this.id;
      } else if(this._id) {
        id = this._id;
      } 
      if(id) {
        var item = getPrepItem(id);
        if(item) {
          return item.prepCostPerPortion;
        }
      }
    }
  }
});