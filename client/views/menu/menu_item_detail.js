Template.menuItemDetail.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      var item = MenuItems.findOne(id);
      if(item.ingredients.length > 0) {
        item.ingredients.forEach(function(doc) {
          var ing = Ingredients.findOne(doc.id);
          doc.desc = ing.description;
          doc.cost = parseInt(ing.unitPrice) * doc.quantity;
        });
      }
      if(item.jobItems.length > 0) {
        item.jobItems.forEach(function(doc) {
          var jobitem = JobItems.findOne(doc.id);
          doc.name = jobitem.name;
          // doc.cost = parseInt(jo  /bitem.unitPrice) * doc.quantity;
        });
      }
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