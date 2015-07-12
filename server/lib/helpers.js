isManagerOrAdmin = function(user) {
  if(user) {
    if(user.isAdmin || user.isManager) {
      return true;
    } else {
      return false;
    }
  }
}

isAdmin = function(id) {
  if(id) {
    var user = Meteor.users.findOne(id);
    if(user) {
      return user.isAdmin;
    }
  }
}
