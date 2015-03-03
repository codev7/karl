Template.showIngredientsList.helpers({
  ingredientsList: function() {
    var list = Ingredients.find().fetch();
    return list;
  },
});

var selectedIngredients = [];
Template.showIngredientsList.events({
  'click .selectedIng': function(event) {
    var item = $(event.target).attr("data-id");
    var qty = $(event.target).parent().parent().find("input[type=text]").val();
    // console.log(qty);
    var index = selectedIngredients.indexOf(item);
    var isChecked = $(event.target)[0].checked;
    if(index < 0) {
      if(isChecked) {
        selectedIngredients.push(item);
      }
    } else {
      if(!isChecked) {
        console.log("...remove.");
        selectedIngredients.splice(index, 1)
      } 
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    if(selectedIngredients.length > 0) {
      console.log("selectedIngredients", selectedIngredients);
      Session.set("selectedIngredients", selectedIngredients);
    }
    $("#ingredientsListModal").modal("hide");
    var doc = [];
    var id = Session.get("thisMenuItem");
    var allInputs = $(event.target).find('[name=ingredient_quantity]').get();
    var allChecks = $(event.target).find('[name=selectedIng]').get();
    allChecks.forEach(function(item) {
      if($(item)[0].checked) {
        var dataid = $(item).attr("data-id");
        allInputs.forEach(function(inputItem) {
          if($(inputItem).attr("data-id") == dataid) {
            var info = {
              "id": dataid,
              "quantity": $(inputItem).val()
            }
            doc.push(info);
          }
        });
      }
    });
    if(doc.length > 0) {
      Meteor.call("addIngredients", id, doc, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          $("#ingredientsListModal").modal("hide");
        }
      });
      
    }
  }
});