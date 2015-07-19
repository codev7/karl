var component = FlowComponents.define('menuItemsList', function(props) {
  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];

  this.MenuItemsSearch = new SearchSource('menuItemsSearch', fields, options);
  this.onRendered(this.onMenuListRendered);
});

component.action.keyup = function(text) {
  var category = Session.get("category");
  var status = Session.get("status");
  var filter = [];
  if(category != "all") {
    filter.push({"category": category});
  }
  if(status != "all") {
    filter.push({"status": status.toLowerCase()});
  }
  if(filter.length > 0) {
    this.MenuItemsSearch.search(text, {'limit': 10, 'filter': filter});
  } else {
    this.MenuItemsSearch.search(text, {'limit': 10});
  }
}

component.state.getMenuItems = function() {
  var data = this.MenuItemsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'name': 1}
  });
  return data;
}

component.prototype.onMenuListRendered = function() {
  var category = Session.get("category");
  var status = Session.get("status");
  var filter = [];
  if(category != "all") {
    filter.push({"category": category});
  }
  if(status != "all") {
    filter.push({"status": status.toLowerCase()});
  }
  if(filter.length > 0) {
    this.MenuItemsSearch.search("", {'limit': 10, 'filter': filter});
  } else {
    this.MenuItemsSearch.search("", {'limit': 10});
  }
}

component.action.loadMore = function() {
  var text = $("#searchMenuItemsBox").val().trim();
  if(this.MenuItemsSearch.history && this.MenuItemsSearch.history[text]) {
    var dataHistory = this.MenuItemsSearch.history[text].data;
    if(dataHistory.length >= 9) {
      this.MenuItemsSearch.cleanHistory();
      var count = dataHistory.length;
      var lastItem = dataHistory[count - 1]['name'];
      this.MenuItemsSearch.search(text, {"limit": count + 10, "endingAt": lastItem});
    }
  }
}