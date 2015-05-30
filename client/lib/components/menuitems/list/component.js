var subs = new SubsManager();

var component = FlowComponents.define('menuItemsList', function(props) {
  var params = Router.current().params;
  this.set("category", params.category);
  this.set("status", params.status);
  subs.subscribe("menuList", params.category, params.status);
});

component.state.list = function() {
  var category = this.get("category");
  var status = this.get("status");
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
