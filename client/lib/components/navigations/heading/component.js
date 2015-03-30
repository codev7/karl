var component = FlowComponents.define('heading', function(props) {
  console.log(props);
});

// component.state.title = function() {
//   var routeName = Router.current().route.getName();
//   if(routeName == "ingredientsList") {
//     return "Ingredients"
//   } else if(routeName == "jobItemsMaster") {
//     return "Jobs"
//   } else if(routeName == "menuItemsMaster") {
//     return "Menus";
//   } else if(routeName == "submitMenuItem") {
//     return "Submit Menu";
//   } else if(routeName == "menuItemDetail") {
//     return "Menu Item Detail";
//   }

// }