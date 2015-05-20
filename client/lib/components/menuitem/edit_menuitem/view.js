Template.editMenuItem.helpers({
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
        Meteor.subscribe("ingredients", ing);
        var ingredientsList = Ingredients.find({'_id': {$in: ing}}).fetch();
        return ingredientsList;
      }
    }
  },

  categoriesList: function() {
    return Categories.find().fetch();
  },

  statusList: function() {
    var list = [
      {'status': 'Active', 'value': 'active'},
      {'status': 'Ideas', 'value': 'ideas'},
      {'status': 'Archived', 'value': 'archived'}
    ]
    return list;
  }
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
    var category = $(event.target).find('[name=category]').val().trim(); 
    var status = $(event.target).find('[name=status]').val().trim(); 
    var instructions = FlowComponents.child('menuItemEditorEdit').getState('content'); 
    var preps = $(event.target).find("[name=prep_qty]").get();;
    var ings = $(event.target).find("[name=ing_qty]").get();
    var salesPrice = $(event.target).find('[name=salesPrice]').val().trim(); 
    var image = $("#uploadedImageUrl").attr("src");

    var menu = MenuItems.findOne(id);
    Session.set("updatingMenu", menu);
    if(!name) {
      return alert("Add a unique name for the menu");
    }
    if(instructions) {
      if($('.ql-editor').text() === "Add instructions here" || $('.ql-editor').text() === "") {
        instructions = ""
      }
    }
    var info = {};
    if(menu.name != name) {
      info.name = name;
    }
    if(menu.instructions != instructions) {
      info.instructions = instructions;
    }
    if(menu.status != status) {
      info.status = status;
    }
    if(menu.image != image) {
      info.image = image;
    }

    salesPrice = parseFloat(salesPrice);
    salesPrice = Math.round(salesPrice * 100)/100;
    if(menu.salesPrice != salesPrice) {
      if(salesPrice == salesPrice) {
        info.salesPrice = salesPrice;
      }
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
    
    info.jobItems = prep_doc;
    info.ingredients = ing_doc;
    if(menu.category != category) {
      info.category = category;
    }
    FlowComponents.callAction('submit', id, info);
  },

  'click #uploadMenuItem': function(event) {
    event.preventDefault();
    filepicker.pickAndStore({mimetype:"image/*"}, {},
      function(InkBlobs){
        var doc = (InkBlobs);
        if(doc) {
          $(".uploadedNewImageDiv").removeClass("hide");
          $("#uploadedImageUrl").attr("src", doc[0].url);
        }
    });
  },

  'click .deleteMenuItemBtn': function(e) {
    e.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if(result) {
      var id = $(event.target).attr("data-id");
      var item = MenuItems.findOne(id);
      
      if(id) {
        Meteor.call("deleteMenuItem", id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            Meteor.call("sendNotifications", "deleteMenu", item, null, function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
            });
            Router.go("menuItemsMaster", {"category": "all", "status": "all"});
          }
        });
      }
    }
  },

  'click .cancelBtn': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Router.go("menuItemDetail", {"_id": id});
  }
});
