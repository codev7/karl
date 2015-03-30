Template.headingAndBreadcrumbs.helpers({
  heading: function() {
    var routeName = Router.current().route.getName();
    console.log(routeName);
    if(routeName == "ingredientsList") {
      return "Ingredients"
    } else if(routeName == "jobItemsMaster") {
      return "Jobs"
    } else if(routeName == "menuItemsMaster") {
      return "Menus";
    } else if(routeName == "submitMenuItem") {
      return "Submit Menu";
    } else if(routeName == "menuItemDetail") {
      return "Menu Item Detail";
    }
  }
});