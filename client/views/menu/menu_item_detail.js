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
            doc.cost = parseInt(ing.unitPrice) * doc.quantity;
            item.ingCost += doc.cost;
          }
        });
      }
      if(item.jobItems) {
        if(item.jobItems.length > 0) {
          item.jobItems.forEach(function(doc) {
            var jobitem = JobItems.findOne(doc.id);
            if(jobitem) {
              doc.name = jobitem.name;
              doc.cost = 0;
              if(jobitem.ingredients.length > 0) {
                jobitem.ingredients.forEach(function(ing_item) {
                  var ing = Ingredients.findOne(ing_item.id);
                  if(ing) {
                    doc.cost += parseInt(ing.unitPrice) * ing_item.quantity;
                  }
                });
              }
            }
            item.prepCost += doc.cost;
          });
        }
      }
      if(item.salesPrice) {
        item.tax = parseInt(item.salesPrice * 10)/100;
      }
      var totalCost = (item.prepCost + item.ingCost + item.tax);
      item.contribution = (item.salesPrice - totalCost);
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