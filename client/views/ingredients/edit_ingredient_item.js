Template.editIngredientItem.helpers({
  'item': function() {
    return Session.get("thisIngredient")
  }
});

Template.editIngredientItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var code = $(event.target).find('[name=code]').val().trim();
    var desc = $(event.target).find('[name=desc]').val().trim();
    var supplier = $(event.target).find('[name=supplier]').val().trim();
    var portionOrdered = $(event.target).find('[name=portionOrdered]').val().trim();
    var costPerPortion = $(event.target).find('[name=costPerPortion]').val().trim();
    var portionUsed = $(event.target).find('[name=portionUsed]').val().trim();
    var unitSize = $(event.target).find('[name=unitSize]').val().trim();

    var info = {
      "code": code,
      "description": desc,
      "suppliers": [supplier],
      "portionOrdered": portionOrdered,
      "costPerPortion": costPerPortion,
      "portionUsed": portionUsed,
      "unitSize": unitSize,
    }
    Meteor.call("editIngredient", id, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
      $("#editIngredientModal").modal("hide");
    });
  }
});