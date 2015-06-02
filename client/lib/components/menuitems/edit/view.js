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
      if($('.note-editable').text() === "Add instructions here" || $('.note-editable').text() === "") {
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
    preps.forEach(function(item) {
      var dataid = $(item).attr("data-id");
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

      if(dataid && !(prep_doc.hasOwnProperty(dataid))) {
        if(menu.jobItems.hasOwnProperty(dataid)) {
          if(menu.jobItems[dataid] != quantity) {
            prep_doc.push(doc);
          }
        } else {
          prep_doc.push(doc);
        }
      } else {
        prep_doc.push(doc);
      }
    });

    var ing_doc = [];
    ings.forEach(function(item) {
      var dataid = $(item).attr("data-id");
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
      if(dataid && !(ing_doc.hasOwnProperty(dataid))) {
        if(menu.ingredients.hasOwnProperty(dataid)) {
          if(menu.ingredients[dataid] != quantity) {
            ing_doc.push(doc);
          }
        } else {
          ing_doc.push(doc);
        }
      } else {
        ing_doc.push(doc);
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
             var options = {
              "type": "delete",
              "title": "Menu " + item.name + " has been deleted",
              "time": Date.now()
            }
            Meteor.call("sendNotifications", id, "menu", options, function(err) {
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
