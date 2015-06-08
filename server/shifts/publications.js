Meteor.publish("rosteredUsersShifts", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  if(!id) {
    logger.error('User id not found : ' + id);
    this.error(new Meteor.Error(404, "User id not found"));
  }
  var shifts = Shifts.find({"assignedTo": id, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
  logger.info("Users rostered shifts published", id);
  return shifts;
});

Meteor.publish("openedShifts", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var shifts = Shifts.find({"assignedTo": null, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
  logger.info("Opened shifts published");
  return shifts;
});