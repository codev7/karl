Template.submitMenuItem.helpers({
  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        Meteor.subscribe("ingredients", ing);
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

    if(!name) {
      return alert("Add a unique name for the menu");
    }
    if(instructions) {
      if($('.ql-editor').text() === "Add instructions here" || $('.ql-editor').text() === "") {
        instructions = ""
      }
    }

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

    var tags = [];
    if(tag) {
      tag = tag.trim().split(",");
      if(tag.length > 0) {
        tag.forEach(function(item) {
          if(item.trim()) {
            tags.push(item.trim());
          }
        });
      }
    }
    var info = {
      "name": name,
      "instructions": instructions,
      "image": image,
      "ingredients": ing_doc,
      "prepItems": prep_doc,
      "tag": tags
    }
    salesPrice = parseFloat(salesPrice);
    if(!salesPrice || typeof(salesPrice) != "number") {
      info.salesPrice =  0;
    } else {
      if(salesPrice === NaN) {
        info.salesPrice = 0;
      } else {
        info.salesPrice = Math.round(salesPrice * 100)/100;
      }
    }
    FlowComponents.callAction('submit', info);
  },

  'click #uploadMenuItem': function(event) {
    event.preventDefault();
    filepicker.pickAndStore({mimetype:"image/*"}, {},
      function(InkBlobs){
        var doc = (InkBlobs);
        if(doc) {
          $(".uploadedImageDiv").removeClass("hide");
          $("#uploadedImageUrl").attr("src", doc[0].url);
        }
    });
  }
});

Template.submitMenuItem.rendered = function() {
  Session.set("selectedIngredients", null);
  Session.set("selectedJobItems", null);
}