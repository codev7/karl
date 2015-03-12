Template.jobItemView.helpers({
  'item': function() {
    if(this) {
      if(this._id) {
        var item = getPrepItem(this._id);
        if(item) {
          item.cost = item.prepCostPerPortion * this.quantity;
          item.cost = Math.round(item.cost * 100)/100;
          return item;
        }
      }
    }
  }
});