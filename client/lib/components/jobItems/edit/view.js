Template.editJobItem.helpers({
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

  jobTypes: function() {
    return JobTypes.find().fetch();
  }
});

Template.editJobItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var id = Session.get("thisJobItem");
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

    var job = JobItems.findOne(id);
    Session.set("updatingJob", job);

    if(job) {
      var info = {};
      if(job.name != name) {
        info.name = name;
      }
      if(type) {
        info.type = type;
      }

      activeTime = parseInt(activeTime);
      if((job.activeTime/60) != activeTime) {
        if(activeTime == activeTime) {
          info.activeTime = activeTime;
        } else {
          info.activeTime = 0;
        }
      }

      avgWagePerHour = parseFloat(avgWagePerHour);
      avgWagePerHour =  Math.round(avgWagePerHour * 100)/100;
      if((job.wagePerHour) != avgWagePerHour) {
        if(avgWagePerHour == avgWagePerHour) {
          info.wagePerHour = avgWagePerHour;
        } else {
          info.wagePerHour = 0;
        }
      }

      //if Prep
      if(type == "Prep") {
        var portions = $(event.target).find('[name=portions]').val().trim();
        var shelfLife = $(event.target).find('[name=shelfLife]').val().trim();
        var ing = $(event.target).find("[name=ing_qty]").get();
        var recipe = FlowComponents.child('jobItemEditorEdit').getState('content');

        portions = parseInt(portions);
        if(job.portions != portions) {
          if(portions == portions) {
            info.portions = portions;
          } else {
            info.portions = 0;
          }
        }

        shelfLife = parseFloat(shelfLife);
        if(job.shelfLife != shelfLife) {
          if(shelfLife == shelfLife) {
            info.shelfLife = shelfLife;
          } else {
            info.shelfLife = 0;
          }
        }

        if(job.recipe != recipe) {
          if($('.note-editable').text() === "Add recipe here" || $('.note-editable').text() === "") {
            info.recipe = "";
          } else {
            info.recipe = recipe;
          }
        }
        
        var ing_doc = [];
        ing.forEach(function(item) {
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
          if(dataid) {
            if(job.ingredients.hasOwnProperty(dataid)) {
              if(job.ingredients[dataid] != quantity) {
                var doc = {
                  "_id": dataid,
                  "quantity": quantity
                }
                ing_doc.push(doc);
              }
            } else {
              var doc = {
                "_id": dataid,
                "quantity": quantity
              }
              ing_doc.push(doc);
            }
          }
        });

        if(ing_doc.length > 0) {
          info.ingredients = ing_doc;
        } 
      }

      //if Recurring
      else if(type == "Recurring") {
        var description = FlowComponents.child('jobItemEditorEdit').getState('content');
        if(job.description != description) {
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
        if(job.frequency != frequency) {
          info.frequency = frequency;
        }

        var repeatAt = $(event.target).find('[name=repeatAt]').val().trim();
        if(job.repeatAt != repeatAt) {
          info.repeatAt = repeatAt;
        }
        var startsOn = $(event.target).find('[name=startsOn]').val();
        startsOn = new Date(startsOn);
        if(moment(job.startsOn).format("YYYY-MM-DD") != moment(startsOn).format("YYYY-MM-DD")) {
          info.startsOn = startsOn;
        }
        var endsOn = $(event.target).find('[type=radio]:checked').attr("data-doc");
        if(job.endsOn && job.endsOn.on != endsOn) {
          info.endsOn = {
            "on": endsOn
          }
        } 
        if(endsOn == "endsAfter") {
          var after = $(event.target).find("[name=occurrences]").val();
          after = parseInt(after);
          if(after == after) {
            if(job.endsOn && job.endsOn.after != after) {
              info.endsOn['after'] = after;
            } else {
              info.endsOn['after'] = 1;
            }
          } else {
            info.endsOn['after'] = 1;
          }
        } else if(endsOn == "endsOn") {
          var lastDate = $(event.target).find("[name=endsOn]").val();
          if(job.endsOn && moment(job.endsOn.lastDate).format("YYYY-MM-DD") != lastDate) {
            info.endsOn['lastDate'] = new Date(lastDate);
          }
        }
        var section = $(event.target).find("[name=sections]").val();
        if(job.section && job.section != section) {
          info.section = section;
        }

        if(frequency == "Weekly") {
          var repeatDays = [];
          var repeatOn = $(event.target).find('[name=daysSelected]').get();
          repeatOn.forEach(function(doc) {
            if(doc.checked) {
              var value = $(doc).val();
              if(job.repeatOn.indexOf(value) < 0) {
                repeatDays.push(value);
              }
            }
          });
          info.repeatOn = repeatDays;
        }
      }
      FlowComponents.callAction('submit', id, info);
    }
  },

  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  },

  'click .deleteJobItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var item = JobItems.findOne(id);
    var result = confirm("Are you sure you want to delete this job ?");
    if(result) {
      Meteor.call("deleteJobItem", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          var options = {
            "type": "delete",
            "title": "Job " + item.name + " has been deleted",
            "time": Date.now()
          }
          Meteor.call("sendNotifications", id, "job", options, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
          });
          Router.go("jobItemsMaster");
        }
      });
    }
  },

  'click .cancelEditJobItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Router.go("jobItemDetailed", {"_id": id});
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

Template.editJobItem.rendered = function() {
  Session.set("selectedIngredients", null);
  Session.set("jobType", null);
  Session.set("frequency", null);
}