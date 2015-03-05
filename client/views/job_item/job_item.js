Template.jobItem.helpers({
  'cost': function() {
    var item = this;
    var cost = 0;
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
    return parseFloat(cost).toFixed(2);
  }
});

Template.jobItem.events({
  'click .deleteJobItem': function(event) {
    event.preventDefault();
    if(this) {
      Meteor.call("deleteJobItem", this._id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});