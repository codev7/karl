var component = FlowComponents.define('profile', function(props) {
  this.onRendered(this.onProfileRendered);
});

component.state.basic = function() {
  var id = this.get("id");
  var user = Meteor.users.findOne(id);
  this.set("user", user);
  if(user) {
    return user;
  }
}

component.state.email = function() {
  var user = this.get("user");
  if(user && user.emails) {
    return user.emails[0].address;;
  }
}

component.state.image = function() {
  var user = this.get("user");
  if(user) {
    if(user.services && user.services.google) {
      return user.services.google.picture;
    } else {
      return "/images/user-image.jpeg";
    }
  }
}

//permitted for profile owner and admins
component.state.isEditPermitted = function() {
  var user = this.get("user");
  if(user) {
    if(isAdmin() || isManager()) {
      return true;
    } else if(user._id == Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  }
}

//permitted for admin only
component.state.isAdminPermitted = function() {
  if(isAdmin()) {
    return true;
  } else {
    return false;
  }
}

component.state.isNotMe = function() {
  var user = this.get("user");
  if(user._id != Meteor.userId()) {
    return true;
  } else {
    return false;
  }
}

component.prototype.onProfileRendered = function() {
  var id = Router.current().params._id;
  this.set("id", id);
}

component.state.shiftsPerWeek = function() {
  var user = this.get("user");
  var shifts = [1, 2, 3, 4, 5, 6, 7];
  var formattedShifts = [];
  shifts.forEach(function(shift) {
    if(user && user.profile.shiftsPerWeek == shift) {
      var doc = {
        "shift": shift,
        "selected": true
      }
    } else {
      var doc = {
        "shift": shift,
        "selected": false
      }
    }
    formattedShifts.push(doc);
  });
  return formattedShifts;
}

component.state.rosteredForShifts = function() {
  var user = this.get("user");
  if(user) {
    return Shifts.find({"assignedTo": user._id, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
  }
}

component.state.openedShifts = function() {
  return Shifts.find({"assignedTo": null, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
}

