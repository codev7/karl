Template.showJobItemsList.helpers({
  jobItemsList: function() {
    var list = JobItems.find().fetch();
    list.forEach(function(jobItem) {
      jobItem.totalCost = 0;
      jobItem.costPerPortion = 0;
      if(jobItem.ingredients.length > 0) {
        jobItem.ingredients.forEach(function(doc) {
          var ing = Ingredients.findOne(doc.id);
          var cost = 0;
          if(ing) {
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
              var calc_cost = cost * doc.quantity
              jobItem.totalCost += calc_cost;
            }
          }
          jobItem.costPerPortion = parseFloat(jobItem.totalCost/jobItem.portions);
        });
      }
    });
    return list;
  },
});

var selectedJobItems = [];
Template.showJobItemsList.events({
  'click .selectedPrep': function(event) {
    var item = $(event.target).attr("data-id");
    var qty = $(event.target).parent().parent().find("input[type=text]").val();
    var index = selectedJobItems.indexOf(item);
    var isChecked = $(event.target)[0].checked;
    if(index < 0) {
      if(isChecked) {
        selectedJobItems.push(item);
      }
    } else {
      if(!isChecked) {
        selectedJobItems.splice(index, 1)
      } 
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    if(selectedJobItems.length > 0) {
      Session.set("selectedJobItems", selectedJobItems);
    }
    $("#jobItemListModal").modal("hide");
  }
});