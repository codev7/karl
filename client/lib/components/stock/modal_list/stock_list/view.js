Template.stocksModalList.events({
  "keyup #searchText-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),

  'click #addNewIng': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  }
});