Template.salesCalibratedList.events({
  'keyup #dateRange': function(event) {
    var value = $(event.target).val();
    FlowComponents.callAction("keyup", value);
  },

  'submit form': function(event) {
    event.preventDefault();
    var dateRange = $(event.target).find('[name=dateRange]').val();
    var totalRevenue = $(event.target).find('[name=totalRevenue]').val();
    var menus = $(event.target).find('[name=qty]').get();
    var items = [];
    if(menus.length > 0) {
      menus.forEach(function(item) {
        var obj = {
          "_id": $(item).attr("data-id"),
          "qty": parseFloat($(item).val())
        }
        items.push(obj);
      });
    }
    var exist = SalesCalibration.findOne();

    if(exist) {
      Meteor.call("updateSalesCalibration", exist._id, dateRange, totalRevenue, items, function(err, id) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    } else {
      Meteor.call("createSalesCalibration", dateRange, totalRevenue, items, function(err, id) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          return;
        }
      });      
    }
  }
});

