Meteor.publish("weeklyPayroll", function(startDate, endDate, users) {
  var cursor = [];
  console.log(startDate, endDate, users);
  if(users.length > 0) {
    var data = Payroll.find({
      "user": {$in: users},  
      $and: [
        {"date": {$gte: new Date(startDate).getTime()}}, 
        {"date": {$lte: new Date(endDate).getTime()}}, 
      ]
    });
    return data;
  }
});