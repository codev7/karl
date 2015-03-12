Template.ingredientsList.helpers({
  ingredientsList: function() {
    var list = Ingredients.find().fetch();
    console.log(list);
    return list;
  },

  actionPermission: function() {
    if(Router.current()) {
      var routename = Router.current().route.getName();
      if(routename == "menuItemSubmitStep2") {
        return false;
      } else {
        return true;
      }
    }
  },

  actionPermissionReverse: function() {
    if(Router.current()) {
      var routename = Router.current().route.getName();
      if(routename == "menuItemSubmitStep2") {
        return true;
      } else {
        return false;
      }
    }
  }

});