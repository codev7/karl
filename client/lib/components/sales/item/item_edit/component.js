var component = FlowComponents.define("editSalesItem", function(props) {
  this.onRendered(this.onMenuListRendered);
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.MenuItemsSearch = new SearchSource('menuItems', fields, options);
});

component.action.keyup = function(text) {
  this.MenuItemsSearch.search(text);
}

component.state.getMenuItems = function() {
  var doc = this.MenuItemsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
  return doc;
}

component.prototype.onMenuListRendered = function() {
  this.MenuItemsSearch.search("");
}