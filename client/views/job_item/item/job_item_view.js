Template.jobItemView.helpers({
  'item': function() {
    var self = this;
    var id = 0;
    if(self) {
      if(self.id) {
        id = self.id;
      } else if(self._id) {
        id = self._id;
      }
      var item = getPrepItem(id);
      if(item) {
        return item;
      }
    }
  }
});