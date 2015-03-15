Template.menuItemDetail.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      var item = MenuItems.findOne(id);
      item.totalIngCost = 0;
      item.totalPrepCost = 0;
      item.contribution = 0;
      if(item.ingredients) {
        if(item.ingredients.length > 0) {
          item.ingredients.forEach(function(doc) {
            var ing = getIngredientItem(doc._id);
            if(ing) {
              ing.totalCost = ing.costPerPortionUsed * doc.quantity;
              item.totalIngCost += ing.totalCost;
            }
          });
        }
      }
      if(item.jobItems) {
        if(item.jobItems.length > 0) {
          item.jobItems.forEach(function(doc) {
            var jobitem = getPrepItem(doc._id);
            if(jobitem) {
              jobitem.totalCost = jobitem.prepCostPerPortion * doc.quantity;
              item.totalPrepCost += jobitem.totalCost;
            }
          });
        }
      }
      if(item.salesPrice) {
        item.tax = parseFloat(item.salesPrice * 10)/100;
        item.tax = Math.round(item.tax * 100)/100;
      }
      var totalCost = parseFloat(parseFloat(item.totalIngCost) + item.totalPrepCost + item.tax);
      item.contribution = parseFloat(item.salesPrice - totalCost);
      item.contribution = Math.round(item.contribution * 100)/100;
      return item;
    }
  }
});

Template.menuItemDetail.events({
  'click .editMenuItemBtn': function(e) {
    e.preventDefault();
    Router.go("menuItemEdit", {"_id": $(e.target).attr("data-id")})
  }
});