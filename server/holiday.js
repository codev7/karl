Meteor.methods({
  'setWorkerHoliday': function(workerId, date) {
    if(!workerId) {
      throw new Meteor.Error(404, "WorkerId not found");
    }
    if(!date) {
      throw new Meteor.Error(404, "Date not found");
    }
    var exist = Holidays.findOne({"date": date});
    if(exist) {
      console.log("Holiday updated: ", {"date": date, "workerId": workerId});
      Holidays.update({"date": date}, {$addToset: {"onHoliday": workerId}});
    } else {
      console.log("Holiday inserted: ", {"date": date, "workerId": workerId});
      Holidays.insert({"date": date, "onHoliday": ["workerId"]});
    }
  }
});