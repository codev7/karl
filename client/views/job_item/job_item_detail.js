Template.jobItemDetail.helpers({
  item: function() {
    var id = Session.get("thisJobItem");
    var item = JobItems.findOne(id);
    if(item.ingredients || item.ingredients.length > 0) {
      item.ingredients.forEach(function(doc) {
        var ing = Ingredients.findOne(doc.id);
        doc.cost = 0;
        var cost = 0;
        if(ing) {
          doc.portionUsed = ing.portionUsed;
          doc.desc = ing.description;
          if(ing.unit == "each") {
            cost = parseFloat(ing.costPerUnit)/parseInt(ing.unitSize)
          }  else {
            var unitId = ing.unit + "-" + ing.portionUsed;
            var conversion = Conversions.findOne(unitId);
            if(conversion) {
              var convertedCount = parseInt(conversion.count);
              if(ing.unitSize > 1) {
                convertedCount = (convertedCount * parseInt(ing.unitSize));
              }
              cost = parseFloat(ing.costPerUnit)/convertedCount;
            } else {
              cost = 0;
              console.log("Convertion not defined");
            }
          }
          var calc_cost = (cost * parseFloat(doc.quantity));
          doc.cost += calc_cost;
          doc.cost = Math.round(doc.cost * 100)/100;
        }
      });
    }
    return item;
  }
});

Template.jobItemDetail.events({
  'click .editJobItemBtn': function(event) {
    event.preventDefault();
    Router.go("jobItemEdit", {'_id': Session.get("thisJobItem")});
  }
});