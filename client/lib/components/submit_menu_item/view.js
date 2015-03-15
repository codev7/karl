Template.submitMenuItem.helpers({
  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        var ingredientsList = Ingredients.find({'_id': {$in: ing}});
        return ingredientsList;
      }
    }
  },

  jobItemsList: function() {
    var jobItems = Session.get("selectedJobItems");
    if(jobItems) {
      if(jobItems.length > 0) {
        var jobItemsList = JobItems.find({'_id': {$in: jobItems}}).fetch();
        return jobItemsList
      }
    }
  },
});

Template.submitMenuItem.events({
  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #showJobItemsList': function(event) {
    event.preventDefault();
    $("#jobItemListModal").modal("show");
  },

  'submit form': function(e, instance) {
    e.preventDefault();
    var name = $(event.target).find('[name=name]').val().trim(); 
    var tag = $(event.target).find('[name=tag]').val().trim(); 
    var instructions = FlowComponents.child('menuItemEditorSubmit').getState('content');
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim(); 
    var image = $("#uploadedImageUrl").attr("src");
    var preps = $(event.target).find("[name=prep_qty]").get();
    var ings = $(event.target).find("[name=ing_qty]").get();
    
    var ing_doc = [];
    var ingredientIds = [];
    ings.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && ingredientIds.indexOf(dataid) < 0) {
        var quantity = $(item).val();
        var info = {
          "_id": dataid,
          "quantity": quantity
        }
        ing_doc.push(info);
        ingredientIds.push(dataid);
      }
    });

    var prep_doc = [];
    var jobItemsIds = [];
    preps.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && jobItemsIds.indexOf(dataid) < 0) {
        var quantity = $(item).val();
        var info = {
          "_id": dataid,
          "quantity": quantity
        }
        prep_doc.push(info);
        jobItemsIds.push(dataid);
      }
    });

    if(tag) {
      var tags = [];
      tag = tag.trim().split(",");
      if(tag.length > 0) {
        tag.forEach(function(item) {
          var doc = item.trim();
          if(doc) {
            tags.push(doc);
          }
        });
      }
    }
    if(typeof(parseInt(salesPrice)) != 'number') {
      salesPrice = 0;
    }
    var info = {
      "name": name,
      "tag": tag,
      "instructions": instructions,
      "salesPrice": parseFloat(salesPrice),
      "image": image
    }

    if(ing_doc.length > 0) {
      info.ingredients = ing_doc;
    }
    if(prep_doc.length > 0) {
      info.prepItems = prep_doc;
    }
    console.log(info);
    FlowComponents.callAction('submit', info);
  },

  'click #uploadMenuItem': function(event) {
    event.preventDefault();
    filepicker.pickAndStore({mimetype:"image/*"},{},
      function(InkBlobs){
        var doc = (InkBlobs);
        if(doc) {
          console.log(doc);
          $("#uploadedImageUrl").attr("src", doc[0].url).removeClass("hide");
        }
    });
  }
});

Template.submitMenuItem.rendered = function() {
  Session.set("selectedIngredients", null);
  Session.set("selectedJobItems", null);
}