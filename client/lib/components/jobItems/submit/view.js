Template.submitJobItem.helpers({
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

  isPrep: function() {
    var id = Session.get("jobType");
    var type = JobTypes.findOne(id);
    if(type && type.name == "Prep") {
      return true;
    } else {
      return false;
    }
  },

  isRecurring: function() {
    var id = Session.get("jobType");
    var type = JobTypes.findOne(id);
    if(type && type.name == "Recurring") {
      return true;
    } else {
      return false;
    }
  },

  isRecurringDaily: function() {
    var type = Session.get("frequency");
    if(type == "Daily") {
      return true;
    } else {
      return false;
    }
  }
});

Template.submitJobItem.events({
  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  },

  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val().trim();
    var typeId = $(event.target).find('[name=type]').val();
    var typeDoc = JobTypes.findOne(typeId);
    var type = null;
    if(typeDoc) {
      type = typeDoc.name;
    }
    var activeTime = $(event.target).find('[name=activeTime]').val().trim();
    var avgWagePerHour = $(event.target).find('[name=avgWagePerHour]').val().trim();

    if(!name) {
      return alert("Name should have a value");
    } 
    if(!activeTime) {
      return alert("Should have an active time for the job");
    }
    if(!type) {
      return alert("Should have an type for the job");
    }

    var info = {
      "name": name,
      "type": typeId,
      "activeTime": 0,
      "avgWagePerHour": 0
    }
    if(activeTime) {
      activeTime = parseInt(activeTime);
      if((activeTime == activeTime) && (activeTime > 0)) {
        info.activeTime = activeTime;
      } else {
        info.activeTime = 0;
      }
    }

    if(avgWagePerHour) {
      avgWagePerHour = parseFloat(avgWagePerHour);
      if((avgWagePerHour == avgWagePerHour) && (avgWagePerHour > 0)) {
        info.wagePerHour = Math.round(avgWagePerHour * 100)/100;
      } else {
        info.wagePerHour = 0;
      }
    }

    //if Prep
    if(type == "Prep") {
      var portions = $(event.target).find('[name=portions]').val().trim();
      var shelfLife = $(event.target).find('[name=shelfLife]').val().trim();
      var ing = $(event.target).find("[name=ing_qty]").get();
      var recipe = FlowComponents.child('jobItemEditorSubmit').getState('content');

      if(!portions) {
        info.portions = 0;
      } else {
        portions = parseFloat(portions);
        if((portions == portions) && (portions > 0)) {
          info.portions = portions;
        } else {
          info.portions = 0;
        }
      }

      if(!shelfLife) {
        info.shelfLife =  0;
      } else {
        shelfLife = parseFloat(shelfLife)
        if((shelfLife == shelfLife) && (shelfLife > 0)) {
          info.shelfLife = Math.round(shelfLife * 100)/100;
        } else {
          info.shelfLife = 0;
        }
      }
      
      if(recipe) {
        if($('.note-editable').text() === "Add recipe here" || $('.note-editable').text() === "") {
          info.recipe = null;
        } else {
          info.recipe = recipe;
        }
      }

      var ing_doc = [];
      var ingIds = [];
      ing.forEach(function(item) {
        var dataid = $(item).attr("data-id");
        if(dataid && (ingIds.indexOf(dataid) < 0)) {
          var quantity = $(item).val();
          var doc = {
            "_id": dataid,
            "quantity": 1
          }
          if(quantity) {
            quantity = parseFloat(quantity);
            if((quantity == quantity) && (quantity > 0)) {
              doc.quantity = quantity;
            }
          }
          ing_doc.push(doc);
          ingIds.push(dataid);
        }
      });

      if(ing_doc.length > 0) {
        info.ingredients = ing_doc;
      } 
    }

    //if Recurring
    else if(type == "Recurring") {

      var description = FlowComponents.child('jobItemEditorSubmit').getState('content');
      if(description) { 
        if($('.note-editable').text() === "Add description here" || $('.note-editable').text() === "") {
          info.description = "";
        } else {
          info.description = description;
        }
      } 
      //checklist
      var listItems = Session.get("checklist");
      info.checklist = listItems;

      var frequency = $(event.target).find("[name=frequency]").val();
      if(!frequency) {
        return alert("Frequency should be defined");
      }
      info.frequency = frequency;

      var repeatAt = $(event.target).find('[name=repeatAt]').val().trim();
      if(!repeatAt) {
        return alert("Repeat at should be defined");
      }
      info.repeatAt = moment(repeatAt, ["hh:mm A"]).format();

      var startsOn = $(event.target).find('[name=startsOn]').val();
      if(!startsOn) {
        return alert("Starts on should be defined");
      }
      info.startsOn = new Date(startsOn);
      info.endsOn = {
        "on": null
      };
      var endsOn = $(event.target).find('[type=radio]:checked').attr("data-doc");
      info.endsOn.on = endsOn;
      if(endsOn == "endsAfter") {
        var after = $(event.target).find("[name=occurrences]").val();
        if(!after) {
          return alert("No. of occurrences should be defined");
        }
        after = parseInt(after);
        if(after == after) {
          info.endsOn.after = after;
        } else {
          info.endsOn.after = 1;
        }
      } else if(endsOn == "endsOn") {
        var lastDate = $(event.target).find("[name=endsOn]").val();
        if(!lastDate) {
          return alert("Date to be ended on should be defined");
        }
        info.endsOn.lastDate = new Date(lastDate);
      }
      var section = $(event.target).find("[name=sections]").val();
      if(!section) {
        return alert("Section should be defined");
      }
      if(section) {
        info.section = section;
      }

      if(frequency == "Weekly") {
        var repeatDays = [];
        var repeatOn = $(event.target).find('[name=daysSelected]').get();
        repeatOn.forEach(function(doc) {
          if(doc.checked) {
            var value = $(doc).val();
            repeatDays.push(value);
          }
        });
        if(repeatDays.length <= 0) {
          return alert("Days to be repeated should be defined");
        } else {
          info.repeatOn = repeatDays;
        }
      }
    }
    FlowComponents.callAction('submit', info);
  },

  'change .changeType': function(event) {
    event.preventDefault();
    var type = $(event.target).val();
    Session.set("jobType", type);
    Session.set("frequency", "Daily");
  },

  'change .changeFrequency': function(event) {
    event.preventDefault();
    var frequency = $(event.target).val();
    Session.set("frequency", frequency);
  },

  'focus .timepicker': function(event) {
    event.preventDefault();
    $(".timepicker").datetimepicker({
      format: "LT"
    });
  },

  'focus .dateselecter': function(event) {
    event.preventDefault();
    $(".dateselecter").datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        format: "yyyy-mm-dd"
    });
  },

  'keypress .addItemToChecklist': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var item = $(event.target).val().trim();
      if(item) {
        var listItems = Session.get("checklist");
        listItems.push(item);
        Session.set("checklist", listItems);
        var listItem = "<li class='list-group-item'>" + item + "<i class='fa fa-minus-circle m-l-lg right removelistItem'></i></li>"
        $(".checklist").append(listItem);
        $(event.target).val("");
      }
    }
  },

  'click .removelistItem': function(event) {
    event.preventDefault();
    var removing = $(event.target).closest("li").text().trim();
    var listItems = Session.get("checklist");
    if(listItems.length > 0) {
      var index = listItems.indexOf(removing);
      if(index >= 0) {
        listItems.splice(index, 1);
      }
    }
    Session.set("checklist", listItems);
    var item = $(event.target).closest("li").remove();
  }
});

Template.submitJobItem.rendered = function() {
  Session.set("jobType", "Prep");
  Session.set("frequency", "Daily");
  Session.set("checklist", []);
}