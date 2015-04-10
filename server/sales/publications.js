Meteor.publish("salesOnDate", function(date) {
  var cursors = [];
  var salesCursor = Sales.find({"date": date});
  cursors.push(salesCursor);
  return cursors;
});