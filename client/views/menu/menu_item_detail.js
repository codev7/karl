Template.menuItemDetail.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      var item = MenuItems.findOne(id);
      item.ingCost = 0;
      item.prepCost = 0;
      item.contribution = 0;
      if(item.ingredients.length > 0) {
        item.ingredients.forEach(function(doc) {
          var ing = Ingredients.findOne(doc.id);
          if(ing) {
            doc.desc = ing.description;
            doc.cost = parseFloat(ing.unitPrice) * doc.quantity;
            item.ingCost += doc.cost;
          }
        });
      }
      if(item.jobItems) {
        if(item.jobItems.length > 0) {
          item.jobItems.forEach(function(doc) {
            var jobitem = JobItems.findOne(doc.id);
            jobitem.prepCostPerPortion = 0;
            if(jobitem) {
              // console.log(jobitem);
              doc.name = jobitem.name;
              doc.cost = 0;
              if(jobitem.ingredients.length > 0) {
                jobitem.ingredients.forEach(function(ing_item) {
                  var ing = Ingredients.findOne(ing_item.id);
                  if(ing) {
                    doc.cost += parseFloat(ing.unitPrice) * ing_item.quantity;
                  }
                });
                doc.prepCostPerPortion = parseFloat(doc.cost)/parseInt(jobitem.portions);
                item.prepCost += doc.cost;
              }
            }
          });
        }
      }
      if(item.salesPrice) {
        item.tax = parseFloat(item.salesPrice * 10)/100;
      }
      var totalCost = parseFloat(parseFloat(item.prepCost) + parseFloat(item.ingCost) + parseFloat(item.tax));
      item.contribution = parseFloat(item.salesPrice - totalCost);
      console.log("---------", item)
      return item;
    }
  }
});

Template.menuItemDetail.events({
  'click .editBtn': function(e) {
    e.preventDefault();
    Router.go("menuItemEdit", {"_id": $(e.target).attr("data-id")})
  }
});

Template.menuItemDetail.rendered = function() {
}