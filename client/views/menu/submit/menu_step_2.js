Template.menuStep2Submit.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      return MenuItems.findOne(id);
    }
  }
});

Template.menuStep2Submit.events({
  'click #showIngredientsList': function(event) {
    event.preventDefault();
    console.log("--------");
    $("#ingredientsListModal").modal("show");
  }
});