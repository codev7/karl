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

  categoriesList: function() {
    return Categories.find().fetch();
  }
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

  'submit form': function(event, instance) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val().trim(); 
    var category = $(event.target).find('[name=category]').val().trim(); 
    var status = $(event.target).find('[name=status]').val().trim(); 
    var instructions = FlowComponents.child('menuItemEditorSubmit').getState('content');
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim(); 
    var image = $("#uploadedImageUrl").attr("src");
    var preps = $(event.target).find("[name=prep_qty]").get();
    var ings = $(event.target).find("[name=ing_qty]").get();
    if(!name) {
      return alert("Add a unique name for the menu");
    }
    if(instructions) {
      if($('.note-editable').text() === "Add instructions here" || $('.note-editable').text() === "") {
        instructions = ""
      }
    }
    console.log(instructions);

    var ing_doc = [];
    ings.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && !(ing_doc.hasOwnProperty(dataid))) {
        var quantity = $(item).val();
        if(quantity) {
          quantity = parseFloat(quantity);
          if(quantity == quantity) {
            quantity = quantity;
          } else {
            quantity = 1;
          }
        } else {
          quantity = 1;
        }
        var doc = {
          "_id": dataid,
          "quantity": quantity
        }
        ing_doc.push(doc);
      }
    });

    var prep_doc = [];
    preps.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && !(prep_doc.hasOwnProperty(dataid))) {
        var quantity = $(item).val();
        if(quantity) {
          quantity = parseFloat(quantity);
          if(quantity == quantity) {
            quantity = quantity;
          } else {
            quantity = 1;
          }
        } else {
          quantity = 1;
        }
        var doc = {
          "_id": dataid,
          "quantity": quantity
        }
        prep_doc.push(doc);
      }
    });
    var info = {
      "name": name,
      "instructions": instructions,
      "image": image,
      "ingredients": ing_doc,
      "prepItems": prep_doc,
      "category": category,
      "status": status
    }
    salesPrice = parseFloat(salesPrice);
    salesPrice = Math.round(salesPrice * 100)/100;
    if(salesPrice == salesPrice) {
      info.salesPrice =  salesPrice;
    } else {
      info.salesPrice = 0;
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