var component = FlowComponents.define("pageHeading", function(props) {
  this.title = props.title;
  this.category = props.category;
  this.type = props.name;
  this.id = props.id;
});

component.state.title = function() {
  return this.title;
} 

component.state.category = function() {
  return this.category;
}

component.state.id = function() {
  return this.id;
}

component.state.isMenuList = function() {
  if(this.type == "menulist") {
    return true;
  } else {
    return false;
  }
}

component.state.isActualSales = function() {
  if(this.type == "actualsales") {
    return true;
  } else {
    return false;
  }
}

component.state.routeDate = function() {
  var date = Router.current().params.date;
  if(date) {
    return date;
  }
}

component.state.isMenuListSubscribed = function() {
  if(this.type == "menulist") {
    var result = Subscriptions.findOne({"_id": "menulist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isMenuSubmit = function() {
  if(this.type == "menusubmit") {
    return true;
  } else {
    return false;
  }
}

component.state.isMenuDetailed = function() {
  if(this.type == "menudetailed") {
    return true;
  } else {
    return false;
  }
}

component.state.isJobsList = function() {
  if(this.type == "jobslist") {
    return true;
  } else {
    return false;
  }
}

component.state.isMenuSubscribed = function() {
  if(this.type == "menudetailed") {
    var userId = Meteor.userId();
    var menuSubs = Subscriptions.findOne({"_id": Session.get("thisMenuItem"), "subscribers": userId});
    if(menuSubs) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isJobsSubscribed = function() {
  if(this.type == "jobslist") {
    var result = Subscriptions.findOne({"_id": "joblist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isIngredientsList = function() {
  if(this.type == "ingredientslist") {
    return true;
  } else {
    return false;
  }
}