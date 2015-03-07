Template.jobItemEdit.helpers({
  costPerPortion: function() {
    console.log(this);
    var cost = 0;
    var costOfPortion = 0;
    var item = this;
    if(item && item.ingredients) {
      if(item.ingredients.length > 0) {
        item.ingredients.forEach(function(doc) {
          if(doc.id) {
            var ing_doc = Ingredients.findOne(doc.id);
            var costPerPortion = 0;
            if(ing_doc.unit == "each") {
              costPerPortion = parseFloat(ing_doc.costPerUnit)/parseInt(ing_doc.unitSize)
            }  else {
              var unitId = ing_doc.unit + "-" + ing_doc.portionUsed;
              var conversion = Conversions.findOne(unitId);
              if(conversion) {
                var convertedCount = parseInt(conversion.count);
                if(ing_doc.unitSize > 1) {
                  convertedCount = (convertedCount * parseInt(ing_doc.unitSize));
                }
                costPerPortion = parseFloat(ing_doc.costPerUnit)/convertedCount;
              } else {
                costPerPortion = "Convertion not defined"
              }
            }
            var calc_cost = costPerPortion * doc.quantity
            cost += calc_cost;
          }
        });
      }
    }
    costOfPortion = Math.round((cost/item.portions) * 100)/100;
    return costOfPortion;
  }
});

Template.jobItemEdit.events({
  'click .removePrep': function(event) {
    event.preventDefault();
    var routename = Router.current().route.getName();
    var id = $(event.target).attr("data-id");
    if(routename == "menuItemEdit") {
      var menuId = Session.get("thisMenuItem");
      if(id) {
        // Meteor.call("removeIngredients", menuId, id, function(err) {
        //   if(err) {
        //     console.log(err);
        //     return alert(err.reason);
        //   }
        // });
      } else {
        var item = $(event.target).parent().parent();
        $(item).remove();
      }
    } else if(routename == "jobItemEdit") {
      var jobId = Session.get("thisJobItem");
      if(id) {
        // Meteor.call("removeIngredientsFromJob", jobId, id, function(err) {
        //   if(err) {
        //     console.log(err);
        //     return alert(err.reason);
        //   }
        // });
      } else {
        var item = $(event.target).parent().parent();
        $(item).remove();
      }
    }
  }
});