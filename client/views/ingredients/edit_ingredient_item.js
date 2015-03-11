Template.editIngredientItem.helpers({
  'item': function() {
    return Session.get("thisIngredient")
  }
});

Template.editIngredientItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var code = $(event.target).find('[name=code]').val().trim();
    var desc = $(event.target).find('[name=desc]').val().trim();
    var supplier = $(event.target).find('[name=supplier]').val().trim();
    var unitOrdered = $(event.target).find('[name=unitOrdered]').val().trim();
    var costperUnit = $(event.target).find('[name=costPerUnit]').val().trim();
    var unitSize = $(event.target).find('[name=unitSize]').val().trim();
    var unit = $(event.target).find('[name=unit]').val().trim();
    var portionUsed = $(event.target).find('[name=portionUsed]').val().trim();

    var info = {
      "description": desc,
      "suppliers": [supplier],
      "unitOrdered": unitOrdered,
      "unitSize": unitSize,
      "costPerUnit": costperUnit,
      "portionUsed": portionUsed,
      "unit": unit
    }
    Meteor.call("editIngredient", code, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
      $("#editIngredientModal").modal("hide");
    });
  }
});