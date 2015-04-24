Template.cafeSalesForecastEditList.events({
  'click .generateJobs': function(event) {
    var forecast = ForecastCafe.find().fetch();
    var menus = [];
    var menuIds = [];
    forecast.forEach(function(day) {
      if(day.selected && day.selected.length > 0) {
        var selected = day.selected;
        selected.forEach(function(doc) {
          if(menuIds.indexOf(doc.menuItem) >= 0) {
            var index = menuIds.indexOf(doc.menuItem);
            var item = menus[index];
            item.quantity += doc.quantity;
          } else {
            var obj = {
              "id": doc.menuItem,
              "quantity": doc.quantity
            }
            menus.push(obj);
          }
          if(menuIds.indexOf(doc.menuItem) < 0) {
            menuIds.push(doc.menuItem);
          }
        });
      } 
    });
    Meteor.call("generateJobs", menus, new Date(), function(err, result) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        Router.go("/jobs")
      }
    });
  }
});