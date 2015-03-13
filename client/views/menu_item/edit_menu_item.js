Template.editMenuItem.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      var item = MenuItems.findOne(id);
      if(item) {
        if(item.salesPrice) {
          item.tax = parseFloat(item.salesPrice * 10)/100;
          item.tax = Math.round(item.tax * 100)/100;
        }
        return item;
      }
    }
  },

  jobItemsList: function() {
    var jobItems = Session.get("selectedJobItems");
    if(jobItems) {
      if(jobItems.length > 0) {
        var jobItemsList = JobItems.find({'_id': {$in: jobItems}}).fetch();
        return jobItemsList;
      }
    }
  },

  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        var ingredientsList = Ingredients.find({'_id': {$in: ing}}).fetch();
        return ingredientsList;
      }
    }
  },
});

Template.editMenuItem.events({
  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  },

  'click #addNewJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click #showJobItemsList': function(event) {
    event.preventDefault();
    $("#jobItemListModal").modal("show");
  },

  'submit form': function(event) {
    event.preventDefault();
    var id = Session.get("thisMenuItem");
    var name = $(event.target).find('[name=name]').val().trim(); 
    var tag = $(event.target).find('[name=tag]').val().trim(); 
    var instructions = $(event.target).find('[name=instructions]').val().trim(); 
    var preps = $(event.target).find("[name=prep_qty]").get();;
    var ings = $(event.target).find("[name=ing_qty]").get();
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim(); 
    var image = [];
    var info = {
      "name": name,
      "tag": tag,
      "instructions": instructions,
      "salesPrice": parseFloat(salesPrice)
    }

    var prep_doc = [];
    var jobItemsIds = [];
    preps.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && jobItemsIds.indexOf(dataid) < 0) {
        var quantity = $(item).val();
        if(quantity > 0) {
          var info = {
            "_id": dataid,
            "quantity": quantity
          }
          prep_doc.push(info);
          jobItemsIds.push(dataid);
        }
      }
    });

    var ing_doc = [];
    var ingredientIds = [];
    ings.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && ingredientIds.indexOf(dataid) < 0) {
        var quantity = $(item).val();
        if(quantity > 0) {
          var info = {
            "_id": dataid,
            "quantity": quantity
          }
          ing_doc.push(info);
          ingredientIds.push(dataid);
        }
      }
    });

    if(prep_doc.length > 0) {
      info.jobItems = prep_doc;
    }
    if(ing_doc.length > 0) {
      info.ingredients = ing_doc;
    }

    Meteor.call("editMenuItem", id, info, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        Router.go("menuItemsMaster");
      }
    });
  }
});

Template.editMenuItem.rendered = function() {
  Session.set("selectedIngredients", null);
  Session.set("selectedJobItems", null);
}
