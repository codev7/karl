var component = FlowComponents.define('editMenuItem', function(props) {
  var id = Router.current().params._id;
  if(id) {
    var item = MenuItems.findOne(id);
    if(item) {
      this.item = item;
    }
  }
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

component.state.id = function() {
  return this.item._id;
}

component.state.name = function() {
  return this.item.name;
}

component.state.isMyCategory = function(categoryId) {
  if(categoryId) {
    if(categoryId == this.item.category) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isMyStatus = function(status) {
  if(status) {
    if(status == this.item.status) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.jobItems = function() {
  return this.item.jobItems;
}

component.state.ingredients = function() {
  return this.item.ingredients;
}

component.state.salePrice = function() {
  return this.item.salesPrice;
}

component.state.image = function() {
  return this.item.image;
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
                  var str = "<strong>" + key + "</strong> was " + Categories.findOne(menuBefore[key]).name + " and updated to be " + Categories.findOne(info[key]).name;  
                } else {
                  var str = "<strong>" + key + "</strong> was " + menuBefore[key] + " and updated to be " + info[key];
                }
                if(desc) {
                  desc = desc + "<br>" + str;
                } else {
                  desc = str;
                }
              }
            }
          }
        }
      }
      Meteor.call("sendNotifications", 'menulist', id, desc, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
      Router.go("menuItemDetail", {"_id": id});
    }
  });
};