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
  var query = {};
  if(category != "all") {
    query.category = category;
  }
  if(status != "all") {
    query.status = status;
  }
  var menuItems = MenuItems.find(query);
  return menuItems;
}
