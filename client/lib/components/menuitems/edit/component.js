var component = FlowComponents.define('editMenuItem', function(props) {
  this.id = Router.current().params._id;
  this.onRendered(this.onMenuRendered);
});

component.state.initialHTML = function() {
  var id = Session.get("thisMenuItem");
  var item = MenuItems.findOne(id);
  if(item) {
    if(item.instructions) {
      return item.instructions;
    } else {
      return "Add instructions here"
    }
  }
};

component.prototype.onMenuRendered = function() {
  this.item = MenuItems.findOne(this.id);
}

component.state.menu = function() {
  this.item = MenuItems.findOne(this.id);
  if(this.item) {
    return this.item;
  }
}

component.state.myCategory = function(categoryId) {
  var myCategory = this.item.category;
  if(myCategory) {
    return Categories.findOne(myCategory);
  }
}


component.state.categoriesList = function() {
  var myCategory = this.item.category;
  if(myCategory) {
    return Categories.find({"_id": {$nin: [myCategory]}}).fetch();
  }
}

component.state.jobItemsList = function() {
  var jobItems = Session.get("selectedJobItems");
  if(jobItems) {
    if(jobItems.length > 0) {
      var jobItemsList = JobItems.find({'_id': {$in: jobItems}}).fetch();
      return jobItemsList;
    }
  }
}

component.state.ingredientsList = function() {
  var ing = Session.get("selectedIngredients");
  if(ing) {
    if(ing.length > 0) {
      Meteor.subscribe("ingredients", ing);
      var ingredientsList = Ingredients.find({'_id': {$in: ing}}).fetch();
      return ingredientsList;
    }
  }
}
component.state.statusList = function() {
  var myStatus = this.item.status;
  var list = null;
  if(myStatus) {
    list = Statuses.find({"name": {$nin: [myStatus]}}).fetch();
  }
  return list;
}

component.action.submit = function(id, info) {
  Meteor.call("editMenuItem", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      var desc = null;
      if(info) {
        var menuBefore = Session.get("updatingMenu");
        if(menuBefore) {
          for (var key in info) {
            if (info.hasOwnProperty(key)) {
              if(key != "jobItems" && key != "ingredients") {
                if(key == "category") {
                  var str = key + " changed from " + Categories.findOne(menuBefore[key]).name + " to " + Categories.findOne(info[key]).name + ".</br>";  
                } else {
                  var str =  key;
                  if(key == "image") {
                    if(menuBefore[key]) {
                      str += " changed from <img src='" + menuBefore[key] + "'/> to <img src='" + info[key] + "'/><br>";
                    } else {
                      str += " updated to be <img src='" + info[key] + "'/><br>";  
                    }
                  } else {
                    if(menuBefore[key]) {
                      str += " changed from '" + menuBefore[key] + "' to '" + info[key] + "'.<br>";
                    } else {
                      str += " updated to be " + info[key] + "'.<br>";  
                    }
                  }
                }
                if(desc) {
                  desc += str;
                } else {
                  desc = str;
                }
              }
            }
          }
        }
      }
     var options = {
      "type": "edit",
      "title": menuBefore.name + " has been updated",
      "text": desc
    }
    Meteor.call("sendNotifications", id, "menu", options, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    }); 
      Router.go("menuItemDetail", {"_id": id});
    }
  });
};