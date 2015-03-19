isManagerOrAdmin = function(id) {
  var permitted = false;
  if(id) {
    var user = Meteor.users.findOne(id);
    if(user) {
      if(user.isAdmin) {
        permitted = true;
      } else if(user.isManager) {
        permitted = true;
      }
    }
  }
  return permitted;
}