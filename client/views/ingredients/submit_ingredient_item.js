Template.submitIngredientItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var code = $(event.target).find('[name=code]').val().trim();
    var desc = $(event.target).find('[name=desc]').val().trim();
    var supplier = $(event.target).find('[name=supplier]').val().trim();
    var portionOrdered = $(event.target).find('[name=portionOrdered]').val().trim();
    var costPerPortion = $(event.target).find('[name=costPerPortion]').val();
    var portionUsed = $(event.target).find('[name=portionUsed]').val().trim();
    var unitSize = $(event.target).find('[name=unitSize]').val().trim();

    var info = {
      "code": code,
      "description": desc,
      "suppliers": [supplier],
      "portionOrdered": portionOrdered,
      "costPerPortion": parseFloat(costPerPortion),
      "portionUsed": portionUsed,
      "unitSize": parseFloat(unitSize)
    }
    Meteor.call("createIngredients", info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
      $("#addIngredientModal").modal("hide");
    });
  }
});