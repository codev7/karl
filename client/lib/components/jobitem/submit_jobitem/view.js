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
    var type = Session.get("jobType");
    if(type == "Prep") {
      return true;
    } else {
      return false;
    }
  },

  isRecurring: function() {
    var type = Session.get("jobType");
    if(type == "Recurring") {
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
    var type = $(event.target).find('[name=type]').val();
    var activeTime = $(event.target).find('[name=activeTime]').val().trim();
    var avgWagePerHour = $(event.target).find('[name=avgWagePerHour]').val().trim();

    if(!name) {
      return alert("Name should have a value");
    } 
    if(!activeTime) {
      return alert("Should have an active time for the job");
    }

    var info = {
      "name": name,
      "type": type,
      "activeTime": activeTime,
      "avgWagePerHour": 0
    }
    
    if(!avgWagePerHour || typeof(parseFloat(avgWagePerHour)) != "number") {
      info.wagePerHour =  0;
    } else {
      info.wagePerHour = parseFloat(avgWagePerHour);
      info.wagePerHour = Math.round(info.wagePerHour * 100)/100;
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
        info.portions = parseInt(portions);
      }
      info.portions = portions;


      shelfLife = parseFloat(shelfLife)
      if(!shelfLife || typeof(shelfLife) != "number") {
        info.shelfLife =  0;
      } else {
        if(shelfLife === NaN) {
          info.shelfLife = 0;
        }
        info.shelfLife = Math.round(shelfLife * 100)/100;
      }
      
      if(recipe) {
        if($('.ql-editor').text() === "Add recipe here" || $('.ql-editor').text() === "") {
          info.recipe = ""
        } else {
          info.recipe = recipe;
        }
      }

      var ing_doc = [];
      var ingIds = [];
      ing.forEach(function(item) {
        var dataid = $(item).attr("data-id");
        if(dataid && ingIds.indexOf(dataid) < 0) {
          var quantity = $(item).val();
          if(quantity > 0) {
            var info = {
              "_id": dataid,
              "quantity": quantity
            }
            ing_doc.push(info);
            ingIds.push(dataid);
          }
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
        if($('.ql-editor').text() === "Add description here" || $('.ql-editor').text() === "") {
          info.description = ""
        } else {
          info.description = description;
        }
      }
      var frequency = $(event.target).find("[name=frequency]").val();
      info.frequency = frequency;
      var repeatAt = $(event.target).find('[name=repeatAt]').val().trim();
      info.repeatAt = repeatAt;
      var startsOn = $(event.target).find('[name=startsOn]').val();
      info.startsOn = new Date(startsOn);
      info.endsOn = {};
      var endsOn = $(event.target).find('[type=radio]:checked').attr("data-doc");
      info.endsOn.on = endsOn;
      if(endsOn == "endsAfter") {
        var after = $(event.target).find("[name=occurrences]").val();
        info.endsOn.after = parseInt(after);
      } else if(endsOn == "endsOn") {
        var lastDate = $(event.target).find("[name=endsOn]").val();
        info.endsOn.lastDate = new Date(lastDate);
      }
      var section = $(event.target).find("[name=sections]").val();
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
        info.repeatOn = repeatDays;
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
    $(".dateselecter").datetimepicker({
      format: "YYYY-MM-DD"
    });
  }
});

Template.submitJobItem.rendered = function() {
  Session.set("jobType", "Prep");
  Session.set("frequency", "Daily");
}

Tracker.autorun(function() {
  if(Session.get("thisJobItem") == null) {
    return Meteor.subscribe("ingredients", []);
  }
});