isManagerOrAdmin = function(id) {
  if(id) {
    var user = Meteor.users.findOne(id);
    if(user) {
      if(user.isAdmin) {
        return true;
      } else if(user.isManager) {
        return true;
      } else {
        return false;
      }
    }
  }
  return permitted;
}

isAdmin = function(id) {
  if(id) {
    var user = Meteor.users.findOne(id);
    if(user) {
      return user.isAdmin;
    }
  }
}
