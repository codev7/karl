var component = FlowComponents.define('menuItemsList', function(props) {
});

component.state.list = function() {
  var category = Session.get("category")
  var status =  Session.get("status")
  if(category == "all" && status == "all") {
    return MenuItems.find();
  } else {
    var query = {
      $and: []
    };
    if(category != "all") {
      query["$and"].push({"category": category});
    }
    if(status != "all") {
      query["$and"].push({"status": status.toLowerCase()});
    }
    var menuItems = MenuItems.find(query);
    return menuItems;
  }
}
