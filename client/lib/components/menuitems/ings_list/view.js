Template.showListOfIngs.events({
  'submit form': function(event) {
    event.preventDefault();
    var menuId = Session.get("thisMenuItem");
    var prep_items = $(event.target).find("[name=selectedPrep]").get();
    var ing_items = $(event.target).find("[name=selectedIng]").get();
    var info = {};
    
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
    console.log("prep_items..........", prep_items_doc);

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
    console.log("ing_items.........", ing_items_doc);
    // var alreadySelected = Session.get("selectedJobItems");
    // if(alreadySelected && alreadySelected.length > 0) {
    //   prep_items_doc = prep_items_doc.concat(alreadySelected);  
    // } 
    if(prep_items_doc.length > 0) {
      info.jobItems = prep_items_doc;
    } 
    if(ing_items_doc.length > 0) {
      info.ingredients = ing_items_doc;
    }
    if(info.ingredients || info.jobItems) {
      Meteor.call("editMenuItem", menuId, info, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
        }
      })
    }
    $("#showListOfIngs").modal("hide");
    // $(event.target).find('[type=checkbox]').attr('checked', false);
    // $("#searchText-box").val("");
    // $("#jobItemListModal").modal("hide");
    // FlowComponents.callAction('submit');
  },
});