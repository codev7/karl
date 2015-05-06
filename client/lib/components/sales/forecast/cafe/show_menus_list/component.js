var component = FlowComponents.define("showMenusList", function(props) {

});

component.state.menusList = function() {
  var menus = MenuItems.find({"status": "active"});
  return menus;
}