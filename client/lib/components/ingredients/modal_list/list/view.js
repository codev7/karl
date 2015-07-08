Template.showIngredientsList.events({
  "keyup #searchText-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),

  'submit form': function(event) {
    event.preventDefault();
    var ing_items = $(event.target).find("[name=selectedIng]").get();
    var ing_items_doc = [];
    ing_items.forEach(function(ing) {
      var dataid = $(ing).attr("data-id");
      var check = $(ing).is(':checked');
      if(dataid && check) {
        ing_items_doc.push(dataid);
      }
    });
    var alreadySelected = Session.get("selectedIngredients");
    if(alreadySelected && alreadySelected.length > 0) {
      ing_items_doc = ing_items_doc.concat(alreadySelected);  
    } 
    if(ing_items_doc.length > 0) {
      Session.set("selectedIngredients", ing_items_doc);
    } 
    $(event.target).find('[type=checkbox]').attr('checked', false);
    $("#searchText-box").val("");
    $("#ingredientsListModal").modal("hide");
    FlowComponents.callAction('submit');
  },

  'click #addNewIng': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  }
});