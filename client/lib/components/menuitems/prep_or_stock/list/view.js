Template.showListOfIngs.events({
  "keyup #searchText-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),


  'submit form': function(event) {
    event.preventDefault();
    var menuId = Session.get("thisMenuItem");
    var prep_items = $(event.target).find("[name=selectedPrep]").get();
    var ing_items = $(event.target).find("[name=selectedIng]").get();
    
    var prep_items_doc = [];
    prep_items.forEach(function(prep) {
      var dataid = $(prep).attr("data-id");
      var check = $(prep).is(':checked');
      if(dataid && check) {
        var doc = {
          "_id": dataid,
          "quantity": 1
        }
        prep_items_doc.push(doc);
      }
    });

    var ing_items_doc = [];
    ing_items.forEach(function(ing) {
      var dataid = $(ing).attr("data-id");
      var check = $(ing).is(':checked');
      if(dataid && check) {
        var doc = {
          "_id": dataid,
          "quantity": 1
        }
        ing_items_doc.push(doc);
      }
    });
  
    var prep_result = false;
    var ing_result = false;
    if(prep_items_doc.length > 0) {
      Meteor.call("addJobItem", menuId, prep_items_doc, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          prep_result = true;
        }
      });
    } else {
      prep_result = true;
    }

    if(ing_items_doc.length > 0) {
      Meteor.call("addIngredients", menuId, ing_items_doc, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          ing_result = true;
        }
      });
    } else {
      ing_result = true;
    }
    
    $("#showListOfIngs").modal("hide");
    if($(".modal-backdrop").length > 0) {
      $(".pace-done").removeClass("modal-open");
      $(".modal-backdrop").remove();
    }
    Meteor.subscribe("menuItem", menuId);
  },
});